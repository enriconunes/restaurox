// CustomerRetention.tsx
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


interface CustomerRetentionProps {
  retentionData: Array<{ date: Date; newCustomers: number; returningCustomers: number }>;
}

export default function CustomerRetention({ retentionData }: CustomerRetentionProps) {
  const data = retentionData.map(item => ({
    date: item.date.toISOString().split('T')[0],
    novos: item.newCustomers,
    retornando: item.returningCustomers
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Retenção de Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="novos" stroke="#82ca9d" />
            <Line type="monotone" dataKey="retornando" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}