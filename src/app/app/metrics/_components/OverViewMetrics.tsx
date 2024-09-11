import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OverviewMetricsProps {
  metrics: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    topSellingItems: Array<{ itemId: string; name: string; totalSold: number }>;
  }
}

export default function OverviewMetrics({ metrics }: OverviewMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalOrders}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R${metrics.totalRevenue.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Médio dos Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R${metrics.averageOrderValue.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Item Mais Vendido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.topSellingItems[0]?.name}</div>
          <p className="text-xs text-muted-foreground">
            Vendidos: {metrics.topSellingItems[0]?.totalSold}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}