'use client'

import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Clock } from 'lucide-react'
import { OpeningHours } from '@/app/app/(main)/types'
import { darkenColor } from '../../functions'

interface OpeningHoursButtonProps {
  openingHours: OpeningHours[];
  colorThemeCode: string;
}

export default function OpeningHoursButton({ openingHours, colorThemeCode }: OpeningHoursButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const buttonStyle = useMemo(() => {
    const darkenedColor = darkenColor(colorThemeCode, 20);
    return {
      backgroundColor: darkenedColor,
      '--button-hover-bg': darkenColor(colorThemeCode, 40),
    } as React.CSSProperties;
  }, [colorThemeCode]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="text-white hover:brightness-95 font-semibold px-6 py-2 rounded-md shadow-md transition-colors duration-200 hover:bg-[var(--button-hover-bg)]"
          style={{ backgroundColor: darkenColor(colorThemeCode, 20) }}
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