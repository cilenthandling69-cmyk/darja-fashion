import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod = "COD" } = req.body;
  const allowedPaymentMethods = ["COD", "UPI", "CARD", "NETBANKING"];

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("Your cart is empty");
  }
  if (!allowedPaymentMethods.includes(paymentMethod)) {
    res.status(400);
    throw new Error("Select a valid payment method");
  }

  const productIds = items.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds }, active: true });
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const safeItems = items.map((item) => {
    const product = productMap.get(item.product);
    const quantity = Math.max(Number(item.quantity) || 1, 1);

    if (!product) throw new Error("A product in your cart is unavailable");
    if (product.stock < quantity) throw new Error(`${product.name} does not have enough stock`);

    return {
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity,
      size: item.size || product.sizes[0] || "M",
      color: item.color || product.colors[0] || "Black",
    };
  });

  const subtotal = safeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 1999 ? 0 : 99;
  const total = subtotal + shippingFee;

  const order = await Order.create({
    customer: req.user._id,
    items: safeItems,
    shippingAddress,
    subtotal,
    shippingFee,
    total,
    paymentMethod,
    statusHistory: [{ status: "placed", changedAt: new Date() }],
  });

  await Promise.all(
    safeItems.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
    )
  );

  res.status(201).json({ success: true, order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("customer", "name email")
    .sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (req.body.orderStatus && req.body.orderStatus !== order.orderStatus) {
    order.orderStatus = req.body.orderStatus;
    order.statusHistory.push({ status: req.body.orderStatus, changedAt: new Date() });
  }
  if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;
  await order.save();

  res.json({ success: true, order });
});
