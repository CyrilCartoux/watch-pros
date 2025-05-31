import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const formData = await request.formData()

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Extract seller fields
    const companyName = formData.get('companyName') as string
    const watchProsName = formData.get('watchProsName') as string
    const companyStatus = formData.get('companyStatus') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const username = formData.get('username') as string
    const country = formData.get('country') as string
    const title = formData.get('title') as string
    const phonePrefix = formData.get('phonePrefix') as string
    const phone = formData.get('phone') as string
    const language = formData.get('language') as string

    // Create the seller
    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .insert({
        user_id: user.id,
        company_name: companyName,
        watch_pros_name: watchProsName,
        company_status: companyStatus,
        first_name: firstName,
        last_name: lastName,
        email: user.email,
        username,
        country,
        title,
        phone_prefix: phonePrefix,
        phone,
        language
      })
      .select()
      .single()

    if (sellerError) {
      console.error('Error creating seller:', sellerError)
      return NextResponse.json(
        { error: 'Failed to create seller account' },
        { status: 500 }
      )
    }

    // Handle address creation
    const street = formData.get('street') as string
    const addressComplement = formData.get('addressComplement') as string
    const postalCode = formData.get('postalCode') as string
    const city = formData.get('city') as string
    const fax = formData.get('fax') as string
    const mobile = formData.get('mobile') as string
    const website = formData.get('website') as string
    const siren = formData.get('siren') as string
    const taxId = formData.get('taxId') as string
    const vatNumber = formData.get('vatNumber') as string
    const oss = formData.get('oss') === 'true'
    const faxPrefix = formData.get('faxPrefix') as string
    const mobilePrefix = formData.get('mobilePrefix') as string

    const { error: addressError } = await supabase
      .from('seller_addresses')
      .insert({
        seller_id: seller.id,
        street,
        address_complement: addressComplement || null,
        postal_code: postalCode,
        city,
        fax: fax || null,
        mobile: mobile || null,
        website: website || null,
        siren: siren || null,
        tax_id: taxId || null,
        vat_number: vatNumber || null,
        oss: oss || null,
        country,
        fax_prefix: faxPrefix || null,
        mobile_prefix: mobilePrefix || null
      })

    if (addressError) {
      console.error('Error creating seller address:', addressError)
      return NextResponse.json(
        { error: 'Failed to create seller address' },
        { status: 500 }
      )
    }

    // Handle banking information
    const cardHolder = formData.get('cardHolder') as string
    const cvc = formData.get('cvc') as string
    const isAuthorized = formData.get('isAuthorized') === 'true'
    const accountHolder = formData.get('accountHolder') as string
    const sepaStreet = formData.get('sepaStreet') as string
    const sepaPostalCode = formData.get('sepaPostalCode') as string
    const sepaCity = formData.get('sepaCity') as string
    const bankName = formData.get('bankName') as string
    const paymentMethod = formData.get('paymentMethod') as string
    const cardNumber = formData.get('cardNumber') as string
    const expiryDate = formData.get('expiryDate') as string
    const sepaCountry = formData.get('sepaCountry') as string
    const bic = formData.get('bic') as string
    const iban = formData.get('iban') as string

    const { error: bankingError } = await supabase
      .from('seller_banking')
      .insert({
        seller_id: seller.id,
        card_holder: cardHolder || null,
        cvc: cvc || null,
        is_authorized: isAuthorized || null,
        account_holder: accountHolder || null,
        sepa_street: sepaStreet || null,
        sepa_postal_code: sepaPostalCode || null,
        sepa_city: sepaCity || null,
        bank_name: bankName || null,
        payment_method: paymentMethod,
        card_number: cardNumber || null,
        expiry_date: expiryDate || null,
        sepa_country: sepaCountry || null,
        bic: bic || null,
        iban: iban || null
      })

    if (bankingError) {
      console.error('Error creating seller banking info:', bankingError)
      return NextResponse.json(
        { error: 'Failed to create seller banking information' },
        { status: 500 }
      )
    }

    // Handle document uploads
    const documents = formData.getAll('documents') as File[]
    if (documents.length > 0) {
      const documentUploadPromises = documents.map(async (document) => {
        const fileExt = document.name.split('.').pop()
        const docFileName = `${seller.id}/documents/${Date.now()}-${document.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('sellers')
          .upload(docFileName, document)

        if (uploadError) {
          throw uploadError
        }

        const { data: publicUrl } = supabase.storage
          .from('sellers')
          .getPublicUrl(docFileName)

        return supabase
          .from('seller_documents')
          .insert({
            seller_id: seller.id,
            document_type: fileExt?.toUpperCase() || 'OTHER',
            url: publicUrl.publicUrl,
            file_name: document.name
          })
      })

      await Promise.all(documentUploadPromises)
    }

    return NextResponse.json({
      success: true,
      message: 'Seller account created successfully',
      seller
    })
  } catch (error) {
    console.error('Error in registration:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
