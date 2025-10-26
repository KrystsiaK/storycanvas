# StoryCanvas

**AI-powered interactive storytelling studio for families - where children's imagination comes to life**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-0.73-blue.svg)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)

## 🎨 Overview

StoryCanvas is an innovative mobile application that transforms children's creativity into magical, interactive adventures. Unlike traditional story generators, StoryCanvas is a creative studio where families co-create personalized tales that adapt, respond, and come alive across multiple formats.

### Key Features

- **Creative Character Creation**: Draw your hero, upload photos, or describe characters in detail
- **Interactive Storytelling**: Real-time branching narratives that respond to children's choices
- **Multi-Format Output**: Read, listen, watch, print, or order physical hardcover books
- **Family Co-Creation**: Collaborative creation mode for parents and children
- **Educational Integration**: Vocabulary building, moral lessons, and reading comprehension
- **Multi-Language Support**: Stories in 50+ languages with translation toggle

## 📁 Project Structure

This is a monorepo containing both the mobile app and backend services:

```
storycanvas/
├── apps/
│   ├── mobile/          # React Native mobile application
│   └── backend/         # Node.js backend API
├── packages/
│   └── shared/          # Shared utilities and types
├── docs/                # Documentation and design files
├── .github/
│   └── workflows/       # CI/CD pipelines
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or pnpm
- React Native development environment ([setup guide](https://reactnative.dev/docs/environment-setup))
- PostgreSQL 14+ (for backend)
- Redis (for caching)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KrystsiaK/storycanvas.git
cd storycanvas
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/mobile/.env.example apps/mobile/.env
```

4. Start the backend:
```bash
cd apps/backend
npm run dev
```

5. Start the mobile app:
```bash
cd apps/mobile
npm run ios    # for iOS
npm run android # for Android
```

## 🛠️ Technology Stack

### Mobile App
- **Framework**: React Native 0.73
- **State Management**: Redux Toolkit
- **Data Fetching**: RTK Query
- **UI Components**: React Native Paper + Custom Components
- **Navigation**: React Navigation

### Backend
- **Runtime**: Node.js 20.x
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Job Queue**: RabbitMQ
- **Cache**: Redis
- **AI Services**: OpenAI GPT-4o-mini, DALL-E 3, ElevenLabs

### Infrastructure
- **Cloud**: AWS (EKS, S3, RDS)
- **CDN**: Cloudflare
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry
- **Analytics**: Mixpanel

## 📖 Documentation

Detailed documentation is available in the `docs/` directory:

- [Market Research](docs/market_research.md)
- [Product Concept](docs/product_concept.md)
- [Design Document](docs/design_document.md)
- [Technology Stack](docs/technology_stack.md)
- [API Documentation](docs/api.md) *(coming soon)*
- [Deployment Guide](docs/deployment.md) *(coming soon)*

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Roadmap

### Phase 1: MVP (Months 1-4)
- [x] Market research and concept validation
- [x] Design system and UX flows
- [x] Technology stack selection
- [ ] Core story generation engine
- [ ] Basic mobile app UI
- [ ] User authentication and profiles
- [ ] PDF export functionality

### Phase 2: Enhanced Features (Months 5-8)
- [ ] Draw Your Hero feature
- [ ] Photo-to-character conversion
- [ ] Enhanced interactivity
- [ ] Video story format
- [ ] Physical book ordering

### Phase 3: Advanced Features (Months 9-12)
- [ ] Voice interaction
- [ ] Educator dashboard
- [ ] Advanced analytics
- [ ] International expansion
- [ ] Community features

## 📞 Contact

- **Project Lead**: [Your Name]
- **Email**: [your.email@example.com]
- **Website**: [https://storycanvas.app](https://storycanvas.app) *(coming soon)*

## 🙏 Acknowledgments

- OpenAI for GPT and DALL-E APIs
- ElevenLabs for voice generation
- All contributors and beta testers

---

**Made with ❤️ for families who love stories**

