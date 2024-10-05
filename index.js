import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Food from "./models/Food.js";

const app = express();

app.use(cookieParser())

const salt = bcrypt.genSaltSync(10);
const secret = 'hgtye823etudgwetr6tgw7e386tr4';



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
app.post("/register", async (req, res) => {
    const { username, password, email, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, salt);
    const userDoc = await UserOfJSM.create({ username, password: hashedPassword, email, role });
    res.json(userDoc);
})

app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    const userDoc = await UserOfJSM.findOne({email});
    const passOk = await bcrypt.compareSync(password, userDoc.password)
    if(passOk){
        jwt.sign({email: userDoc.email, id: userDoc.id}, secret, {}, (err, token) => {
            if(err) throw err
            res.cookie('token', token).json("success")
        })
    }
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
