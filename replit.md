# ToolsUniverse - All-in-One Online Tools Platform

## Overview

ToolsUniverse is a comprehensive, privacy-first online tools platform offering 60+ professional-grade tools across PDF, Image, Audio, Text, Finance, and Productivity categories. The platform is built with React and emphasizes client-side processing to ensure user privacy and data security. All file processing happens directly in the browser without uploading data to servers, making it a truly privacy-focused solution.

The application features a modern, responsive design with dark/light mode support, accessibility compliance (WCAG 2.1 AA), and comprehensive SEO optimization. It includes a hybrid advertising system for monetization while maintaining user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (August 13, 2025)

- Successfully migrated project from Replit Agent to Replit environment
- Installed all required dependencies including tsx and pdfjs-dist
- Fixed tool routing system by mapping all existing components in ToolPage.jsx
- Implemented comprehensive suite of 12 PDF tools and 8 Image tools
- All tools are production-ready with client-side processing for privacy
- Enhanced SEO optimization with proper keywords and meta descriptions
- Tools include advanced features like AI background removal, PDF conversion, watermarking, and professional image filters
- Added proper error handling, file validation, and user feedback systems
- Resolved "tools under construction" errors - all created tools are now accessible

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with functional components and hooks
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Custom component library built on Radix UI primitives
- **State Management**: React hooks with TanStack React Query for server state
- **Build System**: Vite for fast development and optimized production builds
- **Type Safety**: TypeScript configuration for build-time type checking

### Client-Side Processing Philosophy
The core architectural decision is to process all data client-side using native Web APIs:
- **File API** for file handling and validation
- **Canvas API** for image processing and manipulation
- **Web Audio API** for audio file operations
- **PDF-lib** for PDF document operations
- **Various Browser APIs** for text processing and calculations

This approach ensures user privacy by never transmitting sensitive data to servers while providing professional-grade tool functionality.

### Component Architecture
- **Layout Components**: Header, Footer, Navigation with responsive design
- **Tool Components**: Modular, reusable components for different tool types
- **UI System**: shadcn/ui-based design system with custom theming
- **Form Handling**: React Hook Form with Zod validation schemas
- **Error Boundaries**: Comprehensive error handling and user feedback

### SEO and Performance Optimization
- **Structured Data**: JSON-LD schema markup for search engines
- **Meta Tags**: Dynamic meta tag generation for each tool and page
- **Performance**: Lazy loading, code splitting, and optimized asset loading
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### Ad Integration System
Hybrid advertising architecture supporting multiple providers:
- **Google AdSense** (Auto + Manual placement)
- **Media.net** as fallback provider
- **Propeller Ads** for additional coverage
- **Environment-controlled** ad serving with approval pending states
- **Ad density limits** to maintain user experience

## External Dependencies

### Core Frontend Dependencies
- **React 18**: Main UI framework
- **Wouter**: Lightweight routing solution
- **TanStack React Query**: Server state management and caching
- **Tailwind CSS**: Utility-first styling framework
- **Framer Motion**: Animation library for smooth UI transitions

### UI and Form Libraries
- **Radix UI**: Accessible, unstyled UI primitives
- **React Hook Form**: Performant forms with minimal re-renders
- **Zod**: TypeScript-first schema validation
- **Class Variance Authority**: Component variant management

### Backend Infrastructure
- **Express.js**: Node.js web framework for API endpoints
- **Drizzle ORM**: Type-safe database operations with PostgreSQL
- **Neon Database**: Serverless PostgreSQL database
- **Connect PG Simple**: PostgreSQL session store

### Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type checking and enhanced developer experience
- **PostCSS**: CSS processing with Autoprefixer
- **ESBuild**: Fast JavaScript bundler for production builds

### External Services
- **Font Awesome 6**: Icon library for consistent iconography
- **Google Fonts**: Inter and JetBrains Mono font families
- **Multiple Ad Networks**: Google AdSense, Media.net, Propeller Ads
- **CDN Services**: For font and icon delivery

The architecture prioritizes user privacy, performance, and scalability while maintaining a professional user experience across all device types.