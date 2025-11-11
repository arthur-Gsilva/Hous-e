import { useQuery } from "@tanstack/react-query"
import { Button } from "./ui/button"
import { getAllProducts } from "@/services/product"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { CreateProductDialog } from "./CreateProductDialog"

export const AdminHome = () => {

    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: () => getAllProducts(''),
        staleTime: 60 * 1000
    })

    return(
        <div className="w-full">
            <div className="flex w-full justify-between items-center">
                <h2>Produtos</h2>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="cursor-pointer">Adicionar Produto</Button>
                    </DialogTrigger>
                    
                    <DialogContent>
                        <CreateProductDialog />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-5 gap-5 pt-12">
                {products?.map((product) => (
                    <div key={product.id} className="bg-gray-200 rounded-md text-center pb-2 cursor-pointer transition-all duration-300 hover:-translate-y-1">
                        <h3 className="">{product.name}</h3>

                        <Image 
                            src={product.image}
                            alt={product.name}
                            className="rounded-md mx-auto"
                            width={150}
                            height={150}
                            unoptimized
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}