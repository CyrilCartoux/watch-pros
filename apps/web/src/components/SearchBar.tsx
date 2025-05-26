'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import React from "react"

const brands = [
  "Rolex",
  "Patek Philippe",
  "Audemars Piguet",
  "Omega",
  "Cartier",
  "Jaeger-LeCoultre",
  "Vacheron Constantin",
  "IWC",
  "Panerai",
  "Tudor"
]

const models = {
  "Rolex": ["Submariner", "Daytona", "GMT-Master II", "Datejust", "Day-Date"],
  "Patek Philippe": ["Nautilus", "Aquanaut", "Calatrava", "Grand Complications"],
  "Audemars Piguet": ["Royal Oak", "Royal Oak Offshore", "Code 11.59"],
  "Omega": ["Speedmaster", "Seamaster", "Constellation", "De Ville"],
  "Cartier": ["Tank", "Santos", "Ballon Bleu", "Drive"],
  "Jaeger-LeCoultre": ["Reverso", "Master Control", "Polaris", "Rendez-Vous"],
  "Vacheron Constantin": ["Overseas", "Patrimony", "Traditionnelle", "Fiftysix"],
  "IWC": ["Portugieser", "Pilot's Watch", "Portofino", "Aquatimer"],
  "Panerai": ["Luminor", "Radiomir", "Submersible", "Luminor Due"],
  "Tudor": ["Black Bay", "Pelagos", "Ranger", "1926"]
}

export function SearchBar() {
  const [selectedBrand, setSelectedBrand] = React.useState<string>("")
  const [availableModels, setAvailableModels] = React.useState<string[]>([])

  React.useEffect(() => {
    if (selectedBrand) {
      setAvailableModels(models[selectedBrand as keyof typeof models] || [])
    } else {
      setAvailableModels([])
    }
  }, [selectedBrand])

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-4 p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-xl shadow-lg border border-border">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search watches..."
            className="w-full bg-background/50"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select onValueChange={setSelectedBrand}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Select disabled={!selectedBrand}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  )
} 