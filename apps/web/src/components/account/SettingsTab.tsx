"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function SettingsTab() {
  const [profile, setProfile] = useState({
    firstName: "JOHN",
    lastName: "DOE",
    customerNumber: "007 665 950",
    billingAddress: {
      street: "1700 CHEMIN MOCK",
      city: "PARIS",
      postalCode: "75019"
    },
    email: "cyrilcartoux13@gmail.com",
    password: "****************",
    personalInfo: {
      gender: "",
      birthDate: "",
      phone: "+33612457114",
      profession: "",
      language: "",
      about: ""
    }
  })

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBillingAddressChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: value
      }
    }))
  }

  const handlePersonalInfoChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Profil */}
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Informations de votre compte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input
                value={profile.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input
                value={profile.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Numéro client</Label>
            <Input
              value={profile.customerNumber}
              disabled
              className="bg-muted"
            />
          </div>
        </CardContent>
      </Card>

      {/* Adresse de facturation */}
      <Card>
        <CardHeader>
          <CardTitle>Adresse de facturation</CardTitle>
          <CardDescription>Votre adresse principale</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Rue</Label>
            <Input
              value={profile.billingAddress.street}
              onChange={(e) => handleBillingAddressChange("street", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Code postal</Label>
              <Input
                value={profile.billingAddress.postalCode}
                onChange={(e) => handleBillingAddressChange("postalCode", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Ville</Label>
              <Input
                value={profile.billingAddress.city}
                onChange={(e) => handleBillingAddressChange("city", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Identifiant */}
      <Card>
        <CardHeader>
          <CardTitle>Identifiant</CardTitle>
          <CardDescription>Informations de connexion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Adresse e-mail</Label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Mot de passe</Label>
            <Input
              type="password"
              value={profile.password}
              disabled
              className="bg-muted"
            />
            <Button variant="outline" className="mt-2">
              Modifier le mot de passe
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Données personnelles */}
      <Card>
        <CardHeader>
          <CardTitle>Données personnelles</CardTitle>
          <CardDescription>Informations complémentaires</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Sexe</Label>
              <Select
                value={profile.personalInfo.gender}
                onValueChange={(value) => handlePersonalInfoChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Homme</SelectItem>
                  <SelectItem value="female">Femme</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date de naissance</Label>
              <Input
                type="date"
                value={profile.personalInfo.birthDate}
                onChange={(e) => handlePersonalInfoChange("birthDate", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Téléphone</Label>
            <Input
              type="tel"
              value={profile.personalInfo.phone}
              onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Profession</Label>
            <Input
              value={profile.personalInfo.profession}
              onChange={(e) => handlePersonalInfoChange("profession", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Langue</Label>
            <Select
              value={profile.personalInfo.language}
              onValueChange={(value) => handlePersonalInfoChange("language", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>À propos de moi</Label>
            <Textarea
              value={profile.personalInfo.about}
              onChange={(e) => handlePersonalInfoChange("about", e.target.value)}
              placeholder="Parlez-nous de vous..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Enregistrer les modifications</Button>
      </div>
    </div>
  )
} 