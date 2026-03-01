# Maison Régnier

> Site web professionnel pour ostréiculture avec interface d'administration no-code

## Features

- ✨ **No-code editor** - Drag & drop interface for content management
- 🎨 **Visual customization** - Theme colors, backgrounds, and layouts
- 📱 **Responsive design** - Mobile-first approach
- 🖼️ **Image management** - Built-in gallery and image upload
- 🔐 **Secure authentication** - Password hashing with bcrypt
- 📧 **Password reset** - Email-based password recovery
- 💾 **Auto-save** - Automatic persistence with localStorage

## Installation

Install dependencies:

```bash
npm install
```

## Usage

### Development Server

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to view the site.

### Production Build

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Routes

| Path | Description | Access |
|------|-------------|--------|
| `/` | Public website | Public |
| `/login` | Admin login | Public |
| `/admin` | Admin dashboard | Authenticated |

## Configuration

### Email Service

Configure EmailJS for password reset functionality in `src/config/emailConfig.ts`:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: "your_service_id",
  TEMPLATE_ID: "your_template_id",
  PUBLIC_KEY: "your_public_key"
};

export const ADMIN_EMAIL = "admin@example.com";
```

### Admin Access

The default admin password is stored as a bcrypt hash. To change the admin email, update `ADMIN_EMAIL` in `src/config/emailConfig.ts`.

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 7
- **State Management:** Zustand
- **Layout:** React Grid Layout
- **Email Service:** EmailJS
- **Authentication:** bcrypt
- **Server:** Caddy (production)

## Project Structure

```
maison-regnier/
├── src/
│   ├── components/       # React components
│   ├── contexts/         # AuthContext for authentication
│   ├── pages/            # Page components (Login, Admin, Public)
│   ├── store/            # Zustand store (useSiteStore)
│   ├── config/           # Configuration files (emailConfig)
│   └── types/            # TypeScript type definitions
├── public/
│   └── data/img/         # Static images
└── dist/                 # Production build output
```

## License

© 2026 Maison Régnier. All rights reserved.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
