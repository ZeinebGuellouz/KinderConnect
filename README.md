# KinderConnect

A modern kindergarten management system that helps parents stay connected with their child's educational journey.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZeinebGuellouz/KinderConnect.git
   cd KinderConnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   └── *.tsx         # Custom components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and configurations
│   ├── pages/            # Page components
│   └── main.tsx          # Application entry point
├── server/                # Backend Express server
│   ├── routes/           # API route handlers
│   └── index.ts          # Server entry point
├── shared/                # Shared types and utilities
└── public/               # Static assets
```

## 🛠️ Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build locally
- **`npm run test`** - Run tests


## 🎨 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **React Query** for data fetching
- **React Hook Form** for form management

### Backend
- **Express.js** with TypeScript
- **Zod** for schema validation

### Development Tools
- **TypeScript** for type safety
- **Prettier** for code formatting
- **Vitest** for testing

## 🔧 Development

### Running the Application

1. **Development mode** :
   ```bash
   npm run dev
   ```

2. **Production build**:
   ```bash
   npm run build
   npm run preview
   ```


## 🌐 Features

- **Attendance Tracking** - Monitor child's attendance with detailed reports
- **Event Management** - View and manage kindergarten events
- **One-Tap Reporting** - Quick absence reporting system
- **Smart Notifications** - Real-time updates and announcements
- **Multilingual Support** - News and updates in multiple languages
- **Contract Management** - Request and track contract modifications

## 📱 User Roles

- **Parents** - Access portal, track attendance, manage events
- **Admin** - Create evenets , receives absence info

## 🔗 Key Routes

- `/` - Landing page
- `/login` - Parent sign-in
- `/dashboard` - Parent dashboard
- `/admin` - Admin panel
- `/events` - Event management
- `/contact` - Contact information

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: If port 5173 is in use, Vite will automatically try another port
2. **Package manager**: This project supports both npm and pnpm
3. **TypeScript errors**: Run `npm run typecheck` to identify issues


## 📦 Package Management

This project is configured to work with both npm and pnpm. The `packageManager` field in `package.json` specifies pnpm, but npm commands work as well.

---

**Happy coding! 🎉**
