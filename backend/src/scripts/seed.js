import "dotenv/config";
import { connectDatabase } from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

const sampleProducts = [
  {
    name: "Midnight Web Oversized Hoodie",
    slug: "midnight-web-oversized-hoodie",
    description: "Heavyweight oversized streetwear hoodie with a bold web-inspired graphic and premium brushed interior.",
    price: 2499,
    compareAtPrice: 3199,
    category: "Hoodies",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=85"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: ["Black", "Crimson"],
    stock: 24,
    featured: true,
  },
  {
    name: "Noir Signature Bomber",
    slug: "noir-signature-bomber",
    description: "A structured luxury bomber jacket with minimal metal detailing, satin lining, and a clean modern silhouette.",
    price: 4299,
    compareAtPrice: 5499,
    category: "Jackets",
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=85"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Charcoal"],
    stock: 16,
    featured: true,
  },
  {
    name: "Scarlet Motion Graphic Tee",
    slug: "scarlet-motion-graphic-tee",
    description: "Relaxed-fit cotton tee with an expressive red motion graphic designed for statement streetwear looks.",
    price: 1299,
    compareAtPrice: 1699,
    category: "T-Shirts",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: ["Black", "White"],
    stock: 40,
    featured: true,
  },
  {
    name: "Obsidian Utility Cargo",
    slug: "obsidian-utility-cargo",
    description: "Tapered utility cargo trousers with adjustable hems, deep pockets, and durable premium fabric.",
    price: 2199,
    compareAtPrice: 2799,
    category: "Bottomwear",
    images: ["https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=1200&q=85"],
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Black", "Olive"],
    stock: 30,
    featured: false,
  },
  {
    name: "Ivory Luxe Co-ord Set",
    slug: "ivory-luxe-co-ord-set",
    description: "Minimal premium co-ord set with a fluid silhouette, subtle texture, and elevated everyday comfort.",
    price: 3499,
    compareAtPrice: 4299,
    category: "Co-ords",
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Ivory", "Sand"],
    stock: 18,
    featured: true,
  },
  {
    name: "Darja Monogram Cap",
    slug: "darja-monogram-cap",
    description: "Structured six-panel cap with an embroidered Darja monogram and adjustable metal clasp.",
    price: 899,
    compareAtPrice: 1199,
    category: "Accessories",
    images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85"],
    sizes: ["Free Size"],
    colors: ["Black", "Beige"],
    stock: 50,
    featured: false,
  },
];

// Products mirrored from Darja Fashion's live collections and grouped into the
// broader storefront sections used by this app.
const sectionProducts = [
  ["Jatais Ka Paytan Ghiu?", "jatais-ka-paytan-ghiu", "Fashion", 799, 0, true],
  ["Darja on Shoulder - Acid Wash", "darja-on-shoulder-acid-wash", "Fashion", 1199.85, 1, true],
  ["Malkin Oversized Tee", "malkin-oversized-tee", "Fashion", 759.05, 2, false],
  ["Chaltay Ki Oversized Tee", "chaltay-ki-oversized-tee", "Fashion", 999, 3, false],
  ["Amchyasarkhe Shodhun Sapdnar Nahit", "amchyasarkhe-shodhun-sapdnar-nahit", "Relationships", 499, 4, true],
  ["Apli Yari Lai Bhari", "apli-yari-lai-bhari", "Relationships", 499, 5, false],
  ["Dil Dosti Duniyadari", "dil-dosti-duniyadari", "Relationships", 499, 6, false],
  ["Besties Forever", "besties-forever", "Relationships", 499, 7, false],
  ["Tukaram Maharaj", "tukaram-maharaj", "Marathi & Culture", 499, 8, true],
  ["Avagha Rang Ek Zala", "avagha-rang-ek-zala", "Marathi & Culture", 499, 9, false],
  ["Vitthal Tilak", "vitthal-tilak", "Marathi & Culture", 499, 10, false],
  ["Paule Chalati Pandharichi Vaat", "paule-chalati-pandharichi-vaat", "Marathi & Culture", 499, 11, false],
  ["Mountain Oversized Tee", "mountain-oversized-tee", "Lifestyle", 799, 12, true],
  ["Time Heals Everything", "time-heals-everything", "Lifestyle", 799, 13, false],
  ["Switch Kelyashivay Growth Nahi", "switch-kelyashivay-growth-nahi", "Lifestyle", 799, 14, false],
  ["Tu Udat Gelas Sonya - Tejaswini Pandit", "tu-udat-gelas-sonya", "Special Collections", 799, 15, true],
  ["Hi Cheating Ahe - Siddharth Jadhav", "hi-cheating-ahe-siddharth-jadhav", "Special Collections", 799, 16, false],
  ["Abhi To Party Shuru Hui Hai - Nagesh Bhosale", "abhi-to-party-shuru-hui-hai", "Special Collections", 799, 17, false],
].map(([name, slug, category, price, image, featured]) => ({
  name,
  slug,
  category,
  price,
  compareAtPrice: 0,
  description: `Original Darja graphic T-shirt from the ${category} collection, made for everyday comfort and statement styling.`,
  images: [`https://images.unsplash.com/photo-${[
    "1521572163474-6864f9cf17ab", "1503341504253-dff4815485f1", "1583743814966-8936f37f4678",
    "1576566588028-4147f3842f27", "1521572163474-6864f9cf17ab", "1503341504253-dff4815485f1",
    "1583743814966-8936f37f4678", "1576566588028-4147f3842f27", "1521572163474-6864f9cf17ab",
    "1503341504253-dff4815485f1", "1583743814966-8936f37f4678", "1576566588028-4147f3842f27",
    "1521572163474-6864f9cf17ab", "1503341504253-dff4815485f1", "1583743814966-8936f37f4678",
    "1576566588028-4147f3842f27", "1521572163474-6864f9cf17ab", "1503341504253-dff4815485f1",
  ][image]}?auto=format&fit=crop&w=1200&q=85`],
  sizes: ["S", "M", "L", "XL", "2XL"],
  colors: ["Black", "White"],
  stock: 25,
  featured,
}));

async function seed() {
  await connectDatabase();

  const email = (process.env.DEV_EMAIL || "developer@darjafashion.com").toLowerCase();
  let developer = await User.findOne({ email });

  if (!developer) {
    developer = await User.create({
      name: process.env.DEV_NAME || "Darja Developer",
      email,
      password: process.env.DEV_PASSWORD,
      role: "developer",
    });
    console.log(`Developer created: ${developer.email}`);
  } else {
    developer.role = "developer";
    await developer.save();
    console.log(`Developer already exists: ${developer.email}`);
  }

  const products = [...sampleProducts, ...sectionProducts];
  const operations = products.map((product) => ({
    updateOne: {
      filter: { slug: product.slug },
      update: { $setOnInsert: { ...product, createdBy: developer._id } },
      upsert: true,
    },
  }));
  const result = await Product.bulkWrite(operations);
  console.log(`${result.upsertedCount} new products inserted; existing products kept.`);

  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
