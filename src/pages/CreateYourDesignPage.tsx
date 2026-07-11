import React from 'react'
import { useBlankProducts } from '../hooks/queries/blankProductQuery'
import ProductCard from '../components/shared/ProductCard'

const CreateYourDesignPage = () => {
  const { data: blankProducts, isLoading, error } = useBlankProducts()

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center bg-background text-foreground">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center bg-background text-danger">
        Failed to load blank products
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-background px-4 py-8 text-foreground transition-colors sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 font-['Montserrat'] text-3xl font-bold sm:text-4xl">
          Create your design
        </h1>
        
        {/* Filter section omitted as requested */}

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {blankProducts?.map((product) => (
            <ProductCard
              key={product.id}
              productId={product.id}
              title={product.name}
              subtitle={product.description || `${product.material}, ${product.pattern}`}
              price={`${product.price} EGP`}
              imageSrc={product.images?.[0]?.url}
              images={product.images?.map(img => ({
                id: img.id,
                url: img.url,
                color: img.color,
              }))}
              colors={product.colors?.map(c => c.color)}
              to={`/createYourDesign/${product.id}`}
              productType="SHOP"
            />
          ))}
          
          {/* Fallback if no products */}
          {blankProducts?.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-text">
              No blank products available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateYourDesignPage