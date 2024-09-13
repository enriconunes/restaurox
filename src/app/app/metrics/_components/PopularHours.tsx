import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react'

interface PopularHoursProps {
  popularHours: Array<{ hour: number; orderCount: number }>;
}

export default function PopularHours({ popularHours }: PopularHoursProps) {
  const data = popularHours.map(item => ({
    hour: `${item.hour}:00`,
    orderCount: item.orderCount
  }));

  const NoDataDisplay = () => (
    <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
      <Clock size={48} />
      <p className="mt-4 text-lg font-medium">Nenhum dado disponível</p>
      <p className="text-sm">Comece a registrar vendas para ver o gráfico de horas populares</p>
    </div>
  )

  const hasNonZeroOrders = popularHours.some(hour => hour.orderCount > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horas Mais Populares (Hora x Qtd. de Pedidos)</CardTitle>
      </CardHeader>
      <CardContent>
        {popularHours.length > 0 && hasNonZeroOrders ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orderCount" fill="#b91c1c" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <NoDataDisplay />
        )}
      </CardContent>
    </Card>
  )
}