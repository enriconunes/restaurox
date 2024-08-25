'use client'

import React, { useState } from 'react'

const tailwindColors = [
  { name: 'gray', shades: { 400: '#9ca3af', 700: '#374151', 950: '#030712' }},
  { name: 'red', shades: { 400: '#f87171', 700: '#b91c1c', 950: '#450a0a' }},
  { name: 'orange', shades: { 400: '#fb923c', 700: '#c2410c', 950: '#431407' }},
  { name: 'yellow', shades: { 400: '#facc15', 700: '#a16207', 950: '#422006' }},
  { name: 'green', shades: { 400: '#4ade80', 700: '#15803d', 950: '#052e16' }},
  { name: 'cyan', shades: { 400: '#22d3ee', 700: '#0e7490', 950: '#083344' }},
  { name: 'blue', shades: { 400: '#60a5fa', 700: '#1d4ed8', 950: '#172554' }},
  { name: 'purple', shades: { 400: '#a78bfa', 700: '#7e22ce', 950: '#3b0764' }},
  { name: 'pink', shades: { 400: '#f472b6', 700: '#be185d', 950: '#500724' }},
]

export default function TailwindColorMosaic() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  return (
    <div className="p-4 bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Tailwind CSS Color Mosaic</h2>
      <div className="space-y-2">
        {tailwindColors.map((colorFamily) => (
          <div key={colorFamily.name} className="grid grid-cols-3 gap-x-2">
            {Object.entries(colorFamily.shades).map(([shade, hex]) => (
              <button
                key={`${colorFamily.name}-${shade}`}
                className={`w-full h-12 rounded-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 ${
                  selectedColor === hex ? 'ring-2 ring-offset-2 ring-opacity-50 scale-105' : ''
                }`}
                style={{ backgroundColor: hex }}
                onClick={() => setSelectedColor(hex)}
                aria-label={`Select color ${hex}`}
              >
                <span className="sr-only">Select color {hex}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
      {selectedColor && (
        <p className="mt-4 text-lg text-gray-800 dark:text-white">
          Cor selecionada: <span className="font-bold">{selectedColor}</span>
        </p>
      )}
    </div>
  )
}