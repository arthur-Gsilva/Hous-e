'use client'

import { LeftBar } from "@/components/LeftBar"
import { ProductCard } from "@/components/ProductCard";
import { getAllProducts } from "@/services/product";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {

    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";
     const [priceRange, setPriceRange] = useState<[number, number]>([0, Number.MAX_SAFE_INTEGER])

    const { data: products } = useSuspenseQuery({
        queryKey: ['products', query, priceRange],
        queryFn: () => getAllProducts(query, priceRange[0], priceRange[1]),
        staleTime: 60 * 1000
    })

    // const { data: allProducts } = useSuspenseQuery({
    //     queryKey: ['products', query, 'all'],
    //     queryFn: () => getAllProducts(query),
    //     staleTime: 60 * 1000,
    // });

    useEffect(() => {
    if (products && products.length > 0) {
        const prices = products.map(p => p.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setPriceRange([min, max]);
    }
    }, [products]);

    return(
        <div  className="w-full max-w-7xl mx-auto p-6 flex flex-1">
            <LeftBar products={products} priceRange={priceRange} setPriceRange={setPriceRange}/>

            <main>
                <div className="font-bold w-full flex justify-between items-center mb-4">
                    <p>Resultado para: <span className="text-3xl text-primary">{query}</span></p>

                    <Link href={'/home'}>Voltar</Link>
                </div>

                <div className="w-full grid grid-cols-4">
                    {products?.map((product) => (
                        <ProductCard key={product.id} product={product}/>
                    ))}

                    {!products &&
                        <p>Nenhum produto encontrado</p>
                    }
                </div>
            </main>
        </div>
    )
}

export default page