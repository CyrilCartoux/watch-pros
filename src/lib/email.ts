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
      from: 'Watch Pros <onboarding@resend.dev>',
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
  priceUpdate: (listingTitle: string, price: number, currency: string, oldPrice?: number) => ({
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
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/listings" 
             style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            View Listing
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent because you're following this watch on Watch Pros.</p>
          <p>© ${new Date().getFullYear()} Watch Pros. All rights reserved.</p>
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
          <p>This email was sent because you were following this watch on Watch Pros.</p>
          <p>© ${new Date().getFullYear()} Watch Pros. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  newMessage: (sellerName: string, message: string) => ({
    subject: `New Message from ${sellerName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">New Message</h1>
          <p style="color: #7f8c8d; font-size: 16px;">You have received a new message from a seller</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
          <h2 style="color: #2c3e50; margin-top: 0;">From: ${sellerName}</h2>
          <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 20px 0; border: 1px solid #e0e0e0;">
            <p style="color: #2c3e50; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/messages" 
             style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            View Message
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent because you received a new message on Watch Pros.</p>
          <p>© ${new Date().getFullYear()} Watch Pros. All rights reserved.</p>
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
          <p>This email was sent because you received a new offer on Watch Pros.</p>
          <p>© ${new Date().getFullYear()} Watch Pros. All rights reserved.</p>
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
    country: string | null
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
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/listings" 
             style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            View Listing
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent because a new watch matching your search criteria was listed on Watch Pros.</p>
          <p>© ${new Date().getFullYear()} Watch Pros. All rights reserved.</p>
        </div>
      </div>
    `,
  }),
} 

