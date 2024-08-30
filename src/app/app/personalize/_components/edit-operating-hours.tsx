'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { updateOperatingHours } from '../(main)/actions'
import { toast } from '@/components/ui/use-toast'

interface OpeningHours {
  id: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  restaurantId: string;
}

interface EditOperatingHoursProps {
  data: OpeningHours[];
  userId: string; // Adiciona userId como prop
}

interface DaySchedule {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
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

export default function EditOperatingHours({ data, userId }: EditOperatingHoursProps) {
  const [schedule, setSchedule] = useState<WeekSchedule>({
    monday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
    tuesday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
    wednesday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
    thursday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
    friday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
    saturday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
    sunday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
});


  useEffect(() => {
    const initialSchedule = daysOfWeek.reduce((acc, day) => {
      const dayData = data.find(d => d.dayOfWeek.toLowerCase() === day.label.toLowerCase());
      acc[day.key as keyof WeekSchedule] = dayData
        ? {
            isOpen: dayData.isOpen,
            openTime: dayData.openTime,
            closeTime: dayData.closeTime
          }
        : { isOpen: false, openTime: '', closeTime: '' };
      return acc;
    }, {} as WeekSchedule);
    setSchedule(initialSchedule);
  }, [data]);

  const handleToggleDay = (day: keyof WeekSchedule) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen }
    }));
  };

  const handleTimeChange = (day: keyof WeekSchedule, field: 'openTime' | 'closeTime', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const validateTimeFormat = (time: string) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const openingHoursData = Object.entries(schedule).map(([day, { isOpen, openTime, closeTime }]) => ({
    dayOfWeek: daysOfWeek.find(d => d.key === day)?.label as string,
    isOpen,
    openTime,
    closeTime,
  }));

  const { error, data } = await updateOperatingHours(userId, openingHoursData);
  
  if (error) {
    console.error(error);
    toast({
        title: 'Erro.',
        description: 'Erro ao alterar os horários de funcionamento. Por favor, tente novamente.',
      });
  } else {
    toast({
        title: 'Sucesso',
        description: 'Os horários de funcionamento foram alterados com sucesso.',
      });
  }
};


  return (
    <Card className="w-full max-w-2xl mx-auto">
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
  );
}
