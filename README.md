# FlowGateX - Event Management Platform

A modern, feature-rich event management web application built with React, featuring real-time IoT integrations, multi-role support, and a seamless booking experience.

## 🚀 Features

- **Event Discovery & Booking**: Browse, search, and book events with ease
- **Multi-Role Support**: Separate dashboards for Attendees, Organizers, and Admins
- **QR Ticketing**: Digital tickets with QR codes for easy check-in
- **Real-time Analytics**: Live event performance tracking with charts
- **IoT Integration**: Smart entry gates and crowd monitoring
- **AI Chatbot**: 24/7 customer support assistant
- **Payment Processing**: Secure payments via Stripe/Razorpay
- **PWA Support**: Installable as a progressive web app

## 📁 Project Structure

```
flowgatex/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Buttons, Cards, Modals, etc.
│   │   ├── layout/        # Header, Footer, Sidebar
│   │   └── forms/         # Form components
│   ├── features/          # Feature modules
│   │   ├── auth/          # Authentication
│   │   ├── events/        # Event management
│   │   ├── booking/       # Booking system
│   │   ├── payment/       # Payment processing
│   │   ├── analytics/     # Analytics & reporting
│   │   ├── iot/           # IoT integration
│   │   ├── crowdMonitoring/
│   │   ├── chatbot/       # AI chatbot
│   │   └── admin/         # Admin utilities
│   ├── pages/             # Page components
│   │   ├── common/        # Public pages
│   │   ├── user/          # User dashboard pages
│   │   ├── organizer/     # Organizer pages
│   │   └── admin/         # Admin pages
│   ├── hooks/             # Custom React hooks
│   ├── context/           # React Context providers
│   ├── store/             # Redux store configuration
│   ├── services/          # API & WebSocket services
│   ├── routes/            # Routing configuration
│   ├── utils/             # Utility functions
│   ├── styles/            # Global styles
│   ├── config/            # App configuration
│   ├── App.jsx            # Root component
│   └── main.jsx           # Entry point
├── .env                   # Environment variables
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies
```

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Forms**: Formik + Yup
- **HTTP Client**: Axios
- **WebSocket**: Socket.io Client
- **Charts**: ApexCharts
- **UI Libraries**: Material Icons, Animate.css

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Mekeshkumar/FlowgateX.git
cd FlowgateX
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your configuration (see `.env` template)

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## 🔐 Environment Variables

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WEBSOCKET_URL=ws://localhost:5000
VITE_AUTH_TOKEN_KEY=flowgatex_auth_token
VITE_STRIPE_PUBLIC_KEY=your-stripe-key
VITE_ENABLE_CHATBOT=true
VITE_ENABLE_IOT=true
```

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
