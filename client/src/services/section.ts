import { Section } from "@/types/section"
import api from "./api"

export const getSections = async (): Promise<Section[]> => {
    const response = await api.get('/section')
    return response.data.sections
}

export const addProductInSection = async (productId: string, sectionId: string) => {
    const response = await api.post(`section/${sectionId}`, {productId})
    return response.data.section
}