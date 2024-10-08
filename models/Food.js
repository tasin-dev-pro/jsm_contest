import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    dishType: {
        type: String,
        required: true
    }
});

const Food = mongoose.model("Food", FoodSchema);
export default Food;
