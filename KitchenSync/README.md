# KitchenSync - Frontend MVP

## What is this?
These are the HTML/CSS/Bootstrap 5 frontend files for the KitchenSync app.

## How to Run
1. Open the `kitchensync` folder in **VSCode**
2. Install the **Live Server** extension (by Ritwick Dey) if you don't have it
3. Right-click on `index.html` and select **"Open with Live Server"**
4. Your browser will open and you can navigate through all the pages

Alternatively, just double-click `index.html` to open it directly in your browser.

## File Structure
```
kitchensync/
├── views/
│   └── index.ejs             <-- Welcome/Landing page (start here)
│   └──login.ejs             <-- Sign In page
│   └── register.ejs          <-- Create Account page
│   └──dashboard.ejs         <-- Main Dashboard (overview, items, recipes, storage)
│   └── recipes.ejs           <-- Browse Recipes page
│   └── liked-recipes.ejs     <-- Liked/Saved Recipes page
│   └── fridge.ejs            <-- Fridge storage view
│   └── pantry.ejs            <-- Pantry storage view
│   └──freezer.ejs           <-- Freezer storage view
│   └── add-item.ejs          <-- Add New Item form
│   └──recipes.ejs           <-- Check recipe
│   └── add-recipe.ejs        <-- Add Recipe Item
│   └── liked-recipes.ejs     <-- Check liked recipes
│   └── recipe.ejs            <-- check all recipes
│   └── recipe-suggestions.ejs<-- Shows suggestion from the API

├── css/
│   └── style.ejs         <-- All custom styles (colors, layout, components)
├── js/
│   └── app.ejs           <-- All interactivity (search overlay, tabs, forms)
├── server.js             <-- Used to run the code 
└── README.md             <-- This file
```

## Page Flow (User Journey)
```
index.html (Welcome)
  └──> login.ejs (Sign In)
         ├──> register.ejs (Create Account)
         └──> dashboard.ejs (Main Dashboard)
                ├──> recipes.ejs (Browse Recipes)
                ├──> liked-recipes.ejs (Liked Recipes)
                ├──> fridge.ejs (Fridge Storage)
                ├──> pantry.ejs (Pantry Storage)
                ├──> freezer.ejs (Freezer Storage)
                └──> add-item.ejs (Add New Item)
                └──> add-recipe.ejs (Add Recipe Item)
                └──> liked-recipes.ejs (Check liked recipes)
                └──> recipe.ejs (check all recipes)
                └──> recipe-suggestions.ejs(Shows suggestion from the API)
```

## Technology Stack
- **HTML5** - Page structure
- **CSS3** - Custom styling (in `css/style.css`)
- **Bootstrap 5.3.3** - Responsive grid and utility classes (loaded via CDN)
- **Bootstrap Icons 1.11.3** - All icons (loaded via CDN)
- **Vanilla JavaScript** - Interactivity (in `js/app.js`)

## Key Features Working Right Now

## Colors Used (from our Figma design)
- Background cream: `#F5F0E1`
- Gold accent: `#D4A843`
- Brown button: `#A07850`
- Red (expired): `#E74C3C`
- Orange (expiring): `#F39C12`
- Green (add item): `#2E7D32`
- Blue (learn more): `#2196F3`

## Next Steps
- Connect to Node.js/Express backend
- Set up MongoDB/Mongoose models
- Replace placeholder icons with real food images
- Implement actual CRUD operations
- Add EJS templating to replace static HTML
- Wire up notification system for expiry alerts

## How To Run The Code
- Ensure your Mongo is connected
- Create env and input 
DB_SECRET=secretvalue
- Install the following extenseion 
```

    └──>npm install axios
    └──>npm install init
    └──>npm install passport-local-mongoose
    └──>npm install express ejs mongoose
    └──>npm install dotenv
    └──>npm install passport
    └──>npm install passport-local
    └──>npm express-session
```  
- After that direct directory and ensure you are in Kitchen Sync folder
- Then launch node server.js