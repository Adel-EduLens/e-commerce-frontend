import ProductCard from "./ProductCard";
import type { Product } from "../../hooks/queries/productsQuery";

export type WholesaleCardProps = {
  wholesale: Product;
  to?: string;
};

export default function WholesaleCard({ wholesale, to }: WholesaleCardProps) {
  const sizes = Array.from(
    new Set(
      wholesale.colors?.flatMap((wc) =>
        wc.variants?.map((size) => size.size) ?? [],
      ) ?? [],
    ),
  );

  return (
    <ProductCard
      productId={wholesale.id}
      productType="WHOLESALE"
      title={wholesale.name}
      subtitle={wholesale.description || undefined}
      price={`${(wholesale.wholesalePrice ?? wholesale.price ?? 0).toLocaleString()}$`}
      to={to ?? `/wholesale/${wholesale.id}`}
      imageSrc={wholesale.images?.[0]?.url}
      images={wholesale.images}
      rating={wholesale.rating ?? 0}
      brand={wholesale.brand?.name}
      category={wholesale.category?.name}
      colors={wholesale.colors?.map((wc) => wc.colorName || wc.color || "") ?? []}
      wholesaleSizes={sizes}
      sizeLabel={sizes.slice(0, 4).join("-") || "All Sizes"}
      minOrder={wholesale.colors?.[0]?.minOrder ?? 1}
      wholesaleCard
    />
  );
}
