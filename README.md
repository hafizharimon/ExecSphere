# NexLink Hub - Executive Networking Platform

A modern, mobile-first networking platform designed exclusively for C-level executives to connect, collaborate, and elevate their professional relationships.

## 🌟 Features

### 🔐 Advanced Authentication & Verification
- **LinkedIn Integration**: Seamless profile import and verification
- **Multi-Factor Authentication**: Email, SMS, and Aadhaar OTP verification
- **Company Email Verification**: Ensures authentic corporate connections
- **Secure Payment Gateway**: ₹1,000 registration fee with refund policy
- **Super Admin Approval**: Rigorous verification process for quality assurance

### 👥 User Roles & Capabilities

#### **CXO (Executive Users)**
- Smart AI-powered networking and connection recommendations
- Access to exclusive discussion forums and industry insights
- 1:1 messaging with end-to-end encryption
- Mentorship program participation (as mentor or mentee)
- Exclusive webinars, summits, and networking events
- Personal dashboard with analytics and activity tracking

#### **Mentors**
- Comprehensive mentor dashboard with session management
- Flexible fee setting with Super Admin-defined maximums
- Progress tracking and mentee analytics
- Q&A vault for knowledge sharing
- Session scheduling and calendar integration
- Revenue tracking and payment management

#### **Admin/Moderator**
- User verification and approval workflows
- Real-time activity monitoring and moderation tools
- Event management and content curation
- Analytics and reporting dashboard
- Community guidelines enforcement
- Support ticket management

#### **Super Admin (Platform Owner)**
- Complete platform analytics and insights
- Revenue and billing management
- Service provider curation and partnerships
- Role and permission management
- System-wide announcement capabilities
- Advanced security and compliance monitoring

### 🎨 Modern Design System
- **Travel App-Inspired UI**: Clean, modern interface with blue gradient themes
- **Mobile-First Responsive**: Optimized for all devices and screen sizes
- **Dark/Light Theme Support**: Automatic theme switching with user preferences
- **Glass Effects & Animations**: Smooth transitions and modern visual effects
- **Horizontal Scrolling Navigation**: Intuitive mobile navigation patterns
- **Stable Footer Navigation**: Quick access to key features

### 💰 Multi-Currency Support
Support for 10+ major currencies including:
- INR (Indian Rupee) - Primary
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- JPY (Japanese Yen)
- AUD (Australian Dollar)
- CAD (Canadian Dollar)
- SGD (Singapore Dollar)
- CNY (Chinese Yuan)
- AED (UAE Dirham)

### 🔒 Security & Privacy
- End-to-end encrypted messaging
- GDPR compliant data handling
- Multi-layer authentication system
- Secure payment processing
- Regular security audits and updates
- Privacy-first design principles

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser with JavaScript enabled
- Valid LinkedIn profile for registration
- Company email address for verification

### Demo Access
For testing purposes, use these credentials:
- **Email**: test@demo.com
- **OTP Format**: AZ47E5 (2 letters + 2 numbers + 1 letter + 1 number)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-org/nexlink-hub.git
   cd nexlink-hub
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Configure the following variables:
   \`\`\`env
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   
   # Database
   DATABASE_URL=your-database-url
   
   # Payment Gateway
   RAZORPAY_KEY_ID=your-razorpay-key
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   
   # Email Service
   SMTP_HOST=your-smtp-host
   SMTP_PORT=587
   SMTP_USER=your-email
   SMTP_PASS=your-password
   
   # SMS Service
   SMS_API_KEY=your-sms-api-key
   SMS_API_SECRET=your-sms-secret
   
   # LinkedIn OAuth
   LINKEDIN_CLIENT_ID=your-linkedin-client-id
   LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
   \`\`\`

4. **Set up the database**
   \`\`\`bash
   npm run db:setup
   npm run db:seed
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Mobile Experience

NexLink Hub is designed with a mobile-first approach:

- **Responsive Design**: Seamlessly adapts to all screen sizes
- **Touch-Optimized**: Intuitive gestures and interactions
- **Fast Loading**: Optimized performance for mobile networks
- **Offline Support**: Basic functionality available offline
- **Progressive Web App**: Install as a native app experience

## 🛠 Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Modern component library
- **Framer Motion**: Smooth animations
- **React Hook Form**: Form management
- **Zustand**: State management

### Backend & Database
- **Next.js API Routes**: Serverless backend
- **Prisma**: Database ORM
- **PostgreSQL**: Primary database
- **Redis**: Caching and sessions
- **NextAuth.js**: Authentication system

### External Services
- **Razorpay**: Payment processing
- **Twilio**: SMS services
- **SendGrid**: Email services
- **LinkedIn API**: Profile integration
- **Aadhaar API**: Identity verification

## 🔧 Development

### Project Structure
\`\`\`
nexlink-hub/
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── hooks/                 # Custom React hooks
├── context/              # React context providers
├── types/                # TypeScript type definitions
├── public/               # Static assets
└── prisma/               # Database schema and migrations
\`\`\`

### Key Commands
\`\`\`bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema changes
npm run db:migrate      # Run migrations
npm run db:seed         # Seed database

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # TypeScript checking
npm run format          # Format with Prettier
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Manual Deployment
\`\`\`bash
npm run build
npm run start
\`\`\`

## 📊 Analytics & Monitoring

- **User Engagement**: Track connection rates and platform usage
- **Revenue Analytics**: Monitor subscription and payment metrics
- **Performance Monitoring**: Real-time application performance
- **Security Auditing**: Continuous security monitoring
- **User Feedback**: Integrated feedback and support systems

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.nexlinkhub.com](https://docs.nexlinkhub.com)
- **Community Forum**: [community.nexlinkhub.com](https://community.nexlinkhub.com)
- **Email Support**: support@nexlinkhub.com
- **Emergency Contact**: +91-XXXX-XXXX-XX

## 🗺 Roadmap

### Q1 2024
- [ ] Advanced AI matching algorithms
- [ ] Video conferencing integration
- [ ] Mobile app development (iOS/Android)
- [ ] Advanced analytics dashboard

### Q2 2024
- [ ] International expansion
- [ ] Multi-language support
- [ ] Advanced security features
- [ ] Enterprise partnerships

### Q3 2024
- [ ] Blockchain integration for credentials
- [ ] Advanced mentorship matching
- [ ] Industry-specific forums
- [ ] API for third-party integrations

---

**NexLink Hub** - Connecting the world's most influential business leaders.

*Built with ❤️ for the executive community*
