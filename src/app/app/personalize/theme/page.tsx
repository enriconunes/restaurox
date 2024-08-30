import { getRestaurantColorThemeByIdUser } from "../(main)/actions";
import TailwindColorSelectorForm from "../_components/tailwind-color-mosaic";

import { auth } from '@/services/auth' // Importa o serviço de autenticação

export default async function Page(){

    const session = await auth() // Obtém a sessão de autenticação
    const { error, data } = await getRestaurantColorThemeByIdUser(session?.user.id as string); //contem apenas uma string do tipo '#b91c1c', por ex.

    console.log(data)

    return(
        <TailwindColorSelectorForm data={data}/>
    )
}