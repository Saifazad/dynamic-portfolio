# Dynamic Portfolio Frontend Client

This is the client-side SPA (Single Page Application) for the Dynamic Portfolio system. It is built using **React 19**, **Vite**, **Tailwind CSS v4**, **Framer Motion**, and **Lenis** smooth scrolling.

For full-stack system architecture, database configurations, and Express REST API documentation, refer to the root [README.md](file:///Users/saif/.gemini/antigravity-ide/scratch/dynamic-portfolio/README.md).

---

## 🎨 Key Features

1. **Dynamic Theme Engine**:
   Integrated via `ThemeContext`, the app reads configuration details (`site_config`) from the database and injects them as global CSS variables (like `--primary-color` and custom font styles).
2. **Interactive Admin Dashboard**:
   A secure admin interface accessed directly via the navigation header. Includes dedicated editing views:
   - **Settings Tab**: Customise site name, headers, animations, and primary colors.
   - **Projects Tab**: Insert, modify, and delete portfolio items.
   - **Timeline Tab**: Add/edit educational certifications and jobs.
   - **Skills Tab**: Control your skills metrics and categories.
3. **Immersive UI & Animations**:
   - Integrated with `Framer Motion` for animations on headings, timelines, skill bars, and cards.
   - Smooth-scrolling enabled using `Lenis`.
4. **Fast Linting & Development**:
   Uses `oxlint` for fast, lightweight code quality checks.

---

## 📂 Project Structure

```text
src/
├── main.jsx                 # Application entry point
├── App.jsx                  # Main router, view switcher, and API fetch state
├── index.css                # Global stylesheets, Tailwind imports & base classes
├── context/
│   └── ThemeContext.jsx     # Handles site configuration themes, styling vars & loading state
└── components/
    ├── Hero.jsx             # Beautiful dynamic splash screen with background effects
    ├── Projects.jsx         # Portfolio cards with stack filters
    ├── Timeline.jsx         # Work/Education chronological lists
    ├── Skills.jsx           # Proficiencies and category grids
    ├── AdminDashboard.jsx   # Master Admin layout and authentication guard
    └── admin/               # Admin panel specific tabs and notifications
        ├── AuthCard.jsx
        ├── ProjectsTab.jsx
        ├── SettingsTab.jsx
        ├── SkillsTab.jsx
        ├── TimelineTab.jsx
        └── ToastContainer.jsx
```

---

## ⚡ Development & Scripts

Inside the `frontend` folder, you can run the following scripts:

### Start Development Server
Starts the React development server locally.
```bash
npm run dev
```
*Vite web server defaults to [http://localhost:5173](http://localhost:5173).*

### Build Production Bundle
Builds the optimized production assets inside `/dist`.
```bash
npm run build
```

### Preview Production Build
Runs a local web server serving the production build outputs from `/dist`.
```bash
npm run preview
```

### Run Oxlint Code Quality Check
Runs high-performance linting configurations on source codes.
```bash
npm run lint
```

---

## ⚙️ Connecting to Backend

By default, the client talks to the Express server running on `http://localhost:5001`.
You can configure this endpoint inside `frontend/src/App.jsx` under the `BACKEND_URL` variable.
Ensure your backend server is active before starting the frontend development server to avoid database loading errors.
