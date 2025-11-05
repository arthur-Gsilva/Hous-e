import { Section } from "@/types/section"
import api from "./api"
import { category } from "@/types/category"

export const getSections = async (): Promise<Section[]> => {
    const response = await api.get('/section')
    return response.data.sections
}

export const getCategories = async (): Promise<category[]> => {
    const response = await api.get('/category')
    return response.data.categories
}