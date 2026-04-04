const express = require("express"); // Declared express in the file
const mongoose = require("mongoose"); // Decalred mongoose in the file
const session = require("express-session"); //Decalred session to help remeber log in
const passport = require("passport"); // utilized passport for easy authentication
const passportLocalMongoose = require("passport-local-mongoose").default; //
const axios = require("axios");// Imported axios in other to utilize api
const app = express();
const port = 3000;
require("dotenv").config();
app.set("view engine", "ejs"); // We utilized ejs because html is static 
app.use("/css", express.static("css"));
app.use("/js", express.static("js"));



app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.DB_SECRET,
  resave: false,
  saveUninitialized: false
}));

mongoose.connect("mongodb://127.0.0.1:27017/kitchensync").then(() => console.log("MongoDB connected"));

const userSchema = new mongoose.Schema // Decalred user schema
  ({
    username: String,

  });

const foodSchema = new mongoose.Schema // Decalred food schema
  ({
    name: String,
    quantity: Number,
    expiryDate: Date,
    storage: {
      type: String,
      enum: ["pantry", "fridge", "freezer"]
    },
    imageUrl: String

  });
const recipeSchema = new mongoose.Schema // Declared recipe schema
  ({
    title: String,
    image: String,
    instructions: String,
    ingredients: [String],
    source: {
      type: String,
      enum: ["manual", "suggested"],
      default: "manual"
    },
    username: String,
    liked: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });


const Recipe = mongoose.model("Recipe", recipeSchema);
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
const Food = mongoose.model("Food", foodSchema);

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", (req, res) => {
  res.render("login");
});


app.post("/loginForm",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/"
  })
);

app.get("/add-item", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  res.render("add-item");
});


app.get("/add-recipe", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  res.render("add-recipe");
});




app.post("/register", async (req, res) => {
  console.log("User " + req.body.username + " is attempting to register");

  const oldUser = await User.findOne({
    username: req.body.username
  });
  if (oldUser) {
    return res.redirect("/");
  } else {
    const user = new User({ username: req.body.username });
    await User.register(user, req.body.password);

    req.login(user, (err) => {
      if (err) return res.redirect("/");
      res.redirect("/dashboard");
    });
  }

});



app.get("/dashboard", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  try {
    const foods = await Food.find({}); // get foods from database

    res.render("dashboard", {
      username: req.user.username,
      foods: foods
    });

  } catch (err) {
    console.log(err);
    res.send("Error loading dashboard");
  }
});

app.post("/addItemForm", async (req, res) => {
  try {
    const food = new Food({
      name: req.body.name,
      quantity: req.body.quantity,
      expiryDate: req.body.expiryDate,
      storage: req.body.storage,
      imageUrl: req.body.imageUrl
    });

    await food.save();
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.redirect("/add-item");
  }
});

app.get("/dashboard-summary", async (req, res) => {
  try {
    const foods = await Food.find();

    const today = new Date();
    const soonDate = new Date();
    soonDate.setDate(today.getDate() + 3);

    const totalItems = foods.length;

    const expiredItems = foods.filter(item =>
      item.expiryDate && new Date(item.expiryDate) < today
    ).length;

    const expiringSoonItems = foods.filter(item =>
      item.expiryDate &&
      new Date(item.expiryDate) >= today &&
      new Date(item.expiryDate) <= soonDate
    ).length;

    const lowStockItems = foods.filter(item =>
      item.quantity <= 1
    ).length;

    res.json({
      totalItems,
      expiredItems,
      expiringSoonItems,
      lowStockItems
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/add-recipe", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  try {
    const ingredientsArray = req.body.ingredients
      ? req.body.ingredients
        .split("\n")
        .map(item => item.trim())
        .filter(item => item !== "")
      : [];

    const recipe = new Recipe({
      title: req.body.title,
      image: req.body.image,
      instructions: req.body.instructions,
      ingredients: ingredientsArray,
      source: "manual",
      username: req.user.username
    });

    await recipe.save();
    res.redirect("/recipes");
  } catch (err) {
    console.log(err);
    res.send("Error adding recipe");
  }
});
app.get("/api/recipes/expiring-soon", async (req, res) => {
  try {
    const foods = await Food.find();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const soonDate = new Date();
    soonDate.setHours(0, 0, 0, 0);
    soonDate.setDate(soonDate.getDate() + 3);

    const expiringSoonFoods = foods.filter(item => {
      if (!item.expiryDate) return false;

      const expiry = new Date(item.expiryDate);
      expiry.setHours(0, 0, 0, 0);

      return expiry >= today && expiry <= soonDate;
    });

    const ingredientNames = expiringSoonFoods
      .map(item => item.name?.trim())
      .filter(Boolean);

    if (ingredientNames.length === 0) {
      return res.json([]);
    }

    const ingredient = ingredientNames[0];

    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`
    );

    const data = await response.json();

    res.json(data.meals || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/recipes", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  try {
    const recipes = await Recipe.find({ username: req.user.username }).sort({ createdAt: -1 });

    res.render("recipes", { recipes });
  } catch (err) {
    console.log(err);
    res.send("Error loading recipes");
  }
});

app.get("/freezer", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  try {
    const freezerFoods = await Food.find({ storage: "freezer" });

    res.render("freezer", {
      foods: freezerFoods
    });
  } catch (err) {
    console.log(err);
    res.send("Error loading freezer");
  }
});
app.get("/fridge", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  try {
    const foods = await Food.find({ storage: "fridge" });

    res.render("fridge", { foods });
  } catch (err) {
    console.log(err);
    res.send("Error loading fridge");
  }
});

app.get("/pantry", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  try {
    const foods = await Food.find({ storage: "pantry" });
    res.render("pantry", { foods });
  } catch (err) {
    console.log(err);
    res.send("Error loading pantry");
  }
});

app.get("/recipe-suggestions", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  try {
    const foods = await Food.find();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const soonDate = new Date();
    soonDate.setHours(0, 0, 0, 0);
    soonDate.setDate(soonDate.getDate() + 3);

    const expiringSoonFoods = foods.filter(food => {
      if (!food.expiryDate) return false;

      const expiry = new Date(food.expiryDate);
      expiry.setHours(0, 0, 0, 0);

      return expiry >= today && expiry <= soonDate;
    });

    const ingredientNames = expiringSoonFoods
      .map(food => food.name && food.name.trim())
      .filter(Boolean);

    if (ingredientNames.length === 0) {
      return res.render("recipe-suggestions", { recipes: [] });
    }

    let allMeals = [];

    for (const ingredient of ingredientNames) {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`
      );

      if (response.data.meals) {
        allMeals.push(...response.data.meals);
      }
    }

    const uniqueMeals = [];
    const seenIds = new Set();

    allMeals.forEach(meal => {
      if (!seenIds.has(meal.idMeal)) {
        seenIds.add(meal.idMeal);
        uniqueMeals.push(meal);
      }
    });

    const detailedRecipes = [];

    for (const meal of uniqueMeals.slice(0, 8)) {
      const detailResponse = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
      );

      const fullMeal = detailResponse.data.meals[0];

      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = fullMeal[`strIngredient${i}`];
        const measure = fullMeal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
          ingredients.push(`${measure ? measure : ""} ${ingredient}`.trim());
        }
      }

      detailedRecipes.push({
        title: fullMeal.strMeal,
        image: fullMeal.strMealThumb,
        instructions: fullMeal.strInstructions,
        ingredients: ingredients
      });
    }

    res.render("recipe-suggestions", { recipes: detailedRecipes });

  } catch (error) {
    console.log(error);
    res.send("Error loading recipe suggestions");
  }
});

app.post("/recipes/save", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  try {
    let ingredients = req.body.ingredients;

    if (!Array.isArray(ingredients)) {
      ingredients = ingredients ? [ingredients] : [];
    }

    const newRecipe = new Recipe({
      title: req.body.title,
      image: req.body.image,
      instructions: req.body.instructions,
      ingredients: ingredients,
      source: "suggested",
      username: req.user.username
    });

    await newRecipe.save();
    res.redirect("/recipes");
  } catch (error) {
    console.log(error);
    res.send("Could not save recipe");
  }
});

app.post("/like-recipe", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  try {
    await Recipe.findByIdAndUpdate(req.body.recipeId, {
      liked: true
    });

    res.redirect("/liked-recipes");
  } catch (err) {
    console.log(err);
    res.send("Error liking recipe");
  }
});

app.get("/liked-recipes", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  try {
    const likedRecipes = await Recipe.find({
      username: req.user.username,
      liked: true
    });

    res.render("liked-recipes", { likedRecipes: likedRecipes });
  } catch (err) {
    console.log(err);
    res.render("liked-recipes", { likedRecipes: [] });
  }
});


app.post("/delete-item", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  try {
    const foodId = req.body.foodId;

    await Food.findByIdAndDelete(foodId);

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.send("Error deleting item");
  }
});

app.post("/decrease-quantity", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  try {
    const food = await Food.findById(req.body.foodId);

    if (!food) {
      return res.redirect("/dashboard");
    }

    food.quantity = food.quantity - 1;

    if (food.quantity <= 0) {
      await Food.findByIdAndDelete(req.body.foodId);
    } else {
      await food.save();
    }

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.send("Error updating quantity");
  }
});
app.post("/delete-recipe", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  try {
    await Recipe.findByIdAndDelete(req.body.recipeId);
    res.redirect("/recipes");
  } catch (err) {
    console.log(err);
    res.send("Error deleting recipe");
  }
});
app.get("/recipes/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.send("Recipe not found");
    }

    res.render("recipe-details", { recipe });
  } catch (err) {
    console.log(err);
    res.send("Error loading recipe");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});