import mongoose from "mongoose";
import Food from "./Food.js";
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
    },
    // availableFoods: [Food]
//     cabins: [{
//         totalCabins: {
//             type: Number,
//         },
//         class: {
//             type: String,
//             enum: ["regular", "vip", "public", "private"],
//             default: "regular",
//         },
//         isBooked: {
//             type: Boolean,
//             default: false
//         }
// }]
});
const Restaurant  = mongoose.model("Restaurant", RestaurantSchema);
export default Restaurant;
