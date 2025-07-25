import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export type EmailTemplate = {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailTemplate) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Watch Pros® <notifications@watch-pros.com>',
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// Templates d'emails
export const emailTemplates = {
  priceUpdate: (listingTitle: string, price: number, currency: string, oldPrice?: number, listingId?: string) => ({
    subject: `Price Update: ${listingTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">Price Update Alert</h1>
          <p style="color: #7f8c8d; font-size: 16px;">We've detected a price change for a watch you're following</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
          <h2 style="color: #2c3e50; margin-top: 0;">${listingTitle}</h2>
          ${oldPrice ? `
            <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin: 20px 0;">
              <div style="text-align: center;">
                <p style="color: #7f8c8d; margin: 0;">Old Price</p>
                <p style="font-size: 20px; color: #e74c3c; text-decoration: line-through; margin: 5px 0;">${oldPrice.toLocaleString()} ${currency}</p>
              </div>
              <div style="font-size: 24px; color: #7f8c8d;">→</div>
              <div style="text-align: center;">
                <p style="color: #7f8c8d; margin: 0;">New Price</p>
                <p style="font-size: 24px; color: #27ae60; font-weight: bold; margin: 5px 0;">${price.toLocaleString()} ${currency}</p>
              </div>
            </div>
          ` : `
            <p style="font-size: 24px; color: #27ae60; font-weight: bold; margin: 20px 0;">
              ${price.toLocaleString()} ${currency}
            </p>
          `}
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/listings/${listingId}" 
             style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            View Listing
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent because you're following this watch on Watch Pros®.</p>
          <p>© ${new Date().getFullYear()} Watch Pros®. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  listingSold: (listingTitle: string) => ({
    subject: `Watch Sold: ${listingTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">Watch Sold Notification</h1>
          <p style="color: #7f8c8d; font-size: 16px;">A watch you were following has been sold</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
          <h2 style="color: #2c3e50; margin-top: 0;">${listingTitle}</h2>
          <p style="font-size: 20px; color: #e74c3c; margin: 20px 0;">
            This watch has been sold
          </p>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/listings" 
             style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            View Similar Listings
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent because you were following this watch on Watch Pros®.</p>
          <p>© ${new Date().getFullYear()} Watch Pros®. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  newMessage: (sellerName: string, message: string, listingDetails?: any) => ({
    subject: `New Message from ${sellerName}${listingDetails ? ` - ${listingDetails.title}` : ''}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">New Message</h1>
          <p style="color: #7f8c8d; font-size: 16px;">You have received a new message from a seller</p>
        </div>
        
        ${listingDetails ? `
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 15px;">About this listing:</h3>
            <div style="display: flex; gap: 15px; align-items: center;">
              <div style="width: 80px; height: 80px; background-color: #e0e0e0; border-radius: 6px; overflow: hidden;">
                <img src="${listingDetails.listing_images?.[0]?.url || `${process.env.NEXT_PUBLIC_APP_URL}/api/listings/${listingDetails.id}/image`}" 
                     alt="${listingDetails.title}" 
                     style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <div style="flex: 1;">
                <h4 style="color: #2c3e50; margin: 0 0 5px 0; font-size: 16px;">${listingDetails.title}</h4>
                <p style="color: #7f8c8d; margin: 0 0 5px 0; font-size: 14px;">${listingDetails.brand?.label} • ${listingDetails.model?.label}</p>
                <p style="color: #27ae60; font-weight: bold; margin: 0; font-size: 18px;">${listingDetails.price.toLocaleString()} ${listingDetails.currency}</p>
              </div>
            </div>
          </div>
        ` : ''}
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
          <h2 style="color: #2c3e50; margin-top: 0;">From: ${sellerName}</h2>
          <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 20px 0; border: 1px solid #e0e0e0;">
            <p style="color: #2c3e50; margin: 0; white-space: pre-wrap; line-height: 1.5;">${message}</p>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/account?tab=messages" 
             style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            View Message
          </a>
          ${listingDetails ? `
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/listings/${listingDetails.id}" 
               style="background-color: #27ae60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; margin-left: 10px;">
              View Listing
            </a>
          ` : ''}
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent because you received a new message on Watch Pros®.</p>
          <p>© ${new Date().getFullYear()} Watch Pros®. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  offerReceived: (listingTitle: string, offerAmount: number, currency: string) => ({
    subject: `New Offer Received: ${listingTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">New Offer Received</h1>
          <p style="color: #7f8c8d; font-size: 16px;">You have received a new offer for one of your listings</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
          <h2 style="color: #2c3e50; margin-top: 0;">${listingTitle}</h2>
          <p style="font-size: 24px; color: #27ae60; font-weight: bold; margin: 20px 0;">
            ${offerAmount.toLocaleString()} ${currency}
          </p>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/offers" 
             style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            View Offer
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent because you received a new offer on Watch Pros®.</p>
          <p>© ${new Date().getFullYear()} Watch Pros®. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  offerAccepted: (listingTitle: string, offerAmount: number, currency: string, listingId: string) => ({
    subject: `Your Offer Has Been Accepted: ${listingTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">Offer Accepted!</h1>
          <p style="color: #7f8c8d; font-size: 16px;">Great news! Your offer has been accepted</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
          <h2 style="color: #2c3e50; margin-top: 0;">${listingTitle}</h2>
          <p style="font-size: 24px; color: #27ae60; font-weight: bold; margin: 20px 0;">
            ${offerAmount.toLocaleString()} ${currency}
          </p>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/listings/${listingId}" 
             style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            View Details
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent because your offer was accepted on Watch Pros®.</p>
          <p>© ${new Date().getFullYear()} Watch Pros®. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  offerDeclined: (listingTitle: string, offerAmount: number, currency: string, listingId: string) => ({
    subject: `Your Offer Has Been Declined: ${listingTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #e74c3c; margin-bottom: 10px;">Offer Declined</h1>
          <p style="color: #7f8c8d; font-size: 16px;">Unfortunately, your offer has been declined by the seller.</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
          <h2 style="color: #2c3e50; margin-top: 0;">${listingTitle}</h2>
          <p style="font-size: 24px; color: #e74c3c; font-weight: bold; margin: 20px 0;">
            ${offerAmount.toLocaleString()} ${currency}
          </p>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/listings/${listingId}" 
             style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            View Listing
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent because your offer was declined on Watch Pros®.</p>
          <p>© ${new Date().getFullYear()} Watch Pros®. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  newWatchMatch: (
    brandName: string,
    modelName: string,
    title: string,
    reference: string,
    description: string | null,
    year: string | null,
    price: number,
    currency: string,
    condition: string | null,
    included: string | null,
    country: string | null,
    listingId: string
  ) => ({
    subject: `New Watch Match: ${brandName} ${modelName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">New Watch Match!</h1>
          <p style="color: #7f8c8d; font-size: 16px;">A new watch matching your search criteria has been listed</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
          <h2 style="color: #2c3e50; margin-top: 0;">${brandName} ${modelName}</h2>
          <p style="font-size: 18px; color: #34495e; margin: 10px 0;">${title}</p>
          <p style="font-size: 16px; color: #7f8c8d; margin: 5px 0;">Reference: ${reference}</p>
          ${year ? `<p style="font-size: 16px; color: #7f8c8d; margin: 5px 0;">Year: ${year}</p>` : ''}
          ${condition ? `<p style="font-size: 16px; color: #7f8c8d; margin: 5px 0;">Condition: ${condition}</p>` : ''}
          ${included ? `<p style="font-size: 16px; color: #7f8c8d; margin: 5px 0;">Included: ${included}</p>` : ''}
          ${country ? `<p style="font-size: 16px; color: #7f8c8d; margin: 5px 0;">Location: ${country}</p>` : ''}
          
          <div style="margin: 20px 0; padding: 15px; background-color: white; border-radius: 4px; border: 1px solid #e0e0e0;">
            <p style="font-size: 24px; color: #27ae60; font-weight: bold; margin: 0;">
              ${price.toLocaleString()} ${currency}
            </p>
          </div>

          ${description ? `
            <div style="margin-top: 20px; padding: 15px; background-color: white; border-radius: 4px; border: 1px solid #e0e0e0;">
              <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 10px;">Description</h3>
              <p style="color: #34495e; margin: 0; white-space: pre-wrap;">${description}</p>
            </div>
          ` : ''}
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/listings/${listingId}" 
             style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            View Listing
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent because a new watch matching your search criteria was listed on Watch Pros®.</p>
          <p>© ${new Date().getFullYear()} Watch Pros®. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  sellerVerified: (companyName: string) => ({
    subject: `Your Watch Pros® Account Has Been Verified`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">Account Verified!</h1>
          <p style="color: #7f8c8d; font-size: 16px;">Congratulations! Your Watch Pros® seller account has been verified</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
          <h2 style="color: #2c3e50; margin-top: 0;">${companyName}</h2>
          <p style="font-size: 16px; color: #34495e; margin: 20px 0;">
            Your account has been successfully verified. You can now start listing watches and managing your inventory on Watch Pros®.
          </p>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/" 
             style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            Visit website
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent because your Watch Pros® seller account has been verified.</p>
          <p>© ${new Date().getFullYear()} Watch Pros®. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  sellerRejected: (companyName: string, reason: string) => ({
    subject: `Watch Pros® Account Verification Update`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">Account Verification Update</h1>
          <p style="color: #7f8c8d; font-size: 16px;">Your Watch Pros® seller account verification requires additional attention</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
          <h2 style="color: #2c3e50; margin-top: 0;">${companyName}</h2>
          <p style="font-size: 16px; color: #34495e; margin: 20px 0;">
            We have reviewed your account verification request and need additional information or clarification.
          </p>
          <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 20px 0; border: 1px solid #e0e0e0;">
            <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 10px;">Reason for Rejection:</h3>
            <p style="color: #34495e; margin: 0; white-space: pre-wrap;">${reason}</p>
          </div>
          <p style="font-size: 16px; color: #34495e;">
            Please address these concerns and resubmit your verification request. If you have any questions, please don't hesitate to contact our support team.
          </p>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/register" 
             style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            Register again
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent regarding your Watch Pros® seller account verification.</p>
          <p>© ${new Date().getFullYear()} Watch Pros®. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  sellerReviewReceived: (reviewerName: string, rating: number, comment: string, sellerId: string) => ({
    subject: `New Review Received`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">You received a new review!</h1>
          <p style="color: #7f8c8d; font-size: 16px;">A new review has been posted on your seller profile.</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
          <h2 style="color: #2c3e50; margin-top: 0;">From: ${reviewerName}</h2>
          <p style="font-size: 18px; color: #34495e; margin: 10px 0;">Rating: <b>${rating} / 5</b></p>
          <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 20px 0; border: 1px solid #e0e0e0;">
            <p style="color: #2c3e50; margin: 0; white-space: pre-wrap;">${comment}</p>
          </div>
        </div>
        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/sellers/${sellerId}" 
             style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            View your profile
          </a>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent because you received a new review on Watch Pros®.</p>
          <p>© ${new Date().getFullYear()} Watch Pros®. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  sellerRegistrationAdmin: (companyName: string, email: string, country: string) => ({
    subject: `New Seller Registration: ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">New Seller Registration</h1>
          <p style="color: #7f8c8d; font-size: 16px;">A new seller has just registered on Watch Pros®.</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
          <h2 style="color: #2c3e50; margin-top: 0;">${companyName}</h2>
          <p style="font-size: 16px; color: #34495e; margin: 10px 0;">Email: <a href="mailto:${email}">${email}</a></p>
          <p style="font-size: 16px; color: #34495e; margin: 10px 0;">Country: ${country}</p>
        </div>
        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" 
             style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            Review Seller Applications
          </a>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent to notify you of a new seller registration on Watch Pros®.</p>
          <p>© ${new Date().getFullYear()} Watch Pros®. All rights reserved.</p>
        </div>
      </div>
    `
  }),
} 

