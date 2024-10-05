import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Food from "./models/Food.js";
import Restaurant from "./models/Restaurant.js";

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://r11137307:todo_myapp@todo.8yhhs.mongodb.net/?retryWrites=true&w=majority&appName=todo");

app.post("/createFood", async (req, res) => {
    const { name, description, price } = req.body;
    const foodDoc = await Food.create({ name, description, price });
    res.json(foodDoc);
})
app.get("/getFoods", async (req, res) => {
    const foods = await Food.find();
    res.json(foods);
})

app.put("/updateFoods/:id", async(req,res)=>{
    const foodupdate =await Food.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.json(foodupdate);    
})


app.delete("/deleteFoods/:id", async(req,res)=>{
    const foodupdate =await Food.findByIdAndDelete(req.params.id,req.body);
    res.json(foodupdate);    
})
 

// Retaurant Crud Operations
app.post("/createRetaurant", async (req, res) => {
    const { name, rating , location } = req.body;
    const restaurantDoc = await Restaurant.create({ name , rating , location }) ;
    res.json(restaurantDoc);
}) 



app.listen(3000)
