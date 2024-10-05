import mongoose, {Schema} from "mongoose";

const UsersSchemaOfJsm  = new Schema({
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
        role: ['user', 'admin'],
        default: 'user',
    },

})

const UserOfJSM = mongoose.model('UserOfJSM', UsersSchemaOfJsm)

export default UserOfJSM;
