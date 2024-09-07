import { getRestaurantDetailsById } from '../actions';
import { notFound } from 'next/navigation';
import RestaurantHeader from './_components/restaurant-header';

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const restaurantId = searchParams.id;

  if (!restaurantId || typeof restaurantId !== 'string') {
    notFound();
  }

  const { error, data } = await getRestaurantDetailsById(restaurantId);

  if (error || !data) {
    notFound();
  }

  return (
    <main>
      <RestaurantHeader restaurant={data} />
      {/* We'll add more components for the menu items in the next steps */}
    </main>
  )
}