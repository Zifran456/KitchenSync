const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose").default;
const app = express();
const port = 3000;
require("dotenv").config(); 
app.set("view engine", "ejs");
app.use("/css", express.static("css"));
app.use("/js", express.static("js"));



app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.DB_SECRET,
    resave: false,
    saveUninitialized: false
}));

mongoose.connect("mongodb://127.0.0.1:27017/kitchensync").then(() => console.log("MongoDB connected"));

const userSchema = new mongoose.Schema({
  username: String,
 
});

const foodSchema = new mongoose.Schema({
  name:String,
  quantity:Number,
  expiryDate: Date, 
  storage: {
    type:String,
    enum: ["pantry","fridge","freezer"]
  },
  imageUrl:String

});

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
  res.render("add-item");
});

app.get("/liked-recipes", (req, res) => {
  res.render("liked-recipes");
});



app.post("/register", async (req, res) => {
  console.log( "User " + req.body.username + " is attempting to register" );

  const oldUser = await User.findOne({
    username: req.body.username
  });
  if(oldUser){
    return res.redirect("/");
  }else{
    const user = new User({username: req.body.username});
    await User.register( user, req.body.password); 

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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});