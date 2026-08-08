import { Menu, PackageSearch, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, isDeveloper } = useAuth();
  const { itemCount } = useCart();
  const close = () => setOpen(false);
  const offers = [
    "Free shipping on orders over ₹1,999",
    "Extra 10% off on your first order — use code DARJA10",
    "Easy returns within 7 days",
  ];

  return (
    <header className="navbar-wrap">
      <nav className="navbar container">
        <Link to="/" className="brand" onClick={close}>
          DARJA <span>FASHION</span>
        </Link>

        <button
          className="menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>

        <div className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" onClick={close}>Home</NavLink>
          <Link to="/shop?category=Fashion" onClick={close}>Fashion</Link>
          <Link to="/shop?category=Relationships" onClick={close}>Relationships</Link>
          <Link to="/shop?category=Marathi%20%26%20Culture" onClick={close}>Marathi &amp; Culture</Link>
          <Link to="/shop?category=Lifestyle" onClick={close}>Lifestyle</Link>
          <Link to="/shop?category=Special%20Collections" onClick={close}>Special Collections</Link>
          <Link to="/contact" onClick={close}>Customize</Link>
          <NavLink to="/about" onClick={close}>About Us</NavLink>
          {isDeveloper && (
            <NavLink to="/developer/dashboard" onClick={close}>Developer</NavLink>
          )}
        </div>

        <div className="nav-actions">
          {user && <Link className="icon-link" to="/orders" aria-label="Track my orders" title="Track my orders"><PackageSearch /></Link>}
          {user ? (
            <button className="text-button" onClick={logout} title={`Signed in as ${user.name}`}>
              <UserRound size={18} /> Logout
            </button>
          ) : (
            <Link className="icon-link" to="/login" aria-label="Login"><UserRound /></Link>
          )}
          <Link className="cart-link" to="/cart" aria-label="Cart">
            <ShoppingBag />
            {itemCount > 0 && <span>{itemCount}</span>}
          </Link>
        </div>
      </nav>
      <div className="offer-strip" aria-label="Current offers">
        <div className="offer-track">
          {[0, 1].map((group) => (
            <div className="offer-group" key={group} aria-hidden={group === 1}>
              {offers.map((offer) => (
                <span className="offer-item" key={offer}>
                  {offer}<span className="offer-separator" aria-hidden="true">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
