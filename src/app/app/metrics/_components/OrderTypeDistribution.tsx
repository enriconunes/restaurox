import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface OrderTypeDistributionProps {
  distribution: Array<{ orderType: string; count: number }>;
}

const COLORS = ['#b91c1c', '#7b808a'];

export default function OrderTypeDistribution({ distribution }: OrderTypeDistributionProps) {
  const total = distribution.reduce((sum, item) => sum + item.count, 0);
  const data = distribution.map(item => ({
    name: item.orderType === 'delivery' ? 'Delivery' : 'No local',
    value: item.count,
    percentage: ((item.count / total) * 100).toFixed(2)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Tipos de Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percentage }) => `${name} ${percentage}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}