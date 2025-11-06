'use client'

import { LeftBar } from "@/components/LeftBar"
import { ProductCard } from "@/components/ProductCard";
import { getAllProducts } from "@/services/product";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const page = () => {

    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";

    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: () => getAllProducts(query),
        staleTime: 60 * 1000
    })

    return(
        <div  className="w-full max-w-7xl mx-auto p-6 flex flex-1">
            <LeftBar />

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