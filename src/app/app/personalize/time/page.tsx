import { getOpeningHoursByIdUser } from "../(main)/actions";
import EditOperatingHours from "../_components/edit-operating-hours";
import { auth } from '@/services/auth' // Importa o serviço de autenticação

export default async function Page(){

    const session = await auth() // Obtém a sessão de autenticação
    const { error, data } = await getOpeningHoursByIdUser(session?.user.id as string);

    return(
        <EditOperatingHours userId={session?.user.id as string} data={data!}/>
    )
}