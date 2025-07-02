"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Building2, MapPin, CreditCard, FileText, CheckCircle2, Upload, Check, Shield, Lock, Clock, ChevronDown, AlertCircle, Paperclip } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { countries, phonePrefixes } from "@/data/form-options"
import { plans } from "@/data/subscription-plans"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useAuthStatus } from '@/hooks/useAuthStatus'
import { supabaseBrowser } from '@/lib/supabase/client'
import { normalizeAndCompress } from '@/lib/image-utils'
import { PlacesLeft } from "@/components/PlacesLeft"

// Déclarer le type global pour window
declare global {
  interface Window {
    handleStripePayment: () => Promise<boolean>;
    isPaymentFormComplete: boolean;
  }
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Constants for file validation
const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf", "image/webp", "image/heic", "image/heif"];

// File validation function
const validateFile = (file: File) => {
  if (!file) return "File is required";
  
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "File format not accepted. Accepted formats: JPG, PNG, PDF";
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return "File is too large. Maximum size: 6MB";
  }
  
  return null;
};

// Helper function to validate and normalize URLs
const validateAndNormalizeUrl = (url: string): string | null => {
  if (!url || url.trim() === '') return null
  
  let normalizedUrl = url.trim()
  
  // Remove www. if present
  if (normalizedUrl.startsWith('www.')) {
    normalizedUrl = normalizedUrl.substring(4)
  }
  
  // Add https:// if no protocol is present
  if (!normalizedUrl.match(/^https?:\/\//)) {
    normalizedUrl = `https://${normalizedUrl}`
  }
  
  // Basic URL validation
  try {
    new URL(normalizedUrl)
    return normalizedUrl
  } catch {
    return null
  }
}

// Validation schema for professional account
const accountSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  watchProsName: z.string().min(1, "Watch Pros name is required"),
  companyStatus: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phonePrefix: z.string().min(1, "Phone prefix is required"),
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, { message: "Phone number must contain only digits (no spaces, dashes, or symbols)" })
    .min(9, "Phone number must contain at least 9 digits")
    .max(15, "Phone number must not exceed 15 digits"),
  cryptoFriendly: z.boolean().default(false),
  companyLogo: z.custom<File>((file) => {
    if (!file) return false;
    return validateFile(file as File) === null;
  }, "Company logo is required"),
})

// Validation schema for address
const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  addressComplement: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  website: z.string()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (!val || val.trim() === '') return ''
      const normalized = validateAndNormalizeUrl(val)
      if (!normalized) {
        throw new Error("Please enter a valid website URL (e.g., mywebsite.com)")
      }
      return normalized
    }),
  siren: z.string().min(1, "SIREN/SIRET number is required"),
  taxId: z.string().min(1, "Tax ID number is required"),
  vatNumber: z.string().min(1, "VAT number is required"),
  oss: z.boolean().optional(),
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

// Add this new component
function PaymentFormWrapper({ 
  onPaymentComplete, 
  onPaymentError,
  onPaymentFormChange 
}: { 
  onPaymentComplete: () => void,
  onPaymentError: (error: string) => void,
  onPaymentFormChange: (isComplete: boolean) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    if (!stripe || !elements) {
      onPaymentError('Payment system not initialized')
      return
    }

    try {
      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/register/verify`,
        },
      })

      if (paymentError) {
        setError(paymentError.message || 'Payment failed')
        onPaymentError(paymentError.message || 'Payment failed')
        return false
      }

      onPaymentComplete()
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      onPaymentError(errorMessage)
      return false
    }
  }

  // Expose handlePayment to parent
  useEffect(() => {
    // @ts-ignore - we're adding a custom property to window
    window.handleStripePayment = handlePayment
  }, [handlePayment])

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      <PaymentElement 
        onChange={(e) => {
          onPaymentFormChange(Boolean(e.complete))
        }}
      />
    </div>
  )
}


// Helper to upload a file to Supabase Storage and return its public URL
async function uploadToStorage(file: File, userId: string, type: string) {
  const ext = file.type === 'application/pdf' ? 'pdf' : 'jpg'
  const fileName = `${userId}/${type}-${Date.now()}.${ext}`
  const { error } = await supabaseBrowser
    .storage.from('sellerdocuments')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data } = supabaseBrowser
    .storage.from('sellerdocuments')
    .getPublicUrl(fileName)
  return { url: data.publicUrl, path: fileName }
}

export default function RegisterFormPage() {
  const { isAuthenticated, isSeller, isLoading } = useAuthStatus()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [currentTab, setCurrentTab] = useState("account")
  const [isFormValid, setIsFormValid] = useState({
    account: false,
    address: false,
    documents: false,
  })
  const [isSubmitted, setIsSubmitted] = useState({
    account: false,
    address: false,
    documents: false,
  })
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null | undefined>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loadingPayment, setLoadingPayment] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const [isPaymentFormComplete, setIsPaymentFormComplete] = useState(false)
  const idCardFrontInputRef = useRef<HTMLInputElement>(null)
  const idCardBackInputRef = useRef<HTMLInputElement>(null)
  const proofOfAddressInputRef = useRef<HTMLInputElement>(null)
  const [loadingSellerRegistration, setLoadingSellerRegistration] = useState(false)

  const accountForm = useForm({
    resolver: zodResolver(accountSchema),
    mode: "onSubmit",
  })

  const addressForm = useForm({
    resolver: zodResolver(addressSchema),
    mode: "onSubmit",
  })

  const documentsForm = useForm({
    resolver: zodResolver(documentsSchema),
    mode: "onSubmit",
  })

  const { watch: documentsWatch } = documentsForm
  const isDocumentsIncomplete = !documentsWatch("idCardFront") || !documentsWatch("idCardBack") || !documentsWatch("proofOfAddress")

  // Détermine si on doit désactiver les boutons
  const disableContinue = isLoading

  // Alert message
  let alertMessage = null
  if (!isLoading) {
    if (!isAuthenticated) {
      alertMessage = "You must create a user account before you can create a professional account."
    } else if (isSeller) {
      alertMessage = "You already have a seller account. You cannot create another professional account."
    }
  }

  // Function to check if a tab is accessible
  const isTabAccessible = (tab: string) => {
    switch (tab) {
      case "account":
        return true
      case "address":
        return isFormValid.account
      case "documents":
        return isFormValid.account && isFormValid.address
      default:
        return false
    }
  }

  // Update form validation
  useEffect(() => {
    const validateForms = async () => {
      const accountValid = await accountForm.trigger()
      const addressValid = await addressForm.trigger()
      const documentsValid = await documentsForm.trigger()

      setIsFormValid({
        account: accountValid,
        address: addressValid,
        documents: documentsValid,
      })
    }

    validateForms()
  }, [accountForm, addressForm, documentsForm])

  // Handle seller registration (Step 3)
  const handleSellerRegistration = async () => {
    setLoadingSellerRegistration(true)
    setIsSubmitted(prev => ({ ...prev, documents: true }))
    try {
      // Check that all forms are valid
      const isAccountValid = await accountForm.trigger()
      const isAddressValid = await addressForm.trigger()
      const isDocumentsValid = await documentsForm.trigger()
      if (!isAccountValid || !isAddressValid || !isDocumentsValid) {
        setLoadingSellerRegistration(false)
        return
      }

      // Get all values
      const formData = {
        account: {
          ...accountForm.getValues(),
        },
        address: {
          ...addressForm.getValues(),
        },
        documents: documentsForm.getValues()
      }

      // Get userId (from useAuthStatus or supabaseBrowser.auth.getUser())
      let userId = null
      if (typeof window !== 'undefined' && supabaseBrowser.auth) {
        const { data } = await supabaseBrowser.auth.getUser()
        userId = data?.user?.id
      }
      if (!userId) {
        throw new Error('User not authenticated')
      }

      // 1) upload files
      const uploaded = []
      try {
        const logoRes = await uploadToStorage(formData.account.companyLogo, userId, 'companyLogo')
        uploaded.push(logoRes)
        const idFrontRes = await uploadToStorage(formData.documents.idCardFront, userId, 'idCardFront')
        uploaded.push(idFrontRes)
        const idBackRes = await uploadToStorage(formData.documents.idCardBack, userId, 'idCardBack')
        uploaded.push(idBackRes)
        const addressProofRes = await uploadToStorage(formData.documents.proofOfAddress, userId, 'proofOfAddress')
        uploaded.push(addressProofRes)

        // 2) préparez le payload JSON
        const { companyLogo, ...accountWithoutLogo } = formData.account
        const payload = {
          account: {
            ...accountWithoutLogo,
            companyLogoUrl: logoRes.url,
          },
          address: formData.address,
          documents: {
            idCardFrontUrl: idFrontRes.url,
            idCardBackUrl: idBackRes.url,
            proofOfAddressUrl: addressProofRes.url
          }
        }

        // 3) appelez votre API en JSON léger
        const response = await fetch('/api/sellers/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Error registering seller')
        }
        await response.json()
        handleNext()
        setLoadingSellerRegistration(false)
      } catch (error) {
        // Rollback: remove uploaded files if API call fails
        await Promise.all(
          uploaded.map(async (file) => {
            try {
              await supabaseBrowser.storage.from('sellerdocuments').remove([file.path])
            } catch (e) {
              // Ignore cleanup errors
            }
          })
        )
        throw error
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
      setLoadingSellerRegistration(false)
    }
  }

  // Handle subscription payment (Step 4)
  const handleSubscriptionPayment = async () => {
    try {
      if (!selectedPlan) {
        throw new Error("Please select a subscription plan")
      }

      // @ts-ignore - we know this exists from the useEffect in PaymentFormWrapper
      const paymentSuccessful = await window.handleStripePayment()
      console.log('[LOG] handleSubscriptionPayment - paymentSuccessful:', paymentSuccessful)
      if (!paymentSuccessful) {
        throw new Error("Payment failed")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "An error occurred during payment",
        variant: "destructive",
      })
    }
  }

  const handleNext = async () => {
    let isValid = false
    console.log('[LOG] handleNext - currentTab:', currentTab)
    switch (currentTab) {
      case "account":
        setIsSubmitted(prev => ({ ...prev, account: true }))
        isValid = await accountForm.trigger()
        console.log('[LOG] handleNext - accountForm.isValid:', isValid)
        console.log('[LOG] handleNext - accountForm.errors:', accountForm.formState.errors)
        if (!isValid) {
          console.log("Account form errors:", accountForm.formState.errors)
        }
        if (isValid) {
          console.log("Account form values:", accountForm.getValues())
          setCurrentTab("address")
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        break
      case "address":
        setIsSubmitted(prev => ({ ...prev, address: true }))
        isValid = await addressForm.trigger()
        console.log('[LOG] handleNext - addressForm.isValid:', isValid)
        console.log('[LOG] handleNext - addressForm.errors:', addressForm.formState.errors)
        if (!isValid) {
          console.log("Address form errors:", addressForm.formState.errors)
        }
        if (isValid) {
          console.log("Address form values:", addressForm.getValues())
          setCurrentTab("documents")
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        break
      case "documents":
        setIsSubmitted(prev => ({ ...prev, documents: true }))
        isValid = await documentsForm.trigger()
        console.log('[LOG] handleNext - documentsForm.isValid:', isValid)
        console.log('[LOG] handleNext - documentsForm.errors:', documentsForm.formState.errors)
        if (!isValid) {
          console.log("Documents form errors:", documentsForm.formState.errors)
        }
        if (isValid) {
          console.log("Documents form values:", documentsForm.getValues())
          setCurrentTab("subscription")
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        break
      case "subscription":
        if (!selectedPlan) {
          // Show error message
          console.log('[LOG] handleNext - no selectedPlan')
          return
        }
        // The subscription form handles its own submission
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
      case "documents":
        setCurrentTab("address")
        break
      case "subscription":
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

  const handleCompanyLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const error = validateFile(file)
      if (error) {
        accountForm.setError("companyLogo", { message: error })
      } else {
        try {
          // Optimize image before setting in form
          const optimized = await normalizeAndCompress(file, {
            maxSizeMB: 0.8,           // on vise < 800 Ko
            maxWidthOrHeight: 1000,   // 1000 px max
            initialQuality: 0.75,     // qualité visuelle correcte
          })
          
          accountForm.setValue("companyLogo", optimized)
          accountForm.clearErrors("companyLogo")
          
          // Create preview
          const reader = new FileReader()
          reader.onloadend = () => {
            setCompanyLogoPreview(reader.result as string)
          }
          reader.readAsDataURL(optimized)
        } catch (error) {
          console.error('Error optimizing company logo:', error)
          // Fallback to original file if optimization fails
          accountForm.setValue("companyLogo", file)
          accountForm.clearErrors("companyLogo")
          
          const reader = new FileReader()
          reader.onloadend = () => {
            setCompanyLogoPreview(reader.result as string)
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }

  useEffect(() => {
    if (selectedPlan) {
      // Create subscription
      fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId: selectedPlan, account: accountForm.getValues(), address: addressForm.getValues() }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            toast({
              title: "Error",
              description: data.error,
              variant: "destructive",
            })
          } else {
            setClientSecret(data.clientSecret)
          }
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: "Failed to initialize payment",
            variant: "destructive",
          })
        })
        .finally(() => {
          setLoadingPayment(false)
        })
    }
  }, [selectedPlan])

  const renderPaymentForm = () => {
    if (loadingPayment) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-40">
              <p>Loading payment form...</p>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (!clientSecret) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 p-4 text-red-800 bg-red-100 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <p>Failed to load payment form</p>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>
            Enter your payment details to complete your registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#0f172a",
                },
              },
            }}
          >
            <PaymentFormWrapper 
              onPaymentComplete={() => {
                toast({
                  title: "Payment successful!",
                  description: "Your account has been activated.",
                })
              }}
              onPaymentError={(error) => {
                toast({
                  title: "Payment Error",
                  description: error,
                  variant: "destructive",
                })
              }}
              onPaymentFormChange={setIsPaymentFormComplete}
            />
          </Elements>
        </CardContent>
      </Card>
    )
  }

  return (
    <main className="container py-12">
      <div className="max-w-3xl mx-auto">
        {/* Message d'alerte si besoin */}
        {alertMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 mb-3">
              <AlertCircle className="h-5 w-5" />
              <span>{alertMessage}</span>
            </div>
            {!isAuthenticated && (
              <div className="flex justify-center">
                <Button 
                  onClick={() => router.push('/auth?mode=register')}
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-700 hover:bg-red-100"
                >
                  Go to Login
                </Button>
              </div>
            )}
          </div>
        )}
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
          <TabsList className="grid w-full grid-cols-4 mb-8">
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
              value="documents" 
              className="flex items-center gap-2"
              disabled={!isTabAccessible("documents")}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger 
              value="subscription" 
              className="flex items-center gap-2"
              disabled={!isTabAccessible("subscription")}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Subscription</span>
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
                  console.log('[LOG] Account form submit - values:', accountForm.getValues())
                  handleNext()
                }} className="space-y-6">
                  <div className="space-y-4">
                    {/* Company Logo Upload */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Company Logo</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload your company logo. This will be displayed on your profile and listings.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {companyLogoPreview && (
                          <div className="relative aspect-square">
                            <img
                              src={companyLogoPreview}
                              alt="Company logo preview"
                              className="w-full h-full object-contain rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setCompanyLogoPreview(null)
                                accountForm.setValue("companyLogo", null)
                              }}
                              className="absolute top-2 right-2 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center hover:bg-background"
                            >
                              ×
                            </button>
                          </div>
                        )}
                        
                        {!companyLogoPreview && (
                          <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">Upload logo</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              className="hidden"
                              onChange={handleCompanyLogoChange}
                            />
                          </label>
                        )}
                      </div>
                      <FormError error={accountForm.formState.errors.companyLogo?.message as string} isSubmitted={isSubmitted.account} />
                      <p className="text-xs text-muted-foreground">
                        Accepted formats: JPG, PNG, WEBP (max 5MB)
                      </p>
                    </div>

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
                      <Label htmlFor="companyStatus">Company Status</Label>
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

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="cryptoFriendly"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        {...accountForm.register("cryptoFriendly")}
                      />
                      <Label htmlFor="cryptoFriendly" className="text-sm">
                        I accept cryptocurrency payments
                      </Label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
                    <p className="text-sm text-muted-foreground order-2 sm:order-1">* Required field</p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto order-1 sm:order-2">
                      <Button type="button" variant="outline" size="lg" onClick={handleBack} className="w-full sm:w-auto" disabled={disableContinue}>
                        Back
                      </Button>
                      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={disableContinue}>
                        Continue
                      </Button>
                    </div>
                  </div>
                  {/* Message d'erreur si le formulaire est invalide après soumission */}
                  {isSubmitted.account && !accountForm.formState.isValid && (
                    <div className="mt-2 text-sm text-red-600 text-center">
                      Some fields are incorrect or missing. Please check the form above.
                    </div>
                  )}
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
                  console.log('[LOG] Address form submit - values:', addressForm.getValues())
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
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" type="text" placeholder="mywebsite.com or www.mywebsite.com" {...addressForm.register("website")} />
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
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
                    <p className="text-sm text-muted-foreground order-2 sm:order-1">* Required field</p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto order-1 sm:order-2">
                      <Button type="button" variant="outline" size="lg" onClick={handleBack} className="w-full sm:w-auto" disabled={disableContinue}>
                        Back
                      </Button>
                      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={disableContinue}>
                        Continue
                      </Button>
                    </div>
                  </div>
                  {/* Message d'erreur si le formulaire est invalide après soumission */}
                  {isSubmitted.address && !addressForm.formState.isValid && (
                    <div className="mt-2 text-sm text-red-600 text-center">
                      Some fields are incorrect or missing. Please check the form above.
                    </div>
                  )}
                </form>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Note: Your contact information will be displayed next to your listings and on your professional homepage.
                  </p>
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
                  console.log('[LOG] Documents form submit - values:', documentsForm.getValues())
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
                            accept="image/*,application/pdf"
                            ref={idCardFrontInputRef}
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const error = validateFile(file)
                                if (error) {
                                  documentsForm.setError("idCardFront", { message: error })
                                } else {
                                  try {
                                    // Only optimize images, not PDFs
                                    if (file.type.startsWith('image/')) {
                                      const optimized = await normalizeAndCompress(file, {
                                        maxSizeMB: 0.8,
                                        maxWidthOrHeight: 1000,
                                        initialQuality: 0.75,
                                      })
                                      documentsForm.setValue("idCardFront", optimized)
                                    } else {
                                      // For PDFs, use the original file
                                      documentsForm.setValue("idCardFront", file)
                                    }
                                    documentsForm.clearErrors("idCardFront")
                                  } catch (error) {
                                    console.error('Error optimizing idCardFront:', error)
                                    // Fallback to original file if optimization fails
                                    documentsForm.setValue("idCardFront", file)
                                    documentsForm.clearErrors("idCardFront")
                                  }
                                }
                              }
                            }}
                            className="cursor-pointer"
                          />
                          <FormError error={documentsForm.formState.errors.idCardFront?.message as string} isSubmitted={isSubmitted.documents} />
                          {documentsForm.watch('idCardFront') && (
                            <div className="flex items-center gap-2 mt-2 bg-accent/30 rounded px-2 py-1 text-primary font-semibold">
                              <Paperclip className="w-4 h-4" />
                              <span className="truncate">{documentsForm.watch('idCardFront').name}</span>
                              <button
                                type="button"
                                className="ml-1 text-destructive hover:text-red-600 text-lg font-bold px-1"
                                onClick={() => {
                                  documentsForm.setValue('idCardFront', undefined);
                                  if (idCardFrontInputRef.current) idCardFrontInputRef.current.value = '';
                                }}
                                aria-label="Remove document"
                              >
                                ×
                              </button>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Accepted formats: JPG, PNG, PDF (max 5MB)
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="idCardBack">Back *</Label>
                          <Input
                            id="idCardBack"
                            type="file"
                            accept="image/*,application/pdf"
                            ref={idCardBackInputRef}
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const error = validateFile(file)
                                if (error) {
                                  documentsForm.setError("idCardBack", { message: error })
                                } else {
                                  try {
                                    // Only optimize images, not PDFs
                                    if (file.type.startsWith('image/')) {
                                      const optimized = await normalizeAndCompress(file, {
                                        maxSizeMB: 0.8,
                                        maxWidthOrHeight: 1000,
                                        initialQuality: 0.75,
                                      })
                                      documentsForm.setValue("idCardBack", optimized)
                                    } else {
                                      // For PDFs, use the original file
                                      documentsForm.setValue("idCardBack", file)
                                    }
                                    documentsForm.clearErrors("idCardBack")
                                  } catch (error) {
                                    console.error('Error optimizing idCardBack:', error)
                                    // Fallback to original file if optimization fails
                                    documentsForm.setValue("idCardBack", file)
                                    documentsForm.clearErrors("idCardBack")
                                  }
                                }
                              }
                            }}
                            className="cursor-pointer"
                          />
                          <FormError error={documentsForm.formState.errors.idCardBack?.message as string} isSubmitted={isSubmitted.documents} />
                          {documentsForm.watch('idCardBack') && (
                            <div className="flex items-center gap-2 mt-2 bg-accent/30 rounded px-2 py-1 text-primary font-semibold">
                              <Paperclip className="w-4 h-4" />
                              <span className="truncate">{documentsForm.watch('idCardBack').name}</span>
                              <button
                                type="button"
                                className="ml-1 text-destructive hover:text-red-600 text-lg font-bold px-1"
                                onClick={() => {
                                  documentsForm.setValue('idCardBack', undefined);
                                  if (idCardBackInputRef.current) idCardBackInputRef.current.value = '';
                                }}
                                aria-label="Remove document"
                              >
                                ×
                              </button>
                            </div>
                          )}
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
                          accept="image/*,application/pdf"
                          ref={proofOfAddressInputRef}
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const error = validateFile(file)
                              if (error) {
                                documentsForm.setError("proofOfAddress", { message: error })
                              } else {
                                try {
                                  // Only optimize images, not PDFs
                                  if (file.type.startsWith('image/')) {
                                    const optimized = await normalizeAndCompress(file, {
                                      maxSizeMB: 0.8,
                                      maxWidthOrHeight: 1000,
                                      initialQuality: 0.75,
                                    })
                                    documentsForm.setValue("proofOfAddress", optimized)
                                  } else {
                                    // For PDFs, use the original file
                                    documentsForm.setValue("proofOfAddress", file)
                                  }
                                  documentsForm.clearErrors("proofOfAddress")
                                } catch (error) {
                                  console.error('Error optimizing proofOfAddress:', error)
                                  // Fallback to original file if optimization fails
                                  documentsForm.setValue("proofOfAddress", file)
                                  documentsForm.clearErrors("proofOfAddress")
                                }
                              }
                            }
                          }}
                          className="cursor-pointer"
                        />
                        <FormError error={documentsForm.formState.errors.proofOfAddress?.message as string} isSubmitted={isSubmitted.documents} />
                        {documentsForm.watch('proofOfAddress') && (
                          <div className="flex items-center gap-2 mt-2 bg-accent/30 rounded px-2 py-1 text-primary font-semibold">
                            <Paperclip className="w-4 h-4" />
                            <span className="truncate">{documentsForm.watch('proofOfAddress').name}</span>
                            <button
                              type="button"
                              className="ml-1 text-destructive hover:text-red-600 text-lg font-bold px-1"
                              onClick={() => {
                                documentsForm.setValue('proofOfAddress', undefined);
                                if (proofOfAddressInputRef.current) proofOfAddressInputRef.current.value = '';
                              }}
                              aria-label="Remove document"
                            >
                              ×
                            </button>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Accepted formats: JPG, PNG, PDF (max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
                    <p className="text-sm text-muted-foreground order-2 sm:order-1">* Required field</p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto order-1 sm:order-2">
                      <Button type="button" variant="outline" size="lg" onClick={handleBack} className="w-full sm:w-auto" disabled={disableContinue}>
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleSellerRegistration}
                        size="lg"
                        disabled={disableContinue || loadingSellerRegistration || isDocumentsIncomplete}
                      >
                        {loadingSellerRegistration ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          "Complete Registration"
                        )}
                      </Button>
                    </div>
                  </div>
                  {/* Message d'erreur si le formulaire est invalide après soumission */}
                  {isSubmitted.documents && !documentsForm.formState.isValid && (
                    <div className="mt-2 text-sm text-red-600 text-center">
                      Some fields are incorrect or missing. Please check the form above.
                    </div>
                  )}
                </form>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Your documents will be processed confidentially and securely. They will only be used to verify your identity and address.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>100% secure payment via Stripe</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="h-4 w-4 text-primary" />
                        <span>Your payment details are encrypted and never stored</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <span>Credit cards and SEPA direct debits accepted</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>Cancel anytime</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">Choose Your Plan</h3>
                        <p className="text-muted-foreground">
                          Select the plan that best fits your business needs
                        </p>
                      </div>

                      {/* FOMO Section - Places Left */}
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
                        <div className="text-center space-y-3">
                          <div className="flex items-center justify-center gap-2">
                            <Clock className="w-5 h-5 text-amber-600" />
                            <h4 className="text-lg font-bold text-amber-800">Limited Time Offer</h4>
                          </div>
                          
                          <div className="flex justify-center">
                            <PlacesLeft />
                          </div>
                          
                          <div className="bg-white/80 rounded-lg p-3 max-w-sm mx-auto">
                            <p className="text-sm text-amber-700 font-medium">
                              ⚡ <strong>Early Bird Pricing</strong> - Lock in these rates forever!
                            </p>
                            <p className="text-xs text-amber-600 mt-1">
                              Once all spots are filled, pricing will increase to regular rates
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {plans.map((plan) => (
                          <Card
                            key={plan.priceId}
                            className={`cursor-pointer transition-all ${
                              selectedPlan === plan.priceId
                                ? "border-primary ring-2 ring-primary"
                                : "hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedPlan(plan.priceId)}
                          >
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold text-lg">{plan.name}</h4>
                                  <p className="text-2xl font-bold mt-2">
                                    €{plan.price.early}<span className="text-sm font-normal text-muted-foreground">/month</span>
                                  </p>
                                  <p className="text-sm text-muted-foreground line-through">€{plan.price.regular}/month</p>
                                </div>
                                <ul className="space-y-2">
                                  {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm">
                                      <CheckCircle2 className="w-4 h-4 text-primary" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {selectedPlan && (
                      <div className="mt-8">
                        <h3 className="text-lg font-medium mb-4">Payment Information</h3>
                        {renderPaymentForm()}
                      </div>
                    )}

                    <div className="mt-8">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="faq">
                          <AccordionTrigger className="text-lg font-medium">
                            Frequently Asked Questions
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Can I change my plan later?</h4>
                                <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">What happens if I exceed my listing limit?</h4>
                                <p className="text-muted-foreground">You'll be notified when you're close to your limit. You can either upgrade your plan or archive some listings.</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Is there a long-term commitment?</h4>
                                <p className="text-muted-foreground">No, all plans are billed monthly and can be cancelled at any time. Early-bird pricing is locked in for as long as you maintain an active account.</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Do you charge commission on sales?</h4>
                                <p className="text-muted-foreground">No, we don't take any commission on sales. You keep 100% of your revenue.</p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
                      <p className="text-sm text-muted-foreground order-2 sm:order-1">* Required field</p>
                      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto order-1 sm:order-2">
                        <Button type="button" variant="outline" size="lg" onClick={handleBack} className="w-full sm:w-auto" disabled={disableContinue}>
                          Back
                        </Button>
                        <Button 
                          type="button" 
                          onClick={handleSubscriptionPayment}
                          size="lg"
                          disabled={disableContinue}
                        >
                          {disableContinue ? (
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              <span>Processing...</span>
                            </div>
                          ) : (
                            "Complete Payment"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="h-10">
          <Button onClick={() => {
            console.log('[LOG] Debug Form - account:', accountForm.getValues())
            console.log('[LOG] Debug Form - address:', addressForm.getValues())
            console.log('[LOG] Debug Form - documents:', documentsForm.getValues())
          }}>Debug Form</Button>
        </div>
      </div>
    </main>
  )
} 