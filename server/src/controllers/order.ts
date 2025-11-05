import { RequestHandler } from "express";
import { getOneOrder, getOrderByUser, updateOrderStatus } from "../services/order";
import { getOneProductSchema } from "../schemas/get-one-product-schema";

export const getAllOrdersController: RequestHandler = async (req, res) => {
    const userId = req.user?.id;
    if(!userId){
        res.status(401).json({ error: "Acesso negado" })
        return
    }

    const orders = await getOrderByUser(parseInt(userId))
    res.json({ orders })
}

export const getOneOrderController: RequestHandler = async (req, res) => {
    const paramsResult = getOneProductSchema.safeParse(req.params)
    if(!paramsResult.success){
        res.status(500).json({ error: 'Parâmetros inválidos' })
        return
    }

    const { id } = paramsResult.data
    
    const order = await getOneOrder(parseInt(id))
    if(!order){
        res.status(400).json({ error: "Pedido inexistente." })
        return
    }

    res.json({ order })
}

export const updateOrderStatusController: RequestHandler = async (req, res) => {
  const { orderId, status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({ error: "orderId e status são obrigatórios" });
  }

  try {
    await updateOrderStatus(orderId, status)
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar status do pedido" });
  }
};