# PPYTECH Financial Dashboard

A modern financial dashboard application built with Next.js 14, TypeScript, and shadcn/ui components.

## 🚀 Features

- **Modern Stack**: Built with Next.js 14 App Router and TypeScript
- **Beautiful UI**: Powered by shadcn/ui components and Tailwind CSS
- **Data Visualization**: Interactive charts using Chart.js
- **Responsive Design**: Fully responsive layout with mobile-first approach
- **Navigation Sidebar**: Collapsible sidebar with nested navigation
- **Dashboard Analytics**: Real-time financial metrics and portfolio tracking

## 📦 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Chart.js](https://www.chartjs.org/) with react-chartjs-2
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ppytech-dashboard.git
cd ppytech-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```
Edit `.env.local` with your configuration.

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
ppytech-dashboard/
├── app/                    # Next.js App Router pages and layouts
│   ├── layout.tsx         # Root layout with sidebar
│   ├── page.tsx           # Dashboard home page
│   └── globals.css        # Global styles and Tailwind directives
├── components/            # React components
│   ├── navigation/        # Navigation components
│   │   └── sidebar.tsx    # Main sidebar navigation
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions and helpers
│   └── utils.ts          # Common utility functions
├── public/               # Static assets
├── .env.local           # Environment variables (not tracked)
├── .gitignore           # Git ignore file
├── components.json      # shadcn/ui configuration
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Customization

### Adding New Pages

Create new pages in the `app/` directory following Next.js App Router conventions:

```tsx
// app/portfolio/page.tsx
export default function PortfolioPage() {
  return <div>Portfolio Content</div>
}
```

### Installing shadcn/ui Components

Use the shadcn/ui CLI to add new components:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
```

### Modifying Theme

Edit the CSS variables in `app/globals.css` to customize the color scheme:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... other variables */
}
```

## 🔧 Configuration Files

- **next.config.js**: Next.js configuration
- **tailwind.config.ts**: Tailwind CSS configuration with custom theme
- **tsconfig.json**: TypeScript compiler options
- **components.json**: shadcn/ui component configuration

## 📈 Features Roadmap

- [ ] Real-time data integration
- [ ] User authentication system
- [ ] Advanced charting capabilities
- [ ] Portfolio management tools
- [ ] Transaction history
- [ ] Export/Import functionality
- [ ] Dark mode toggle
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Contact

For questions or support, please contact the PPYTECH team at dhruv@ppytech.com

---

Built with ❤️ by PPYTECH
