import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function makeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(name, currentId = null) {
  const base = makeSlug(name);
  let slug = base;
  let counter = 1;

  while (
    await Product.exists({
      slug,
      ...(currentId ? { _id: { $ne: currentId } } : {}),
    })
  ) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}

export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 100);
  const filter = { active: true };

  if (req.query.category && req.query.category !== "all") {
    filter.category = req.query.category;
  }
  if (req.query.featured === "true") filter.featured = true;
  if (req.query.search) filter.$text = { $search: req.query.search };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    products,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      total,
    },
  });
});

export const getDeveloperProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json({ success: true, products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const query = /^[0-9a-fA-F]{24}$/.test(req.params.identifier)
    ? { _id: req.params.identifier }
    : { slug: req.params.identifier };

  const product = await Product.findOne(query);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ success: true, product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    compareAtPrice,
    category,
    images,
    sizes,
    colors,
    stock,
    featured,
    active,
  } = req.body;

  if (!name || !description || price === undefined || !category || !images?.length) {
    res.status(400);
    throw new Error("Name, description, price, category, and an image are required");
  }

  const product = await Product.create({
    name: name.trim(),
    slug: await uniqueSlug(name),
    description: description.trim(),
    price: Number(price),
    compareAtPrice: Number(compareAtPrice) || 0,
    category: category.trim(),
    images,
    sizes: sizes?.length ? sizes : ["S", "M", "L", "XL"],
    colors: colors?.length ? colors : ["Black"],
    stock: Number(stock) || 0,
    featured: Boolean(featured),
    active: active === undefined ? true : Boolean(active),
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const allowed = [
    "description",
    "price",
    "compareAtPrice",
    "category",
    "images",
    "sizes",
    "colors",
    "stock",
    "featured",
    "active",
  ];

  if (req.body.name && req.body.name !== product.name) {
    product.name = req.body.name.trim();
    product.slug = await uniqueSlug(req.body.name, product._id);
  }

  allowed.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });

  await product.save();
  res.json({ success: true, product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  await product.deleteOne();
  res.json({ success: true, message: "Product deleted" });
});
