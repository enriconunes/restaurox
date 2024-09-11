import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

interface CategorySalesProps {
  categorySales: Array<{ categoryId: string; name: string; totalSales: number }>;
}

export default function CategorySales({ categorySales }: CategorySalesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={categorySales}
              dataKey="totalSales"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {categorySales.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <ul className="mt-4 space-y-2">
          {categorySales.map((category, index) => (
            <li key={category.categoryId} className="flex justify-between items-center">
              <span className="font-medium">{category.name}</span>
              <span className="text-muted-foreground">R${category.totalSales.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}