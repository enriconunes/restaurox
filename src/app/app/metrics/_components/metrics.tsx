'use client'

import { useState, useEffect } from 'react'
import { format, parse } from 'date-fns'
import { getRestaurantMetrics } from '../actions'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import OverviewMetrics from './OverViewMetrics'
import TopSellingItems from './TopSellingItems'
import RevenueChart from './RevenueChart'
import CategorySales from './CategorySales'
import PopularHours from './PopularHours'
import OrderTypeDistribution from './OrderTypeDistribution'

interface MetricsProps {
  userId: string | undefined
}

type MetricsData = {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingItems: Array<{ itemId: string; name: string; totalSold: number }>;
  dailyRevenue: Array<{ date: Date; revenue: number }>;
  categorySales: Array<{ categoryId: string; name: string; totalSales: number }>;
  popularHours: Array<{ hour: number; orderCount: number }>;
  customerRetention: Array<{ date: Date; newCustomers: number; returningCustomers: number }>;
  categories: Array<{ id: string; name: string }>;
  orderTypeDistribution: Array<{ orderType: string; count: number }>;
}

export default function Metrics({ userId }: MetricsProps) {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [orderType, setOrderType] = useState<'delivery' | 'dine-in' | 'all'>('all')
  const [category, setCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!userId) return
      setIsLoading(true)
      const result = await getRestaurantMetrics({
        userId,
        startDate: startDate ? parse(startDate, 'yyyy-MM-dd', new Date()) : undefined,
        endDate: endDate ? parse(endDate, 'yyyy-MM-dd', new Date()) : undefined,
        orderType: orderType === 'all' ? undefined : orderType,
        category: category === 'all' ? undefined : category
      })
      if (result.data) {
        setMetrics(result.data)
      }
      setIsLoading(false)
    }

    fetchMetrics()
  }, [userId, startDate, endDate, orderType, category])

  const clearDateFilter = () => {
    setStartDate('')
    setEndDate('')
  }

  if (!userId) return <div>ID do usuário é obrigatório</div>
  if (isLoading) return <div>Carregando métricas...</div>

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-xl font-bold">Painel de Métricas do Restaurante</h1>
      
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-600">Data Inicial</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-600">Data Final</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div className="">
            <Button onClick={clearDateFilter} variant="outline">Limpar Filtro de Data</Button>
        </div>
        <Select onValueChange={(value) => setOrderType(value as 'delivery' | 'dine-in' | 'all')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de Pedido" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="delivery">Entrega</SelectItem>
            <SelectItem value="dine-in">No Local</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {metrics?.categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {metrics && (
        <>
          <OverviewMetrics metrics={{
            totalOrders: metrics.totalOrders,
            totalRevenue: metrics.totalRevenue,
            averageOrderValue: metrics.averageOrderValue
          }} />
          
          <Tabs defaultValue="revenue" className="w-full">
            <TabsList>
              <TabsTrigger value="revenue">Receita</TabsTrigger>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
              <TabsTrigger value="items">Itens</TabsTrigger>
            </TabsList>
            <TabsContent value="revenue">
              <div className="grid gap-6 md:grid-cols-2">
                <RevenueChart dailyRevenue={metrics.dailyRevenue} />
                <CategorySales categorySales={metrics.categorySales} />
              </div>
            </TabsContent>
            <TabsContent value="items">
              <div className="grid gap-6 md:grid-cols-2">
                <TopSellingItems items={metrics.topSellingItems} />
              </div>
            </TabsContent>
            <TabsContent value="orders">
              <div className="grid gap-6 md:grid-cols-2">
                <PopularHours popularHours={metrics.popularHours} />
                <OrderTypeDistribution distribution={metrics.orderTypeDistribution} />
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}