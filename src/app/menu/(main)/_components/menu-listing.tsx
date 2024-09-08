'use client'

import React, { useState, useRef, useEffect } from 'react';
import { RestaurantData } from '@/app/app/(main)/types';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, X } from 'lucide-react';
import { darkenColor } from '../../functions';

interface MenuListingProps {
  restaurant: RestaurantData;
}

export default function MenuListing({ restaurant }: MenuListingProps) {
  const [activeCategory, setActiveCategory] = useState<string>(restaurant.itemCategories[0]?.id);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleScroll = () => {
      let currentActiveCategory = activeCategory;
      for (const category of restaurant.itemCategories) {
        const element = categoryRefs.current[category.id];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            currentActiveCategory = category.id;
          } else {
            break;
          }
        }
      }
      setActiveCategory(currentActiveCategory);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [restaurant.itemCategories, activeCategory]);

  const scrollToCategory = (categoryId: string) => {
    categoryRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <nav className="sticky top-3 bg-white bg-opacity-60 z-10 py-2 mb-8">
            <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
            {restaurant.itemCategories.map((category) => (
                <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-300`}
                style={{
                    backgroundColor: activeCategory === category.id ? darkenColor(restaurant.colorThemeCode, 20) : 'white',
                    color: activeCategory === category.id ? 'white' : darkenColor(restaurant.colorThemeCode, 20),
                    border: activeCategory === category.id ? 'none' : `1px solid ${darkenColor(restaurant.colorThemeCode, 20)}`,
                    boxShadow: activeCategory === category.id ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
                }}
                >
                {category.name}
                </button>
            ))}
            </div>
        </nav>

      {restaurant.itemCategories.map((category) => (
        <motion.div 
          key={category.id} 
          ref={(el: HTMLDivElement | null) => {
            if (el) {
              categoryRefs.current[category.id] = el;
            }
          }} 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{category.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {category.items.map((item) => (
              <motion.div 
                key={item.id} 
                className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 ${!item.isAvailable ? 'opacity-50' : ''}`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/3 relative cursor-pointer" onClick={() => setExpandedImage(item.imageUrl)}>
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={150}
                      height={150}
                      className="object-cover w-full h-32 sm:h-full"
                    />
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                        <XCircle className="text-white w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div className="w-full sm:w-2/3 p-3 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-gray-800">{item.name}</h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between mt-2">
                      <span className="text-base font-bold text-gray-800 mr-2">
                        {item.discount 
                          ? (
                            <>
                              <span className="line-through text-gray-400 mr-1 text-sm">
                                R${item.price}
                              </span>
                              <span className="text-red-600">R${item.discount.newPrice}</span>
                            </>
                          ) 
                          : `R$${item.price}`
                        }
                      </span>
                      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        {item.isVegan && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                            Vegano
                          </span>
                        )}
                        {item.isAvailable ? (
                          <button
                          style={{ backgroundColor: darkenColor(restaurant.colorThemeCode, 20) }}
                          className="text-white px-3 py-1 rounded-full text-xs font-medium hover:brightness-95 transition-colors duration-300">
                            Adicionar
                          </button>
                        ) : (
                          <span className="text-xs text-red-600 font-medium">
                            Indisponível
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-3xl w-full bg-white rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedImage(null)}
                className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-1 hover:bg-gray-700 transition-colors duration-300"
              >
                <X size={24} />
              </button>
              <Image
                src={expandedImage}
                alt="Expanded view"
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}