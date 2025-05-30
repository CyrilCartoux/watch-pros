import { createClient } from '../lib/supabase/client'
import { createBrowserClient } from '@supabase/ssr'
import mockSellers from '../data/mock-sellers.json'


async function seedSellers() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  for (const sellerData of mockSellers.sellers) {
    console.log(`Processing seller: ${sellerData.account.companyName}...`)

    // Insert seller account
    console.log('Inserting seller account...')
    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .insert({
        company_name: sellerData.account.companyName,
        watch_pros_name: sellerData.account.watchProsName,
        company_status: sellerData.account.companyStatus,
        first_name: sellerData.account.firstName,
        last_name: sellerData.account.lastName,
        email: sellerData.account.email,
        username: sellerData.account.username,
        country: sellerData.account.country,
        title: sellerData.account.title,
        phone_prefix: sellerData.account.phonePrefix,
        phone: sellerData.account.phone,
        language: sellerData.account.language
      })
      .select()
      .single()

    if (sellerError) {
      console.error(`Error inserting seller ${sellerData.account.companyName}:`, sellerError)
      continue
    }

    // Insert seller address
    console.log('Inserting seller address...')
    const { error: addressError } = await supabase
      .from('seller_addresses')
      .insert({
        seller_id: seller.id,
        street: sellerData.address.street,
        address_complement: sellerData.address.addressComplement,
        postal_code: sellerData.address.postalCode,
        city: sellerData.address.city,
        fax: sellerData.address.fax,
        mobile: sellerData.address.mobile,
        website: sellerData.address.website,
        siren: sellerData.address.siren,
        tax_id: sellerData.address.taxId,
        vat_number: sellerData.address.vatNumber,
        oss: sellerData.address.oss,
        country: sellerData.address.country,
        fax_prefix: sellerData.address.faxPrefix,
        mobile_prefix: sellerData.address.mobilePrefix
      })

    if (addressError) {
      console.error(`Error inserting address for ${sellerData.account.companyName}:`, addressError)
      continue
    }

    // Insert seller banking
    console.log('Inserting seller banking...')
    const { error: bankingError } = await supabase
      .from('seller_banking')
      .insert({
        seller_id: seller.id,
        card_holder: sellerData.banking.cardHolder,
        cvc: sellerData.banking.cvc,
        is_authorized: sellerData.banking.isAuthorized,
        account_holder: sellerData.banking.accountHolder,
        sepa_street: sellerData.banking.sepaStreet,
        sepa_postal_code: sellerData.banking.sepaPostalCode,
        sepa_city: sellerData.banking.sepaCity,
        bank_name: sellerData.banking.bankName,
        payment_method: sellerData.banking.paymentMethod,
        card_number: sellerData.banking.cardNumber,
        expiry_date: sellerData.banking.expiryDate,
        sepa_country: sellerData.banking.sepaCountry
      })

    if (bankingError) {
      console.error(`Error inserting banking for ${sellerData.account.companyName}:`, bankingError)
      continue
    }

    // Insert seller documents
    console.log('Inserting seller documents...')
    const documents = [
      {
        seller_id: seller.id,
        document_type: sellerData.documents.idCardFront.type,
        url: sellerData.documents.idCardFront.url
      },
      {
        seller_id: seller.id,
        document_type: sellerData.documents.idCardBack.type,
        url: sellerData.documents.idCardBack.url
      },
      {
        seller_id: seller.id,
        document_type: sellerData.documents.proofOfAddress.type,
        url: sellerData.documents.proofOfAddress.url
      }
    ]

    const { error: documentsError } = await supabase
      .from('seller_documents')
      .insert(documents)

    if (documentsError) {
      console.error(`Error inserting documents for ${sellerData.account.companyName}:`, documentsError)
      continue
    }

    console.log(`Successfully processed ${sellerData.account.companyName}`)
  }

  console.log('Seeding completed!')
}

seedSellers().catch(console.error) 