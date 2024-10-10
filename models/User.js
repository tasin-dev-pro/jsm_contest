import mongoose from 'mongoose';

const { Schema } = mongoose;

const UsersSchemaOfJsm = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  profilePic: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', // Default profile pic URL
  },
  profilePicPublicId: {
    type: String,
    default: null, // Store Cloudinary public_id for easier deletion
  },
cartItems: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' }, // Example for food items
    quantity: { type: Number, required: true },
  }],

  bio: {
    type: String,
    default: 'bio not added',
  },
});

const UserOfJSM = mongoose.model('UserOfJSM', UsersSchemaOfJsm);
export default UserOfJSM;
