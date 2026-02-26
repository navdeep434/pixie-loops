import ProductDetailPage from "./ProductDetailPage";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
    const res = await fetch(`${API_URL}/products/${params.id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { title: "Product | PixieLoops" };
    const data = await res.json();
    const p = data.product;
    return {
      title: `${p.name} | PixieLoops`,
      description: p.description ?? "Handcrafted crochet product",
    };
  } catch {
    return { title: "Product | PixieLoops" };
  }
}

export default function Page() {
  return <ProductDetailPage />;
}