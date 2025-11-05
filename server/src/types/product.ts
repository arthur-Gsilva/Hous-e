export type EditProduct = {
    name?: string,
    price?: number,
    stock?: number,
    description?: string,
    categoryId?: number,
    image?: string
}

export type CreateProduct = {
    name: string,
    price: number,
    stock: number,
    description?: string,
    categoryId: number,
    image?: string
}