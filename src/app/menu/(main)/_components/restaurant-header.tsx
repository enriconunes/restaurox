'use client'

import Image from 'next/image'
import { RestaurantData } from '@/app/app/(main)/types'
import { Button } from "@/components/ui/button"
import { Phone, Instagram, Clock, Truck } from 'lucide-react'
import OpeningHoursButton from './opening-hours-button'
import Link from 'next/link'

interface RestaurantHeaderProps {
  restaurant: RestaurantData
}

export default function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  return (
    <header className="w-full">
      <div className="relative">
        <div 
          className="absolute top-0 left-0 right-0 h-28"
          style={{ backgroundColor: restaurant.colorThemeCode }}
        >
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/banner.png"
              alt="Background pattern"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
        <div className="relative container mx-auto px-4 pt-8 pb-4">
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 relative mb-4">
              <Image
                src={restaurant.avatarUrl}
                alt={restaurant.name}
                layout="fill"
                objectFit="cover"
                className="rounded-xl p-0.5 bg-white shadow-md"
              />
            </div>
            <h1 className="text-2xl text-gray-800 font-bold mb-1">{restaurant.name}</h1>
            <p className="text-sm text-gray-700 mb-4">{restaurant.address}</p>
            <OpeningHoursButton 
              openingHours={restaurant.openingHours} 
              colorThemeCode={restaurant.colorThemeCode}
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center text-sm sm:justify-center sm:space-x-4 space-y-2 sm:space-y-0">
          <span className="flex items-center text-gray-600">
            <Phone className="w-4 h-4 mr-1 text-gray-600" />
            {restaurant.contactNumber}
          </span>
          <Link href={`https://www.instagram.com/${restaurant.instagramProfileName}/`} target='blank' className="flex items-center text-gray-600">
            <Instagram className="w-4 h-4 mr-1 text-gray-600" />
            {restaurant.instagramProfileName}
          </Link>
          {restaurant.doDelivery && (
            <span className="flex items-center text-green-600 font-medium">
              <Truck className="w-4 h-4 mr-1" />
              Delivery disponível
            </span>
          )}
        </div>
      </div>
    </header>
  )
}