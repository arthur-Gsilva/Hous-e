import { getSections } from "@/services/section"
import {  useQuery } from "@tanstack/react-query"
import { SectionArea } from "./SectionArea"
import { Skeleton } from "./ui/skeleton"

export const Home = () => {

    const { data: sections, isFetching } = useQuery({
        queryKey: ['sections'],
        queryFn: getSections,
        staleTime: 60 * 1000
    })

    return(
        <main className="w-full flex-1">
            {sections?.map((section) => (
                <SectionArea key={section.id} section={section} />
            ))}

            {isFetching &&
                <div>
                <Skeleton className="w-full h-20 mt-6"/>

                <div className="mt-8 grid grid-cols-4 gap-8">
                    <Skeleton className="w-full h-40"/>
                    <Skeleton className="w-full h-40"/>
                    <Skeleton className="w-full h-40"/>
                    <Skeleton className="w-full h-40"/>
                </div>
                <Skeleton className="w-full h-20 mt-6"/>

                <div className="mt-8 grid grid-cols-4 gap-8">
                    <Skeleton className="w-full h-40"/>
                    <Skeleton className="w-full h-40"/>
                    <Skeleton className="w-full h-40"/>
                    <Skeleton className="w-full h-40"/>
                </div>
            </div>
            }
            
        </main>
    )
}