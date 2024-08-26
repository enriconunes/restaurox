'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DaySchedule {
  isOpen: boolean
  openTime: string
  closeTime: string
}

type WeekSchedule = {
  [key in 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday']: DaySchedule
}

const daysOfWeek = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
] as const

export default function EditOperatingHours() {
  const [schedule, setSchedule] = useState<WeekSchedule>({
    monday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    tuesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    wednesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    thursday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    friday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    saturday: { isOpen: true, openTime: '10:00', closeTime: '16:00' },
    sunday: { isOpen: false, openTime: '', closeTime: '' },
  })

  const handleToggleDay = (day: keyof WeekSchedule) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen }
    }))
  }

  const handleTimeChange = (day: keyof WeekSchedule, field: 'openTime' | 'closeTime', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }))
  }

  const validateTimeFormat = (time: string) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/
    return regex.test(time)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Updated schedule:', schedule)
    // Here you would typically send the updated schedule to your backend
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>Editar horários de funcionamento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {daysOfWeek.map(({ key, label }) => (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center justify-between sm:w-1/3">
                <Label htmlFor={`${key}-toggle`} className="text-base font-medium">
                  {label}
                </Label>
                <Switch
                  id={`${key}-toggle`}
                  checked={schedule[key].isOpen}
                  onCheckedChange={() => handleToggleDay(key)}
                />
              </div>
              <div className="flex items-center space-x-2 sm:w-2/3">
                <Input
                  type="time"
                  value={schedule[key].openTime}
                  onChange={(e) => handleTimeChange(key, 'openTime', e.target.value)}
                  disabled={!schedule[key].isOpen}
                  className="w-full"
                />
                <span>até</span>
                <Input
                  type="time"
                  value={schedule[key].closeTime}
                  onChange={(e) => handleTimeChange(key, 'closeTime', e.target.value)}
                  disabled={!schedule[key].isOpen}
                  className="w-full"
                />
              </div>
            </div>
          ))}
          <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white">
            <Save className="mr-2 h-4 w-4" /> Salvar horários
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}