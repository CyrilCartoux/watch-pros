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
import { countries, titles, phonePrefixes } from "@/data/form-options"

// Constants for file validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

// File validation function
const validateFile = (file: File) => {
  if (!file) return "File is required";
  
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "File format not accepted. Accepted formats: JPG, PNG, PDF";
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return "File is too large. Maximum size: 5MB";
  }
  
  return null;
};

// Validation schema for professional account
const accountSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  watchProsName: z.string().min(1, "Watch Pros name is required"),
  companyStatus: z.string().min(1, "Company status is required"),
  country: z.string().min(1, "Country is required"),
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phonePrefix: z.string().min(1, "Phone prefix is required"),
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(9, "Phone number must contain at least 9 digits")
    .max(15, "Phone number must not exceed 15 digits"),
})

// Validation schema for address
const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  addressComplement: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  mobilePrefix: z.string().min(1, "Mobile prefix is required"),
  mobile: z.string().min(1, "Mobile number is required"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  siren: z.string().min(1, "SIREN/SIRET number is required"),
  taxId: z.string().min(1, "Tax ID number is required"),
  vatNumber: z.string().min(1, "VAT number is required"),
  oss: z.boolean().optional(),
})

// Validation schema for banking details
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
  message: "Please fill in all required fields",
})

// Validation schema for documents
const documentsSchema = z.object({
  idCardFront: z.custom<File>((file) => {
    if (!file) return false;
    return validateFile(file as File) === null;
  }, "Front of ID card is required"),
  idCardBack: z.custom<File>((file) => {
    if (!file) return false;
    return validateFile(file as File) === null;
  }, "Back of ID card is required"),
  proofOfAddress: z.custom<File>((file) => {
    if (!file) return false;
    return validateFile(file as File) === null;
  }, "Proof of address is required"),
})

// Add component to display errors
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
    documents: false,
  })
  const [isSubmitted, setIsSubmitted] = useState({
    account: false,
    address: false,
    banking: false,
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

  const documentsForm = useForm({
    resolver: zodResolver(documentsSchema),
    mode: "onSubmit",
  })

  // Function to check if a tab is accessible
  const isTabAccessible = (tab: string) => {
    return true;
    // switch (tab) {
    //   case "account":
    //     return true
    //   case "address":
    //     return isFormValid.account
    //   case "banking":
    //     return isFormValid.account && isFormValid.address
    //   case "documents":
    //     return isFormValid.account && isFormValid.address && isFormValid.banking
    //   case "summary":
    //     return isFormValid.account && isFormValid.address && isFormValid.banking
    //   default:
    //     return false
    // }
  }

  // Update form validation
  useEffect(() => {
    const validateForms = async () => {
      const accountValid = await accountForm.trigger()
      const addressValid = await addressForm.trigger()
      const bankingValid = await bankingForm.trigger()
      const documentsValid = await documentsForm.trigger()

      setIsFormValid({
        account: accountValid,
        address: addressValid,
        banking: bankingValid,
        documents: documentsValid,
      })
    }

    validateForms()
  }, [accountForm, addressForm, bankingForm, documentsForm])

  const handleSubmit = async () => {
    try {
      // Check that all forms are valid
      const isAccountValid = await accountForm.trigger()
      const isAddressValid = await addressForm.trigger()
      const isBankingValid = await bankingForm.trigger()
      const isDocumentsValid = await documentsForm.trigger()

      if (!isAccountValid || !isAddressValid || !isBankingValid || !isDocumentsValid) {
        console.error("Some forms are not valid")
        return
      }

      // Get all values
      const formData = {
        account: accountForm.getValues(),
        address: addressForm.getValues(),
        banking: bankingForm.getValues(),
        documents: documentsForm.getValues()
      }

      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append('account', JSON.stringify(formData.account))
      submitData.append('address', JSON.stringify(formData.address))
      submitData.append('banking', JSON.stringify(formData.banking))
      submitData.append('idCardFront', formData.documents.idCardFront)
      submitData.append('idCardBack', formData.documents.idCardBack)
      submitData.append('proofOfAddress', formData.documents.proofOfAddress)

      // Send data to API
      const response = await fetch('/api/sellers/register', {
        method: 'POST',
        body: submitData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error registering seller')
      }

      const result = await response.json()

      // Redirect to success page
      window.location.href = `/register/success`

    } catch (error) {
      console.error("Error submitting form:", error)
      // Here you could show an error message to the user
    }
  }

  const handleNext = async () => {
    let isValid = false

    switch (currentTab) {
      case "account":
        setIsSubmitted(prev => ({ ...prev, account: true }))
        isValid = await accountForm.trigger()
        if (!isValid) {
          console.log("Account form errors:", accountForm.formState.errors)
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
          console.log("Address form errors:", addressForm.formState.errors)
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
          console.log("Banking form errors:", bankingForm.formState.errors)
        }
        if (isValid) {
          console.log("Banking form values:", bankingForm.getValues())
          setCurrentTab("documents")
        }
        break
      case "documents":
        setIsSubmitted(prev => ({ ...prev, documents: true }))
        isValid = await documentsForm.trigger()
        if (!isValid) {
          console.log("Documents form errors:", documentsForm.formState.errors)
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
      case "documents":
        setCurrentTab("banking")
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
            Professional Registration
          </h1>
          <p className="text-muted-foreground text-lg">
            Create your professional account in a few simple steps
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
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger 
              value="address" 
              className="flex items-center gap-2"
              disabled={!isTabAccessible("address")}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Address</span>
            </TabsTrigger>
            <TabsTrigger 
              value="banking" 
              className="flex items-center gap-2"
              disabled={!isTabAccessible("banking")}
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Banking</span>
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
              <span className="hidden sm:inline">Summary</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardContent className="p-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Open your professional account</h2>
                  <p className="text-muted-foreground">
                    First, we need some essential information about your company. You can then register your access credentials for your Watch Pros professional account.
                  </p>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleNext()
                }} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input id="companyName" placeholder="Enter your company name" {...accountForm.register("companyName")} />
                      <FormError error={accountForm.formState.errors.companyName?.message as string} isSubmitted={isSubmitted.account} />
                    </div>

                    <div>
                      <Label htmlFor="watchProsName">Name on Watch Pros *</Label>
                      <Input id="watchProsName" placeholder="Enter the name that will appear on Watch Pros" {...accountForm.register("watchProsName")} />
                      <FormError error={accountForm.formState.errors.watchProsName?.message as string} isSubmitted={isSubmitted.account} />
                    </div>

                    <div>
                      <Label htmlFor="companyStatus">Company Status *</Label>
                      <Input id="companyStatus" placeholder="Enter your company status" {...accountForm.register("companyStatus")} />
                      <FormError error={accountForm.formState.errors.companyStatus?.message as string} isSubmitted={isSubmitted.account} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Controller
                          name="country"
                          control={accountForm.control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
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
                        <FormError error={accountForm.formState.errors?.country?.message as string} isSubmitted={isSubmitted.account} />
                      </div>

                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Controller
                          name="title"
                          control={accountForm.control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
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
                        <FormError error={accountForm.formState.errors.title?.message as string} isSubmitted={isSubmitted.account} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" placeholder="First name for billing address" {...accountForm.register("firstName")} />
                        <FormError error={accountForm.formState.errors.firstName?.message as string} isSubmitted={isSubmitted.account} />
                      </div>

                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" placeholder="Last name for billing address" {...accountForm.register("lastName")} />
                        <FormError error={accountForm.formState.errors.lastName?.message as string} isSubmitted={isSubmitted.account} />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="your@email.com" {...accountForm.register("email")} />
                      <FormError error={accountForm.formState.errors.email?.message as string} isSubmitted={isSubmitted.account} />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <div className="flex gap-2">
                        <Controller
                          name="phonePrefix"
                          control={accountForm.control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Prefix" />
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
                        <FormError error={accountForm.formState.errors.phonePrefix?.message as string} isSubmitted={isSubmitted.account} />
                        <Controller
                          name="phone"
                          control={accountForm.control}
                          defaultValue=""
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="phone"
                              placeholder="Phone number"
                              className="flex-1"
                              value={field.value || ""}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                field.onChange(value);
                              }}
                            />
                          )}
                        />
                        <FormError error={accountForm.formState.errors.phone?.message as string} isSubmitted={isSubmitted.account} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6">
                    <p className="text-sm text-muted-foreground">* Required field</p>
                    <Button type="submit" size="lg">
                      Continue
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
                  <h2 className="text-2xl font-semibold mb-2">Other Company Information</h2>
                  <p className="text-muted-foreground">
                    Now indicate your company's address (headquarters) as it should appear on invoices. We also need your business registration number and tax identification numbers.
                  </p>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleNext()
                }} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="street">Street *</Label>
                      <Input id="street" placeholder="Enter your address" {...addressForm.register("street")} />
                      <FormError error={addressForm.formState.errors.street?.message as string} isSubmitted={isSubmitted.address} />
                    </div>

                    <div>
                      <Label htmlFor="addressComplement">Address Complement</Label>
                      <Input id="addressComplement" placeholder="Apartment, suite, unit, etc." {...addressForm.register("addressComplement")} />
                      <FormError error={addressForm.formState.errors.addressComplement?.message as string} isSubmitted={isSubmitted.address} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input id="postalCode" placeholder="Postal code" {...addressForm.register("postalCode")} />
                        <FormError error={addressForm.formState.errors.postalCode?.message as string} isSubmitted={isSubmitted.address} />
                      </div>

                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" placeholder="City" {...addressForm.register("city")} />
                        <FormError error={addressForm.formState.errors.city?.message as string} isSubmitted={isSubmitted.address} />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Controller
                        name="country"
                        control={addressForm.control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
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
                      <FormError error={addressForm.formState.errors.country?.message as string} isSubmitted={isSubmitted.address} />
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
                      <FormError error={addressForm.formState.errors.mobile?.message as string} isSubmitted={isSubmitted.address} />
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" type="url" placeholder="https://www.your-website.com" {...addressForm.register("website")} />
                      <FormError error={addressForm.formState.errors.website?.message as string} isSubmitted={isSubmitted.address} />
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Identification Numbers</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="siren">SIREN or SIRET Number *</Label>
                          <Input id="siren" placeholder="Enter your SIREN or SIRET number" {...addressForm.register("siren")} />
                          <FormError error={addressForm.formState.errors.siren?.message as string} isSubmitted={isSubmitted.address} />
                        </div>

                        <div>
                          <Label htmlFor="taxId">Tax ID Number *</Label>
                          <Input id="taxId" placeholder="Enter your tax ID number" {...addressForm.register("taxId")} />
                          <FormError error={addressForm.formState.errors.taxId?.message as string} isSubmitted={isSubmitted.address} />
                          <p className="text-sm text-muted-foreground mt-1">
                            Enter the tax ID number corresponding to your company's location: France
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="vatNumber">VAT Number *</Label>
                          <Input id="vatNumber" placeholder="Enter your VAT number" {...addressForm.register("vatNumber")} />
                          <FormError error={addressForm.formState.errors.vatNumber?.message as string} isSubmitted={isSubmitted.address} />
                          <p className="text-sm text-muted-foreground mt-1">
                            Enter the VAT number corresponding to your company's location: France
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
                            I am registered with the One-Stop Shop (OSS)
                          </Label>
                        </div>
                        <FormError error={addressForm.formState.errors.oss?.message as string} isSubmitted={isSubmitted.address} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6">
                    <p className="text-sm text-muted-foreground">* Required field</p>
                    <div className="space-x-4">
                      <Button type="button" variant="outline" size="lg" onClick={handleBack}>
                        Back
                      </Button>
                      <Button type="submit" size="lg">
                        Continue
                      </Button>
                    </div>
                  </div>
                </form>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Note: Your contact information will be displayed next to your listings and on your professional homepage.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banking">
            <Card>
              <CardContent className="p-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Please enter your banking details</h2>
                  <p className="text-muted-foreground">
                    Your data is secured through the PCI DSS (Payment Card Industry Data Security Standard) system implemented by Saferpay. For security reasons, 1 euro will be blocked but not debited from your bank account. This process serves to verify the authenticity of the provided data.
                  </p>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleNext()
                }} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method *</Label>
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
                              <SelectValue placeholder="Select a payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="card">Credit Card</SelectItem>
                              <SelectItem value="sepa">SEPA Direct Debit</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <FormError error={bankingForm.formState.errors.paymentMethod?.message as string} isSubmitted={isSubmitted.banking} />
                    </div>

                    {/* Credit Card Form */}
                    <div className="space-y-4" id="cardForm">
                      <div>
                        <Label htmlFor="cardHolder">Cardholder Name *</Label>
                        <Input id="cardHolder" placeholder="Name as it appears on card" {...bankingForm.register("cardHolder")} />
                        <FormError error={bankingForm.formState.errors.cardHolder?.message as string} isSubmitted={isSubmitted.banking} />
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
                      <FormError error={bankingForm.formState.errors.cardNumber?.message as string} isSubmitted={isSubmitted.banking} />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Controller
                            name="expiryDate"
                            control={bankingForm.control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="expiryDate"
                                placeholder="MM/YY"
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
                          <FormError error={bankingForm.formState.errors.expiryDate?.message as string} isSubmitted={isSubmitted.banking} />
                        </div>

                        <div>
                          <Label htmlFor="cvc">Security Code (CVC) *</Label>
                          <Input 
                            id="cvc" 
                            placeholder="123"
                            maxLength={3}
                            type="password"
                            {...bankingForm.register("cvc")}
                          />
                          <FormError error={bankingForm.formState.errors.cvc?.message as string} isSubmitted={isSubmitted.banking} />
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
                          I hereby authorize Watch Pros GmbH, until revoked, to debit the indicated amounts from my credit card.
                        </Label>
                      </div>
                      <FormError error={bankingForm.formState.errors.authorization?.message as string} isSubmitted={isSubmitted.banking} />
                    </div>

                    {/* SEPA Form */}
                    <div className="space-y-4 hidden" id="sepaForm">
                      <div>
                        <Label htmlFor="accountHolder">Account Holder (if different from company)</Label>
                        <Input id="accountHolder" placeholder="Account holder name" {...bankingForm.register("accountHolder")} />
                        <FormError error={bankingForm.formState.errors.accountHolder?.message as string} isSubmitted={isSubmitted.banking} />
                      </div>

                      <div>
                        <Label htmlFor="sepaStreet">Street *</Label>
                        <Input id="sepaStreet" placeholder="Bank address" {...bankingForm.register("sepaStreet")} />
                        <FormError error={bankingForm.formState.errors.sepaStreet?.message as string} isSubmitted={isSubmitted.banking} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="sepaPostalCode">Postal Code *</Label>
                          <Input id="sepaPostalCode" placeholder="Postal code" {...bankingForm.register("sepaPostalCode")} />
                          <FormError error={bankingForm.formState.errors.sepaPostalCode?.message as string} isSubmitted={isSubmitted.banking} />
                        </div>

                        <div>
                          <Label htmlFor="sepaCity">City *</Label>
                          <Input id="sepaCity" placeholder="City" {...bankingForm.register("sepaCity")} />
                          <FormError error={bankingForm.formState.errors.sepaCity?.message as string} isSubmitted={isSubmitted.banking} />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="sepaCountry">Country *</Label>
                        <Controller
                          name="sepaCountry"
                          control={bankingForm.control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
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
                        <FormError error={bankingForm.formState.errors.sepaCountry?.message as string} isSubmitted={isSubmitted.banking} />
                      </div>

                      <div>
                        <Label htmlFor="bankName">Bank *</Label>
                        <Input id="bankName" placeholder="Your bank name" {...bankingForm.register("bankName")} />
                        <FormError error={bankingForm.formState.errors.bankName?.message as string} isSubmitted={isSubmitted.banking} />
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
                        <FormError error={bankingForm.formState.errors.iban?.message as string} isSubmitted={isSubmitted.banking} />
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
                        <FormError error={bankingForm.formState.errors.bic?.message as string} isSubmitted={isSubmitted.banking} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6">
                    <p className="text-sm text-muted-foreground">* Required field</p>
                    <div className="space-x-4">
                      <Button type="button" variant="outline" size="lg" onClick={handleBack}>
                        Back
                      </Button>
                      <Button type="submit" size="lg">
                        Continue
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
                      For security reasons, you will be redirected to your bank's website.
                    </p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg hidden" id="sepaNote">
                    <p className="text-sm text-muted-foreground">
                      Important note: To be validated, the SEPA direct debit requires your signature. Please print the SEPA mandate that will appear in the next step and send it back to us by mail or upload it via the "Upload Documents" section.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardContent className="p-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Required Documents</h2>
                  <p className="text-muted-foreground">
                    To complete your registration, we need some official documents. These documents are necessary to verify your identity and address.
                  </p>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleNext()
                }} className="space-y-6">
                  <div className="space-y-6">
                    {/* ID Document */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">ID Document</h3>
                      <p className="text-sm text-muted-foreground">
                        Please provide a copy of your ID document (national ID card, passport, or driver's license).
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="idCardFront">Front *</Label>
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
                          <FormError error={documentsForm.formState.errors.idCardFront?.message as string} isSubmitted={isSubmitted.documents} />
                          <p className="text-xs text-muted-foreground mt-1">
                            Accepted formats: JPG, PNG, PDF (max 5MB)
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="idCardBack">Back *</Label>
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
                          <FormError error={documentsForm.formState.errors.idCardBack?.message as string} isSubmitted={isSubmitted.documents} />
                          <p className="text-xs text-muted-foreground mt-1">
                            Accepted formats: JPG, PNG, PDF (max 5MB)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Proof of Address */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Proof of Address</h3>
                      <p className="text-sm text-muted-foreground">
                        Please provide a proof of address less than 3 months old (utility bill, phone bill, rent receipt, etc.).
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
                        <FormError error={documentsForm.formState.errors.proofOfAddress?.message as string} isSubmitted={isSubmitted.documents} />
                        <p className="text-xs text-muted-foreground mt-1">
                          Accepted formats: JPG, PNG, PDF (max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6">
                    <p className="text-sm text-muted-foreground">* Required field</p>
                    <div className="space-x-4">
                      <Button type="button" variant="outline" size="lg" onClick={handleBack}>
                        Back
                      </Button>
                      <Button type="submit" size="lg">
                        Continue
                      </Button>
                    </div>
                  </div>
                </form>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Your documents will be processed confidentially and securely. They will only be used to verify your identity and address.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary">
            <Card>
              <CardContent className="p-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Summary</h2>
                </div>

                <div className="space-y-8">
                  {/* Professional Account */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Professional Account</h3>
                      <Button variant="outline" size="sm" onClick={() => setCurrentTab("account")}>Edit</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Company</p>
                        <p className="font-medium">{accountForm.getValues("companyName")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Watch Pros Name</p>
                        <p className="font-medium">{accountForm.getValues("watchProsName")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{accountForm.getValues("email")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">+{accountForm.getValues("phonePrefix")}{accountForm.getValues("phone")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Plan */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Your Professional Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      During the 30-day trial period, you don't pay any base fee for your Professional plan. You can post as many listings as you want. Only completed sales are subject to a sales commission. After the trial period, we will automatically assign you the most advantageous Professional plan based on the number of watch listings you have published.
                    </p>
                  </div>

                  {/* Company Data */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Company Information</h3>
                      <Button variant="outline" size="sm" onClick={() => setCurrentTab("address")}>Edit</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{addressForm.getValues("street")}</p>
                        {addressForm.getValues("addressComplement") && (
                          <p className="font-medium">{addressForm.getValues("addressComplement")}</p>
                        )}
                        <p className="font-medium">{addressForm.getValues("postalCode")} {addressForm.getValues("city")}</p>
                        <p className="font-medium">{countries.find(c => c.value === addressForm.getValues("country"))?.label}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mobile</p>
                        <p className="font-medium">+{addressForm.getValues("mobilePrefix")}{addressForm.getValues("mobile")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <p className="font-medium">{addressForm.getValues("website") || "--"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Company Status</p>
                        <p className="font-medium">{accountForm.getValues("companyStatus")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">SIREN/SIRET</p>
                        <p className="font-medium">{addressForm.getValues("siren")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tax ID</p>
                        <p className="font-medium">{addressForm.getValues("taxId")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">VAT Number</p>
                        <p className="font-medium">{addressForm.getValues("vatNumber")}</p>
                      </div>
                      {addressForm.getValues("oss") && (
                        <div>
                          <p className="text-sm text-muted-foreground">OSS Registration</p>
                          <p className="font-medium">Yes</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Banking Details */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Your Bank Details</h3>
                      <Button variant="outline" size="sm" onClick={() => setCurrentTab("banking")}>Edit</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Method</p>
                        <p className="font-medium">
                          {bankingForm.getValues("paymentMethod") === "card" ? "Credit Card" : "SEPA Direct Debit"}
                        </p>
                      </div>
                      {bankingForm.getValues("paymentMethod") === "card" ? (
                        <>
                          <div>
                            <p className="text-sm text-muted-foreground">Card Holder</p>
                            <p className="font-medium">{bankingForm.getValues("cardHolder")}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Card Number</p>
                            <p className="font-medium">**** **** **** {bankingForm.getValues("cardNumber")?.slice(-4)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Expiry Date</p>
                            <p className="font-medium">{bankingForm.getValues("expiryDate")}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-sm text-muted-foreground">Account Holder</p>
                            <p className="font-medium">{bankingForm.getValues("accountHolder")}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">IBAN</p>
                            <p className="font-medium">**** **** **** {bankingForm.getValues("iban")?.slice(-4)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">BIC</p>
                            <p className="font-medium">{bankingForm.getValues("bic")}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Bank Name</p>
                            <p className="font-medium">{bankingForm.getValues("bankName")}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Uploaded Documents</h3>
                      <Button variant="outline" size="sm" onClick={() => setCurrentTab("documents")}>Edit</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">ID Card Front</p>
                        <p className="font-medium">{documentsForm.getValues("idCardFront")?.name || "--"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ID Card Back</p>
                        <p className="font-medium">{documentsForm.getValues("idCardBack")?.name || "--"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Proof of Address</p>
                        <p className="font-medium">{documentsForm.getValues("proofOfAddress")?.name || "--"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6">
                    <p className="text-sm text-muted-foreground">* Required field</p>
                    <div className="space-x-4">
                      <Button variant="outline" size="lg" onClick={handleBack}>
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        size="lg"
                        onClick={handleSubmit}
                      >
                        Complete Registration
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add debug button to see all errors */}
      <div className="fixed bottom-4 right-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("Form States:", {
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