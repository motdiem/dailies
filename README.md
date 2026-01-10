# Dailies

A minimalist Progressive Web App (PWA) for organizing your daily links. Designed to be saved on your iOS home screen for quick access to your favorite sites.

## Features

- 📱 **iOS Home Screen Ready** - Install as a PWA on your iPhone
- 🎨 **Auto Dark Mode** - Switches based on your device's theme
- ⚡ **Lightning Fast** - Vanilla JavaScript, no frameworks
- 💾 **Offline Support** - Works without internet connection
- 🔄 **Drag to Reorder** - Easy link management
- 📤 **Import/Export** - Backup and restore your settings
- 🎯 **Minimalist Design** - Clean, distraction-free interface

## Quick Start

### 1. Install Proper Icons (Recommended for iOS)

Open `generate-icons.html` in your web browser:
```bash
open generate-icons.html  # macOS
start generate-icons.html # Windows
xdg-open generate-icons.html # Linux
```

Download both icons and save them as:
- `icon-192.png`
- `icon-512.png`

This replaces the placeholder 1x1 PNGs with proper high-quality icons.

### 2. Serve the App

You need to serve the app over HTTPS (or localhost) for PWA features to work.

**Option A: Using Python**
```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

**Option B: Using Node.js**
```bash
npx serve
# Follow the URL shown
```

**Option C: Deploy to a hosting service**
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

### 3. Install on iOS

1. Open the app in Safari on your iPhone
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Name it "Dailies" and tap "Add"
5. The app icon will appear on your home screen!

## Usage

### Main Screen
- Tap any link to open it in a new tab
- Tap the ⚙️ settings icon to manage your links

### Settings
- **Add Link**: Create a new link with a name and URL
- **Edit Link**: Tap "Edit" on any link to modify it
- **Delete Link**: Tap "Delete" to remove a link
- **Reorder**: Drag links by the ≡ handle to rearrange them
- **Export**: Copy all your links to share or backup
- **Import**: Paste exported data to restore links

## Configuration

### Default Links
The app comes pre-configured with:
- Sam (cluesbysam.com)
- NYT Crosswords
- Puzzmo

You can modify, remove, or add more links in Settings.

### Export Format
Settings are exported as JSON:
```json
[
  {
    "id": "1",
    "name": "Sam",
    "url": "https://www.cluesbysam.com/"
  },
  {
    "id": "2",
    "name": "NYT",
    "url": "https://www.nytimes.com/crosswords"
  }
]
```

## Technical Details

### Files
- `index.html` - Main app structure
- `styles.css` - Styling with dark mode support
- `app.js` - Application logic and storage
- `manifest.json` - PWA configuration
- `service-worker.js` - Offline caching and updates
- `icon-*.png/svg` - App icons

### Storage
All data is stored in browser localStorage under the key `dailies-links`.

### Caching Strategy
The service worker uses a **network-first** strategy:
1. Try to fetch from network (gets latest version)
2. Update cache with fresh content
3. Fall back to cache if offline

This ensures you always get the latest version when online, but the app still works offline.

### Updating the App
The service worker automatically caches new versions. To force an update:
1. Close all app tabs/instances
2. Reopen the app
3. The new version will be fetched and cached

Or in the browser console:
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.update());
});
```

## Browser Support

- ✅ iOS Safari 11.3+
- ✅ Chrome 40+
- ✅ Firefox 44+
- ✅ Edge 17+
- ✅ Samsung Internet 4+

## Development

No build process required! Just edit the files and refresh.

To customize:
1. Edit `styles.css` for visual changes
2. Edit `app.js` for functionality changes
3. Modify `defaultLinks` in `app.js` to change initial links

## Troubleshooting

**Icons not showing on iOS home screen?**
- Make sure you generated proper PNG files using `generate-icons.html`
- Ensure the app is served over HTTPS (not HTTP)

**Links not saving?**
- Check browser console for errors
- Ensure localStorage is not disabled
- Try clearing site data and starting fresh

**Dark mode not working?**
- Dark mode follows your device's system setting
- Check Settings > Display & Brightness on iOS

**App not updating?**
- Force refresh in Safari (hold refresh button > "Request Desktop Website")
- Clear Safari cache
- Uninstall and reinstall from home screen

## License

See LICENSE file for details.

## Credits

Built with vanilla JavaScript, no frameworks or dependencies.
