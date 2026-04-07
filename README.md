<h1 align="center">
    <img src="https://readme-typing-svg.herokuapp.com/?font=Righteous&color=b6d7a8&random=falsesize=35&center=true&vCenter=true&width=500&height=70&duration=2000&lines=Hi+There!+👋;+We+Are+Group+I+👥;Welcome+To+The+KitchenSync🧑‍🍳;" />
</h1>

# Group I - KitchenSync

Welcome to the repository for the ENSE 281 Group Project done by Group I.

## Project Introduction & Background 📝

This web application aims to reduce household food waste and aid in decision making by creating a system that provides its users with various recipes and the tools to track food inventory whilst simultaneously allowing them to track food expiration dates.

## Business Opportunity 📍

The project will allow users to keep track of their food inventory and give user access to a variety of recipes based off said inventory and items nearing expiration, hence, assisting the users decision making on what to eat. Users will be able to adequately plan meals and maintain awareness of the quality of food in their inventory whilst also cutting food wastage and cost, eating better and healthier.

## Minimum Viable Product (MVP) 💻

This web application will allow for:
* Users to input any food items into any designated storages
* Users to track expiry dates on their food items
* Users to receive recipe suggestions based on food items stored and/or items nearing expiry date
* Users to browse and save recipes

## Intended Impact 🕖

The current reality of food waste and disorganization becomes a new reality where food usage is intentional, efficient, and cost-effective.

We envision a simple system where:
  - Food is clearly tracked by storage location
  - Expiry dates are visible and actionable
  - Waste is minimized
  - Meal planning is partially automated based on what is already available
  - Unnecessary grocery spending is reduced

## Target Customers 🎯

Our main audience includes:
  - Home cooks and budget-conscious individuals
  - Families managing large or shared food inventories
  - Students or roommates sharing fridge and pantry space

## Team 🤝

- Zifran Chowdhury
- Deran Cross
- Ikechukwu Ogowuihe
- Emmanuel Dairo

## Project Status 🟢

MVP complete. Backend integrated with Express, MongoDB Atlas, and EJS views. Expiry notifications and storage padding improvements added.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 4 |
| Templating | EJS |
| Database | MongoDB Atlas + Mongoose |
| Auth | express-session + bcrypt password hashing |
| Frontend CSS | Bootstrap 5.3.3 + custom style.css |
| Frontend JS | Vanilla JavaScript |
| Icons | Bootstrap Icons 1.11.3 |

---

## File Structure

```
app/
├── server.js                 <-- Express entry point
├── package.json
├── .env                      <-- Environment variables (not committed)
├── .gitignore
├── seed-recipes.js           <-- Script to seed recipe data into MongoDB (run once)
│
├── models/
│   ├── User.js               <-- Mongoose User model with bcrypt password hashing
│   ├── Item.js               <-- Item model with status virtual (expired/expiring/good)
│   ├── Storage.js            <-- Custom storage model (name, userId)
│   ├── Recipe.js             <-- Recipe model (name, keywords, ingredients, steps)
│   └── LikedRecipe.js        <-- Liked recipe model (userId + recipeId, unique pair)
│
├── routes/
│   ├── auth.js               <-- POST /auth/register, POST /auth/login, GET /auth/logout
│   ├── items.js              <-- POST /items, GET+PUT /items/:id/edit, DELETE /items/:id
│   ├── storages.js           <-- POST /storages, DELETE /storages/:id
│   ├── pages.js              <-- GET routes for all pages + recipe suggestion logic
│   └── recipes.js            <-- POST /recipes/:id/like, DELETE /recipes/:id/like
│
├── middleware/
│   └── requireAuth.js        <-- Session guard — redirects to /login if not authenticated
│
├── views/                    <-- EJS templates
│   ├── index.ejs             <-- Welcome / landing page
│   ├── login.ejs
│   ├── register.ejs
│   ├── dashboard.ejs         <-- Stats, filter tabs, notification bell, recipe suggestions, storage grid
│   ├── add-item.ejs
│   ├── edit-item.ejs
│   ├── fridge.ejs
│   ├── freezer.ejs
│   ├── pantry.ejs
│   ├── storage.ejs           <-- Generic page for custom storages
│   ├── recipes.ejs           <-- Recipe suggestions with like button and detail modal
│   └── liked-recipes.ejs     <-- Saved recipes with unlike button
│
├── public/                   <-- Static assets served by Express
│   ├── css/style.css
│   └── js/app.js
│
├── css/ & js/                <-- Legacy static HTML assets (not served by Express)
│
└── [legacy .html files]      <-- Old prototypes, not used by the Express app
```

---

## Page Flow

```
/ (Welcome)
  └──> /login
         ├──> /register ──POST /auth/register──> /login
         └──> /dashboard ──POST /auth/login
                │
                ├──> Notification bell (top nav) ──> dropdown panel listing expiring/expired items
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
                │      ├──> Like button ──POST /recipes/:id/like──> (no reload, fetch API)
                │      └──> Recipe detail modal (ingredients + steps)
                │
                └──> /liked-recipes
                       ├──> Unlike button ──DELETE /recipes/:id/like──> (no reload)
                       └──> Recipe detail modal

GET /auth/logout ──> /login
```

---

## Features

### Working
- User registration and login with bcrypt password hashing (stored in MongoDB)
- Session-based authentication — all routes protected
- Add, edit, and delete food items with name, quantity, storage, and optional expiry date
- Dashboard overview stats (Total Items, Expired, Expiring Soon, Low Stock)
- Filter tabs (All / Expired / Expiring Soon / Low Stock)
- Built-in storage pages (Fridge, Freezer, Pantry) with expiry colour coding
- Custom storages — create and name your own storage locations, delete with all their items
- Item status calculated server-side based on expiry date:
  - **Expired** — past expiry date (red left border)
  - **Expiring Soon** — within 7 days (orange left border)
  - **Good** — more than 7 days out, or no expiry date set (green left border)
- Low Stock — items with quantity ≤ 2
- In-app notification bell (top nav) — shows a count badge and dropdown listing:
  - Expiring items: "Your [Item] is expiring soon — see recipe suggestions"
  - Expired items: "Your [Item] has expired — consider removing them"
- Recipe suggestions on dashboard (top 3, scored by expiring items first)
- Full recipe page — browse all suggested recipes with matched ingredient chips
- Recipe detail modal — view full ingredients list and step-by-step instructions
- Like / unlike recipes (live, no page reload)
- Liked recipes page — view and manage all saved recipes
- Back navigation is context-aware — Add Item and Back always return to the page you came from
- Search filtering on all storage and recipe pages
- Responsive layout (mobile, tablet, desktop)
- Sign out

### Not Yet Implemented
- User authentication (out of scope for current phase)
- Food item images (placeholder icons only)
