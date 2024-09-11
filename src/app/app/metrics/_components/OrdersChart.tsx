import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'

interface OrdersChartProps {
  ordersByStatus: Array<{ status: string; count: number }>;
  ordersByType: Array<{ orderType: string; count: number }>;
}

export default function OrdersChart({ ordersByStatus, ordersByType }: OrdersChartProps) {
  const data = [
    ...ordersByStatus.map(item => ({ name: item.status, Pedidos: item.count, Tipo: 'Status' })),
    ...ordersByType.map(item => ({ name: item.orderType, Pedidos: item.count, Tipo: 'Tipo de Pedido' }))
  ]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Pedidos" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}