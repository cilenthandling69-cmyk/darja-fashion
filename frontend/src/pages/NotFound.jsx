import { Link } from "react-router-dom";

export default function NotFound() {
  return <section className="empty-state page-top"><h1>404</h1><h3>This page left the runway.</h3><Link className="button button-primary" to="/">Return home</Link></section>;
}
