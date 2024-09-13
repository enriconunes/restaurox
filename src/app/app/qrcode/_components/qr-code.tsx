'use client'

import React, { useState, useRef } from "react"
import { QRCode } from 'react-qrcode-logo'
import Link from "next/link"
import html2canvas from "html2canvas"
import { Download, Utensils, Pizza, Coffee, IceCream, Cake, Copy, Check, Crown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface QRCodeParams {
  idRestaurant: string
  restaurantName: string
  planName: string | null | undefined
}

const qrCodeStyles = [
  { name: 'Classic', icon: Utensils, qrOptions: { qrStyle: 'squares' as const, eyeRadius: 0 } },
  { name: 'Rounded', icon: Coffee, qrOptions: { qrStyle: 'dots' as const, eyeRadius: 10 } },
  { name: 'Fancy', icon: Cake, qrOptions: { qrStyle: 'squares' as const, eyeRadius: 20 } },
  { name: 'Modern', icon: Pizza, qrOptions: { qrStyle: 'dots' as const, eyeRadius: 0 } },
  { name: 'Cute', icon: IceCream, qrOptions: { qrStyle: 'squares' as const, eyeRadius: 30 } },
]

const callToActions = [
  "Acesse o nosso cardápio digital",
  "Explore nosso menu",
  "Conheça as nossas opções",
  "Faça aqui o seu pedido"
]

export default function QRCodeComponent({ idRestaurant, restaurantName, planName }: QRCodeParams) {
  const [selectedStyle, setSelectedStyle] = useState(qrCodeStyles[0])
  const [qrColor, setQrColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#FFFFFF")
  const [selectedCta, setSelectedCta] = useState(callToActions[0])
  const [customCta, setCustomCta] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const [showProDialog, setShowProDialog] = useState(false)
  const qrCodeRef = useRef<HTMLDivElement>(null)
  const qrCodeLink = `https://restaurox/menu?id=${idRestaurant}`

  const isFreePlan = planName === 'free'
  const isStandardConfig = selectedStyle.name === 'Classic' && qrColor === "#000000" && bgColor === "#FFFFFF" && selectedCta === "Acesse o nosso cardápio digital"

  const downloadCode = () => {
    if (isFreePlan && !isStandardConfig) {
      setShowProDialog(true)
      return
    }

    if (qrCodeRef.current) {
      html2canvas(qrCodeRef.current, {
        scale: 4,
        useCORS: true,
        backgroundColor: bgColor,
      }).then(function(canvas) {
        const link = document.createElement('a')
        link.download = `${restaurantName} - QRCode ${selectedStyle.name}.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
      })
    }
  }

  const resetToStandardConfig = () => {
    setSelectedStyle(qrCodeStyles[0])
    setQrColor("#000000")
    setBgColor("#FFFFFF")
    setSelectedCta("Acesse o nosso cardápio digital")
    setCustomCta("")
  }

  const downloadStandardCode = () => {
    resetToStandardConfig()
    setShowProDialog(false)
    
    // We need to wait for the state to update before capturing the QR code
    setTimeout(() => {
      if (qrCodeRef.current) {
        html2canvas(qrCodeRef.current, {
          scale: 4,
          useCORS: true,
          backgroundColor: "#FFFFFF",
        }).then(function(canvas) {
          const link = document.createElement('a')
          link.download = `${restaurantName} - QRCode Standard.png`
          link.href = canvas.toDataURL("image/png")
          link.click()
        })
      }
    }, 0)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrCodeLink).then(() => {
      setIsCopied(true)
      toast({
        title: "Link copiado!",
        description: "O link do QR Code foi copiado para a área de transferência.",
      })
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-background text-foreground">
        <CardHeader>
          <CardTitle className="text-center text-md sm:text-lg md:text-xl">Crie e compartilhe seu QR Code personalizado</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <Tabs defaultValue={qrCodeStyles[0].name} className="w-full">
            <Label className="text-sm pb-2">Estilo</Label>
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 gap-2 h-fit">
              {qrCodeStyles.map((style) => (
                <TabsTrigger
                  key={style.name}
                  value={style.name}
                  onClick={() => setSelectedStyle(style)}
                  className="flex flex-col items-center px-2 py-1 text-xs sm:text-sm"
                >
                  <style.icon className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                  {style.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div>
              <Label htmlFor="qr-color" className="text-sm">Cor do QR Code</Label>
              <Input
                id="qr-color"
                type="color"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                className="h-10 w-full"
              />
            </div>
            <div>
              <Label htmlFor="bg-color" className="text-sm">Cor de fundo</Label>
              <Input
                id="bg-color"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 w-full"
              />
            </div>
          </div>

          <div className="w-full">
            <Label htmlFor="cta-select" className="text-sm">Escolha uma chamada</Label>
            <Select onValueChange={(value) => setSelectedCta(value)}>
              <SelectTrigger id="cta-select" className="w-full">
                <SelectValue placeholder="Selecione uma chamada" />
              </SelectTrigger>
              <SelectContent>
                {callToActions.map((cta, index) => (
                  <SelectItem key={index} value={cta}>{cta}</SelectItem>
                ))}
                <SelectItem value="custom">Personalizada</SelectItem>
              </SelectContent>
            </Select>
            {selectedCta === "custom" && (
              <Input
                placeholder="Digite sua chamada personalizada"
                value={customCta}
                onChange={(e) => setCustomCta(e.target.value)}
                className="mt-2 w-full"
              />
            )}
          </div>
          
          <div
            ref={qrCodeRef}
            style={{ backgroundColor: bgColor }}
            className="p-4 sm:p-6 rounded-lg border border-border transition-all duration-300 ease-in-out w-full max-w-xs sm:max-w-sm mx-auto"
          >
            <h3 className="font-medium text-base sm:text-lg mb-4 text-center" style={{ color: qrColor }}>
              {restaurantName}
            </h3>
            <div className="flex justify-center">
              <QRCode
                value={qrCodeLink}
                size={200}
                qrStyle={selectedStyle.qrOptions.qrStyle}
                eyeRadius={selectedStyle.qrOptions.eyeRadius}
                fgColor={qrColor}
                bgColor={bgColor}
                id="qrcode"
              />
            </div>
            <p className="text-center text-xs sm:text-sm mt-4" style={{ color: qrColor }}>
              {selectedCta === "custom" ? customCta : selectedCta}
            </p>
          </div>

          <div className="w-full max-w-xs sm:max-w-sm mx-auto space-y-2">
            <div className="flex items-center space-x-2">
              <Input
                value={qrCodeLink}
                readOnly
                className="flex-grow"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                className="flex-shrink-0"
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full bg-red-700 hover:bg-red-800 text-white"
              onClick={downloadCode}
            >
              <Download className="mr-2 h-4 w-4" /> Fazer download
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showProDialog} onOpenChange={setShowProDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Crown className="w-5 h-5 mr-2 text-yellow-500" />
              Funcionalidade PRO
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            A personalização só está disponível para o plano PRO.
          </DialogDescription>
            <Button
              variant="outline"
              onClick={downloadStandardCode}
              className="w-full"
            >
              Fazer download do QR Code padrão
            </Button>
            <Button asChild className="w-full">
              <Link href="/app/settings/billing">
                Conheça o plano PRO
              </Link>
            </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}