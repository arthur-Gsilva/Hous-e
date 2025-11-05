import { FilterCheckboxItem } from "./FilterCheckboxItem"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"

import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"


type SliderProps = React.ComponentProps<typeof Slider>

export const LeftBar = ({ className, ...props }: SliderProps) => {

    const [range, setRange] = useState<[number, number]>([20, 80]);
    const minDistance = 1; 

    const handleChange = (values: number[]) => {
        let [left, right] = values;

        
        if (left >= right - minDistance) {
        if (range[0] !== left) {
            left = right - minDistance;
        } else {
            right = left + minDistance;
        }
    }

    setRange([left, right]);
  };

    return(
        <div className="pr-10 sticky top-0">
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
                    value={range}
                    onValueChange={handleChange}
                    min={0}
                    max={100}
                    step={1}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Esquerda: {range[0]}</span>
                    <span>Direita: {range[1]}</span>
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

