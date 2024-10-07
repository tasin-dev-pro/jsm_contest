import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Food from "./models/Food.js";
import Restaurant from "./models/Restaurant.js";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import UserOfJSM from "./models/User.js";
import jwt from "jsonwebtoken";
const app = express();

app.use(cookieParser())

const salt = bcrypt.genSaltSync(10);
const secret = 'hgtye823etudgwetr6tgw7e386tr4';



app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://jsm-contest-fr-1.vercel.app"],
}));

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
app.get("/", (req,res) => {
    res.send("hello guys server is running!!!")
})
app.post('/register', async (req, res) => {
    const {username, email, password} = req.body
    try {
        const userDoc = await UserOfJSM.create({
            username,email,password:bcrypt.hashSync(password, salt),
        })
        res.send(userDoc)
    } catch (error) {
        res.status(400).json(error)
    }

})

app.post('/login', async (req, res) => {
    const {email, password} = req.body
    const userDoc = await UserOfJSM.findOne({email})
    const passOk = bcrypt.compareSync(password, userDoc.password)
    if(passOk) {
        //logged in
        jwt.sign({email: userDoc.email, id: userDoc._id},  secret, {}, (err, token) => {
            if(err) throw err
            res.cookie('token', token).json({
                id: userDoc._id,
                email: userDoc.email,
            })
        } )

    } else {
        res.status(401).json({msg: 'Invalid credentials'}, )
    }

})
app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if(err) throw err
        res.json(info)
    })
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
    const restaurantDoc = await    Restaurant.create({ name , rating , location }) ;
    res.json(restaurantDoc);
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})

app.listen(3001, async () => {
    console.log("running on port 3001");
})
