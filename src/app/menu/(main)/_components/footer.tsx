import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'
import { darkenColor } from '../../functions'

interface FooterProps{
    colorThemeCode: string;
}

export default function Footer({colorThemeCode}: FooterProps) {

  return (
    <footer
    style={{ backgroundColor: darkenColor(colorThemeCode, 40) }}
    className="text-gray-100 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* CTA Section */}
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-base font-bold tracking-tight text-white">
              Pronto para impulsionar o seu comércio?
            </h2>
            <p className="text-sm">
              Junte-se aos estabelecimentos que já estão conquistando seus clientes com cardápios digitais.
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md border-boder text-white hover:brightness-90 transition duration-150 ease-in-out"
              style={{ backgroundColor: darkenColor(colorThemeCode, 70) }}
            >
              Crie agora seu cardápio digital grátis
              <ArrowRight className="ml-2 -mr-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-end space-y-2">
            <Image
              src="/logoWhite.png"
              alt="Restaurox Logo"
              width={150}
              height={50}
              className="h-8 w-auto"
            />
            <p className="text-xs opacity-75">
              Powered by
            </p>
            <Image
              src="/logoBranco.png"
              alt="Pitanga Studio Logo"
              width={100}
              height={33}
              className="h-6 w-auto"
            />
          </div>
        </div>

        {/* Footer Links and Copyright */}
        <div className="mt-8 border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <nav className="-mx-4 -my-2 flex flex-wrap justify-center">
            <div className="px-4 py-1">
              <Link href="#" className="text-sm hover:text-white transition duration-150 ease-in-out">
                Sobre
              </Link>
            </div>
            <div className="px-4 py-1">
              <Link href="#" className="text-sm hover:text-white transition duration-150 ease-in-out">
                Blog
              </Link>
            </div>
            <div className="px-4 py-1">
              <Link href="#" className="text-sm hover:text-white transition duration-150 ease-in-out">
                Contato
              </Link>
            </div>
            <div className="px-4 py-1">
              <Link href="#" className="text-sm hover:text-white transition duration-150 ease-in-out">
                Termos de Uso
              </Link>
            </div>
          </nav>
          <p className="mt-4 sm:mt-0 text-xs">
            &copy; {new Date().getFullYear()} Pitanga Studio. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}