import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Food from "./models/Food.js";

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


app.listen(3000)
