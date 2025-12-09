import { useParams } from "react-router-dom";
import { products } from "../data/products";

export default function ProductDetail() {
  const { productId } = useParams();

  const product = products.find((p) => p.id === productId);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>{product.id}</p>
    </div>
  );
}
