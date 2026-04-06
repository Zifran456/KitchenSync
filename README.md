# KitchenSync

A kitchen inventory management app to store food items across Fridge, Freezer, Pantry, and any custom storage locations — with expiry date tracking and recipe suggestions.

## How to Run

> **Requires:** Node.js and a MongoDB instance (local or Atlas).

```bash
# Install dependencies (first time only)
npm install

# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

Open `http://localhost:3000` in your browser.

### Environment Variables

Create a `.env` file in the project root:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/kitchensync
SESSION_SECRET=kitchensync-super-secret-key-change-in-production
```

Change `SESSION_SECRET` before deploying to production.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 4 |
| Templating | EJS |
| Database | MongoDB + Mongoose (items, custom storages) |
| Auth | users.json (plain text) + express-session |
| Frontend CSS | Bootstrap 5.3.3 (CDN) + custom `style.css` |
| Frontend JS | Vanilla JavaScript |
| Icons | Bootstrap Icons 1.11.3 (CDN) |

---

## File Structure

```
kitchensync/
├── server.js                 <-- Express entry point
├── package.json
├── .env                      <-- Environment variables (not committed)
│
├── models/
│   ├── User.js               <-- Mongoose User model (username, email, hashed password)
│   ├── Item.js               <-- Mongoose Item model (name, qty, storage, expiryDate, userId)
│   └── Storage.js            <-- Mongoose Storage model (name, userId) — custom storages only
│
├── routes/
│   ├── auth.js               <-- POST /auth/login, POST /auth/register, GET /auth/logout
│   ├── items.js              <-- POST /items, GET /items/:id/edit, PUT /items/:id, DELETE /items/:id
│   ├── storages.js           <-- POST /storages, DELETE /storages/:id
│   └── pages.js              <-- GET routes for all pages (dashboard, storage pages, add/edit forms)
│
├── middleware/
│   └── requireAuth.js        <-- Session guard — redirects to /login if unauthenticated
│
├── views/                    <-- EJS templates (one per page)
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── dashboard.ejs
│   ├── add-item.ejs
│   ├── edit-item.ejs         <-- Pre-filled edit form for existing items
│   ├── storage.ejs           <-- Generic page for custom (user-created) storages
│   ├── fridge.ejs
│   ├── freezer.ejs
│   ├── pantry.ejs
│   ├── recipes.ejs
│   └── liked-recipes.ejs
│
├── public/                   <-- Static assets served by Express
│   ├── css/style.css
│   └── js/app.js
│
└── css/ & js/                <-- Legacy static HTML assets (kept for reference)
```

---

## Routes

| Method | Route | Description |
|---|---|---|
| GET | `/` | Welcome page (redirects to `/dashboard` if logged in) |
| GET | `/login` | Sign in page |
| POST | `/auth/login` | Authenticate user |
| GET | `/register` | Create account page |
| POST | `/auth/register` | Register new user |
| GET | `/auth/logout` | Destroy session, redirect to login |
| GET | `/dashboard` | Main dashboard with live stats and storage grid |
| GET | `/add-item` | Add item form (accepts `?storage=` and `?back=` query params) |
| POST | `/items` | Save new item to DB, redirect to `back` or `/dashboard` |
| GET | `/items/:id/edit` | Edit item form pre-filled with current values |
| PUT | `/items/:id` | Save item edits, redirect to referring page |
| DELETE | `/items/:id` | Delete item, redirect to referring page |
| GET | `/fridge` | Fridge items |
| GET | `/freezer` | Freezer items |
| GET | `/pantry` | Pantry items |
| GET | `/storage/:id` | Custom storage page (dynamic, matched by MongoDB `_id`) |
| POST | `/storages` | Create a new custom storage, redirect to `/dashboard#storage-section` |
| DELETE | `/storages/:id` | Delete custom storage and all its items |
| GET | `/recipes` | Browse recipes |
| GET | `/liked-recipes` | Liked/saved recipes |

---

## Page Flow

```
/ (Welcome)
  └──> /login
         ├──> /register ──> /login
         └──> /dashboard
                │
                ├──> /add-item?storage=X&back=Y ──POST /items──> Y (or /dashboard)
                │
                ├──> /fridge
                │      ├──> /add-item?storage=Fridge&back=/fridge ──> /fridge
                │      └──> /items/:id/edit ──PUT /items/:id──> /fridge
                │
                ├──> /freezer  (same pattern as /fridge)
                ├──> /pantry   (same pattern as /fridge)
                │
                ├──> /storage/:id  (custom storage — same pattern as built-in pages)
                │      └──> DELETE /storages/:id ──> /dashboard
                │
                ├──> /recipes
                └──> /liked-recipes
```

---

## Features

### Working
- User registration and login via `users.json` (passwords stored in plain text — dev only)
- Session-based authentication — all routes protected
- Add items with name, quantity, storage location, and expiry date (expiry date required)
- Edit items — update name, quantity, storage location, or expiry date from any page
- Delete items from dashboard and all storage pages
- Dashboard overview stats (Total Items, Expired, Expiring Soon, Low Stock) — live from DB
- Filter tabs (All / Expired / Expiring Soon / Low Stock) — show real items
- Built-in storage pages (Fridge, Freezer, Pantry) — filtered views with expiry color coding
- Custom storages — create and name your own storage locations (e.g. "Garage Freezer")
  - Each custom storage has its own dedicated page with the same functionality as built-in ones
  - Custom storages can be deleted (along with all their items) from within the storage page
- Item status calculated server-side based on expiry date:
  - **Expired** — past expiry date (red left border)
  - **Expiring Soon** — within 7 days (orange left border)
  - **Good** — more than 7 days out (green left border)
- Low Stock — items with quantity ≤ 2
- Back navigation is context-aware — Back and Save always return to the page you came from
- "Assign to" storage buttons on add-item include custom storages dynamically
- Search filtering on all storage pages
- Responsive layout (mobile, tablet, desktop)
- Sign out

### UI Only (not yet wired to backend)
- Recipe pages — static content, no database connection
- Liked recipes — no save/unsave functionality
- Food item images — placeholder icons only

---

## Next Steps

### High Priority
- [ ] **Expiry notifications** — badge/alert when items are expired or expiring soon

### Future
- [ ] **Food images** — replace placeholder icons with real images (upload or API lookup)
