/**
 * seed-recipes.js
 * Run once to populate MongoDB with the built-in recipe library.
 *
 *   node seed-recipes.js
 *
 * Re-running this script will clear and re-insert all recipes.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Recipe   = require('./models/Recipe');

const recipes = [
  // ── BREAKFAST ─────────────────────────────────────────────────────────────
  {
    name: 'Scrambled Eggs',
    description: 'Quick and fluffy scrambled eggs — great for any meal of the day.',
    category: 'breakfast',
    keywords: ['egg', 'butter', 'milk'],
    ingredients: ['2–3 eggs', '1 tbsp butter', 'splash of milk', 'salt and pepper to taste'],
    steps: [
      'Crack the eggs into a bowl and whisk with a splash of milk, salt, and pepper.',
      'Melt butter in a pan over medium-low heat.',
      'Pour in the egg mixture and gently stir with a spatula as it sets.',
      'Remove from heat while still slightly wet — they finish cooking from residual heat.',
      'Serve immediately.'
    ]
  },
  {
    name: 'Bacon and Eggs',
    description: 'A classic breakfast combo that never gets old.',
    category: 'breakfast',
    keywords: ['bacon', 'egg', 'butter'],
    ingredients: ['2–3 strips of bacon', '2 eggs', 'butter (optional)', 'salt and pepper'],
    steps: [
      'Cook bacon in a skillet over medium heat until crispy. Set aside.',
      'Leave a little bacon grease in the pan (or add butter).',
      'Crack eggs into the pan and cook to your liking (fried, sunny-side up, etc.).',
      'Season with salt and pepper. Serve with the bacon.'
    ]
  },
  {
    name: 'French Toast',
    description: 'Thick, custardy bread slices pan-fried to golden perfection.',
    category: 'breakfast',
    keywords: ['bread', 'egg', 'milk', 'butter', 'maple syrup'],
    ingredients: ['2 slices of bread', '1 egg', '¼ cup milk', '1 tbsp butter', 'maple syrup or honey to serve', 'pinch of cinnamon (optional)'],
    steps: [
      'Whisk together egg, milk, and a pinch of cinnamon in a shallow bowl.',
      'Dip each slice of bread in the egg mixture, coating both sides.',
      'Melt butter in a skillet over medium heat.',
      'Cook each slice for 2–3 minutes per side until golden brown.',
      'Serve with maple syrup or honey.'
    ]
  },
  {
    name: 'Oatmeal with Berries',
    description: 'Warm, hearty oats topped with fresh or frozen berries.',
    category: 'breakfast',
    keywords: ['oat', 'berry', 'strawberry', 'raspberry', 'milk', 'honey', 'banana', 'maple syrup'],
    ingredients: ['½ cup oats', '1 cup milk or water', 'handful of berries (fresh or frozen)', 'honey or maple syrup to taste'],
    steps: [
      'Combine oats and milk in a small saucepan over medium heat.',
      'Stir occasionally and cook about 5 minutes until thickened.',
      'Pour into a bowl and top with berries.',
      'Drizzle with honey or maple syrup.'
    ]
  },
  {
    name: 'Yogurt Parfait',
    description: 'Layers of creamy yogurt, fresh berries, and crunchy oats.',
    category: 'breakfast',
    keywords: ['yogurt', 'berry', 'strawberry', 'raspberry', 'oat', 'honey', 'maple syrup'],
    ingredients: ['1 cup yogurt', 'handful of berries', '¼ cup oats', 'drizzle of honey'],
    steps: [
      'Spoon yogurt into a glass or bowl.',
      'Layer berries on top.',
      'Sprinkle oats over the berries.',
      'Drizzle with honey. Enjoy cold.'
    ]
  },
  {
    name: 'Smoothie',
    description: 'Blend whatever fruits and dairy you have for a quick nutritious drink.',
    category: 'breakfast',
    keywords: ['berry', 'strawberry', 'raspberry', 'mango', 'yogurt', 'milk', 'banana', 'protein powder', 'chia', 'spinach', 'flax'],
    ingredients: ['1 cup mixed berries or mango chunks', '½ cup yogurt or milk', '1 banana (optional)', '1 scoop protein powder (optional)', '1 tsp chia seeds (optional)'],
    steps: [
      'Add all ingredients to a blender.',
      'Blend on high for 30–60 seconds until smooth.',
      'Add more milk if too thick. Serve immediately.'
    ]
  },
  {
    name: 'Pancakes',
    description: 'Fluffy homemade pancakes from pantry staples.',
    category: 'breakfast',
    keywords: ['flour', 'egg', 'milk', 'butter', 'sugar', 'baking powder', 'maple syrup', 'honey'],
    ingredients: ['1 cup all-purpose flour', '1 egg', '1 cup milk', '2 tbsp sugar', '1 tsp baking powder', '2 tbsp melted butter', 'maple syrup to serve'],
    steps: [
      'Mix flour, sugar, and baking powder in a bowl.',
      'In another bowl, whisk egg, milk, and melted butter.',
      'Combine wet and dry ingredients — stir until just mixed (lumps are OK).',
      'Heat a non-stick pan over medium heat and pour ¼ cup of batter per pancake.',
      'Cook until bubbles form on top, then flip and cook 1 more minute.',
      'Serve with maple syrup.'
    ]
  },
  {
    name: 'Spinach and Egg Omelette',
    description: 'Protein-packed omelette — a great way to use up wilting spinach.',
    category: 'breakfast',
    keywords: ['egg', 'spinach', 'cheese', 'butter', 'mushroom'],
    ingredients: ['3 eggs', '1 cup fresh spinach', '¼ cup shredded cheese (any kind)', '1 tbsp butter', 'salt and pepper'],
    steps: [
      'Whisk eggs with salt and pepper.',
      'Melt butter in a pan over medium heat.',
      'Pour in eggs and cook until the edges just begin to set.',
      'Add spinach and cheese to one half, then fold the omelette over.',
      'Cook 1 more minute and slide onto a plate.'
    ]
  },
  {
    name: 'Breakfast Burrito',
    description: 'Eggs, cheese, and salsa wrapped in a warm tortilla.',
    category: 'breakfast',
    keywords: ['egg', 'tortilla', 'cheese', 'salsa', 'bacon', 'sour cream'],
    ingredients: ['2 eggs', '1 large tortilla', '¼ cup shredded cheese', 'salsa', '2 strips bacon (optional)', 'sour cream (optional)'],
    steps: [
      'Cook bacon if using, set aside. Scramble eggs in the same pan.',
      'Warm the tortilla in a dry pan or microwave.',
      'Place eggs in the center of the tortilla, top with cheese, bacon, and salsa.',
      'Fold in the sides and roll it up. Serve with sour cream.'
    ]
  },
  {
    name: 'Avocado Toast with Egg',
    description: 'Simple, filling breakfast using bread and eggs.',
    category: 'breakfast',
    keywords: ['bread', 'egg', 'butter', 'bagel'],
    ingredients: ['2 slices bread or a bagel', '1–2 eggs', 'salt, pepper, red pepper flakes (optional)'],
    steps: [
      'Toast the bread or bagel.',
      'Cook an egg your way — fried, poached, or scrambled.',
      'Place egg on toast and season with salt, pepper, and red pepper flakes.',
      'Eat immediately.'
    ]
  },
  // ── LUNCH ─────────────────────────────────────────────────────────────────
  {
    name: 'Grilled Cheese Sandwich',
    description: 'Crispy, buttery bread with melted cheese — a comfort classic.',
    category: 'lunch',
    keywords: ['bread', 'cheese', 'butter', 'cheddar', 'parmesan', 'bagel'],
    ingredients: ['2 slices of bread', 'slices of cheese (cheddar or any melting cheese)', '1 tbsp butter'],
    steps: [
      'Butter one side of each bread slice.',
      'Place cheese between the unbuttered sides.',
      'Cook in a skillet over medium-low heat, buttered side down.',
      'After 2–3 minutes, flip and cook the other side until golden and cheese is melted.',
      'Slice and serve.'
    ]
  },
  {
    name: 'Tuna Salad',
    description: 'Quick tuna salad that works in a sandwich, on crackers, or by itself.',
    category: 'lunch',
    keywords: ['tuna', 'mayo', 'mayonnaise', 'bread', 'cracker'],
    ingredients: ['1 can tuna (drained)', '2 tbsp mayonnaise', 'salt and pepper', 'bread or crackers to serve'],
    steps: [
      'Drain the canned tuna and add to a bowl.',
      'Mix in mayonnaise, salt, and pepper.',
      'Serve on bread as a sandwich or alongside crackers.'
    ]
  },
  {
    name: 'Cheese Quesadilla',
    description: 'Crispy tortillas with melted cheese — top with salsa and you\'re done.',
    category: 'lunch',
    keywords: ['tortilla', 'cheese', 'salsa', 'cheddar', 'sour cream'],
    ingredients: ['2 flour tortillas', '½ cup shredded cheese', 'salsa to serve', 'sour cream (optional)'],
    steps: [
      'Place one tortilla in a dry skillet over medium heat.',
      'Sprinkle cheese over the entire surface, then place the second tortilla on top.',
      'Cook for 2 minutes until the bottom is golden, then flip carefully.',
      'Cook another 1–2 minutes. Slice into wedges and serve with salsa.'
    ]
  },
  {
    name: 'Hummus and Crackers',
    description: 'Easy no-cook snack — great for when you need something quick.',
    category: 'snack',
    keywords: ['hummus', 'cracker', 'olive', 'pita'],
    ingredients: ['½ cup hummus', 'crackers or pita bread', 'olives (optional)'],
    steps: [
      'Spoon hummus into a small bowl.',
      'Arrange crackers around it.',
      'Top hummus with olives if you have them. Dip and enjoy.'
    ]
  },
  // ── DINNER ────────────────────────────────────────────────────────────────
  {
    name: 'Pasta with Tomato Sauce',
    description: 'Simple, satisfying pasta — just pantry staples needed.',
    category: 'dinner',
    keywords: ['pasta', 'canned tomato', 'tomato', 'pasta sauce', 'olive oil'],
    ingredients: ['2 cups dried pasta', '1 can canned tomatoes or jar of pasta sauce', '1 tbsp olive oil', 'salt and pepper', 'parmesan to top (optional)'],
    steps: [
      'Cook pasta according to package directions. Reserve ½ cup of pasta water.',
      'In a saucepan, heat olive oil over medium heat.',
      'Add canned tomatoes or pasta sauce and simmer for 5–10 minutes.',
      'Drain pasta and toss with the sauce, adding pasta water if too thick.',
      'Season with salt and pepper. Top with parmesan if available.'
    ]
  },
  {
    name: 'Pesto Pasta',
    description: 'Two-ingredient magic — just pasta and pesto.',
    category: 'dinner',
    keywords: ['pasta', 'pesto', 'parmesan'],
    ingredients: ['2 cups dried pasta', '3–4 tbsp pesto', 'parmesan to top (optional)'],
    steps: [
      'Cook pasta according to package directions.',
      'Drain, reserving a splash of pasta water.',
      'Toss hot pasta with pesto, adding a little pasta water to loosen if needed.',
      'Season with salt and serve with parmesan if you have it.'
    ]
  },
  {
    name: 'Shrimp Pasta',
    description: 'Quick shrimp and pasta dinner with just butter and a few pantry staples.',
    category: 'dinner',
    keywords: ['shrimp', 'pasta', 'butter', 'olive oil', 'parsley', 'cilantro'],
    ingredients: ['2 cups pasta', '1 cup frozen shrimp (thawed)', '2 tbsp butter', '1 tbsp olive oil', 'salt and pepper', 'parsley (optional)'],
    steps: [
      'Cook pasta according to package directions.',
      'In a skillet, heat butter and olive oil over medium-high heat.',
      'Add shrimp, season with salt and pepper, cook 2 minutes per side until pink.',
      'Toss shrimp with drained pasta. Garnish with parsley if you have it.'
    ]
  },
  {
    name: 'Fried Rice',
    description: 'Use up leftover rice with eggs, frozen veggies, and whatever else you have.',
    category: 'dinner',
    keywords: ['rice', 'egg', 'corn', 'pea', 'butter', 'leftover'],
    ingredients: ['2 cups cooked rice (day-old is best)', '2 eggs', '½ cup frozen peas or corn', '1 tbsp butter or oil', 'soy sauce to taste'],
    steps: [
      'Heat butter or oil in a large skillet or wok over high heat.',
      'Add rice and stir-fry for 2–3 minutes.',
      'Push rice to one side, crack eggs into the pan, and scramble them.',
      'Mix eggs into the rice and add peas and corn.',
      'Stir-fry another 2 minutes. Season with soy sauce to taste.'
    ]
  },
  {
    name: 'Chicken Stir Fry',
    description: 'Quick chicken with veggies over rice — a reliable weeknight staple.',
    category: 'dinner',
    keywords: ['chicken', 'corn', 'pea', 'mushroom', 'rice', 'spinach', 'broth'],
    ingredients: ['1 chicken breast or thigh (sliced)', '1 cup mixed vegetables (peas, corn, mushrooms, spinach)', 'cooked rice to serve', '1 tbsp oil', 'soy sauce to taste'],
    steps: [
      'Heat oil in a skillet over high heat.',
      'Add chicken and cook until no longer pink, about 4–5 minutes.',
      'Add vegetables and stir-fry for 3 more minutes.',
      'Season with soy sauce. Serve over rice.'
    ]
  },
  {
    name: 'Beef Tacos',
    description: 'Simple ground beef tacos with cheese and salsa.',
    category: 'dinner',
    keywords: ['ground beef', 'beef', 'tortilla', 'salsa', 'cheese', 'sour cream'],
    ingredients: ['½ lb ground beef', '4 flour tortillas', '½ cup shredded cheese', 'salsa', 'sour cream (optional)'],
    steps: [
      'Cook ground beef in a skillet over medium heat, breaking it up, until browned. Drain fat.',
      'Season with salt, pepper, and any taco seasoning you have.',
      'Warm tortillas in a dry pan or microwave.',
      'Fill tortillas with beef, top with cheese and salsa.'
    ]
  },
  {
    name: 'Chicken Noodle Soup',
    description: 'Warm, comforting soup — great for using up chicken and broth.',
    category: 'dinner',
    keywords: ['chicken', 'broth', 'noodle', 'egg noodle', 'parsley', 'cilantro'],
    ingredients: ['1 cup cooked or raw chicken (shredded or sliced)', '4 cups chicken broth', '1 cup egg noodles or any pasta', 'salt and pepper', 'parsley to garnish (optional)'],
    steps: [
      'Bring broth to a boil in a pot.',
      'Add chicken and egg noodles.',
      'Simmer for 8–10 minutes until noodles are tender.',
      'Season with salt and pepper. Garnish with parsley if available.'
    ]
  },
  {
    name: 'Lentil Soup',
    description: 'Hearty and warming — lentils are a true pantry hero.',
    category: 'dinner',
    keywords: ['lentil', 'broth', 'canned tomato', 'tomato', 'olive oil'],
    ingredients: ['1 cup dried lentils', '4 cups broth', '1 can canned tomatoes', '1 tbsp olive oil', 'salt, pepper, cumin (optional)'],
    steps: [
      'Heat olive oil in a pot over medium heat.',
      'Add lentils, broth, and canned tomatoes.',
      'Bring to a boil, then reduce heat and simmer 20–25 minutes until lentils are soft.',
      'Season with salt, pepper, and cumin. Serve hot.'
    ]
  },
  {
    name: 'Chili',
    description: 'One-pot chili using canned beans, tomatoes, and whatever protein you have.',
    category: 'dinner',
    keywords: ['black bean', 'bean', 'chickpea', 'canned tomato', 'tomato', 'chili', 'ground beef', 'beef', 'corn', 'broth'],
    ingredients: ['1 can black beans or kidney beans (drained)', '1 can canned tomatoes', '½ lb ground beef (optional)', '1 can corn (optional)', 'chili powder, cumin, salt'],
    steps: [
      'If using beef, brown it in a pot over medium heat. Drain excess fat.',
      'Add canned tomatoes, beans, and corn.',
      'Pour in ½ cup broth or water and season generously with chili powder, cumin, and salt.',
      'Simmer 20 minutes. Serve with crackers or bread.'
    ]
  },
  {
    name: 'Pan-Seared Salmon',
    description: 'Simple salmon with butter and herbs — restaurant quality in 10 minutes.',
    category: 'dinner',
    keywords: ['salmon', 'butter', 'parsley', 'cilantro', 'olive oil'],
    ingredients: ['1–2 salmon fillets', '1 tbsp butter', '1 tbsp olive oil', 'salt and pepper', 'parsley or cilantro to garnish'],
    steps: [
      'Pat salmon dry and season with salt and pepper.',
      'Heat butter and olive oil in a skillet over medium-high heat.',
      'Place salmon skin-side down and cook for 4 minutes.',
      'Flip and cook another 2–3 minutes until just cooked through.',
      'Garnish with fresh herbs and serve.'
    ]
  },
  {
    name: 'Mushroom Risotto',
    description: 'Creamy rice with mushrooms — more impressive than it sounds.',
    category: 'dinner',
    keywords: ['mushroom', 'rice', 'broth', 'butter', 'parmesan', 'olive oil'],
    ingredients: ['1 cup rice (arborio is ideal but any works)', '2 cups mushrooms (sliced)', '3 cups warm broth', '2 tbsp butter', '¼ cup parmesan (optional)'],
    steps: [
      'Sauté mushrooms in 1 tbsp butter until golden, about 5 minutes. Set aside.',
      'In the same pan, toast the rice for 1 minute with remaining butter.',
      'Add broth one ladle at a time, stirring and waiting until absorbed before adding more.',
      'Repeat for about 20 minutes until rice is creamy and tender.',
      'Stir in mushrooms and parmesan. Season with salt and pepper.'
    ]
  },
  {
    name: 'Tofu Scramble',
    description: 'A hearty plant-based scramble — a great way to use up firm tofu.',
    category: 'dinner',
    keywords: ['tofu', 'spinach', 'mushroom', 'olive oil'],
    ingredients: ['1 block firm tofu', '1 cup spinach', '1 cup mushrooms (sliced)', '1 tbsp olive oil', 'soy sauce, salt, pepper, turmeric (optional)'],
    steps: [
      'Press tofu to remove excess water, then crumble into chunks.',
      'Heat oil in a skillet over medium heat.',
      'Add tofu and cook 5 minutes, breaking it up as you go.',
      'Add mushrooms and spinach, cook another 3 minutes.',
      'Season with soy sauce, salt, pepper, and a pinch of turmeric for color.'
    ]
  },
  {
    name: 'Steak with Garlic Butter',
    description: 'Simple pan-seared steak — a special meal with minimal ingredients.',
    category: 'dinner',
    keywords: ['steak', 'butter', 'parsley'],
    ingredients: ['1 steak (any cut)', '2 tbsp butter', 'salt and pepper', 'parsley to garnish'],
    steps: [
      'Let steak sit at room temperature for 30 minutes. Season generously with salt and pepper.',
      'Heat a cast-iron or heavy skillet over high heat until very hot.',
      'Cook steak 3–4 minutes per side for medium-rare, adjusting for desired doneness.',
      'Add butter in the last minute, basting the steak continuously.',
      'Rest for 5 minutes before slicing. Garnish with parsley.'
    ]
  },
  {
    name: 'Chickpea Curry',
    description: 'Filling plant-based curry entirely from pantry staples.',
    category: 'dinner',
    keywords: ['chickpea', 'canned tomato', 'tomato', 'coconut oil', 'broth', 'olive oil', 'rice'],
    ingredients: ['1 can chickpeas (drained)', '1 can canned tomatoes', '1 tbsp coconut oil or olive oil', 'curry powder, cumin, salt', 'rice to serve'],
    steps: [
      'Heat oil in a pot over medium heat.',
      'Add canned tomatoes and curry spices, cook 3 minutes.',
      'Add chickpeas and ½ cup water or broth. Simmer 15 minutes.',
      'Season with salt. Serve over rice.'
    ]
  },
  {
    name: 'Canned Salmon Patties',
    description: 'Quick pan-fried patties from canned salmon — crispy and satisfying.',
    category: 'dinner',
    keywords: ['salmon', 'egg', 'cracker', 'mayo', 'mayonnaise', 'parsley', 'cilantro'],
    ingredients: ['1 can salmon (drained)', '1 egg', '¼ cup crushed crackers', '2 tbsp mayo', 'parsley or cilantro (optional)', 'a little oil for frying'],
    steps: [
      'Mix drained salmon, egg, crushed crackers, and mayo in a bowl.',
      'Form into small patties (about palm-sized).',
      'Heat a little oil in a skillet over medium heat.',
      'Cook patties 3 minutes per side until golden. Serve hot.'
    ]
  },
  // ── SNACK / DESSERT ───────────────────────────────────────────────────────
  {
    name: 'Banana Oat Cookies',
    description: 'Two-ingredient cookies with zero added sugar — easy and delicious.',
    category: 'snack',
    keywords: ['oat', 'banana', 'honey', 'almond', 'chia', 'maple syrup'],
    ingredients: ['2 ripe bananas', '1 cup oats', 'honey or maple syrup (optional)', 'chopped almonds or chia seeds (optional)'],
    steps: [
      'Preheat oven to 350°F (175°C).',
      'Mash bananas in a bowl until smooth.',
      'Mix in oats and any optional add-ins.',
      'Spoon onto a lined baking sheet and flatten slightly.',
      'Bake 12–15 minutes until golden. Cool before eating.'
    ]
  },
  {
    name: 'Trail Mix',
    description: 'No-cook snack — combine whatever nuts and seeds you have.',
    category: 'snack',
    keywords: ['walnut', 'almond', 'chia', 'flax', 'protein powder', 'oat'],
    ingredients: ['¼ cup walnuts', '¼ cup almonds', '1 tbsp chia or flax seeds', 'dried fruit (optional)', 'a few chocolate chips (optional)'],
    steps: [
      'Combine all ingredients in a bowl or zip-lock bag.',
      'Mix well. Snack away. Store in an airtight container.'
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');

    await Recipe.insertMany(recipes);
    console.log(`Inserted ${recipes.length} recipes`);
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Done.');
  }
}

seed();
