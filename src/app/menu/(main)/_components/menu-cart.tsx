'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Plus, Minus, Trash2, Store, Bike, Copy } from 'lucide-react';
import { darkenColor } from '../../functions';
import { toast } from 'react-hot-toast';
import { createNewOrder } from '../../actions';
import TrackingOrder from './tracking-order';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface MenuCartProps {
  colorThemeCode: string;
  doOrder: boolean;
  doDelivery: boolean;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  restaurantId: string;
  deliveryFee: string;
  deliveryTimeMinutes: string;
}

const MenuCart: React.FC<MenuCartProps> = ({ colorThemeCode, doOrder, doDelivery, cartItems, setCartItems, restaurantId, deliveryFee, deliveryTimeMinutes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'cart' | 'tracking'>('cart');
  const [orderType, setOrderType] = useState<'store' | 'delivery' | null>(null);
  const [observation, setObservation] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  const toggleCart = () => setIsOpen(!isOpen);

  const updateQuantity = (id: string, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 
  (orderType === 'delivery' ? parseFloat(deliveryFee) : 0);

  const cartColor = darkenColor(colorThemeCode, 20);
  const buttonColor = darkenColor(colorThemeCode, 50);

  const handleOrderTypeChange = (type: 'store' | 'delivery') => {
    if (type === 'delivery' && !doDelivery) {
      toast.error('Delivery não disponível neste estabelecimento');
    } else {
      setOrderType(type);
    }
  };

  const handleSubmit = async () => {
    const orderData = {
      restaurantId,
      clientName: customerName || undefined,
      note: observation || undefined,
      orderType: orderType === 'store' ? 'dine-in' : 'delivery',
      totalPrice: totalPrice.toFixed(2),
      table: orderType === 'store' ? tableNumber : undefined,
      clientContact: orderType === 'delivery' ? phoneNumber : undefined,
      clientAddress: orderType === 'delivery' ? address : undefined,
      items: cartItems.map(item => ({
        itemId: item.id,
        amount: item.quantity.toString(),
      })),
    };

    try {
      const result = await createNewOrder(orderData);

      if (result.error) {
        toast.error(result.error);
      } else if (result.data) {
        toast.success('Pedido realizado com sucesso!');
        setTrackingCode(result.data.trackingCode);
        setCartItems([]);
        setActiveTab('tracking');
        // Reset other form fields
        setObservation('');
        setTableNumber('');
        setCustomerName('');
        setPhoneNumber('');
        setAddress('');
        setOrderType(null);
      }
    } catch (error) {
      toast.error('Erro ao realizar o pedido. Tente novamente.');
    }
  };

  const copyTrackingCode = () => {
    if (trackingCode) {
      navigator.clipboard.writeText(trackingCode);
      toast.success('Código de rastreio copiado!');
    }
  };

  if (!doOrder) return null;

  return (
    <>
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <button
          onClick={toggleCart}
          className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg"
          style={{ backgroundColor: cartColor }}
        >
          <ShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {totalItems}
            </span>
          )}
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
          >
            <div className="p-4 flex justify-between items-center" style={{ backgroundColor: cartColor }}>
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <button onClick={toggleCart} className="text-white">
                <X size={24} />
              </button>
            </div>
            <div className="flex border-b">
              <button
                className={`flex-1 py-2 px-4 ${activeTab === 'cart' ? 'bg-gray-200' : ''}`}
                onClick={() => setActiveTab('cart')}
              >
                Carrinho
              </button>
              <button
                className={`flex-1 py-2 px-4 ${activeTab === 'tracking' ? 'bg-gray-200' : ''}`}
                onClick={() => setActiveTab('tracking')}
              >
                Acompanhar Pedido
              </button>
            </div>
            <div className="flex-grow overflow-y-auto">
              {activeTab === 'cart' ? (
                <div className="p-4">
                  {cartItems.length === 0 ? (
                    <p className="text-center text-gray-500">Seu carrinho está vazio</p>
                  ) : (
                    cartItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between mb-4 bg-gray-100 p-2 rounded">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600">R$ {item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-500">
                            <Minus size={20} />
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-500">
                            <Plus size={20} />
                          </button>
                          <button onClick={() => removeItem(item.id)} className="ml-2 text-red-500">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}

                  {cartItems.length > 0 && (
                    <>
                      <div className="mt-6">
                        <label htmlFor="observation" className="block text-sm font-medium text-gray-700 mb-1">
                          Observação (opcional)
                        </label>
                        <textarea
                          id="observation"
                          rows={3}
                          maxLength={255}
                          value={observation}
                          onChange={(e) => setObservation(e.target.value)}
                          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                          placeholder="Alguma observação sobre o pedido?"
                        />
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Pedido</label>
                        <div className="flex justify-around">
                          <button
                            onClick={() => handleOrderTypeChange('store')}
                            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                              orderType === 'store' ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            style={{ backgroundColor: orderType === 'store' ? buttonColor : 'transparent' }}
                          >
                            <Store size={20} className="mr-2" />
                            Consumo na Loja
                          </button>
                          <button
                            onClick={() => handleOrderTypeChange('delivery')}
                            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                              orderType === 'delivery' ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
                            } ${!doDelivery ? 'opacity-50 cursor-not-allowed' : ''}`}
                            style={{ backgroundColor: orderType === 'delivery' ? buttonColor : 'transparent' }}
                            disabled={!doDelivery}
                          >
                            <Bike size={20} className="mr-2" />
                            Delivery
                          </button>
                        </div>
                      </div>

                      {orderType === 'store' && (
                        <div className="mt-6 space-y-4">
                          <div>
                            <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-1">
                              Número da Mesa *
                            </label>
                            <input
                              type="text"
                              id="tableNumber"
                              required
                              value={tableNumber}
                              onChange={(e) => setTableNumber(e.target.value)}
                              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                              Seu Nome (opcional)
                            </label>
                            <input
                              type="text"
                              id="customerName"
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      )}

                      {orderType === 'delivery' && (
                        <div className="mt-6 space-y-4">
                          <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                              Número de Contato *
                            </label>
                            <input
                              type="tel"
                              id="phoneNumber"
                              required
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                              placeholder="(00) 00000-0000"
                            />
                          </div>
                          <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                              Endereço de Entrega *
                            </label>
                            <input
                              type="text"
                              id="address"
                              required
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="deliveryCustomerName" className="block text-sm font-medium text-gray-700 mb-1">
                              Seu Nome (opcional)
                            </label>
                            <input
                              type="text"
                              id="deliveryCustomerName"
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {orderType === 'delivery' && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>Tempo médio de entrega: {deliveryTimeMinutes} minutos</p>
                      <p>Taxa de entrega: R$ {deliveryFee}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4">
                  {trackingCode ? (
                    <div className="text-center mb-4">
                      <p className="mb-2">Acompanhe o seu pedido com este código. Copie para não o perder:</p>
                      <div className="flex items-center justify-center">
                        <span className="text-2xl font-bold mr-2">{trackingCode}</span>
                        <button onClick={copyTrackingCode} className="text-blue-500 hover:text-blue-700">
                          <Copy size={20} />
                        </button>
                      </div>
                    </div>
                  ) : null}
                  <TrackingOrder colorThemeCode={colorThemeCode} initialTrackingCode={trackingCode} />
                </div>
              )}
            </div>
            {activeTab === 'cart' && (
              <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold">R$ {totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={cartItems.length === 0 || !orderType || (orderType === 'store' && !tableNumber) || (orderType === 'delivery' && (!phoneNumber || !address))}
                  className="w-full py-2 px-4 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: buttonColor }}
                >
                  Finalizar Pedido
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MenuCart;