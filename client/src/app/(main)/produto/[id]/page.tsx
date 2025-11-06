'use client'

import { Button } from "@/components/ui/button"
import { QuantityAction } from "@/components/ui/QuantityAction"
import { getOneProduct, getRelatedProducts } from "@/services/product"
import { formatPrice } from "@/utils/formatters"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { ProductCard } from "@/components/ProductCard"
import { useCart } from "@/contexts/CartContext"


const page = () => {

    const { dispatch } = useCart()
    const router = useRouter()

    const path = usePathname()
    const productId = parseInt(path.slice(9))

    const { data: product } = useSuspenseQuery({
        queryKey: ['product', {productId}],
        queryFn: () => getOneProduct(productId),
        staleTime: 60000
    })

    const {categoryId, id} = product

    const { data: relatedProducts } = useQuery({
        queryKey: ['related', {categoryId}],
        queryFn: () => getRelatedProducts(categoryId, id)
    })

    const [quantity, setQuantity] = useState(1)

    const handleAddToCart = () => {
        dispatch({
            type: "ADD_PRODUCT",
            payload: { product, quantity }, 
        });
        router.push('/home')
    };

    if(!product) return <p>Produto não encontrado.</p>

    
    return(
        <div className="w-full max-w-7xl mx-auto p-6">
            <main className="flex gap-6">
                <div className="relative w-[600px] h-[600px]">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain rounded-md"
                        unoptimized
                    />
                </div>

                <div className="pt-6 flex flex-col justify-around">
                    <div>
                        <h3 className="text-3xl text-primary font-bold">{product.name}</h3>
                        
                        <p className="text-sm text-gray-700 ">estoque: {product.stock}</p>
                        <div className="text-2xl text-primary font-bold mb-9">{formatPrice(product.price)}</div>

                        <div className="mt-6  flex items-start">
                            <QuantityAction 
                                value={quantity}
                                setValue={setQuantity}
                                inCart={false}
                            />

                            <div className="text-2xl text-primary">{formatPrice(quantity * product.price)}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <Button 
                            className="cursor-pointer"
                            onClick={handleAddToCart}
                        >Adicionar ao carrinho</Button>
                        

                        
                    </div>
                    <div>
                        <h6 className="font-bold text-lg mb-5">Descrição:</h6>
                        <p>{product.description}</p>
                    </div>
                </div>
                
            </main>

            <aside>
                <h3 className="text-primary text-2xl my-12">Produtos relacionados:</h3>
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full"
                >
                <CarouselContent>
                    {relatedProducts?.map((related) => (
                        <CarouselItem key={related.id} className="md:basis-1/2 lg:basis-1/4">
                            <div className="p-1">
                                <ProductCard product={related}/>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            </aside>
        </div>
    )
}

export default page