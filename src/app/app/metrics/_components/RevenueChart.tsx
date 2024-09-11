// RevenueChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface RevenueChartProps {
  dailyRevenue: Array<{ date: Date; revenue: number }>;
}

export default function RevenueChart({ dailyRevenue }: RevenueChartProps) {
  const data = dailyRevenue.map(item => ({
    date: item.date.toISOString().split('T')[0],
    revenue: item.revenue
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita Diária</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#b91c1c" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}