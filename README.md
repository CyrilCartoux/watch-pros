# Watch Pros - Luxury Watch Marketplace

Watch Pros is a modern, secure, and user-friendly marketplace for buying and selling luxury watches. Built with Next.js, TypeScript, and PostgreSQL, it provides a seamless experience for both buyers and sellers in the luxury watch market.

## 🌟 Features

- **User Authentication & Authorization**
  - Secure login and registration system
  - Role-based access control (Buyers, Sellers, Admins)
  - Protected routes and API endpoints

- **Marketplace Features**
  - Browse and search luxury watches
  - Advanced filtering and sorting options
  - Detailed watch listings with high-quality images
  - Real-time price updates and notifications
  - Secure messaging system between buyers and sellers

- **Seller Dashboard**
  - Manage listings and inventory
  - Track sales and analytics
  - Handle customer inquiries
  - Manage business profile and settings

- **Buyer Features**
  - Save favorite watches
  - Price alerts and notifications
  - Make offers and negotiate prices
  - Secure payment processing

## 🛠 Tech Stack

- **Frontend**
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui Components
  - React Query
  - Zustand (State Management)

- **Backend**
  - Next.js API Routes
  - PostgreSQL
  - Prisma ORM
  - Supabase Auth

- **Infrastructure**
  - Vercel (Hosting)
  - Supabase (Database & Auth)
  - AWS S3 (Image Storage)
  - Cloudflare (CDN)

## 📦 Database Schema

The application uses a PostgreSQL database with the following main tables:

### Core Tables
- `brands`: Luxury watch brands
- `models`: Watch models associated with brands
- `listings`: Watch and accessory listings
- `listing_images`: Images associated with listings
- `sellers`: Seller profiles and information
- `seller_addresses`: Seller address information

### Key Relationships
- Listings belong to brands and models
- Sellers can have multiple listings
- Each listing can have multiple images
- Sellers can have multiple addresses and banking information

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Supabase account
- AWS account (for S3)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/watch-pros.git
cd watch-pros
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/watch_pros"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AWS
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
```

## 📝 API Documentation

The API is built using Next.js API routes and follows RESTful principles. Key endpoints include:

- `/api/auth/*` - Authentication endpoints
- `/api/listings/*` - Listing management
- `/api/sellers/*` - Seller profile management
- `/api/brands/*` - Brand information
- `/api/models/*` - Model information

## 🔒 Security

- Authentication handled by Supabase
- Secure password hashing
- CSRF protection
- Rate limiting
- Input validation
- Secure file uploads
- HTTPS enforcement

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

## 📈 Performance Optimization

- Image optimization with Next.js Image component
- Server-side rendering for SEO
- Static page generation where possible
- Database query optimization
- CDN integration for static assets
- Caching strategies

## 🌐 Internationalization

The application supports multiple languages:
- English (default)
- French

## 📱 Responsive Design

- Mobile-first approach
- Responsive layouts
- Touch-friendly interfaces
- Optimized for all device sizes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- [Your Name] - Lead Developer
- [Team Member 2] - Frontend Developer
- [Team Member 3] - Backend Developer
- [Team Member 4] - UI/UX Designer

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
