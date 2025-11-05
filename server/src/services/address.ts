import { prisma } from "../libs/prisma"
import { Address } from "../types/address"


export const addAddress = async (userId: number, address: Address) => {
    return await prisma.userAddress.create({
        data: {
            ...address,
            userId
        }
    })
}

export const getAllAddresses = async (userId: number) => {
    const addresses = await prisma.userAddress.findMany({
        where: { userId },
        select: {
            id: true,
            zipcode: true,
            street: true,
            number: true,
            city: true,
            state: true,
            country: true,
            complement: true
        }
    })

    return addresses
}

export const getAddressById = async (userId: number, addressId: number) => {
    return await prisma.userAddress.findFirst({
        where: { id: addressId, userId },
        select: {
            id: true,
            zipcode: true,
            street: true,
            number: true,
            city: true,
            state: true,
            country: true,
            complement: true
        }
    })
}