import mongoose from "mongoose";    
const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number 
    },
    location: {
     type: String ,
    }
});
const Restaurant  = mongoose.model("Restaurant", RestaurantSchema);
export default Restaurant;