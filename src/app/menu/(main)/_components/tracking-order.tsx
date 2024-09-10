'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Info, CheckCircle, XCircle, Clock, Truck, RefreshCw } from 'lucide-react';
import { getOrderByTrackingCode } from '../../actions';
import { toast } from 'react-hot-toast';
import { darkenColor } from '../../functions';

interface TrackingOrderProps {
  initialTrackingCode: string | null;
  colorThemeCode: string;
}

interface OrderData {
  id: string;
  identifier: string;
  status: string;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  clientName: string | null;
  orderType: string;
  totalPrice: string;
  table: string | null;
  trackingCode: string;
  clientContact: string | null;
  clientAddress: string | null;
  orderItems: Array<{
    id: string;
    amount: string;
    itemId: string;
    orderId: string;
    item: {
      id: string;
      name: string;
      description: string;
      price: string;
      imageUrl: string;
      isAvailable: boolean;
      isVegan: boolean;
      createdAt: Date;
      updatedAt: Date;
      categoryId: string;
      deletedAt: Date | null;
    };
  }>;
}

const TrackingOrder: React.FC<TrackingOrderProps> = ({ initialTrackingCode, colorThemeCode }) => {
  const [trackingCode, setTrackingCode] = useState(initialTrackingCode || '');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (initialTrackingCode) {
      fetchOrder(initialTrackingCode);
    }
  }, [initialTrackingCode]);

  const fetchOrder = async (code: string) => {
    setLoading(true);
    setNotFound(false);
    try {
      const result = await getOrderByTrackingCode(code);
      if (result.error) {
        toast.error(result.error);
        setOrderData(null);
        setNotFound(true);
      } else if (result.data) {
        setOrderData(result.data as OrderData);
      } else {
        setOrderData(null);
        setNotFound(true);
      }
    } catch (error) {
      toast.error('Erro ao buscar o pedido. Tente novamente.');
      setOrderData(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingCode) {
      fetchOrder(trackingCode);
    }
  };

  const handleRefresh = () => {
    if (trackingCode) {
      fetchOrder(trackingCode);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-8 h-8 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'canceled':
        return <XCircle className="w-8 h-8 text-red-500" />;
      case 'done':
        return <Truck className="w-8 h-8 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Aguardando confirmação';
      case 'confirmed':
        return 'Pedido em preparação';
      case 'canceled':
        return 'Pedido cancelado';
      case 'done':
        return 'Pedido enviado';
      default:
        return 'Status desconhecido';
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto h-full overflow-y-auto">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center border-b border-gray-300 py-2">
          <input
            type="text"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder="Digite o código de rastreio"
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            aria-label="Código de rastreio"
          />
          <button
            style={{ backgroundColor: darkenColor(colorThemeCode, 20) }}
            type="submit"
            className="flex-shrink-0 hover:brightness-95 text-sm text-white py-1 px-2 rounded"
            aria-label="Buscar pedido"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <Search className="w-8 h-8 text-blue-500" />
          </motion.div>
          <p className="mt-2">Buscando pedido...</p>
        </div>
      )}

      {notFound && !loading && (
        <div className="text-center text-sm text-red-500 font-semibold mt-4">
          Código inválido. <br/>Tente novamente ou entre em contato com o estabelecimento para acompanhar o status do seu pedido.
        </div>
      )}

      {orderData && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-6">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4"
            >
              {getStatusIcon(orderData.status)}
              <span className="mt-2 text-base font-semibold text-center">{getStatusText(orderData.status)}</span>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Criado às:</p>
              <p className="font-semibold">{new Date(orderData.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Última atualização:</p>
              <p className="font-semibold">{new Date(orderData.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tipo de pedido:</p>
              <p className="font-semibold">{orderData.orderType === 'dine-in' ? 'Consumo no local' : 'Delivery'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total:</p>
              <p className="font-semibold">R$ {orderData.totalPrice}</p>
            </div>
          </div>

          {orderData.clientName && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">Cliente:</p>
              <p className="font-semibold">{orderData.clientName}</p>
            </div>
          )}

          {orderData.table && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">Mesa:</p>
              <p className="font-semibold">{orderData.table}</p>
            </div>
          )}

          {orderData.clientContact && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">Contato:</p>
              <p className="font-semibold">{orderData.clientContact}</p>
            </div>
          )}

          {orderData.clientAddress && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">Endereço de entrega:</p>
              <p className="font-semibold">{orderData.clientAddress}</p>
            </div>
          )}

          {orderData.note && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Observação:</p>
              <p className="italic">{orderData.note}</p>
            </div>
          )}

          <button
            onClick={handleRefresh}
            style={{ backgroundColor: darkenColor(colorThemeCode, 20) }}
            className="mt-4 w-full flex items-center justify-center py-2 px-4 text-white rounded-md shadow-sm text-sm font-medium text-whitehover:brightness-95"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Atualizar pesquisa
          </button>
        </div>
      )}

      <div className="absolute bottom-4 left-4">
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="text-blue-500 hover:text-blue-700"
        aria-label="Informações sobre o sistema de pedidos"
      >
        <Info className="w-6 h-6" />
      </button>
      {showInfo && (
        <div className="absolute left-0 bottom-full mb-2 p-4 bg-white shadow-lg rounded-lg w-64">
          <h3 className="text-lg font-semibold mb-2">Como funciona?</h3>
          <p className="text-sm text-gray-600">
            Nosso sistema de pedidos permite que você acompanhe o status do seu pedido em tempo real. 
            Use o código de rastreio fornecido no momento da compra para verificar o progresso do seu pedido. 
            Os status incluem: aguardando confirmação, confirmado, enviado ou cancelado. <span className='font-medium'>Atualize a busca para receber a informação mais recente.</span>
          </p>
        </div>
      )}
    </div>
    </div>
  );
};

export default TrackingOrder;