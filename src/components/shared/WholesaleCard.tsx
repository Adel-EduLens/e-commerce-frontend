import ProductCard from "./ProductCard";
import type { Wholesale } from "../../hooks/queries/wholesaleQuery";

export type WholesaleCardProps = {
  wholesale: Wholesale;
  to?: string;
};

export default function WholesaleCard({ wholesale, to }: WholesaleCardProps) {
  const sizes = Array.from(
    new Set(
      wholesale.wholesaleColors?.flatMap((wc) =>
        wc.sizes.map((size) => size.size),
      ) ?? [],
    ),
  );

  return (
    <ProductCard
      productId={wholesale.id}
      productType="WHOLESALE"
      title={wholesale.name}
      subtitle={wholesale.description || undefined}
      price={`${wholesale.price.toLocaleString()}$`}
      to={to ?? `/wholesale/${wholesale.id}`}
      imageSrc={wholesale.images[0]?.url}
      images={wholesale.images}
      rating={wholesale.rating ?? 0}
      brand={wholesale.brand}
      category={wholesale.category?.name}
      colors={wholesale.wholesaleColors?.map((wc) => wc.color) ?? []}
      wholesaleSizes={sizes}
      sizeLabel={sizes.slice(0, 4).join("-") || "All Sizes"}
      minOrder={wholesale.minOrder}
      wholesaleCard
    />
  );
}
