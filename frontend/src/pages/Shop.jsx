import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";

const categories = ["all", "Fashion", "Relationships", "Marathi & Culture", "Lifestyle", "Special Collections"];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const requestedCategory = searchParams.get("category");
  const category = categories.includes(requestedCategory) ? requestedCategory : "all";
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/products", { params: { category, search, limit: 50 } });
        setProducts(data.products);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [category, search]);

  const chooseCategory = (item) => {
    setSearchParams(item === "all" ? {} : { category: item });
  };

  return (
    <section className="section container page-top">
      <div className="page-header">
        <span className="eyebrow">DARJA COLLECTION</span>
        <h1>Shop the latest drop</h1>
        <p>Luxury streetwear, statement layers, and accessories designed for your next frame.</p>
      </div>

      <div className="shop-toolbar">
        <div className="search-box"><Search size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" /></div>
        <div className="category-pills">
          {categories.map((item) => (
            <button key={item} className={category === item ? "active" : ""} onClick={() => chooseCategory(item)}>
              {item === "all" ? "All" : item}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loader">Loading collection…</div>
      ) : products.length ? (
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      ) : (
        <div className="empty-state"><h3>No products found</h3><p>Try another search or category.</p></div>
      )}
    </section>
  );
}
