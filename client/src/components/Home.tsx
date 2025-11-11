import { getSections } from "@/services/section"
import {  useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { SectionArea } from "./SectionArea"
import { Skeleton } from "./ui/skeleton"
import { getRecommendations } from "@/services/profile"
import { Section } from "@/types/section"

export const Home = () => {

    const { data: sections, isFetching } = useSuspenseQuery({
        queryKey: ['sections'],
        queryFn: getSections,
        staleTime: 60 * 1000
    })

    const { data: recommendations } = useQuery({
        queryKey: ['recommendations'],
        queryFn: getRecommendations,
        staleTime: 60 * 1000
    })

    const RecomendationSection: Section = {
        id: sections?.length + 1,
        name: "Com base no seu perfil",
        products: recommendations
    }

    return(
        <main className="w-full flex-1">

            {recommendations && recommendations.length > 0 &&
                <SectionArea  section={RecomendationSection} />
            }

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