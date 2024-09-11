import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

interface DailyRevenueChartProps {
  dailyRevenue: Array<{ date: Date; revenue: number }>;
}

export default function DailyRevenueChart({ dailyRevenue }: DailyRevenueChartProps) {
  const data = dailyRevenue.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    revenue: item.revenue
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" stroke="#b91c1c" />
      </LineChart>
    </ResponsiveContainer>
  )
}