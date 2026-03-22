# 🚀 Release Flow

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-blue?logo=typescript)
![GraphQL](https://img.shields.io/badge/GraphQL-Apollo-E10098?logo=graphql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)

A specialized production-ready **Release Checklist Tool** designed to streamline and automate deployment lifecycles for engineering teams.

> ⚡ Elevate your release precision with real-time tracking, health metrics, and automated step verification.

---

## ✨ Features

### 📋 Release Management
- **Interactive Checklists**: Multi-step deployment workflows with status tracking.
- **Dynamic Dashboard**: KPI overview including Total Releases, Success Rate, and Avg Lead Time.
- **Detailed Health Metrics**: Real-time status badges (DONE, ONGOING, PLANNED) for every deployment.
- **Responsive Navigation**: Seamless switching between Dashboard, Releases, Analytics, and Settings.

### 🌓 Design & UX
- **Stunning Dark Mode**: Premium glassmorphism and vibrant color palettes adapted for both light and dark themes.
- **Custom Branding**: Editable user profiles with auto-generated initials and dynamic logo themes.
- **Fully Responsive**: Optimized for mobile, tablet, and desktop viewports with a functional mobile sidebar.
- **Micro-animations**: Smooth transitions and hover effects for a modern feel.

### ⚙️ Developer Experience
- **Type Safety**: End-to-end TypeScript integration for frontend and backend.
- **Modular Architecture**: Clean separation of concerns between Apollo Server (Backend) and React (Frontend).
- **Persistent State**: Database-backed persistence using Prisma and PostgreSQL.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Vanilla CSS Architecture)
- **API Client:** Apollo Client (GraphQL)

### Backend
- **Server:** Node.js + Express
- **API Engine:** Apollo Server 
- **Database ORM:** Prisma
- **Database:** PostgreSQL

---

## 📂 Folder Structure

```bash
release-flow/
│── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── graphql/
│   │   └── App.tsx
│── backend/           # Node.js + Apollo Server
│   ├── src/
│   │   ├── graphql/
│   │   └── index.ts
│   ├── prisma/        # Database schema
│── docker-compose.yaml
│── README.md
```

---

## ⚙️ Installation

### 1. Clone & Setup
```bash
git clone https://github.com/your-username/release-flow.git
cd release-flow
```

### 2. Backend Config
```bash
cd backend
npm install
# Set up your .env file with DATABASE_URL
npm run prisma:generate
npm run dev
```

### 3. Frontend Config
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🎯 Project Goal

Build a scalable, beautiful, and highly functional release management system that eliminates manual errors and provides clear visibility into deployment progress.

---

## 👨‍💻 Author

**Zakariya Qureshi**  
Full Stack Developer

---

## ⭐ Support

If this tool helps your team release better, give it a ⭐ on GitHub!
