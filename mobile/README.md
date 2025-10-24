# AI Journal Mobile App

Simple React Native mobile app built with Expo featuring bottom tab navigation.

## Features

- **Dashboard Screen**: View your journal entries and stats
- **New Entry Screen**: Write new journal entries
- **Bottom Tab Navigation**: Easy navigation between screens
- **Clean UI**: Calming, journaling-focused design

## Setup & Installation

### Prerequisites
- Node.js 18+
- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Install Dependencies

```bash
cd mobile
npm install
```

### Run the App

```bash
# Start Expo dev server
npm start

# Or run directly on Android
npm run android

# Or run directly on iOS (Mac only)
npm run ios
```

### Test on Your Phone

1. Run `npm start`
2. Open **Expo Go** app on your phone
3. Scan the QR code that appears in your terminal
4. App will load on your phone!

## Project Structure

```
mobile/
├── screens/
│   ├── DashboardScreen.tsx    # Home screen with entries
│   └── NewEntryScreen.tsx     # Write new entries
├── App.tsx                     # Main app with tab navigation
├── app.json                    # Expo configuration
└── package.json
```

## Screens

### 1. Dashboard
- View recent journal entries
- See stats (total entries, streak, this week)
- Tap entries to read them (coming soon)

### 2. New Entry
- Write new journal entries
- See word count in real-time
- Action buttons: "Go Deeper", "Talk More", "Finish Entry"

## Customization

### Change Colors

Edit the colors in `App.tsx`:
```typescript
tabBarActiveTintColor: '#10b981',  // Active tab color
headerStyle: { backgroundColor: '#10b981' },  // Header color
```

### Add More Screens

1. Create new screen in `screens/` folder
2. Add it to the Tab Navigator in `App.tsx`

## Building for Production

### Android APK

```bash
npm install -g eas-cli
eas build --platform android
```

### iOS App

```bash
eas build --platform ios
```

## Next Steps

To add functionality:
- Connect to Supabase backend
- Integrate Google Gemini API
- Add authentication
- Implement full CRUD for entries
- Add voice input
- Add offline support

## Tech Stack

- **Expo** - React Native framework
- **React Navigation** - Navigation & tabs
- **TypeScript** - Type safety
- **React Native** - Native mobile UI

---

**Made with React Native & Expo** 📱
