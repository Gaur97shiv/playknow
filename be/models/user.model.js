import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    followers: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    },
    following: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    },
    profilePicture: {
        type: String,
        default: "https://via.placeholder.com/150",
    },
    	profileImg: {
			type: String,
			default: "",
		},
		coverImg: {
			type: String,
			default: "",
		},
    bio: {
        type: String,
    },
   likedPost:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post",
    default:[]
   }],
   balance: {
    type: Number,
    default: 100, // Initial balance for all users
    min: 0
   }
},
	{ timestamps: true }

)
const User=mongoose.model("User", userSchema);
export default User;    
