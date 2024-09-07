'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Clock } from 'lucide-react'
import { OpeningHours } from '@/app/app/(main)/types'

interface OpeningHoursButtonProps {
  openingHours: OpeningHours[];
  colorThemeCode: string;
}

export default function OpeningHoursButton({ openingHours, colorThemeCode }: OpeningHoursButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="hover:brightness-95 text-white font-semibold px-6 py-2 rounded-md shadow-md"
          style={{ backgroundColor: colorThemeCode }}
        >
          <Clock className="w-4 h-4 mr-2" />
          Ver horários
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Horários de Funcionamento</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {openingHours.map((day) => (
            <div key={day.id} className="flex justify-between items-center">
              <span className="font-medium">{day.dayOfWeek}</span>
              <span>
                {day.isOpen 
                  ? `${day.openTime} - ${day.closeTime}`
                  : 'Fechado'}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}