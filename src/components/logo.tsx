type LogoProps = {
    w: string,
}

export default function Logo(){
    return(
        <img src={'/logoRed-700.png'} alt="Logo Restaurox" className={`w-full mx-auto`} />
    )
}