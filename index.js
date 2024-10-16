import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Food from "./models/Food.js";
import Restaurant from "./models/Restaurant.js";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import { v2 as cloudinary } from 'cloudinary';
import UserOfJSM from "./models/User.js";
import jwt from "jsonwebtoken";
const app = express();

app.use(cookieParser())

const salt = bcrypt.genSaltSync(10);
const secret = 'hgtye823etudgwetr6tgw7e386tr4';



app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173","http://localhost:5174", "https://jsm-contest-fr-1.vercel.app"],
}));
mongoose.connect("mongodb+srv://r11137307:todo_myapp@todo.8yhhs.mongodb.net/?retryWrites=true&w=majority&appName=todo");


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.delete('/deleteImage', async (req, res) => {
  const { public_id } = req.body; // public_id of the image to delete
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    res.json({ message: 'Image deleted successfully', result });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Failed to delete image', error });
  }
});

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
        jwt.sign({ email: userDoc.email, id: userDoc._id }, secret, { expiresIn: '1d' }, (err, token) => {
    if (err) throw err;
    res.cookie('token', token).json({
        id: userDoc._id,
        email: userDoc.email,
    });
});


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
const findUserByEmail = async (email) => {
    return await UserOfJSM.findOne({ email:email });
  };
const findUserByEmailAndUpdate = async (email, data) => {
    return await UserOfJSM.findOneAndUpdate({ email }, {data}, {new: true});
  };
app.get("/getProfile/:email", async(req, res) => {
    const userDoc = await findUserByEmail(req.params.email);
    res.json(userDoc);
})
app.put("/updateFoods/:id", async(req,res)=>{
    const foodupdate =await Food.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.json(foodupdate);
})
app.put("/updateUser/:email", async(req,res)=>{
    const email = req.params.email
    const foodupdate = await UserOfJSM.findOneAndUpdate({ email }, req.body, { new: true });

    res.json(foodupdate);
})


app.delete("/deleteFoods/:id", async(req,res)=>{
    const foodupdate =await Food.findByIdAndDelete(req.params.id,req.body);
    res.json(foodupdate);
})


// Retaurant Crud Operations
app.post("/createRetaurant", async (req, res) => {
    const { description, address, contact, image_url, } = req.body;
    const restaurantDoc = await    Restaurant.create({ description: description, address: address, contact: contact, image_url: image_url }); ;
    res.json(restaurantDoc);
})
app.get("/getRetaurants", async (req, res) => {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})

//cart crud operations
app.post("/cart/add", async (req, res) => {
    const { email, productId, quantity } = req.body;

    try {
        // Find user by email
        const user = await UserOfJSM.findOne({ email });

        // Check if item is already in cart
        const itemIndex = user.cartItems.findIndex(item => item.productId == productId);

        if (itemIndex > -1) {
            // If item exists in the cart, update its quantity
            user.cartItems[itemIndex].quantity += quantity;
        } else {
            // If item does not exist, add it to cart
            user.cartItems.push({ productId, quantity });
        }

        // Save user with updated cart
        await user.save();

        res.json({ message: "Item added to cart", cartItems: user.cartItems });
    } catch (error) {
        res.status(500).json({ error: "Failed to add item to cart", details: error });
    }
});
app.get("/cart/:email", async (req, res) => {
    const { email } = req.params;

    try {
        // Find user by email
        const user = await UserOfJSM.findOne({ email }).populate('cartItems.productId'); // Optional: populate product details

        res.json({ cartItems: user.cartItems });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve cart", details: error });
    }
});

app.delete("/cart/remove", async (req, res) => {
    const { email, productId } = req.body;

    try {
        // Find user by email
        const user = await UserOfJSM.findOne({ email });

        // Filter out the item to remove from the cart
        user.cartItems = user.cartItems.filter(item => item.productId != productId);

        // Save the updated user
        await user.save();

        res.json({ message: "Item removed from cart", cartItems: user.cartItems });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove item from cart", details: error });
    }
});




app.listen(3001, async () => {
    console.log("running on port 3001");
})
