import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BarChart } from 'lucide-react';

interface RevenueChartProps {
  dailyRevenue: Array<{ date: Date; revenue: number }>;
}

export default function RevenueChart({ dailyRevenue }: RevenueChartProps) {
  const data = dailyRevenue.map(item => ({
    date: item.date.toISOString().split('T')[0],
    revenue: Number(item.revenue.toFixed(2))
  }));

  const formatCurrency = (value: number) => {
    return `${value.toFixed(2)}`
  }

  const NoDataDisplay = () => (
    <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
      <BarChart size={48} />
      <p className="mt-4 text-lg font-medium">Nenhum dado disponível</p>
      <p className="text-sm">Comece a registrar vendas para ver o gráfico de receita</p>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita Diária</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Receita']}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                name="Receita"
                stroke="#b91c1c" 
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <NoDataDisplay />
        )}
      </CardContent>
    </Card>
  )
}