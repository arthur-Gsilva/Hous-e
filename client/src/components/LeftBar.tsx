'use client'

import { FilterCheckboxItem } from "./FilterCheckboxItem"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { Slider } from "@/components/ui/slider"
import { useEffect, useState } from "react"
import { Product } from "@/types/product"
import { formatPrice } from "@/utils/formatters"

type Props = {
    products: Product[],
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
}

export const LeftBar = ({ products, priceRange, setPriceRange }: Props) => {

    const averagePrice = products?.reduce((sum, product) => sum + product.price, 0) / products.length;
    const prices = products?.map(p => p.price) ?? [];
    const maxPrice = prices.length ? Math.max(...prices) : 0;
    const minPrice = prices.length ? Math.min(...prices) : 0;

    const [localRange, setLocalRange] = useState<[number, number]>([minPrice, maxPrice]);

    const [globalRange, setGlobalRange] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        if (products?.length && globalRange[1] === 0) {
            const prices = products.map(p => p.price);
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            setGlobalRange([min, max]);
            setPriceRange([min, max]); 
        }
    }, [products]);

    const handleChange = (values: number[]) => {
        const [min, max] = values;
        setLocalRange([min, max]);
        console.log(max)
}   ;

    const handleCommit = (values: number[]) => {
        const [min, max] = values;
        if (max - min >= 1) setPriceRange([min, max]);
    };

    return(
        <div className="pr-10 sticky top-0 min-w-52">
            <h3 className="font-bold mb-8">Personalize sua busca:</h3>

            <FilterCheckboxItem label="Condição">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <Checkbox id="new" />
                        <Label htmlFor="new" className="font-normal text-gray-800">Novo</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <Checkbox id="used" />
                        <Label htmlFor="used" className="font-normal text-gray-800">Usado</Label>
                    </div>
                </div>
            </FilterCheckboxItem>

            <FilterCheckboxItem label="Disponibilidade">
                
                <div className="flex items-center gap-3">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms" className="font-normal text-gray-800">Exibir itens sem estoque</Label>
                </div>
                    
            </FilterCheckboxItem>

            <div className="w-full space-y-4">
                <Slider
                    value={localRange}
                    onValueChange={handleChange}
                    onValueCommit={handleCommit}
                    min={globalRange[0]}
                    max={globalRange[1]}
                    step={1}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatPrice(localRange[0])}</span>
                    <span>{formatPrice(localRange[1])}</span>
                </div>
            </div>

            <FilterCheckboxItem label="Novidades">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <Checkbox id="thirty" />
                        <Label htmlFor="thirty" className="font-normal text-gray-800">Últimos 30 dias</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <Checkbox id="sixty" />
                        <Label htmlFor="sixty" className="font-normal text-gray-800">Últimos 60 dias</Label>
                    </div>
                </div>
            </FilterCheckboxItem>
        </div>
    )
}