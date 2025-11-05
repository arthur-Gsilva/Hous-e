'use client'
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { getAllProducts } from "@/services/product"
import { useQuery } from "@tanstack/react-query"
import { Bar, BarChart } from "recharts"

import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';


const page = () => {

    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: getAllProducts,
        staleTime: 60000
    })

    if (isLoading || !products) {
    return <p>Carregando...</p>
  }

    return(
        <div className="w-full max-w-7xl mx-auto p-6">
            <BarChart width={600} height={300} data={products}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="viewsCount" fill="#8884d8" />
            </BarChart>

            <BarChart width={600} height={300} data={products}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="salesCount" fill="#8884d8" />
            </BarChart>

        </div>
    )
}

export default page