"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Product } from "@/types/product"
import Link from "next/link"
import { formatPrice } from "@/utils/formatters"

import { IoIosStarOutline } from "react-icons/io";
import { IoIosStar } from "react-icons/io";
import { favoriteProduct, getFavoriteProducts } from "@/services/product"
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"

type props =  {
  product: Product
}
export const  ProductCard = ({ product}: props) => {

    const { data: favoritesProducts } = useSuspenseQuery({
        queryKey: ['favorites'],
        queryFn: getFavoriteProducts,
        staleTime: Infinity
    })

    const queryClient = useQueryClient()

    const isFavorite = favoritesProducts.some(p => p.id === product.id)

    return (
        <Link href={`/produto/${product.id}`} className="relative">
            <Card className=" shrink-0 rounded-lg overflow-hidden border scale-95 hover:scale-100 transition-all duration-300 cursor-pointer">
                <CardHeader className="p-0">
                    <div className="relative aspect-4/3 w-full">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover rounded-t-md"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            unoptimized
                        />
                    </div>
                </CardHeader>

                <CardContent className="p-4 space-y-2">
                    <CardTitle className="text-base font-semibold line-clamp-1">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <p className="text-lg font-bold text-primary mt-2">{formatPrice(product.price)}</p>
                </CardContent>
            </Card>

            <div className="absolute top-4 right-4 ">
                {!isFavorite  ? (
                    <IoIosStarOutline
                        className="text-2xl text-primary" 
                        onClick={ async (e) => {
                            e.preventDefault()   
                            e.stopPropagation()  
                            await favoriteProduct(product.id)
                        }}
                    />
                ): (
                    <IoIosStar
                        className="text-2xl text-primary" 
                        onClick={ async (e) => {
                            e.preventDefault()   
                            e.stopPropagation()  
                            await favoriteProduct(product.id)
                            queryClient.invalidateQueries({ queryKey: ['favorites'] })
                        }}
                    />
                )}
                
            </div>
        </Link>
    )
}
