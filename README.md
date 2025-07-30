# CareplusHMS - Electronic Medical Records System

A comprehensive Hospital Management System (HMS) built with Next.js 15, featuring role-based access control, appointment management, medical records, and patient care workflows.

## 🏥 Features

### Multi-Role System

- **Admin**: Complete system management, analytics, and oversight
- **Doctor**: Patient management, appointments, clinical notes, and medical records
- **Patient**: Appointment booking, medical history viewing, and profile management
- **Nurse**: Patient care and support functions
- **Lab Technician**: Laboratory test management
- **Cashier**: Payment and billing management

### Core Functionality

- **Appointment Management**: Schedule, reschedule, and track appointments
- **Medical Records**: Comprehensive patient medical history and clinical notes
- **Billing & Payments**: Integrated payment processing and billing management
- **Patient Portal**: Self-service appointment booking and medical history access
- **Analytics Dashboard**: Real-time statistics and performance metrics
- **Staff Management**: Complete staff directory and profile management

### Technical Features

- **Authentication**: Secure role-based authentication with Clerk
- **Database**: PostgreSQL with Prisma ORM
- **UI/UX**: Modern, responsive design with Tailwind CSS and Radix UI
- **Real-time Updates**: Live appointment status and notifications
- **File Management**: Medical document upload and storage
- **Search & Filter**: Advanced search capabilities across all modules

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account for authentication

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Electronic-Medical-App-main
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/careplus_hms"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push

   # Seed the database with sample data
   npx prisma db seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
Electronic-Medical-App-main/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (protected)/       # Role-based protected routes
│   │   ├── admin/         # Admin dashboard
│   │   ├── doctor/        # Doctor dashboard
│   │   ├── patient/       # Patient portal
│   │   └── record/        # Medical records management
│   ├── actions/           # Server actions
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── charts/           # Data visualization
│   ├── forms/            # Form components
│   ├── tables/           # Data tables
│   └── ui/               # Base UI components
├── lib/                  # Utility libraries
├── prisma/               # Database schema and migrations
├── types/                # TypeScript type definitions
└── utils/                # Helper functions and services
```

This comprehensive README provides:

1. **Clear project overview** - Explains what CareplusHMS is and its main features
2. **Detailed feature list** - Covers all the major functionality including multi-role system
3. **Complete setup instructions** - Step-by-step installation and configuration
4. **Project structure** - Clear organization of the codebase
5. **Tech stack details** - All technologies and libraries used
6. **Deployment instructions** - Ready for production deployment
7. **Contributing guidelines** - For open source collaboration

The README is structured to be helpful for both developers who want to contribute and stakeholders who want to understand the system's capabilities.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 🔐 Authentication & Authorization

The system uses Clerk for authentication with role-based access control:

- **Admin**: Full system access
- **Doctor**: Patient management and medical records
- **Patient**: Personal appointments and medical history
- **Staff**: Role-specific permissions

## 📊 Database Schema

The application uses a comprehensive database schema including:

- **Patients**: Complete patient profiles and medical history
- **Doctors**: Staff profiles and specializations
- **Appointments**: Scheduling and status tracking
- **Medical Records**: Clinical notes and diagnoses
- **Payments**: Billing and payment processing
- **Ratings**: Patient feedback system

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables

Ensure all required environment variables are set in your deployment platform:

- `DATABASE_URL`
- `CLERK_SECRET_KEY`
- `CLERK_PUBLISHABLE_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `/docs` folder

## Version History

- **v0.1.0**: Initial release with core HMS functionality
- Multi-role authentication system
- Appointment management
- Medical records system
- Patient portal
- Admin dashboard with analytics

---

**CareplusHMS** - Streamlining healthcare management with modern technology.
