# PPYTECH Financial Dashboard

🚀 A comprehensive financial dashboard application designed for portfolio management, market analysis, and investment tracking. Built with modern web technologies and a focus on user experience and data visualization.

![Dashboard Preview](https://img.shields.io/badge/Status-Production_Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Key Features

### 📊 **Dashboard & Analytics**
- **Portfolio Overview**: Real-time portfolio valuation and performance metrics
- **Asset Management**: Comprehensive asset tracking with allocation breakdowns
- **Market Insights**: Live market data, indices, and sector performance
- **Transaction Monitoring**: Cash flow analysis with inflow/outflow tracking
- **Performance Charts**: Interactive visualizations with Chart.js integration

### 💼 **Lead Management System**
- **Lead Tracking**: Complete CRM functionality for prospect management
- **Channel Analysis**: Multi-source lead attribution and conversion tracking
- **Pipeline Visualization**: Sales funnel analytics and forecasting
- **Contact Management**: Centralized customer relationship management

### 🎯 **Investment Tools**
- **Scheme Analysis**: Mutual fund and investment scheme comparison
- **Risk Assessment**: Portfolio risk metrics and diversification analysis
- **Goal Tracking**: Investment goal setting and progress monitoring
- **Alert System**: Personalized notifications and to-do management

### 🔧 **Technical Features**
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Modern Architecture**: Next.js 14 App Router with server components
- **Type Safety**: Full TypeScript implementation with strict typing
- **Performance Optimized**: Advanced caching, lazy loading, and SSR
- **Accessibility**: WCAG compliant with screen reader support

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.0+
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design system
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/) component library
- **Charts**: [Chart.js](https://www.chartjs.org/) with react-chartjs-2 wrapper
- **Icons**: [Lucide React](https://lucide.dev/) icon library

### **Backend & Data**
- **API Routes**: Next.js API routes with TypeScript
- **Data Layer**: JSON-based data storage with pagination
- **Caching**: In-memory caching with automatic invalidation
- **Validation**: Runtime type checking and data validation

## 🚀 Quick Start

### Prerequisites
- **Node.js**: Version 18.0 or higher
- **npm/yarn/pnpm**: Latest stable version
- **Git**: For version control

### Installation Steps

1. **Clone the repository**:
```bash
git clone https://github.com/your-repo/ppytech-dashboard.git
cd ppytech-dashboard
```

2. **Install dependencies**:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**:
```bash
cp .env.local.example .env.local
```

4. **Configure environment**:
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Start development server**:
```bash
npm run dev
```

6. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Production Deployment

1. **Build for production**:
```bash
npm run build
```

2. **Start production server**:
```bash
npm run start
```

## 📱 Project Structure

```
PPYTECH-Dashboard/
├── app/                           # Next.js 14 App Router
│   ├── api/                       # API Routes
│   │   ├── assets/route.ts        # Assets & portfolio API
│   │   ├── leads/route.ts         # Lead management API
│   │   ├── market-summary/route.ts # Market data API
│   │   └── transactions/route.ts   # Transaction API
│   ├── investors/             # Investor management page
│   │   └── page.tsx           # Investor listing
│   ├── test-pie-chart/        # Chart testing page
│   │   └── page.tsx           # Chart experiments
│   ├── globals.css            # Global styles & Tailwind
│   ├── layout.tsx             # Root layout with sidebar
│   └── page.tsx               # Main dashboard page
├── components/                    # Reusable React components
│   ├── dashboard/             # Dashboard-specific components
│   │   ├── charts/            # Chart components
│   │   │   ├── donut-chart.tsx    # Donut chart implementation
│   │   │   ├── line-chart.tsx     # Line chart implementation
│   │   │   └── pie-chart.tsx      # Pie chart implementation
│   │   ├── asset-*.tsx        # Asset management components
│   │   ├── dashboard-card.tsx # Base card component
│   │   ├── leads-*.tsx        # Lead management components
│   │   ├── market-*.tsx       # Market data components
│   │   ├── stat-card.tsx      # Statistics display cards
│   │   ├── todo-section.tsx   # To-do management
│   │   └── transaction-*.tsx  # Transaction components
│   ├── investors/             # Investor-related components
│   │   ├── investor-card.tsx  # Individual investor card
│   │   ├── investor-filters.tsx # Filtering controls
│   │   └── investor-stats.tsx # Investor statistics
│   ├── navigation/            # Navigation components
│   │   └── sidebar.tsx        # Main navigation sidebar
│   └── ui/                    # shadcn/ui base components
│       ├── alert.tsx          # Alert notifications
│       ├── badge.tsx          # Status badges
│       ├── button.tsx         # Button variants
│       ├── card.tsx           # Card layouts
│       ├── input.tsx          # Input fields
│       ├── select.tsx         # Dropdown selects
│       ├── tabs.tsx           # Tabbed interfaces
│       └── toast.tsx          # Toast notifications
├── lib/                           # Utility functions & helpers
│   ├── api-client.ts          # HTTP client with caching
│   ├── api-validation.ts      # API response validation
│   ├── dashboard-utils.ts     # Dashboard utility functions
│   ├── data-fetching.ts       # Data fetching hooks
│   ├── todo-context.tsx       # Todo state management
│   ├── use-toast.ts          # Toast notification hook
│   └── utils.ts               # Common utility functions
├── public/                        # Static assets
│   └── data/                  # Sample JSON data
│       ├── assets.json        # Portfolio assets data
│       ├── leads.json         # Lead management data
│       ├── market-data.json   # Market information
│       └── transactions.json  # Transaction history
├── types/                         # TypeScript definitions
│   └── index.ts               # Global type definitions
├── docs/                          # Documentation
│   └── performance-optimizations.md # Performance guide
├── components.json               # shadcn/ui configuration
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies & scripts
├── tailwind.config.ts            # Tailwind CSS config
└── tsconfig.json                 # TypeScript configuration
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 API Documentation

### Core Endpoints

#### **Assets API** - `/api/assets`
- **GET**: Retrieve portfolio assets with filtering and pagination
- **Query Parameters**: 
  - `category`: Filter by asset category (Stock, ETF, MutualFund, etc.)
  - `page`: Page number (default: 1)
  - `pageSize`: Items per page (default: 20)
  - `sortBy`: Sort field (totalValue, allocation, performance)
  - `summary`: Return portfolio summary (true/false)

#### **Transactions API** - `/api/transactions`
- **GET**: Retrieve transaction history
- **Query Parameters**:
  - `type`: Transaction type (Buy, Sell, Deposit, Withdrawal)
  - `status`: Transaction status (Completed, Pending, Failed)
  - `startDate` / `endDate`: Date range filters
  - `page`, `pageSize`: Pagination controls

#### **Market Data API** - `/api/market-summary`
- **GET**: Get market indices and performance data
- **Query Parameters**:
  - `symbols`: Comma-separated list of symbols
  - `sector`: Filter by market sector
  - `startDate` / `endDate`: Historical data range

#### **Leads API** - `/api/leads`
- **GET**: Lead management and CRM data
- **Query Parameters**:
  - `status`: Lead status (New, Contacted, Qualified, etc.)
  - `source`: Lead source (Email, Website, Referral, etc.)
  - `analytics`: Return analytics summary (true/false)
  - `search`: Text search across lead fields

### Response Format

All API endpoints return standardized responses:

```json
{
  "success": true,
  "data": {
    "data": [...], // Array of items
    "page": 1,
    "pageSize": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

## 📚 Component Architecture

### Dashboard Components

- **`DashboardCard`**: Base card component with loading states
- **`StatCard`**: Metric display with trend indicators
- **`SectionHeader`**: Consistent section headings with actions
- **`AssetAllocationChart`**: Portfolio allocation visualization
- **`TransactionSnapshot`**: Cash flow analysis summary
- **`LeadsOverview`**: CRM pipeline visualization
- **`MarketOverview`**: Market indices and sector performance

### Chart Components

- **`PieChart`**: Asset allocation and category breakdowns
- **`DonutChart`**: Lead source distribution
- **`LineChart`**: Performance trends over time

### Data Management

- **`ApiClient`**: HTTP client with caching and interceptors
- **`useAssets`**: Asset data fetching hook
- **`useTransactions`**: Transaction data hook
- **`useLeads`**: Lead management hook
- **`useMarketSummary`**: Market data hook

## 🎨 Customization Guide

### Adding New Pages

1. **Create page file**:
```tsx
// app/reports/page.tsx
export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Reports</h1>
      {/* Page content */}
    </div>
  )
}
```

2. **Add to navigation** in `components/navigation/sidebar.tsx`:
```tsx
{
  title: 'Reports',
  href: '/reports',
  icon: FileText,
}
```

### Creating Custom Components

1. **Dashboard components** go in `components/dashboard/`
2. **UI components** use shadcn/ui patterns
3. **Follow naming conventions**: `kebab-case.tsx`

### Theme Customization

**Color Scheme** (`app/globals.css`):
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* Custom dashboard colors */
  --success: 142.1 76.2% 36.3%;
  --warning: 47.9 95.8% 53.1%;
  --danger: 0 84.2% 60.2%;
}
```

**Component Styling**:
- Use Tailwind CSS utility classes
- Follow shadcn/ui design patterns
- Maintain consistent spacing and typography

### Adding shadcn/ui Components

```bash
# Install new components
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add form
```

## 🔧 Performance Optimization

### Built-in Optimizations

- **Server Components**: Automatic SSR for dashboard data
- **Client Caching**: 5-minute cache for API responses
- **Lazy Loading**: Dynamic imports for chart components
- **Image Optimization**: Next.js automatic image optimization
- **Bundle Splitting**: Automatic code splitting by route

### Best Practices

1. **Data Fetching**:
   - Use server components for initial data
   - Implement proper error boundaries
   - Show loading skeletons

2. **State Management**:
   - Minimize client-side state
   - Use React Query for complex data
   - Implement optimistic updates

3. **Component Design**:
   - Keep components small and focused
   - Use TypeScript for type safety
   - Implement proper error handling

## 📊 Data Structure

### Core Types

```typescript
// Asset Management
interface Asset {
  id: string
  name: string
  category: AssetCategory
  totalValue: number
  costBasis: number
  allocation: number
  performance: {
    day: number
    week: number
    month: number
    year: number
  }
}

// Transaction Tracking
interface Transaction {
  id: string
  type: TransactionType
  status: TransactionStatus
  date: string
  total: number
  company?: string
}

// Lead Management
interface Lead {
  id: string
  company: string
  contactName: string
  contactEmail: string
  status: LeadStatus
  source: LeadSource
  potentialValue: number
  createdDate: string
}
```

## 🔧 Configuration Files

- **next.config.js**: Next.js configuration
- **tailwind.config.ts**: Tailwind CSS configuration with custom theme
- **tsconfig.json**: TypeScript compiler options
- **components.json**: shadcn/ui component configuration

## 🔐 Security Considerations

### Data Protection
- All sensitive data should be environment-configured
- API routes include input validation and sanitization
- Client-side data is properly typed and validated
- No hardcoded credentials or API keys in source code

### Best Practices
- Regular dependency updates for security patches
- Environment variable validation on startup
- Proper error handling without data exposure
- CSP headers for XSS protection

## 📦 Deployment Guide

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables
```env
# Required for production
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional
NODE_ENV=production
PORT=3000
```

## 📍 Roadmap & Future Features

### 🎆 Phase 1 (Current)
- [x] Core dashboard functionality
- [x] Asset portfolio management
- [x] Transaction tracking
- [x] Lead management system
- [x] Market data integration
- [x] Responsive design

### 🌟 Phase 2 (Upcoming)
- [ ] Real-time data websockets
- [ ] Advanced charting with zoom & pan
- [ ] Portfolio rebalancing suggestions
- [ ] Risk analysis & stress testing
- [ ] Custom dashboard layouts
- [ ] Mobile app companion

### 🚀 Phase 3 (Future)
- [ ] AI-powered investment insights
- [ ] Multi-tenant architecture
- [ ] Advanced reporting & analytics
- [ ] Third-party integrations
- [ ] White-label solutions
- [ ] API marketplace

## 📝 Documentation Links

- **[Performance Guide](./docs/performance-optimizations.md)**: Optimization strategies
- **[Component Library](./components/README.md)**: Component documentation
- **[API Reference](./docs/api-reference.md)**: Complete API documentation
- **[Deployment Guide](./docs/deployment.md)**: Production deployment

## 🤝 Contributing

We welcome contributions from the community! Here's how to get started:

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/ppytech-dashboard.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/amazing-feature`
5. Make your changes and commit: `git commit -m 'Add amazing feature'`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Contribution Guidelines
- Follow existing code style and conventions
- Add TypeScript types for all new code
- Include unit tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting

### Code of Conduct
Please read our Code of Conduct to understand the standards we expect from our community.

## 🐛 Issues & Support

- **Bug Reports**: Use GitHub Issues with the "bug" label
- **Feature Requests**: Use GitHub Issues with the "enhancement" label
- **Questions**: Start a GitHub Discussion
- **Security Issues**: Email security@ppytech.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎆 Acknowledgments

- **[Next.js Team](https://nextjs.org/)** - Amazing React framework
- **[shadcn](https://twitter.com/shadcn)** - Beautiful UI components
- **[Vercel](https://vercel.com/)** - Seamless deployment platform
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide](https://lucide.dev/)** - Beautiful icon library

---

💼 **PPYTECH Financial Dashboard** - Empowering financial professionals with modern tools and insights.

*Built with precision, designed for performance, crafted for professionals.*
