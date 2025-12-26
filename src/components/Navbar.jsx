import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-teal-500 text-white p-4 shadow-md">
      <ul className="flex gap-4 justify-center">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/FetchAPI_EmptyArray">Fetch 1</Link>
        </li>
        <li>
          <Link to="/nasa">NASA</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
      </ul>
    </nav>
  );
}
