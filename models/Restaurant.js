import mongoose from "mongoose";
const restaurantSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  contact: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  image_url: {
    type: String,
    required: true
  },
  
});

// Create the model
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant
