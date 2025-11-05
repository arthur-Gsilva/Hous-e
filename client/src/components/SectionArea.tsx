import { Section } from "@/types/section"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { ProductCard } from "./ProductCard"

type props = {
    section: Section
}


export const SectionArea = ({ section }: props) => {
    return(
        <div>
            <div className="bg-linear-to-r from-[#252525] to-[#f9fafb] flex items-center w-full text-primary p-5 rounded-md">
                <h2 className="font-bold text-xl first-letter:uppercase">{section.name}</h2>
            </div>

            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full"
            >
                <CarouselContent>
                    {section.products.map((product) => (
                        <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                            <div className="p-1">
                                <ProductCard product={product}/>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}