# Al-Murajaah 📖✨

A modern web application to help users memorize and revise the Quran efficiently. Track progress, set goals, and stay motivated with intelligent spaced repetition and beautiful analytics!

## About

This platform empowers Quran memorizers with the tools and guidance they need to stay vigilant in their memorization journey, ensuring the Quran remains firmly planted in their hearts.

## Features 🌟

- **Track Revisions**: Log daily progress by Juz, Surah, or individual pages
- **Spaced Repetition**: AI-powered smart scheduling that reminds you to review verses at optimal intervals for maximum retention
- **Progress Analytics**: Beautiful dashboards visualizing memorization streaks, completion rates, and goals
- **Visual Progress Tracking**: Track all 30 juz with detailed progress for each surah and page
- **Goal Setting**: Set personalized targets and receive intelligent reminders to stay on track
- **Achievement System**: Stay motivated with daily streaks, badges, and milestones
- **Cloud Sync**: Secure Firebase integration for backing up your progress across devices
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

## Tech Stack 🛠️

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Firebase account (for authentication and data storage)
- Git

## Installation 🚀

1. **Clone the repository**:
   ```bash
   git clone https://github.com/[your-username]/al-murajaah.git
   cd al-murajaah
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
   
   Create a `.env.local` file in the root directory and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**:
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google Sign-In)
3. Create a Firestore database
4. Copy your Firebase configuration values to `.env.local`
5. Set up Firestore security rules (ensure proper authentication and authorization)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── juz/               # Juz-specific pages
│   ├── spaced-review/     # Spaced repetition review
│   ├── profile/           # User profile
│   ├── settings/          # App settings
│   ├── components/        # App-specific components
│   └── lib/               # Utilities and configurations
│       ├── contexts/      # React contexts
│       ├── firebase/      # Firebase configuration
│       ├── data/          # Quran data
│       └── spaced-repetition/ # Spaced repetition logic
├── components/            # Shared components
│   ├── landing/           # Landing page components
│   ├── ui/                # UI primitives
│   └── motion-primitives/ # Animation components
└── lib/                   # Shared utilities
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email almurajaahapp@gmail.com or open an issue in the repository.
