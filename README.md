# KrishiOS - Smart Farming for Bangladesh 🌾

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)

**KrishiOS** is a comprehensive, decision-first farming operating system designed to empower Bangladeshi farmers with AI-driven insights, advanced farm management tools, and real-time market data. Our mission is to bridge the digital divide in agriculture by providing precision tools to optimize yields and maximize profitability.

---

## 🌟 Key Features

### 🤖 AI Smart Advisory
*   **Instant Consultation**: AI-powered diagnosis for crop diseases and pest management.
*   **Expert Advice**: Real-time cultivation techniques tailored to local soil and climate.

### 📊 Production & Farm Management
*   **Holistic Tracking**: Specialized logs for crops, livestock, and aquaculture (fish farming).
*   **Growth Monitoring**: Historical data analysis to monitor productivity over time.

### 💰 Agricultural Finance
*   **Smart Accounting**: Track specialized agricultural income and expenses.
*   **Profit Analysis**: Insightful dashboards to understand your farm's financial health.

### 📈 Marketplace & Real-time Data
*   **Live Market Prices**: Stay updated with the latest crop prices across different regions in Bangladesh.
*   **Equipment Marketplace**: A dedicated hub for buying and selling farming machinery and supplies.

### 📅 Smart Scheduler & Utility
*   **Task Automation**: Automated reminders for irrigation, fertilization, and vaccination.
*   **Weather Engine**: Hyper-local weather forecasts with actionable "Do's and Don'ts" for farmers.
*   **Bilingual Support**: Fully localized in both **Bangla (বাংলা)** and **English**.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 with Vite |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS & shadcn/ui |
| **Database & Auth** | Supabase (PostgreSQL) |
| **State Management** | TanStack Query (React Query) |
| **Data Visualization** | Recharts |
| **Icons** | Lucide React |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0 or higher
- **Package Manager**: npm, bun, or yarn

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/sohanfardin/krishios.git
    cd krishios
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Launch Development Server**
    ```bash
    npm run dev
    ```

---

## 📂 Project Structure

- `src/components`: Modular UI components built with Radix UI and shadcn.
- `src/pages`: Functional views (Dashboard, Finance, AI Advisory, Marketplace).
- `src/hooks`: Custom React hooks for business logic and Supabase integration.
- `src/contexts`: Global state management for Authentication and Localization.
- `supabase/`: Migration scripts and Edge Functions for backend logic.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Built with ❤️ for the farmers of Bangladesh by **[Sohan Fardin](https://github.com/sohanfardin)**.
