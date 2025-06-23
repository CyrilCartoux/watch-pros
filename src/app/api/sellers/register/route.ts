import { emailTemplates, sendEmail } from '@/lib/email'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

export const dynamic = 'force-dynamic'

interface RegisterSellerRequest {
  account: {
    companyName: string
    watchProsName: string
    companyStatus: string
    firstName: string
    lastName: string
    email: string
    username: string
    country: string
    phonePrefix: string
    phone: string
    language: string
    password: string
    cryptoFriendly: boolean
    user_id: string
  }
  address: {
    street: string
    addressComplement?: string
    postalCode: string
    city: string
    country: string
    fax?: string
    mobile: string
    website?: string
    siren: string
    taxId: string
    vatNumber: string
    oss?: boolean
    faxPrefix?: string
    mobilePrefix: string
  }
}

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'image/webp', 'image/heic', 'image/heif'];

// Image optimization constants
const MAX_WIDTH = 1200
const MAX_HEIGHT = 1200
const QUALITY = 80

async function optimizeImage(file: File): Promise<Buffer> {
  // Convert File to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Optimize image
  return sharp(buffer)
    .resize(MAX_WIDTH, MAX_HEIGHT, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: QUALITY, progressive: true })
    .toBuffer()
}

async function processFile(file: File): Promise<{ buffer: Buffer; contentType: string }> {
  if (file.type === 'application/pdf') {
    // For PDFs, just convert to buffer
    const arrayBuffer = await file.arrayBuffer()
    return {
      buffer: Buffer.from(arrayBuffer),
      contentType: 'application/pdf'
    }
  } else {
    // For images, optimize them
    const optimizedBuffer = await optimizeImage(file)
    return {
      buffer: optimizedBuffer,
      contentType: 'image/jpeg'
    }
  }
}

function validateFile(file: File) {
  if (!file) {
    throw new Error('No file provided');
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  try {
    console.log('🚀 Starting seller registration process...')
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('❌ User authentication error:', userError)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.log('✅ User authenticated:', { userId: user.id })

    const formData = await request.formData()

    // Parse JSON data from form fields
    const account = JSON.parse(formData.get('account') as string)
    const address = JSON.parse(formData.get('address') as string)

    console.log('📝 Parsed form data:', {
      account: { ...account, password: '[REDACTED]' },
      address,
    })

    // Add user_id to account object as UUID
    account.user_id = user.id 
    console.log('🔗 Added user_id to account:', account.user_id)

    // Ensure cryptoFriendly is a boolean
    account.cryptoFriendly = Boolean(account.cryptoFriendly)
    console.log('💰 Crypto friendly status:', account.cryptoFriendly)

    // Check if seller already exists with same email or watch_pros_name
    const { data: existingSeller, error: checkError } = await supabase
      .from('sellers')
      .select('email, watch_pros_name')
      .or(`email.eq.${account.email},watch_pros_name.eq.${account.watchProsName}`)
      .maybeSingle()

    if (checkError) {
      console.error('❌ Error checking existing seller:', checkError)
      throw new Error('Failed to check existing seller')
    }

    if (existingSeller) {
      console.error('❌ Seller already exists:', existingSeller)
      if (existingSeller.email === account.email) {
        return NextResponse.json(
          { error: 'A seller with this email already exists' },
          { status: 400 }
        )
      }
      if (existingSeller.watch_pros_name === account.watchProsName) {
        return NextResponse.json(
          { error: 'A seller with this username already exists' },
          { status: 400 }
        )
      }
    }

    // Get and validate files
    const idCardFront = formData.get('idCardFront') as File
    const idCardBack = formData.get('idCardBack') as File
    const proofOfAddress = formData.get('proofOfAddress') as File
    const companyLogo = formData.get('companyLogo') as File

    console.log('📁 Files received:', {
      idCardFront: { name: idCardFront.name, size: idCardFront.size, type: idCardFront.type },
      idCardBack: { name: idCardBack.name, size: idCardBack.size, type: idCardBack.type },
      proofOfAddress: { name: proofOfAddress.name, size: proofOfAddress.size, type: proofOfAddress.type },
      companyLogo: { name: companyLogo.name, size: companyLogo.size, type: companyLogo.type }
    })

    // Validate files
    try {
      validateFile(idCardFront)
      validateFile(idCardBack)
      validateFile(proofOfAddress)
      validateFile(companyLogo)
      console.log('✅ All files validated successfully')
    } catch (error) {
      console.error('❌ File validation error:', error)
      throw error
    }

    // Insert seller and related data in a single transaction
    console.log('🔄 Starting seller registration transaction...')
    const { data: seller, error: registerError } = await supabase.rpc('register_seller', {
      p_account: account,
      p_address: address,
      p_trusted: null
    })

    if (registerError) {
      console.error('❌ Seller registration error:', registerError)
      throw registerError
    }
    console.log('✅ Seller registered successfully:', { sellerId: seller.id })
    console.log('seller after register_seller', seller)

    // Upload documents to storage and get their URLs
    const documents = [
      {
        file: idCardFront,
        type: 'idCardFront',
        user_id: user.id
      },
      {
        file: idCardBack,
        type: 'idCardBack',
        user_id: user.id
      },
      {
        file: proofOfAddress,
        type: 'proofOfAddress',
        user_id: user.id
      },
      {
        file: companyLogo,
        type: 'companyLogo',
        user_id: user.id
      }
    ]

    const documentUrls: Record<string, string> = {}
    console.log('📤 Starting document uploads...')

    for (const doc of documents) {
      try {
        console.log(`🔄 Processing ${doc.type}...`)
        
        // Process file (optimize if image, keep as is if PDF)
        const { buffer, contentType } = await processFile(doc.file)
        console.log(`✅ ${doc.type} processed:`, { contentType, size: buffer.length })

        // Create a unique file name with extension
        const fileExtension = doc.file.type === 'application/pdf' ? 'pdf' : 'jpg'
        const fileName = `${doc.user_id}/${doc.type}-${Date.now()}.${fileExtension}`
        console.log(`📝 Generated filename for ${doc.type}:`, fileName)

        // Upload file to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('sellerdocuments')
          .upload(fileName, buffer, {
            contentType,
            upsert: false,
            cacheControl: '3600'
          })

        if (uploadError) {
          console.error(`❌ Error uploading ${doc.type}:`, uploadError)
          throw new Error(`Failed to upload ${doc.type}: ${uploadError.message}`)
        }
        console.log(`✅ ${doc.type} uploaded successfully`)

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('sellerdocuments')
          .getPublicUrl(fileName)

        // Store the URL in our object
        documentUrls[doc.type] = publicUrl
        console.log(`🔗 ${doc.type} URL generated:`, publicUrl)

      } catch (error) {
        console.error(`❌ Error processing document ${doc.type}:`, error)
        // If there's an error, try to clean up any uploaded files
        try {
          const fileExtension = doc.file.type === 'application/pdf' ? 'pdf' : 'jpg'
          await supabase.storage
            .from('sellerdocuments')
            .remove([`${doc.user_id}/${doc.type}-${Date.now()}.${fileExtension}`])
          console.log(`🧹 Cleaned up ${doc.type} after error`)
        } catch (cleanupError) {
          console.error('❌ Error cleaning up files:', cleanupError)
        }
        throw error
      }
    }

    console.log('📝 Updating seller with document URLs...')
    // Update seller with document URLs
    const { error: updateError } = await supabase
      .from('sellers')
      .update({
        id_card_front_url: documentUrls.idCardFront,
        id_card_back_url: documentUrls.idCardBack,
        proof_of_address_url: documentUrls.proofOfAddress,
        company_logo_url: documentUrls.companyLogo
      })
      .eq('id', seller.id)

    if (updateError) {
      console.error('❌ Error updating seller with document URLs:', updateError)
      throw new Error('Failed to update seller with document URLs')
    }
    console.log('✅ Seller updated with document URLs')

    console.log('📝 Updating profile with seller_id...')
    // Update profile with seller_id
    const { error: profileUpdateError } = await supabaseAdmin
      .from('profiles')
      .update({
        seller_id: seller.id
      })
      .eq('id', user.id)

    if (profileUpdateError) {
      console.error('❌ Error updating profile with seller_id:', profileUpdateError)
      throw new Error('Failed to update profile with seller_id')
    }
    console.log('✅ Profile updated with seller_id')

    console.log('🎉 Seller registration completed successfully')

    // Send email to admin
    await sendEmail({
      to: 'admin@watch-pros.com',
      ...emailTemplates.sellerRegistrationAdmin(account.companyName, account.email, account.country)
    })

    return NextResponse.json({
      message: 'Seller registered successfully',
      seller: {
        id: seller.id,
        username: seller.username
      }
    })

  } catch (error) {
    console.error('❌ Error in seller registration:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}