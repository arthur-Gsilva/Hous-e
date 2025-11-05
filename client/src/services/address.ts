import { Address } from "@/types/Address"
import api from "./api"

export const getAddress = async (): Promise<Address[]> => {
    const response = await api.get('/user/addresses')
    return response.data.addresses
}