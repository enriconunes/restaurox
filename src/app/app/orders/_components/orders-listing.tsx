'use client'

import { useEffect, useState } from 'react'
import { getOrdersByUserId, updateOrderStatus } from '../actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon, User, Truck, UtensilsCrossed, Calendar, DollarSign, MapPin, Phone, Hash, ClipboardList, SearchCheck } from 'lucide-react'
import { Order, OrderItem } from '../../(main)/types'
import { toast } from '@/components/ui/use-toast'

interface OrdersListingProps {
  userId: string | undefined
}

type OrderStatus = 'pending' | 'canceled' | 'confirmed' | 'done'

const statusTranslations: Record<OrderStatus, string> = {
  pending: 'Pendente',
  canceled: 'Cancelado',
  confirmed: 'Confirmado',
  done: 'Concluído'
}

export default function OrdersListing({ userId }: OrdersListingProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    orderType: 'all',
    status: 'all',
    identifier: '',
    sortBy: 'createdAt' as 'createdAt' | 'updatedAt',
    sortOrder: 'desc' as 'asc' | 'desc',
  })

  useEffect(() => {
    if (userId) {
      fetchOrders()
    }
  }, [userId, page, filters])

  const fetchOrders = async () => {
    if (!userId) {
      setError('ID do usuário não fornecido')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await getOrdersByUserId({
        userId,
        page,
        pageSize: 5,
        orderType: filters.orderType !== 'all' ? filters.orderType as 'delivery' | 'dine-in' : undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        identifier: filters.identifier || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      })

      if (result.error) {
        setError(result.error)
      } else if (result.data) {
        setOrders(result.data)
        setTotalPages(Math.ceil(result.totalCount / 5))
      } else {
        setError('Nenhum dado recebido do servidor')
      }
    } catch (err) {
      setError('Falha ao obter pedidos: ' + (err instanceof Error ? err.message : String(err)))
      console.error('Erro ao buscar pedidos:', err)
    }
    setLoading(false)
  }

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const result = await updateOrderStatus({ id: orderId, status: newStatus })
      if (result.error) {
        toast({
          title: "Erro ao atualizar status",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ))
        toast({
          title: "Status atualizado",
          description: `O pedido foi atualizado para ${statusTranslations[newStatus]}`,
        })
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao tentar atualizar o status do pedido.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'confirmed': return 'bg-blue-500'
      case 'done': return 'bg-green-500'
      case 'canceled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(value))
  }

  const renderOrderItems = (items: OrderItem[]) => (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
          <span>{item.amount}x {item.item.name}</span>
          <span className="font-semibold">{formatCurrency(item.item.price)}</span>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div>
          <Label htmlFor="orderType" className="mb-2 block text-sm font-medium text-gray-700">Tipo de Pedido</Label>
          <Select
            value={filters.orderType}
            onValueChange={(value) => setFilters(prev => ({ ...prev, orderType: value }))}
          >
            <SelectTrigger id="orderType" className="w-full">
              <SelectValue placeholder="Tipo de Pedido" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
              <SelectItem value="dine-in">Consumo Local</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status" className="mb-2 block text-sm font-medium text-gray-700">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="confirmed">Confirmado</SelectItem>
              <SelectItem value="done">Concluído</SelectItem>
              <SelectItem value="canceled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="identifier" className="mb-2 block text-sm font-medium text-gray-700">Nº do pedido</Label>
          <Input
            id="identifier"
            placeholder="Buscar por número do pedido"
            className="w-full"
            value={filters.identifier}
            onChange={(e) => setFilters(prev => ({ ...prev, identifier: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="sortOrder" className="mb-2 block text-sm font-medium text-gray-700">Ordenar por</Label>
          <Select
            value={filters.sortOrder}
            onValueChange={(value: 'asc' | 'desc') => setFilters(prev => ({ ...prev, sortOrder: value }))}
          >
            <SelectTrigger id="sortOrder" className="w-full">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Mais recentes</SelectItem>
              <SelectItem value="asc">Mais antigos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro:</strong>
          <span className="block sm:inline"> {error}</span>
          <Button onClick={fetchOrders} className="mt-4 bg-red-500 hover:bg-red-600 text-white">
            Tentar novamente
          </Button>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500 text-xl">Nenhum pedido encontrado.</p>
      ) : (
        <>
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gray-100">
                  <CardTitle className="flex justify-between items-center">
                    <span className="text-xl text-gray-800">Pedido #{order.identifier}</span>
                    <Badge className={`${getStatusColor(order.status as OrderStatus)} text-white px-3 py-1 rounded-full text-sm flex items-center gap-1`}>
                      {statusTranslations[order.status as OrderStatus]}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                    <div className="space-y-2 mb-4 md:mb-0">
                      <p className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{order.clientName || 'N/A'}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        {order.orderType === 'delivery' ? <Truck className="w-4 h-4 text-gray-500" /> : <UtensilsCrossed className="w-4 h-4 text-gray-500" />}
                        <span className="text-gray-700">{order.orderType === 'delivery' ? 'Delivery' : 'Consumo Local'}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{new Date(order.createdAt).toLocaleString()}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 font-semibold">{formatCurrency(order.totalPrice)}</span>
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      {expandedOrder === order.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                      {expandedOrder === order.id ? 'Menos detalhes' : 'Mais detalhes'}
                    </Button>
                  </div>
                  {expandedOrder === order.id && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 text-lg text-gray-700">Itens do Pedido:</h4>
                      {renderOrderItems(order.orderItems)}
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{order.note || 'Nenhuma nota'}</span>
                        </p>
                        {order.orderType === 'delivery' && (
                          <>
                            <p className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{order.clientAddress || 'N/A'}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{order.clientContact || 'N/A'}</span>
                            </p>
                          </>
                        )}
                        {order.orderType === 'dine-in' && (
                          <p className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">Mesa: {order.table || 'N/A'}</span>
                          </p>
                        )}
                        <p className="flex items-center gap-2">
                          <SearchCheck className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">Código para Acompanhamento: {order.trackingCode}</span>
                        </p>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex justify-end space-x-2">
                        <Select onValueChange={(value) => handleUpdateStatus(order.id, value as OrderStatus)}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Atualizar Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="confirmed">Confirmado</SelectItem>
                            <SelectItem value="done">Concluído</SelectItem>
                            <SelectItem value="canceled">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              <ChevronLeftIcon className="mr-2 h-4 w-4" /> Anterior
            </Button>
            <span className="text-sm px-2 font-semibold text-gray-700">Página {page} de {totalPages}</span>
            <Button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Próxima <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}