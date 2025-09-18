# Hair Dye Diary

A beautiful, interactive digital journal for tracking your hair coloring journey. Built with Next.js and featuring a unique notebook-style interface with realistic page-flipping animations.

## Features

- **Digital Logbook**: Record detailed hair dye sessions with formulas, processing times, and notes
- **Formula Tracking**: Document color ratios, developer volumes, and shade combinations
- **Photo Documentation**: Upload before and after photos for each session
- **Interactive Notebook**: Desktop users enjoy a realistic book interface with 3D page-flip animations
- **Mobile Responsive**: Optimized single-page view for mobile devices
- **Local Storage**: All data is stored locally in your browser - no account required
- **Entry Management**: Edit or delete past entries with confirmation dialogs

## What You Can Track

- **Hair Color Formulas**: Multiple shade combinations with precise ratios
- **Developer Information**: Volume and amount used
- **Processing Time**: How long the color was left on
- **Personal Notes**: Results, observations, and future adjustments
- **Visual Progress**: Before and after photos
- **Date Tracking**: Chronological organization of all sessions

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to [http://localhost:3000](http://localhost:3000)

4. **Start tracking** your hair color journey by clicking the "+" button to add your first entry

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Turbopack

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── entry-form.tsx      # Form for creating/editing entries
│   │   ├── logbook-page.tsx    # Individual page component
│   │   ├── page-flip.tsx       # 3D page flip animations
│   │   └── page-navigation.tsx # Navigation controls
│   ├── logbook/
│   │   └── page.tsx           # New entry creation page
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main diary view
└── components/
    └── ui/                    # Reusable UI components
```

## Development

- **Lint**: `npm run lint`
- **Build**: `npm run build`
- **Start**: `npm start`

## Data Storage

All entries are stored in your browser's local storage, ensuring privacy and eliminating the need for user accounts. Your data remains completely private and accessible only to you.
