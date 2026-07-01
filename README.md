# CentWise — MERN Stack Expense Tracker

CentWise is a complete, production-ready, feature-rich financial ledger and overview dashboard designed to track individual cashflow, categorise allocations, monitor monthly transaction trends, and export itemised reports.

---

## 🚀 Key Features

*   **Secure Authentication**: Token-based JSON Web Token (JWT) workflow, password encryption using `bcryptjs`, and automated route guarding.
*   **Transaction Logging**: Full CRUD capability for both Expense (Title, Amount, Category, Payment Method, Date, Description) and Income (Source, Amount, Date, Description) models.
*   **Intuitive Visualisations**: Interactive analytics (Category Pie Chart, Monthly Expenditures Bar Chart, and Income vs. Expense Line Chart) powered by `Recharts`.
*   **Adaptive Query Filters**: Realtime search filtering by text, category type, months, years, custom date ranges, and sorting (by latest date or amount magnitude).
*   **High-fidelity Statement Export**: PDF-optimised reporting module layout allowing instant printing of Daily, Weekly, Monthly, or Yearly summaries.
*   **Customisable Profiles**: Support for altering personal info (names, emails, passwords) and uploading custom profile avatars encoded directly as Base64.
*   **Responsive Dark Mode**: Smooth transition styling fully compatible with light and dark mode preferences.

---

## 🛠️ Technology Stack

*   **Database**: MongoDB with Mongoose ODM schemas.
*   **Server**: Node.js & Express.js framework.
*   **Client**: React.js with Vite builder.
*   **Styling**: Tailwind CSS design system.
*   **Visuals & Alerts**: Recharts graphs and React Hot Toast messages.
*   **Security Protocols**: CORS controls, Helmet header shielding, and rate-limiting blocks.

---

## 📂 Repository Structure

```
.
├── backend/
│   ├── config/              # Mongoose DB connection setup
│   ├── controllers/         # Business logic functions (Auth, Expenses, Incomes, Stats)
│   ├── middleware/          # JWT gatekeep, validations, error middleware
│   ├── models/              # Schema declarations (User, Expense, Income)
│   ├── routes/              # Express Router mappings
│   ├── server.js            # Entry startup script
│   └── package.json         # Node server packages
├── frontend/
│   ├── src/
│   │   ├── components/      # Common components (Sidebar, Navbar, Layout, Modals)
│   │   ├── context/         # React Context states (Auth, Theme)
│   │   ├── pages/           # Pages (Dashboard, Ledger logs, Reports, Profile, Settings)
│   │   ├── services/        # Fetch API connection wrappers
│   │   ├── utils/           # Formatters & helper files
│   │   ├── main.jsx         # App mounting point
│   │   └── index.css        # Tailwind stylesheet import
│   ├── package.json         # React client packages
│   └── vite.config.js       # Vite proxy settings
└── README.md
```

---

## ⚡ Setup and Startup Instructions

### Prerequisites
*   Node.js (v18+)
*   NPM (v9+)
*   MongoDB running locally or a MongoDB Atlas URI string.

### Configuration
1.  Navigate into `backend/` and verify the `.env` settings matching `.env.example`:
    ```
    PORT=5000
    MONGODB_URI=mongodb://127.0.0.1:27017/expense-tracker
    JWT_SECRET=development_secret_key_1234567890_abcdef
    JWT_EXPIRES_IN=7d
    NODE_ENV=development
    ```

### Execution
To install dependencies and boot up both the API server and the React dev client, execute the following from the root directory:

```bash
# 1. Boot up backend
cd backend
npm install
npm run start

# 2. Boot up frontend (in a separate terminal)
cd ../frontend
npm install
npm run dev
```

Visit the app on your browser at `http://localhost:3000`.

---

## 🛡️ Security Measures
*   **Helmet**: Protects against common vulnerabilities (XSS, Clickjacking, MIME-sniffing).
*   **CORS**: Configured safely for cross-origin client resources.
*   **Rate Limiting**: Retrains requests per window to mitigate brute-force attempts.
*   **Bcrypt**: Uses high salting numbers to hash user credentials safely.
