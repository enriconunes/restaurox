'use client'

import React from "react"
import { QRCode } from 'react-qrcode-logo'
import Link from "next/link"
import html2canvas from "html2canvas"
import { Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QRCodeParams {
  idUser: string
  restaurantName: string
}

export default function QRCodeComponent({ idUser, restaurantName }: QRCodeParams) {
  const downloadCode = () => {
    const container = document.getElementById("qrcode-container")
    if (container) {
      html2canvas(container).then(function(canvas) {
        const link = document.createElement('a')
        link.download = `${restaurantName} - QRCode.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
      })
    }
  }

  const baseURL = "https://cardapioplus-frontend-nextjs.vercel.app/"

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <Card className="bg-background text-foreground">
        <CardHeader>
          <CardTitle className="text-center">Seu QR Code</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div
            id="qrcode-container"
            className="bg-white p-6 rounded-lg border border-border"
          >
            <h3 className="font-medium text-lg mb-4 text-center text-gray-900">Seja bem-vindo(a)!</h3>
            <Link href={`${baseURL}/cardapio?id=${idUser}`} target="_blank">     
              <QRCode
                value={`${baseURL}/cardapio?id=${idUser}`}
                size={200}
                qrStyle="squares"
                eyeRadius={0}
                id="qrcode"
              />
            </Link>
            <p className="text-center text-sm mt-2 text-gray-900">Acesse o nosso cardápio digital</p>
          </div>
          <Button
            variant="outline"
            className="mt-4 bg-red-700 hover:bg-red-800 text-white"
            onClick={downloadCode}
          >
            <Download className="mr-2 h-4 w-4" /> Fazer download
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}