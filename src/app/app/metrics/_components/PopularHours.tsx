// PopularHours.tsx
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


interface PopularHoursProps {
  popularHours: Array<{ hour: number; orderCount: number }>;
}

export default function PopularHours({ popularHours }: PopularHoursProps) {
  const data = popularHours.map(item => ({
    hour: `${item.hour}:00`,
    orderCount: item.orderCount
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horas Mais Populares (Hora x Qtd. de Pedidos)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orderCount" fill="#b91c1c" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}