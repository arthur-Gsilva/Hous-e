"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Order } from "@/types/order";
import api from "@/services/api";



export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await api.get("/order", { withCredentials: true });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Erro ao buscar pedidos", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        <span>Carregando pedidos...</span>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center py-10">
        <h2 className="text-lg text-muted-foreground">Nenhum pedido encontrado</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Meus Pedidos</h1>

      <div className="grid grid-cols-4 gap-5">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row justify-between items-center mt-2">
                <div>
                  <CardTitle className="text-lg font-medium">Pedido #{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <Badge variant={order.status === "DELIVERED" ? "default" : "secondary"}>
                  {order.status.replace("_", " ")}
                </Badge>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Envio para {order.shippingCity}, {order.shippingState}
                  </p>
                  <p className="text-sm">Total: <span className="font-semibold">R$ {order.total.toFixed(2)}</span></p>
                </div>
                <Link href={`/pedidos/${order.id}`}>
                  <Button variant="outline">Ver Detalhes</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
