import { Product } from "@/types/product"
import api from "./api"
import { AddProductSchema } from "@/schemas/add-product-schema"


export const getOneProduct = async (id: number): Promise<Product> => {
    const response = await api.get(`/product/${id}`)
    return response.data.product
}

export const getRelatedProducts = async (categoryId: number, productId: number): Promise<Product[]> => {
    const response = await api.get(`category/${categoryId}/${productId}`)
    return response.data.products
}

export const favoriteProduct = async (productId: number) => {
    try{
      const response = await api.post(`user/favorite/${productId}`)
      return response.status
    } catch (err){
      console.log("erro ao favoritar produto"+ err)
    }
}

export const getFavoriteProducts = async (): Promise<Product[]> => {
    const response = await api.get('user/favorites')
    return response.data.products
}

export const getAllProducts = async (query: string, min?: number, max?: number): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (min !== undefined) params.append('min', min.toString());
    if (max !== undefined) params.append('max', max.toString());

    const response = await api.get(`product?${params.toString()}`);
    return response.data.products;
}

export async function createProduct(data: AddProductSchema) {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("price", data.price.toString());
  formData.append("stock", data.stock.toString());
  formData.append("description", data.description as string);
  formData.append("categoryId", data.categoryId);

  if (data.image && data.image.length > 0) {
    formData.append("image", data.image[0]); 
  }

  const res = await api.post("/product", formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}