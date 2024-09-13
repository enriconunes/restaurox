import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from 'lucide-react'

interface TopSellingItemsProps {
  items: Array<{ itemId: string; name: string; totalSold: number }>;
}

export default function TopSellingItems({ items }: TopSellingItemsProps) {
  const NoDataDisplay = () => (
    <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
      <TrendingUp size={48} />
      <p className="mt-4 text-lg font-medium">Nenhum dado disponível</p>
      <p className="text-sm">Comece a registrar vendas para ver os itens mais vendidos</p>
    </div>
  )

  const topItems = items.slice(0, 10) // Limit to top 10 items

  return (
    <Card>
      <CardHeader>
        <CardTitle>Itens Mais Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <ul className="space-y-2">
            {topItems.map((item, index) => (
              <li key={item.itemId} className="flex justify-between items-center">
                <span className="font-medium">{index + 1}. {item.name}</span>
                <span className="text-muted-foreground">{item.totalSold} vendidos</span>
              </li>
            ))}
          </ul>
        ) : (
          <NoDataDisplay />
        )}
      </CardContent>
    </Card>
  )
}