import Link from 'next/link'
import Image from 'next/image'

type LogoProps = {
    w?: string,
}

export default function Logo({ w = 'full' }: LogoProps) {
    return (
        <Link href="/app" className={`inline-block w-${w}`}>
            <Image 
                src="/logoRed-700.png" 
                alt="Logo Restaurox" 
                width={200} 
                height={50} 
                className="w-full h-auto"
            />
        </Link>
    )
}