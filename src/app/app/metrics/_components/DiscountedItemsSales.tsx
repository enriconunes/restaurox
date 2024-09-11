import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DiscountedItemsSalesProps {
  items: Array<{ itemId: string; name: string; totalSold: number }>;
}

export default function DiscountedItemsSales({ items }: DiscountedItemsSalesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas de Itens com Desconto</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.itemId} className="flex justify-between items-center">
              <span className="font-medium">{item.name}</span>
              <span className="text-muted-foreground">{item.totalSold} vendidos</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}