const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const campground = require("./models/campground");
const { urlencoded } = require("express");
const methodOverride = require("method-override");


mongoose.connect("mongodb://localhost:27017/yelp-camp",{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});

// Setting the view engine as ejs
app.set("view engine","ejs");

// Setting the ejs files folder as views folder in the project directory
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))

// This sets the response when we go to homepage(localhost:PORT)
app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/campgrounds", async (req,res)=>{
   const campgrounds = await campground.find({});
   res.render("campgrounds/index",{campgrounds})
})
app.get("/campgrounds/new",(req,res)=>{
    res.render("campgrounds/new");
})
app.get("/campgrounds/:id", async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show",{campground});
});

app.post("/campgrounds",async (req,res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id/edit", async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit",{campground});

})

app.put("/campgrounds/:id",async(req,res)=>{
    const {id} = req.params;
    const campground= await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
})


// To start server we start listening the denoted PORT of localhost
app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})