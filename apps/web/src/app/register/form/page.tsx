"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Building2, MapPin, CreditCard, FileText, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"

const countries = [
  { value: "fr", label: "France" },
  { value: "be", label: "Belgique" },
  { value: "ch", label: "Suisse" },
  { value: "lu", label: "Luxembourg" },
  { value: "de", label: "Allemagne" },
]

const titles = [
  { value: "mr", label: "M." },
  { value: "mrs", label: "Mme" },
  { value: "ms", label: "Mlle" },
]

const languages = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
]

const phonePrefixes = [
  { value: "+33", label: "France (+33)" },
  { value: "+32", label: "Belgique (+32)" },
  { value: "+41", label: "Suisse (+41)" },
  { value: "+352", label: "Luxembourg (+352)" },
  { value: "+49", label: "Allemagne (+49)" },
]

export default function RegisterFormPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")

  useEffect(() => {
    const cardForm = document.getElementById("cardForm")
    const sepaForm = document.getElementById("sepaForm")
    const sepaNote = document.getElementById("sepaNote")

    if (cardForm && sepaForm && sepaNote) {
      // Hide all forms first
      cardForm.classList.add("hidden")
      sepaForm.classList.add("hidden")
      sepaNote.classList.add("hidden")

      // Show the selected form
      if (paymentMethod === "card") {
        cardForm.classList.remove("hidden")
      } else if (paymentMethod === "sepa") {
        sepaForm.classList.remove("hidden")
        sepaNote.classList.remove("hidden")
      }
    }
  }, [paymentMethod])

  return (
    <main className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Inscription professionnelle
          </h1>
          <p className="text-muted-foreground text-lg">
            Créez votre compte professionnel en quelques étapes simples
          </p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Compte</span>
            </TabsTrigger>
            <TabsTrigger value="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Adresse</span>
            </TabsTrigger>
            <TabsTrigger value="banking" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Bancaire</span>
            </TabsTrigger>
            <TabsTrigger value="trusted" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Trusted</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Récapitulatif</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardContent className="p-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Ouvrez votre compte professionnel</h2>
                  <p className="text-muted-foreground">
                    Nous nécessitons tout d'abord quelques informations essentielles sur votre entreprise. Vous pourrez ensuite enregistrer vos identifiants d'accès pour votre compte professionnel Watch Pros.
                  </p>
                </div>

                <form className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Nom de la société *</Label>
                      <Input id="companyName" placeholder="Entrez le nom de votre société" />
                    </div>

                    <div>
                      <Label htmlFor="watchProsName">Nom sur Watch Pros *</Label>
                      <Input id="watchProsName" placeholder="Entrez le nom qui apparaîtra sur Watch Pros" />
                    </div>

                    <div>
                      <Label htmlFor="companyStatus">Statut de l'entreprise *</Label>
                      <Input id="companyStatus" placeholder="Entrez le statut de votre entreprise" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">Pays *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un pays" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.value} value={country.value}>
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="title">Civilité *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez" />
                          </SelectTrigger>
                          <SelectContent>
                            {titles.map((title) => (
                              <SelectItem key={title.value} value={title.value}>
                                {title.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input id="firstName" placeholder="Prénom pour l'adresse de facturation" />
                      </div>

                      <div>
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input id="lastName" placeholder="Nom pour l'adresse de facturation" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Adresse e-mail *</Label>
                      <Input id="email" type="email" placeholder="votre@email.com" />
                    </div>

                    <div>
                      <Label htmlFor="phone">Téléphone *</Label>
                      <div className="flex gap-2">
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Indicatif" />
                          </SelectTrigger>
                          <SelectContent>
                            {phonePrefixes.map((prefix) => (
                              <SelectItem key={prefix.value} value={prefix.value}>
                                {prefix.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input id="phone" placeholder="Numéro de téléphone" className="flex-1" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="username">Nom d'utilisateur *</Label>
                      <Input id="username" placeholder="Choisissez un nom d'utilisateur" />
                    </div>

                    <div>
                      <Label htmlFor="password">Mot de passe *</Label>
                      <Input id="password" type="password" placeholder="Créez un mot de passe" />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Répéter le mot de passe *</Label>
                      <Input id="confirmPassword" type="password" placeholder="Confirmez votre mot de passe" />
                    </div>

                    <div>
                      <Label htmlFor="language">Votre langue de préférence *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre langue" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language.value} value={language.value}>
                              {language.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6">
                    <p className="text-sm text-muted-foreground">* Champ obligatoire</p>
                    <Button type="submit" size="lg">
                      Continuer
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address">
            <Card>
              <CardContent className="p-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Autres informations sur l'entreprise</h2>
                  <p className="text-muted-foreground">
                    Indiquez maintenant l'adresse (du siège social) de votre entreprise telle qu'elle doit figurer sur les factures. Nous avons également besoin de votre numéro d'immatriculation au registre du commerce et de vos numéros d'identification fiscale.
                  </p>
                </div>

                <form className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="street">Rue *</Label>
                      <Input id="street" placeholder="Entrez votre adresse" />
                    </div>

                    <div>
                      <Label htmlFor="addressComplement">Complément d'adresse</Label>
                      <Input id="addressComplement" placeholder="Appartement, suite, unité, etc." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="postalCode">Code postal *</Label>
                        <Input id="postalCode" placeholder="Code postal" />
                      </div>

                      <div>
                        <Label htmlFor="city">Ville *</Label>
                        <Input id="city" placeholder="Ville" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="country">Pays *</Label>
                      <Select defaultValue="fr">
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="fax">Fax</Label>
                      <div className="flex gap-2">
                        <Select defaultValue="+33">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Indicatif" />
                          </SelectTrigger>
                          <SelectContent>
                            {phonePrefixes.map((prefix) => (
                              <SelectItem key={prefix.value} value={prefix.value}>
                                {prefix.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input id="fax" placeholder="Numéro de fax" className="flex-1" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="mobile">Mobile *</Label>
                      <div className="flex gap-2">
                        <Select defaultValue="+33">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Indicatif" />
                          </SelectTrigger>
                          <SelectContent>
                            {phonePrefixes.map((prefix) => (
                              <SelectItem key={prefix.value} value={prefix.value}>
                                {prefix.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input id="mobile" placeholder="Numéro de mobile" className="flex-1" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="website">Site Internet</Label>
                      <Input id="website" type="url" placeholder="https://www.votre-site.com" />
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Numéros d'identification</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="siren">Numéro SIREN ou SIRET *</Label>
                          <Input id="siren" placeholder="Entrez votre numéro SIREN ou SIRET" />
                        </div>

                        <div>
                          <Label htmlFor="taxId">Numéro d'identification fiscale *</Label>
                          <Input id="taxId" placeholder="Entrez votre numéro d'identification fiscale" />
                          <p className="text-sm text-muted-foreground mt-1">
                            Indiquez le numéro d'identification fiscale correspondant à l'emplacement de votre entreprise : France
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="vatNumber">Numéro de TVA *</Label>
                          <Input id="vatNumber" placeholder="Entrez votre numéro de TVA" />
                          <p className="text-sm text-muted-foreground mt-1">
                            Indiquez le numéro de TVA correspondant à l'emplacement de votre entreprise : France
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="oss"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="oss" className="text-sm">
                            Je suis inscrit(e) au guichet unique (OSS)
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6">
                    <p className="text-sm text-muted-foreground">* Champ obligatoire</p>
                    <div className="space-x-4">
                      <Button variant="outline" size="lg">
                        Retour
                      </Button>
                      <Button type="submit" size="lg">
                        Continuer
                      </Button>
                    </div>
                  </div>
                </form>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Remarque : Vos coordonnées seront affichées à côté de vos annonces et sur votre page d'accueil professionnelle.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banking">
            <Card>
              <CardContent className="p-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Veuillez saisir vos coordonnées bancaires</h2>
                  <p className="text-muted-foreground">
                    Vos données sont sécurisées grâce au dispositif PCI DSS (Payment Card Industry Data Security Standard) mis en place par Saferpay. Pour des raisons de sécurité, la somme de 1 euro sera bloquée mais pas débitée de votre compte bancaire. Ce processus sert à vérifier l'authenticité des données renseignées.
                  </p>
                </div>

                <form className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="paymentMethod">Moyen de paiement *</Label>
                      <Select 
                        defaultValue="card"
                        onValueChange={(value) => setPaymentMethod(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un moyen de paiement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">Carte bancaire</SelectItem>
                          <SelectItem value="sepa">Prélèvement SEPA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Formulaire Carte Bancaire */}
                    <div className="space-y-4" id="cardForm">
                      <div>
                        <Label htmlFor="cardHolder">Titulaire de la carte *</Label>
                        <Input id="cardHolder" placeholder="Nom tel qu'il apparaît sur la carte" />
                      </div>

                      <div>
                        <Label htmlFor="cardNumber">Numéro de la carte *</Label>
                        <Input 
                          id="cardNumber" 
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\s/g, '');
                            const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
                            e.target.value = formatted;
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Date de validité *</Label>
                          <Input 
                            id="expiryDate" 
                            placeholder="MM/AA"
                            maxLength={5}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) {
                                e.target.value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
                              }
                            }}
                          />
                        </div>

                        <div>
                          <Label htmlFor="cvc">Code de vérification (CVC) *</Label>
                          <Input 
                            id="cvc" 
                            placeholder="123"
                            maxLength={3}
                            type="password"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-6">
                        <input
                          type="checkbox"
                          id="authorization"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          required
                        />
                        <Label htmlFor="authorization" className="text-sm">
                          Par la présente, j'autorise Chrono24 GmbH, jusqu'à révocation, à débiter de ma carte bancaire les montants indiqués.
                        </Label>
                      </div>
                    </div>

                    {/* Formulaire SEPA */}
                    <div className="space-y-4 hidden" id="sepaForm">
                      <div>
                        <Label htmlFor="accountHolder">Titulaire du compte (si différent de l'entreprise)</Label>
                        <Input id="accountHolder" placeholder="Nom du titulaire du compte" />
                      </div>

                      <div>
                        <Label htmlFor="sepaStreet">Rue *</Label>
                        <Input id="sepaStreet" placeholder="Adresse de la banque" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="sepaPostalCode">Code postal *</Label>
                          <Input id="sepaPostalCode" placeholder="Code postal" />
                        </div>

                        <div>
                          <Label htmlFor="sepaCity">Ville *</Label>
                          <Input id="sepaCity" placeholder="Ville" />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="sepaCountry">Pays *</Label>
                        <Select defaultValue="fr">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un pays" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.value} value={country.value}>
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="bankName">Banque *</Label>
                        <Input id="bankName" placeholder="Nom de votre banque" />
                      </div>

                      <div>
                        <Label htmlFor="iban">IBAN *</Label>
                        <Input 
                          id="iban" 
                          placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                          onChange={(e) => {
                            const value = e.target.value.replace(/\s/g, '').toUpperCase();
                            const formatted = value.replace(/(.{4})/g, '$1 ').trim();
                            e.target.value = formatted;
                          }}
                        />
                      </div>

                      <div>
                        <Label htmlFor="bic">BIC *</Label>
                        <Input 
                          id="bic" 
                          placeholder="XXXXXXXXXXX"
                          onChange={(e) => {
                            e.target.value = e.target.value.toUpperCase();
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6">
                    <p className="text-sm text-muted-foreground">* Champ obligatoire</p>
                    <div className="space-x-4">
                      <Button variant="outline" size="lg">
                        Retour
                      </Button>
                      <Button type="submit" size="lg">
                        Continuer
                      </Button>
                    </div>
                  </div>
                </form>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-center">
                    <img 
                      src="/images/saferpay-logo.png" 
                      alt="Powered by Saferpay" 
                      className="h-8"
                    />
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground text-center">
                      Pour des raisons de sécurité, vous allez être redirigé(e) vers le site de votre banque.
                    </p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg hidden" id="sepaNote">
                    <p className="text-sm text-muted-foreground">
                      Remarque importante : Pour être validé, le prélèvement SEPA requiert votre signature. Merci de bien vouloir imprimer le mandat SEPA qui apparaîtra à la prochaine étape et nous le renvoyer par fax / courrier ou nous le transmettre via la rubrique "Charger des documents".
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trusted">
            <Card>
              <CardContent className="p-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Coordonnées bancaires pour Trusted Checkout</h2>
                  <p className="text-muted-foreground">
                    Trusted Checkout est le moyen le plus sûr de régler ses achats sur Watch pros. Grâce à Trusted Checkout, vous gagnez la confiance de vos acheteurs potentiels et augmentez ainsi vos chances de vendre.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Nous avons besoin de vos coordonnées bancaires pour vous verser l'argent une fois l'achat conclu.
                  </p>
                </div>

                <form className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="trustedAccountHolder">Titulaire du compte *</Label>
                      <Input id="trustedAccountHolder" placeholder="Nom du titulaire du compte" />
                    </div>

                    <div>
                      <Label htmlFor="trustedIban">IBAN *</Label>
                      <Input 
                        id="trustedIban" 
                        placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, '').toUpperCase();
                          const formatted = value.replace(/(.{4})/g, '$1 ').trim();
                          e.target.value = formatted;
                        }}
                      />
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="text-lg font-semibold mb-4">Représentant légal de l'entreprise</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="legalFirstName">Prénom *</Label>
                          <Input id="legalFirstName" placeholder="Prénom" />
                        </div>

                        <div>
                          <Label htmlFor="legalLastName">Nom *</Label>
                          <Input id="legalLastName" placeholder="Nom" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label htmlFor="birthDate">Date de naissance *</Label>
                          <Input 
                            id="birthDate" 
                            type="date"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <Label htmlFor="nationality">Nationalité *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country.value} value={country.value}>
                                  {country.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="residenceCountry">Pays de résidence *</Label>
                        <Select defaultValue="fr">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.value} value={country.value}>
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="text-lg font-semibold mb-4">Adresse de retour (si différente de l'adresse principale)</h4>
                      
                      <div>
                        <Label htmlFor="returnName">Nom *</Label>
                        <Input id="returnName" placeholder="Nom" />
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="returnStreet">Rue *</Label>
                        <Input id="returnStreet" placeholder="Adresse" />
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="returnComplement">Complément d'adresse</Label>
                        <Input id="returnComplement" placeholder="Appartement, suite, unité, etc." />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label htmlFor="returnPostalCode">Code postal *</Label>
                          <Input id="returnPostalCode" placeholder="Code postal" />
                        </div>

                        <div>
                          <Label htmlFor="returnCity">Ville *</Label>
                          <Input id="returnCity" placeholder="Ville" />
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="returnCountry">Pays *</Label>
                        <Select defaultValue="fr">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.value} value={country.value}>
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6">
                    <p className="text-sm text-muted-foreground">* Champ obligatoire</p>
                    <div className="space-x-4">
                      <Button variant="outline" size="lg">
                        Retour
                      </Button>
                      <Button type="submit" size="lg">
                        Continuer
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Formulaire de documents à venir...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary">
            <Card>
              <CardContent className="p-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Récapitulatif</h2>
                </div>

                <div className="space-y-8">
                  {/* Compte professionnel */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Compte professionnel</h3>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Entreprise</p>
                        <p className="font-medium">TEST TEST</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">E-mail</p>
                        <p className="font-medium">totoeeee@gmail.com</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Téléphone</p>
                        <p className="font-medium">+33612457115</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nom d'utilisateur</p>
                        <p className="font-medium">test6ss</p>
                      </div>
                    </div>
                  </div>

                  {/* Forfait Professional */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Votre forfait Professional</h3>
                    <p className="text-sm text-muted-foreground">
                      Pendant la période d'essai de 30 jours, vous ne payez pas de tarif de base pour votre forfait Professional. Vous pouvez publier autant d'annonces que vous le souhaitez. Seules les ventes, que vous effectuez, sont sujettes à une commission de vente. Après la période d'essai, nous vous attribuerons automatiquement le forfait Professional le plus avantageux pour vous en fonction du nombre d'annonces de montres que vous avez publiées.
                    </p>
                  </div>

                  {/* Données entreprise */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Données concernant votre entreprise</h3>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Adresse</p>
                        <p className="font-medium">TOTOTOOTOT</p>
                        <p className="font-medium">13430 TREST</p>
                        <p className="font-medium">France</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fax</p>
                        <p className="font-medium">--</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mobile</p>
                        <p className="font-medium">+33643343423</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Site Internet</p>
                        <p className="font-medium">--</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Statut de l'entreprise</p>
                        <p className="font-medium">Personne physique / Entrepreneur individuel</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Vos numéros d'identification fiscale dans l'UE</p>
                        <p className="font-medium">***********020</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Numéro de TVA intra-communautaire</p>
                        <p className="font-medium">FR76847724408</p>
                      </div>
                    </div>
                  </div>

                  {/* Adresse de retour */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Adresse de retour</h3>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Adresse</p>
                      <p className="font-medium">TEST</p>
                      <p className="font-medium">TOTOTOOTOT</p>
                      <p className="font-medium">13430 TREST</p>
                      <p className="font-medium">France</p>
                    </div>
                  </div>

                  {/* Coordonnées bancaires */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Vos coordonnées bancaires</h3>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Moyen de paiement</p>
                        <p className="font-medium">Autre moyen de paiement</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Nous vous contacterons dans les plus brefs délais pour convenir avec vous du moyen de paiement.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Remarque */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Vous ne payez pas de forfait pendant les 30 premiers jours. Seules les ventes abouties sont sujettes à une commission de vente. Nous vous avertirons par e-mail 2 semaines avant la fin de la période d'essai et avant l'envoi de la première facture. Bien entendu, vous pouvez résilier à tout moment avant la fin du mois.
                    </p>
                  </div>

                  {/* Coordonnées bancaires Trusted */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Vos coordonnées bancaires</h3>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Titulaire du compte</p>
                        <p className="font-medium">ZEDZED</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">IBAN</p>
                        <p className="font-medium">************************597</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Le paiement est en</p>
                        <p className="font-medium">EUR</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Statut de l'entreprise</p>
                        <p className="font-medium">Personne physique / Entrepreneur individuel</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Représentant légal de l'entreprise</p>
                        <p className="font-medium">TEST TEST</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date de naissance</p>
                        <p className="font-medium">02. janvier 1950</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nationalité</p>
                        <p className="font-medium">France</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pays de résidence</p>
                        <p className="font-medium">France</p>
                      </div>
                    </div>
                  </div>

                  {/* Importation des données */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Vous avez une boutique en ligne ? Nous transférons vos annonces !</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Importer automatiquement vos annonces vous permet de gagner un temps précieux en réduisant le nombre de manipulations.
                    </p>
                    <Button variant="link" className="p-0 h-auto">
                      En savoir plus sur l'importation des données
                    </Button>
                  </div>

                  {/* Source d'information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Comment avez-vous entendu parler de Chrono24 ?</h3>
                    <p className="text-sm text-muted-foreground">
                      Veuillez choisir une des options suivantes (participation facultative) :
                    </p>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="search">Recherche sur Internet</SelectItem>
                        <SelectItem value="friend">Ami / Connaissance</SelectItem>
                        <SelectItem value="social">Réseaux sociaux</SelectItem>
                        <SelectItem value="press">Presse</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-between items-center pt-6">
                    <p className="text-sm text-muted-foreground">* Champ obligatoire</p>
                    <div className="space-x-4">
                      <Button variant="outline" size="lg">
                        Retour
                      </Button>
                      <Button type="submit" size="lg">
                        Terminer l'inscription
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
} 