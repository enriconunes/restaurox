import Link from 'next/link';
import { Edit, Phone, Instagram, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RestaurantData } from '@/app/types';

interface RestaurantMainDetailsProps {
  data: RestaurantData | null;
}

export default function RestaurantMainDetails({ data }: RestaurantMainDetailsProps) {
  if (!data) {
    return <p>Erro ao carregar os detalhes do restaurante.</p>;
  }

  const {
    name,
    address,
    contactNumber,
    instagramProfileName,
    doDelivery,
    avatarUrl,
  } = data;

  return (
    <div className="w-full max-w-3xl mx-auto lg:p-6 mb-6 lg:mb-0">
      <div className="bg-background text-foreground rounded-lg shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center p-4 sm:p-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
            <img
              src={avatarUrl}
              alt={`Logotipo de ${name}`}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold mb-1">{name}</h1>
            <p className="text-muted-foreground text-sm mb-2">{address}</p>
            <Link href="/app/personalize">
              <Button variant="outline" size="sm" className="bg-red-700 hover:bg-red-800 text-white border-red-600">
                <Edit className="mr-2 h-4 w-4" /> Personalizar
              </Button>
            </Link>
          </div>
        </div>
        <div className="bg-muted p-4">
          <div className="flex flex-col sm:flex-row lg:flex-row lg:justify-center lg:space-x-12 text-sm mb-2">
          <div className="flex items-center mb-2 sm:mb-0">
            <Phone className="h-4 w-4 mr-2 text-red-700" />
            <span>{contactNumber}</span>
          </div>
          <div className="flex items-center mb-2 sm:mb-0">
            <Truck className="h-4 w-4 mr-2 text-red-700" />
            {doDelivery ? (
              <span>Delivery disponível</span>
            ):(
              <span>Delivery indisponível</span>
            )}
          </div>
          <div className="flex items-center">
            <Instagram className="h-4 w-4 mr-2 text-red-700" />
            <span>{instagramProfileName}</span>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
}
