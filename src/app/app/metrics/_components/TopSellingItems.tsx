import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TopSellingItemsProps {
  items: Array<{ itemId: string; name: string; totalSold: number }>;
}

export default function TopSellingItems({ items }: TopSellingItemsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Itens Mais Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={item.itemId} className="flex justify-between items-center">
              <span className="font-medium">{index + 1}. {item.name}</span>
              <span className="text-muted-foreground">{item.totalSold} vendidos</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}