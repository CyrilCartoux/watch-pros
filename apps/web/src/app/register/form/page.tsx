"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Building2, MapPin, CreditCard, FileText, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

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

// Constantes pour la validation des fichiers
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

// Fonction de validation des fichiers
const validateFile = (file: File) => {
  if (!file) return "Le fichier est requis";
  
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Format de fichier non accepté. Formats acceptés : JPG, PNG, PDF";
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return "Le fichier est trop volumineux. Taille maximale : 5MB";
  }
  
  return null;
};

// Schéma de validation pour le compte professionnel
const accountSchema = z.object({
  companyName: z.string().min(1, "Le nom de la société est requis"),
  watchProsName: z.string().min(1, "Le nom sur Watch Pros est requis"),
  companyStatus: z.string().min(1, "Le statut de l'entreprise est requis"),
  country: z.string().min(1, "Le pays est requis"),
  title: z.string().min(1, "La civilité est requise"),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phonePrefix: z.string().min(1, "L'indicatif téléphonique est requis"),
  phone: z.string()
    .min(1, "Le téléphone est requis")
    .regex(/^\d+$/, "Le numéro de téléphone doit contenir uniquement des chiffres")
    .min(9, "Le numéro de téléphone doit contenir au moins 9 chiffres")
    .max(15, "Le numéro de téléphone ne doit pas dépasser 15 chiffres"),
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Le mot de passe doit contenir au moins un caractère spécial"),
  confirmPassword: z.string().min(1, "La confirmation du mot de passe est requise"),
  language: z.string().min(1, "La langue est requise"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

// Schéma de validation pour l'adresse
const addressSchema = z.object({
  street: z.string().min(1, "La rue est requise"),
  addressComplement: z.string().optional(),
  postalCode: z.string().min(1, "Le code postal est requis"),
  city: z.string().min(1, "La ville est requise"),
  country: z.string().min(1, "Le pays est requis"),
  faxPrefix: z.string().optional(),
  fax: z.string().optional(),
  mobilePrefix: z.string().min(1, "L'indicatif mobile est requis"),
  mobile: z.string().min(1, "Le mobile est requis"),
  website: z.string().url("URL invalide").optional().or(z.literal("")),
  siren: z.string().min(1, "Le numéro SIREN/SIRET est requis"),
  taxId: z.string().min(1, "Le numéro d'identification fiscale est requis"),
  vatNumber: z.string().min(1, "Le numéro de TVA est requis"),
  oss: z.boolean().optional(),
})

// Schéma de validation pour les coordonnées bancaires
const bankingSchema = z.object({
  paymentMethod: z.enum(["card", "sepa"]),
  cardHolder: z.string().optional(),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvc: z.string().optional(),
  authorization: z.boolean().optional(),
  accountHolder: z.string().optional(),
  sepaStreet: z.string().optional(),
  sepaPostalCode: z.string().optional(),
  sepaCity: z.string().optional(),
  sepaCountry: z.string().optional(),
  bankName: z.string().optional(),
  iban: z.string().optional(),
  bic: z.string().optional(),
}).refine((data) => {
  if (data.paymentMethod === "card") {
    return data.cardHolder && data.cardNumber && data.expiryDate && data.cvc && data.authorization
  }
  return true
}, {
  message: "Veuillez remplir tous les champs obligatoires",
})

// Schéma de validation pour Trusted Checkout
const trustedSchema = z.object({
  accountHolder: z.string().min(1, "Le titulaire du compte est requis"),
  iban: z.string().min(1, "L'IBAN est requis"),
  legalFirstName: z.string().min(1, "Le prénom est requis"),
  legalLastName: z.string().min(1, "Le nom est requis"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  nationality: z.string().min(1, "La nationalité est requise"),
  residenceCountry: z.string().min(1, "Le pays de résidence est requis"),
  returnName: z.string().min(1, "Le nom est requis"),
  returnStreet: z.string().min(1, "La rue est requise"),
  returnComplement: z.string().optional(),
  returnPostalCode: z.string().min(1, "Le code postal est requis"),
  returnCity: z.string().min(1, "La ville est requise"),
  returnCountry: z.string().min(1, "Le pays est requis"),
})

// Schéma de validation pour les documents
const documentsSchema = z.object({
  idCardFront: z.custom<File>((file) => {
    if (!file) return false;
    return validateFile(file as File) === null;
  }, "Le recto de la pièce d'identité est requis"),
  idCardBack: z.custom<File>((file) => {
    if (!file) return false;
    return validateFile(file as File) === null;
  }, "Le verso de la pièce d'identité est requis"),
  proofOfAddress: z.custom<File>((file) => {
    if (!file) return false;
    return validateFile(file as File) === null;
  }, "Le justificatif de domicile est requis"),
})

// Ajouter un composant pour afficher les erreurs
const FormError = ({ error, isSubmitted }: { error?: string, isSubmitted: boolean }) => {
  if (!error || !isSubmitted) return null
  return <p className="text-sm text-red-500 mt-1">{error}</p>
}

export default function RegisterFormPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [currentTab, setCurrentTab] = useState("account")
  const [isFormValid, setIsFormValid] = useState({
    account: false,
    address: false,
    banking: false,
    trusted: false,
    documents: false,
  })
  const [isSubmitted, setIsSubmitted] = useState({
    account: false,
    address: false,
    banking: false,
    trusted: false,
    documents: false,
  })

  const accountForm = useForm({
    resolver: zodResolver(accountSchema),
    mode: "onSubmit",
  })

  const addressForm = useForm({
    resolver: zodResolver(addressSchema),
    mode: "onSubmit",
  })

  const bankingForm = useForm({
    resolver: zodResolver(bankingSchema),
    mode: "onSubmit",
  })

  const trustedForm = useForm({
    resolver: zodResolver(trustedSchema),
    mode: "onSubmit",
  })

  const documentsForm = useForm({
    resolver: zodResolver(documentsSchema),
    mode: "onSubmit",
  })

  // Fonction pour vérifier si un onglet est accessible
  const isTabAccessible = (tab: string) => {
    return true;
    // switch (tab) {
    //   case "account":
    //     return true
    //   case "address":
    //     return isFormValid.account
    //   case "banking":
    //     return isFormValid.account && isFormValid.address
    //   case "trusted":
    //     return isFormValid.account && isFormValid.address && isFormValid.banking
    //   case "documents":
    //     return isFormValid.account && isFormValid.address && isFormValid.banking && isFormValid.trusted
    //   case "summary":
    //     return isFormValid.account && isFormValid.address && isFormValid.banking && isFormValid.trusted
    //   default:
    //     return false
    // }
  }

  // Mettre à jour la validation des formulaires
  useEffect(() => {
    const validateForms = async () => {
      const accountValid = await accountForm.trigger()
      const addressValid = await addressForm.trigger()
      const bankingValid = await bankingForm.trigger()
      const trustedValid = await trustedForm.trigger()
      const documentsValid = await documentsForm.trigger()

      setIsFormValid({
        account: accountValid,
        address: addressValid,
        banking: bankingValid,
        trusted: trustedValid,
        documents: documentsValid,
      })
    }

    validateForms()
  }, [accountForm, addressForm, bankingForm, trustedForm, documentsForm])

  const handleSubmit = async () => {
    try {
      // Vérifier que tous les formulaires sont valides
      const isAccountValid = await accountForm.trigger()
      const isAddressValid = await addressForm.trigger()
      const isBankingValid = await bankingForm.trigger()
      const isTrustedValid = await trustedForm.trigger()
      const isDocumentsValid = await documentsForm.trigger()

      if (!isAccountValid || !isAddressValid || !isBankingValid || !isTrustedValid || !isDocumentsValid) {
        console.error("Certains formulaires ne sont pas valides")
        return
      }

      // Récupérer toutes les valeurs
      const formData = {
        account: accountForm.getValues(),
        address: addressForm.getValues(),
        banking: bankingForm.getValues(),
        trusted: trustedForm.getValues(),
        documents: documentsForm.getValues(),
      }

      // Ici, vous pouvez envoyer les données à votre API
      console.log("Données du formulaire :", formData)

      // Exemple d'envoi à une API
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // })

      // if (!response.ok) {
      //   throw new Error('Erreur lors de l\'envoi du formulaire')
      // }

      // Redirection après succès
      // window.location.href = '/register/success'
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error)
    }
  }

  const handleNext = async () => {
    let isValid = false

    switch (currentTab) {
      case "account":
        setIsSubmitted(prev => ({ ...prev, account: true }))
        isValid = await accountForm.trigger()
        if (!isValid) {
          console.log("Erreurs du formulaire compte:", accountForm.formState.errors)
        }
        if (isValid) {
          console.log("Account form values:", accountForm.getValues())
          setCurrentTab("address")
        }
        break
      case "address":
        setIsSubmitted(prev => ({ ...prev, address: true }))
        isValid = await addressForm.trigger()
        if (!isValid) {
          console.log("Erreurs du formulaire adresse:", addressForm.formState.errors)
        }
        if (isValid) {
          console.log("Address form values:", addressForm.getValues())
          setCurrentTab("banking")
        }
        break
      case "banking":
        setIsSubmitted(prev => ({ ...prev, banking: true }))
        isValid = await bankingForm.trigger()
        if (!isValid) {
          console.log("Erreurs du formulaire bancaire:", bankingForm.formState.errors)
        }
        if (isValid) {
          console.log("Banking form values:", bankingForm.getValues())
          setCurrentTab("trusted")
        }
        break
      case "trusted":
        setIsSubmitted(prev => ({ ...prev, trusted: true }))
        isValid = await trustedForm.trigger()
        if (!isValid) {
          console.log("Erreurs du formulaire trusted:", trustedForm.formState.errors)
        }
        if (isValid) {
          console.log("Trusted form values:", trustedForm.getValues())
          setCurrentTab("documents")
        }
        break
      case "documents":
        setIsSubmitted(prev => ({ ...prev, documents: true }))
        isValid = await documentsForm.trigger()
        if (!isValid) {
          console.log("Erreurs du formulaire documents:", documentsForm.formState.errors)
        }
        if (isValid) {
          console.log("Documents form values:", documentsForm.getValues())
          setCurrentTab("summary")
        }
        break
      case "summary":
        setCurrentTab("documents")
        break
      default:
        break
    }
  }

  const handleBack = () => {
    switch (currentTab) {
      case "address":
        setCurrentTab("account")
        break
      case "banking":
        setCurrentTab("address")
        break
      case "trusted":
        setCurrentTab("banking")
        break
      case "documents":
        setCurrentTab("trusted")
        break
      case "summary":
        setCurrentTab("documents")
        break
      default:
        break
    }
  }

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

        <Tabs 
          value={currentTab} 
          onValueChange={(value) => {
            if (isTabAccessible(value)) {
              setCurrentTab(value)
            }
          }} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger 
              value="account" 
              className="flex items-center gap-2"
              disabled={!isTabAccessible("account")}
            >
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Compte</span>
            </TabsTrigger>
            <TabsTrigger 
              value="address" 
              className="flex items-center gap-2"
              disabled={!isTabAccessible("address")}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Adresse</span>
            </TabsTrigger>
            <TabsTrigger 
              value="banking" 
              className="flex items-center gap-2"
              disabled={!isTabAccessible("banking")}
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Bancaire</span>
            </TabsTrigger>
            <TabsTrigger 
              value="trusted" 
              className="flex items-center gap-2"
              disabled={!isTabAccessible("trusted")}
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Trusted</span>
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className="flex items-center gap-2"
              disabled={!isTabAccessible("documents")}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger 
              value="summary" 
              className="flex items-center gap-2"
              disabled={!isTabAccessible("summary")}
            >
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

                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleNext()
                }} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Nom de la société *</Label>
                      <Input id="companyName" placeholder="Entrez le nom de votre société" {...accountForm.register("companyName")} />
                      <FormError error={accountForm.formState.errors.companyName?.message} isSubmitted={isSubmitted.account} />
                    </div>

                    <div>
                      <Label htmlFor="watchProsName">Nom sur Watch Pros *</Label>
                      <Input id="watchProsName" placeholder="Entrez le nom qui apparaîtra sur Watch Pros" {...accountForm.register("watchProsName")} />
                      <FormError error={accountForm.formState.errors.watchProsName?.message} isSubmitted={isSubmitted.account} />
                    </div>

                    <div>
                      <Label htmlFor="companyStatus">Statut de l'entreprise *</Label>
                      <Input id="companyStatus" placeholder="Entrez le statut de votre entreprise" {...accountForm.register("companyStatus")} />
                      <FormError error={accountForm.formState.errors.companyStatus?.message} isSubmitted={isSubmitted.account} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">Pays *</Label>
                        <Controller
                          name="country"
                          control={accountForm.control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
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
                          )}
                        />
                        <FormError error={accountForm.formState.errors?.country?.message} isSubmitted={isSubmitted.account} />
                      </div>

                      <div>
                        <Label htmlFor="title">Civilité *</Label>
                        <Controller
                          name="title"
                          control={accountForm.control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
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
                          )}
                        />
                        <FormError error={accountForm.formState.errors.title?.message} isSubmitted={isSubmitted.account} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input id="firstName" placeholder="Prénom pour l'adresse de facturation" {...accountForm.register("firstName")} />
                        <FormError error={accountForm.formState.errors.firstName?.message} isSubmitted={isSubmitted.account} />
                      </div>

                      <div>
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input id="lastName" placeholder="Nom pour l'adresse de facturation" {...accountForm.register("lastName")} />
                        <FormError error={accountForm.formState.errors.lastName?.message} isSubmitted={isSubmitted.account} />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Adresse e-mail *</Label>
                      <Input id="email" type="email" placeholder="votre@email.com" {...accountForm.register("email")} />
                      <FormError error={accountForm.formState.errors.email?.message} isSubmitted={isSubmitted.account} />
                    </div>

                    <div>
                      <Label htmlFor="phone">Téléphone *</Label>
                      <div className="flex gap-2">
                        <Controller
                          name="phonePrefix"
                          control={accountForm.control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
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
                          )}
                        />
                        <FormError error={accountForm.formState.errors.phonePrefix?.message} isSubmitted={isSubmitted.account} />
                        <Controller
                          name="phone"
                          control={accountForm.control}
                          defaultValue=""
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="phone"
                              placeholder="Numéro de téléphone"
                              className="flex-1"
                              value={field.value || ""}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                field.onChange(value);
                              }}
                            />
                          )}
                        />
                        <FormError error={accountForm.formState.errors.phone?.message} isSubmitted={isSubmitted.account} />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="username">Nom d'utilisateur *</Label>
                      <Input id="username" placeholder="Choisissez un nom d'utilisateur" {...accountForm.register("username")} />
                      <FormError error={accountForm.formState.errors.username?.message} isSubmitted={isSubmitted.account} />
                    </div>

                    <div>
                      <Label htmlFor="password">Mot de passe *</Label>
                      <Input id="password" type="password" placeholder="Créez un mot de passe" {...accountForm.register("password")} />
                      <FormError error={accountForm.formState.errors.password?.message} isSubmitted={isSubmitted.account} />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Répéter le mot de passe *</Label>
                      <Input id="confirmPassword" type="password" placeholder="Confirmez votre mot de passe" {...accountForm.register("confirmPassword")} />
                      <FormError error={accountForm.formState.errors.confirmPassword?.message} isSubmitted={isSubmitted.account} />
                    </div>

                    <div>
                      <Label htmlFor="language">Votre langue de préférence *</Label>
                      <Controller
                        name="language"
                        control={accountForm.control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
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
                        )}
                      />
                      <FormError error={accountForm.formState.errors.language?.message} isSubmitted={isSubmitted.account} />
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

                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleNext()
                }} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="street">Rue *</Label>
                      <Input id="street" placeholder="Entrez votre adresse" {...addressForm.register("street")} />
                      <FormError error={addressForm.formState.errors.street?.message} isSubmitted={isSubmitted.address} />
                    </div>

                    <div>
                      <Label htmlFor="addressComplement">Complément d'adresse</Label>
                      <Input id="addressComplement" placeholder="Appartement, suite, unité, etc." {...addressForm.register("addressComplement")} />
                      <FormError error={addressForm.formState.errors.addressComplement?.message} isSubmitted={isSubmitted.address} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="postalCode">Code postal *</Label>
                        <Input id="postalCode" placeholder="Code postal" {...addressForm.register("postalCode")} />
                        <FormError error={addressForm.formState.errors.postalCode?.message} isSubmitted={isSubmitted.address} />
                      </div>

                      <div>
                        <Label htmlFor="city">Ville *</Label>
                        <Input id="city" placeholder="Ville" {...addressForm.register("city")} />
                        <FormError error={addressForm.formState.errors.city?.message} isSubmitted={isSubmitted.address} />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="country">Pays *</Label>
                      <Controller
                        name="country"
                        control={addressForm.control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
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
                        )}
                      />
                      <FormError error={addressForm.formState.errors.country?.message} isSubmitted={isSubmitted.address} />
                    </div>

                    <div>
                      <Label htmlFor="fax">Fax</Label>
                      <div className="flex gap-2">
                        <Controller
                          name="faxPrefix"
                          control={addressForm.control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
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
                          )}
                        />
                        <Input id="fax" placeholder="Numéro de fax" className="flex-1" {...addressForm.register("fax")} />
                      </div>
                      <FormError error={addressForm.formState.errors.fax?.message} isSubmitted={isSubmitted.address} />
                      <FormError error={addressForm.formState.errors.faxPrefix?.message} isSubmitted={isSubmitted.address} />
                    </div>

                    <div>
                      <Label htmlFor="mobile">Mobile *</Label>
                      <div className="flex gap-2">
                        <Controller
                          name="mobilePrefix"
                          control={addressForm.control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
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
                          )}
                        />
                        <Input id="mobile" placeholder="Numéro de mobile" className="flex-1" {...addressForm.register("mobile")} />
                      </div>
                      <FormError error={addressForm.formState.errors.mobile?.message} isSubmitted={isSubmitted.address} />
                      <FormError error={addressForm.formState.errors.mobilePrefix?.message} isSubmitted={isSubmitted.address} />
                    </div>

                    <div>
                      <Label htmlFor="website">Site Internet</Label>
                      <Input id="website" type="url" placeholder="https://www.votre-site.com" {...addressForm.register("website")} />
                      <FormError error={addressForm.formState.errors.website?.message} isSubmitted={isSubmitted.address} />
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Numéros d'identification</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="siren">Numéro SIREN ou SIRET *</Label>
                          <Input id="siren" placeholder="Entrez votre numéro SIREN ou SIRET" {...addressForm.register("siren")} />
                          <FormError error={addressForm.formState.errors.siren?.message} isSubmitted={isSubmitted.address} />
                        </div>

                        <div>
                          <Label htmlFor="taxId">Numéro d'identification fiscale *</Label>
                          <Input id="taxId" placeholder="Entrez votre numéro d'identification fiscale" {...addressForm.register("taxId")} />
                          <FormError error={addressForm.formState.errors.taxId?.message} isSubmitted={isSubmitted.address} />
                          <p className="text-sm text-muted-foreground mt-1">
                            Indiquez le numéro d'identification fiscale correspondant à l'emplacement de votre entreprise : France
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="vatNumber">Numéro de TVA *</Label>
                          <Input id="vatNumber" placeholder="Entrez votre numéro de TVA" {...addressForm.register("vatNumber")} />
                          <FormError error={addressForm.formState.errors.vatNumber?.message} isSubmitted={isSubmitted.address} />
                          <p className="text-sm text-muted-foreground mt-1">
                            Indiquez le numéro de TVA correspondant à l'emplacement de votre entreprise : France
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="oss"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            {...addressForm.register("oss")}
                          />
                          <Label htmlFor="oss" className="text-sm">
                            Je suis inscrit(e) au guichet unique (OSS)
                          </Label>
                        </div>
                        <FormError error={addressForm.formState.errors.oss?.message} isSubmitted={isSubmitted.address} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6">
                    <p className="text-sm text-muted-foreground">* Champ obligatoire</p>
                    <div className="space-x-4">
                      <Button type="button" variant="outline" size="lg" onClick={handleBack}>
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

                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleNext()
                }} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="paymentMethod">Moyen de paiement *</Label>
                      <Controller
                        name="paymentMethod"
                        control={bankingForm.control}
                        defaultValue="card"
                        render={({ field }) => (
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              setPaymentMethod(value);
                            }}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un moyen de paiement" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="card">Carte bancaire</SelectItem>
                              <SelectItem value="sepa">Prélèvement SEPA</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <FormError error={bankingForm.formState.errors.paymentMethod?.message} isSubmitted={isSubmitted.banking} />
                    </div>

                    {/* Formulaire Carte Bancaire */}
                    <div className="space-y-4" id="cardForm">
                      <div>
                        <Label htmlFor="cardHolder">Titulaire de la carte *</Label>
                        <Input id="cardHolder" placeholder="Nom tel qu'il apparaît sur la carte" {...bankingForm.register("cardHolder")} />
                        <FormError error={bankingForm.formState.errors.cardHolder?.message} isSubmitted={isSubmitted.banking} />
                      </div>

                      <Controller
                        name="cardNumber"
                        control={bankingForm.control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, "");
                              let formatted = "";
                              for (let i = 0; i < value.length; i++) {
                                if (i > 0 && i % 4 === 0) {
                                  formatted += " ";
                                }
                                formatted += value[i];
                              }
                              field.onChange(formatted);
                            }}
                          />
                        )}
                      />
                      <FormError error={bankingForm.formState.errors.cardNumber?.message} isSubmitted={isSubmitted.banking} />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Date de validité *</Label>
                          <Controller
                            name="expiryDate"
                            control={bankingForm.control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="expiryDate"
                                placeholder="MM/AA"
                                maxLength={5}
                                onChange={(e) => {
                                  let value = e.target.value.replace(/\D/g, "");
                                  if (value.length >= 2) {
                                    value = value.slice(0, 2) + "/" + value.slice(2);
                                  }
                                  field.onChange(value);
                                }}
                              />
                            )}
                          />
                          <FormError error={bankingForm.formState.errors.expiryDate?.message} isSubmitted={isSubmitted.banking} />
                        </div>

                        <div>
                          <Label htmlFor="cvc">Code de vérification (CVC) *</Label>
                          <Input 
                            id="cvc" 
                            placeholder="123"
                            maxLength={3}
                            type="password"
                            {...bankingForm.register("cvc")}
                          />
                          <FormError error={bankingForm.formState.errors.cvc?.message} isSubmitted={isSubmitted.banking} />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-6">
                        <input
                          type="checkbox"
                          id="authorization"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          {...bankingForm.register("authorization")}
                          required
                        />
                        <Label htmlFor="authorization" className="text-sm">
                          Par la présente, j'autorise Watch pros GmbH, jusqu'à révocation, à débiter de ma carte bancaire les montants indiqués.
                        </Label>
                      </div>
                      <FormError error={bankingForm.formState.errors.authorization?.message} isSubmitted={isSubmitted.banking} />
                    </div>

                    {/* Formulaire SEPA */}
                    <div className="space-y-4 hidden" id="sepaForm">
                      <div>
                        <Label htmlFor="accountHolder">Titulaire du compte (si différent de l'entreprise)</Label>
                        <Input id="accountHolder" placeholder="Nom du titulaire du compte" {...bankingForm.register("accountHolder")} />
                        <FormError error={bankingForm.formState.errors.accountHolder?.message} isSubmitted={isSubmitted.banking} />
                      </div>

                      <div>
                        <Label htmlFor="sepaStreet">Rue *</Label>
                        <Input id="sepaStreet" placeholder="Adresse de la banque" {...bankingForm.register("sepaStreet")} />
                        <FormError error={bankingForm.formState.errors.sepaStreet?.message} isSubmitted={isSubmitted.banking} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="sepaPostalCode">Code postal *</Label>
                          <Input id="sepaPostalCode" placeholder="Code postal" {...bankingForm.register("sepaPostalCode")} />
                          <FormError error={bankingForm.formState.errors.sepaPostalCode?.message} isSubmitted={isSubmitted.banking} />
                        </div>

                        <div>
                          <Label htmlFor="sepaCity">Ville *</Label>
                          <Input id="sepaCity" placeholder="Ville" {...bankingForm.register("sepaCity")} />
                          <FormError error={bankingForm.formState.errors.sepaCity?.message} isSubmitted={isSubmitted.banking} />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="sepaCountry">Pays *</Label>
                        <Controller
                          name="sepaCountry"
                          control={bankingForm.control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
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
                          )}
                        />
                        <FormError error={bankingForm.formState.errors.sepaCountry?.message} isSubmitted={isSubmitted.banking} />
                      </div>

                      <div>
                        <Label htmlFor="bankName">Banque *</Label>
                        <Input id="bankName" placeholder="Nom de votre banque" {...bankingForm.register("bankName")} />
                        <FormError error={bankingForm.formState.errors.bankName?.message} isSubmitted={isSubmitted.banking} />
                      </div>

                      <div>
                        <Label htmlFor="iban">IBAN *</Label>
                        <Controller
                          name="iban"
                          control={bankingForm.control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="iban"
                              placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                              maxLength={34}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\s/g, "").toUpperCase();
                                let formatted = "";
                                for (let i = 0; i < value.length; i++) {
                                  if (i > 0 && i % 4 === 0) {
                                    formatted += " ";
                                  }
                                  formatted += value[i];
                                }
                                field.onChange(formatted);
                              }}
                            />
                          )}
                        />
                        <FormError error={bankingForm.formState.errors.iban?.message} isSubmitted={isSubmitted.banking} />
                      </div>

                      <div>
                        <Label htmlFor="bic">BIC *</Label>
                        <Controller
                          name="bic"
                          control={bankingForm.control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="bic"
                              placeholder="BNPAFRPP"
                              maxLength={11}
                              onChange={(e) => {
                                let value = e.target.value.toUpperCase();
                                field.onChange(value);
                              }}
                            />
                          )}
                        />
                        <FormError error={bankingForm.formState.errors.bic?.message} isSubmitted={isSubmitted.banking} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6">
                    <p className="text-sm text-muted-foreground">* Champ obligatoire</p>
                    <div className="space-x-4">
                      <Button type="button" variant="outline" size="lg" onClick={handleBack}>
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

                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleNext()
                }} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="trustedAccountHolder">Titulaire du compte *</Label>
                      <Input id="trustedAccountHolder" placeholder="Nom du titulaire du compte" {...trustedForm.register("accountHolder")} />
                      <FormError error={trustedForm.formState.errors.accountHolder?.message} isSubmitted={isSubmitted.trusted} />
                    </div>

                    <div>
                      <Label htmlFor="trustedIban">IBAN *</Label>
                      <Controller
                        name="iban"
                        control={trustedForm.control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="trustedIban"
                            placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                            maxLength={34}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\s/g, "").toUpperCase();
                              let formatted = "";
                              for (let i = 0; i < value.length; i++) {
                                if (i > 0 && i % 4 === 0) {
                                  formatted += " ";
                                }
                                formatted += value[i];
                              }
                              field.onChange(formatted);
                            }}
                          />
                        )}
                      />
                      <FormError error={trustedForm.formState.errors.iban?.message} isSubmitted={isSubmitted.trusted} />
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="text-lg font-semibold mb-4">Représentant légal de l'entreprise</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="legalFirstName">Prénom *</Label>
                          <Input id="legalFirstName" placeholder="Prénom" {...trustedForm.register("legalFirstName")} />
                          <FormError error={trustedForm.formState.errors.legalFirstName?.message} isSubmitted={isSubmitted.trusted} />
                        </div>

                        <div>
                          <Label htmlFor="legalLastName">Nom *</Label>
                          <Input id="legalLastName" placeholder="Nom" {...trustedForm.register("legalLastName")} />
                          <FormError error={trustedForm.formState.errors.legalLastName?.message} isSubmitted={isSubmitted.trusted} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label htmlFor="birthDate">Date de naissance *</Label>
                          <Input 
                            id="birthDate" 
                            type="date"
                            className="w-full"
                            {...trustedForm.register("birthDate")}
                          />
                          <FormError error={trustedForm.formState.errors.birthDate?.message} isSubmitted={isSubmitted.trusted} />
                        </div>

                        <div>
                          <Label htmlFor="nationality">Nationalité *</Label>
                          <Controller
                            name="nationality"
                            control={trustedForm.control}
                            defaultValue=""
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value}>
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
                            )}
                          />
                          <FormError error={trustedForm.formState.errors.nationality?.message} isSubmitted={isSubmitted.trusted} />
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="residenceCountry">Pays de résidence *</Label>
                        <Controller
                          name="residenceCountry"
                          control={trustedForm.control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
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
                          )}
                        />
                        <FormError error={trustedForm.formState.errors.residenceCountry?.message} isSubmitted={isSubmitted.trusted} />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="text-lg font-semibold mb-4">Adresse de retour (si différente de l'adresse principale)</h4>
                      
                      <div>
                        <Label htmlFor="returnName">Nom *</Label>
                        <Input id="returnName" placeholder="Nom" {...trustedForm.register("returnName")} />
                        <FormError error={trustedForm.formState.errors.returnName?.message} isSubmitted={isSubmitted.trusted} />
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="returnStreet">Rue *</Label>
                        <Input id="returnStreet" placeholder="Adresse" {...trustedForm.register("returnStreet")} />
                        <FormError error={trustedForm.formState.errors.returnStreet?.message} isSubmitted={isSubmitted.trusted} />
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="returnComplement">Complément d'adresse</Label>
                        <Input id="returnComplement" placeholder="Appartement, suite, unité, etc." {...trustedForm.register("returnComplement")} />
                        <FormError error={trustedForm.formState.errors.returnComplement?.message} isSubmitted={isSubmitted.trusted} />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label htmlFor="returnPostalCode">Code postal *</Label>
                          <Input id="returnPostalCode" placeholder="Code postal" {...trustedForm.register("returnPostalCode")} />
                          <FormError error={trustedForm.formState.errors.returnPostalCode?.message} isSubmitted={isSubmitted.trusted} />
                        </div>

                        <div>
                          <Label htmlFor="returnCity">Ville *</Label>
                          <Input id="returnCity" placeholder="Ville" {...trustedForm.register("returnCity")} />
                          <FormError error={trustedForm.formState.errors.returnCity?.message} isSubmitted={isSubmitted.trusted} />
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="returnCountry">Pays *</Label>
                        <Controller
                          name="returnCountry"
                          control={trustedForm.control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
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
                          )}
                        />
                        <FormError error={trustedForm.formState.errors.returnCountry?.message} isSubmitted={isSubmitted.trusted} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6">
                    <p className="text-sm text-muted-foreground">* Champ obligatoire</p>
                    <div className="space-x-4">
                      <Button type="button" variant="outline" size="lg" onClick={handleBack}>
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
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Documents requis</h2>
                  <p className="text-muted-foreground">
                    Pour finaliser votre inscription, nous avons besoin de quelques documents officiels. Ces documents sont nécessaires pour vérifier votre identité et votre adresse.
                  </p>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleNext()
                }} className="space-y-6">
                  <div className="space-y-6">
                    {/* Pièce d'identité */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Pièce d'identité</h3>
                      <p className="text-sm text-muted-foreground">
                        Veuillez fournir une copie de votre pièce d'identité (carte nationale d'identité, passeport ou permis de conduire).
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="idCardFront">Recto *</Label>
                          <Input
                            id="idCardFront"
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const error = validateFile(file)
                                if (error) {
                                  documentsForm.setError("idCardFront", { message: error })
                                } else {
                                  documentsForm.setValue("idCardFront", file)
                                  documentsForm.clearErrors("idCardFront")
                                }
                              }
                            }}
                            className="cursor-pointer"
                          />
                          <FormError error={documentsForm.formState.errors.idCardFront?.message} isSubmitted={isSubmitted.documents} />
                          <p className="text-xs text-muted-foreground mt-1">
                            Formats acceptés : JPG, PNG, PDF (max 5MB)
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="idCardBack">Verso *</Label>
                          <Input
                            id="idCardBack"
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const error = validateFile(file)
                                if (error) {
                                  documentsForm.setError("idCardBack", { message: error })
                                } else {
                                  documentsForm.setValue("idCardBack", file)
                                  documentsForm.clearErrors("idCardBack")
                                }
                              }
                            }}
                            className="cursor-pointer"
                          />
                          <FormError error={documentsForm.formState.errors.idCardBack?.message} isSubmitted={isSubmitted.documents} />
                          <p className="text-xs text-muted-foreground mt-1">
                            Formats acceptés : JPG, PNG, PDF (max 5MB)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Justificatif de domicile */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Justificatif de domicile</h3>
                      <p className="text-sm text-muted-foreground">
                        Veuillez fournir un justificatif de domicile datant de moins de 3 mois (facture d'électricité, de téléphone, quittance de loyer, etc.).
                      </p>

                      <div>
                        <Label htmlFor="proofOfAddress">Document *</Label>
                        <Input
                          id="proofOfAddress"
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const error = validateFile(file)
                              if (error) {
                                documentsForm.setError("proofOfAddress", { message: error })
                              } else {
                                documentsForm.setValue("proofOfAddress", file)
                                documentsForm.clearErrors("proofOfAddress")
                              }
                            }
                          }}
                          className="cursor-pointer"
                        />
                        <FormError error={documentsForm.formState.errors.proofOfAddress?.message} isSubmitted={isSubmitted.documents} />
                        <p className="text-xs text-muted-foreground mt-1">
                          Formats acceptés : JPG, PNG, PDF (max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6">
                    <p className="text-sm text-muted-foreground">* Champ obligatoire</p>
                    <div className="space-x-4">
                      <Button type="button" variant="outline" size="lg" onClick={handleBack}>
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
                    Vos documents seront traités de manière confidentielle et sécurisée. Ils ne seront utilisés que pour vérifier votre identité et votre adresse.
                  </p>
                </div>
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

                  {/* Source d'information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Comment avez-vous entendu parler de Watch Pros ?</h3>
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
                      <Button 
                        type="button" 
                        size="lg"
                        onClick={handleSubmit}
                      >
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

      {/* Ajouter un bouton de debug pour voir toutes les erreurs */}
      <div className="fixed bottom-4 right-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("État des formulaires :", {
              account: {
                isValid: accountForm.formState.isValid,
                errors: accountForm.formState.errors,
                values: accountForm.getValues()
              },
              address: {
                isValid: addressForm.formState.isValid,
                errors: addressForm.formState.errors,
                values: addressForm.getValues()
              },
              banking: {
                isValid: bankingForm.formState.isValid,
                errors: bankingForm.formState.errors,
                values: bankingForm.getValues()
              },
              trusted: {
                isValid: trustedForm.formState.isValid,
                errors: trustedForm.formState.errors,
                values: trustedForm.getValues()
              },
              documents: {
                isValid: documentsForm.formState.isValid,
                errors: documentsForm.formState.errors,
                values: documentsForm.getValues()
              }
            })
          }}
        >
          Debug Form
        </Button>
      </div>
    </main>
  )
} 