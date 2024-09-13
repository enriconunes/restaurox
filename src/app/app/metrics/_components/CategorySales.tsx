import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

interface CategorySalesProps {
  categorySales: Array<{ categoryId: string; name: string; totalSales: number }>;
}

export default function CategorySales({ categorySales }: CategorySalesProps) {
  const NoDataDisplay = () => (
    <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
      <PieChartIcon size={48} />
      <p className="mt-4 text-lg font-medium">Nenhum dado disponível</p>
      <p className="text-sm">Comece a registrar vendas para ver o gráfico de receita</p>
    </div>
  )

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2)}`
  }

  const hasNonZeroSales = categorySales.some(category => category.totalSales > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        {categorySales.length > 0 ? (
          hasNonZeroSales ? (
            <>
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
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
              <ul className="mt-4 space-y-2">
                {categorySales.map((category, index) => (
                  <li key={category.categoryId} className="flex justify-between items-center">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-muted-foreground">{formatCurrency(category.totalSales)}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="space-y-4">
              <NoDataDisplay />
              <ul className="space-y-2">
                {categorySales.map((category, index) => (
                  <li key={category.categoryId} className="flex justify-between items-center">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-muted-foreground">{formatCurrency(category.totalSales)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        ) : (
          <NoDataDisplay />
        )}
      </CardContent>
    </Card>
  )
}