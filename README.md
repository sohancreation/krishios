# 🌾 KrishiOS: The Intelligent Farming Operating System

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)

**KrishiOS** is a next-generation, decision-first farming operating system specifically engineered to modernize Bangladeshi agriculture. By integrating AI-driven advisory, comprehensive farm management, and real-time market economics, KrishiOS empowers farmers to transition from traditional methods to data-backed precision agriculture.

---

## 🚀 Vision
To bridge the digital gap in rural agriculture by providing accessible, localized, and intelligent tools that optimize crop yields, reduce waste, and maximize the economic potential of every farm in Bangladesh.

---

## ✨ Core Features

### 🤖 AI-Powered Smart Advisory
*   **Disease Diagnosis**: Instant AI analysis of crop diseases and pest infestations with recommended treatments.
*   **Personalized Cultivation**: Real-time expert advice tailored to local soil composition, weather patterns, and seasonality.

### 🚜 Holistic Farm Management
*   **Multi-Sector Logging**: Specialized management modules for **Crops**, **Livestock**, and **Aquaculture** (Fish Farming).
*   **Predictive Analytics**: Historical data tracking to forecast productivity and identify growth bottlenecks.

### 💰 Agricultural Finance & ERP
*   **Precision Accounting**: Track agricultural specific income and expenses with automated categorization.
*   **Profitability Dashboards**: Visual financial health indicators and ROI analysis for different farm segments.

### 🛒 Integrated Ecosystem
*   **Live Market Intelligence**: Real-time price tracking across major Bangladeshi regional markets to ensure fair trade.
*   **Equipment Hub**: A dedicated marketplace for buying, selling, and renting farming machinery and supplies.

### 🛠️ Smart Utilities
*   **Autonomous Scheduler**: Automated reminders for critical tasks like irrigation, fertilization, and vaccination cycles.
*   **Hyper-Local Weather**: Advanced weather engine providing "Actionable Weather" (specific tasks to do or avoid based on forecast).
*   **Bilingual Accessibility**: Full localized support for **Bangla (বাংলা)** and **English**.

---

## 💻 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui, Lucid Icons |
| **Backend/DB** | Supabase (PostgreSQL), Edge Functions |
| **State Management** | TanStack Query (React Query) |
| **Charts** | Recharts |
| **Forms/Validation** | React Hook Form, Zod |
| **Testing** | Vitest, Testing Library |

---

## 📂 Project Architecture

```text
├── src/
│   ├── components/  # Atomic UI components & shadcn primitives
│   ├── pages/       # High-level route views (Dashboard, Advisory, Marketplace)
│   ├── hooks/       # Custom business logic & Supabase data fetching
│   ├── contexts/    # Global state (Auth, Theme, Localization)
│   ├── lib/         # Utility functions & Supabase client config
│   └── types/       # Global TypeScript interfaces
├── supabase/        # Database migrations & Edge Functions
└── public/          # Static assets & localization files
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- [Bun](https://bun.sh/) or npm

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sohancreation/krishios.git
   cd krishios
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

---

## 🧪 Testing

KrishiOS maintains high code quality standards through unit and integration testing.

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's fixing bugs, adding features, or improving documentation:

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📬 Contact & Support

**Sohan Fardin** - [GitHub Profile](https://github.com/sohanfardin)

Built with ❤️ for the resilient farmers of Bangladesh.
