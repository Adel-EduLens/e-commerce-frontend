import React from 'react'
import { useTranslation } from 'react-i18next'
import { useProducts } from '../../hooks/queries/productsQuery'
import ProductCard from '../../components/shared/ProductCard'

const CreateYourDesignPage = () => {
  const { t } = useTranslation("productSection")
  const { data, isLoading, error } = useProducts({ type: "BLANK" })
  const blankProducts = data?.products || []

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center bg-background text-foreground">
        {t("Loading", "Loading...")}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center bg-background text-danger">
        {t("failedToLoadBlankProducts", "Failed to load blank products")}
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-background px-4 py-8 text-foreground transition-colors sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 font-['Montserrat'] text-3xl font-bold sm:text-4xl">
          {t("createYourDesign", "Create your design")}
        </h1>
        
        {/* Filter section omitted as requested */}

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {blankProducts?.map((product) => (
            <ProductCard
              key={product.id}
              productId={product.id}
              title={product.name}
              subtitle={product.description || product.materials?.map(m => m.material).join(', ')}
              price={`${product.blankPrice ?? product.price ?? 0} EGP`}
              imageSrc={product.colors?.[0]?.images?.[0]?.url}
              images={product.colors?.flatMap(c => 
                c.images.map(img => ({
                  id: img.id,
                  url: img.url || img.imageUrl || "",
                  color: c.color,
                }))
              )}
              colors={product.colors?.map(c => c.colorName || c.color).filter((color): color is string => Boolean(color))}
              to={`/createYourDesign/${product.id}`}
              productType="SHOP"
              hideAddToCart={true}
              hideQuickActions={true}
            />
          ))}
          
          {/* Fallback if no products */}
          {blankProducts?.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-text">
              {t("noBlankProductsAvailable", "No blank products available yet.")}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateYourDesignPage
