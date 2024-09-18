import { getRestaurantDetailsById } from '../actions';
import { notFound } from 'next/navigation';
import RestaurantHeader from './_components/restaurant-header';
import MenuListing from './_components/menu-listing';
import Footer from './_components/footer';

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
    <main className='bg-white'>
      <RestaurantHeader restaurant={data} />
      <MenuListing restaurant={data} />
      <Footer colorThemeCode={data.colorThemeCode}/>
    </main>
  )
}