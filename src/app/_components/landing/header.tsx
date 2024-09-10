import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <Image src="/logoRed-700.png" alt="Logo Restaurox" width={150} height={40} />
        </Link>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><Link href="#recursos" className="text-gray-600 hover:text-red-700 transition-colors">Recursos</Link></li>
            <li><Link href="#como-funciona" className="text-gray-600 hover:text-red-700 transition-colors">Como Funciona</Link></li>
            <li><Link href="#precos" className="text-gray-600 hover:text-red-700 transition-colors">Preços</Link></li>
            <li><Link href="#contato" className="text-gray-600 hover:text-red-700 transition-colors">Contato</Link></li>
          </ul>
        </nav>
        <Link href="/app" className="hidden md:inline-block bg-red-700 text-white px-6 py-2 rounded-full hover:bg-red-800 transition-colors">
          Começar Grátis
        </Link>
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4">
          <nav className="container mx-auto px-4">
            <ul className="space-y-4">
              <li><Link href="#recursos" className="block text-gray-600 hover:text-red-700 transition-colors">Recursos</Link></li>
              <li><Link href="#como-funciona" className="block text-gray-600 hover:text-red-700 transition-colors">Como Funciona</Link></li>
              <li><Link href="#precos" className="block text-gray-600 hover:text-red-700 transition-colors">Preços</Link></li>
              <li><Link href="#contato" className="block text-gray-600 hover:text-red-700 transition-colors">Contato</Link></li>
              <li>
                <Link href="/app" className="block bg-red-700 text-white px-6 py-2 rounded-full hover:bg-red-800 transition-colors text-center">
                  Começar Grátis
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}