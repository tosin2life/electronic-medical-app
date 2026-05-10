# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Healthcare Management System (HMS) built with Next.js 15, TypeScript, Prisma, PostgreSQL, and Clerk authentication. The system handles patients, doctors, appointments, medical records, billing, and staff management.

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database
- **ORM**: Prisma with PostgreSQL
- **Seed**: `npm run prisma:seed` (uses `tsx prisma/seed.ts`)
- **Schema**: `prisma/schema.prisma` - Contains comprehensive healthcare data models
- **Key Models**: Patient, Doctor, Staff, Appointment, MedicalRecords, Payment, LabTest, VitalSigns, Diagnosis

## Architecture

### Authentication & Authorization
- **Clerk**: Used for authentication with role-based access
- **Roles**: ADMIN, NURSE, DOCTOR, LAB_TECHNICIAN, PATIENT, CASHIER
- **Protected Routes**: All main functionality under `app/(protected)/`

### Database Schema Structure
- **Patients**: Core entity with medical history, insurance, emergency contacts
- **Doctors**: Specialists with working schedules, departments, availability
- **Appointments**: Scheduling system with status tracking, linked to payments and medical records
- **Medical Records**: Treatment plans, prescriptions, lab requests, linked to diagnoses and vital signs
- **Billing**: Payment tracking with multiple services, receipt generation
- **Audit Logging**: Track all user actions for compliance

### Key Directories
- `app/` - Next.js App Router with layout and page components
- `app/(protected)/` - Protected routes requiring authentication
- `components/` - Reusable UI components (appointments, medical history, ratings, etc.)
- `lib/` - Core utilities (database connection, schemas, routes, Clerk utilities)
- `utils/` - Helper functions for roles, settings, services
- `prisma/` - Database schema and seeding

### UI Framework
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI primitives
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner for toast messages

### Key Features
- Multi-role dashboard system
- Appointment scheduling and management
- Medical records with vital signs and diagnosis tracking
- Prescription management
- Lab test integration
- Billing and payment processing
- Patient rating system
- Audit logging for compliance