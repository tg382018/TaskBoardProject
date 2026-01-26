import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true, //index
            trim: true, //boşluk silelim
            lowercase: true, //küçük harf
        },
        name: {
            type: String,
            trim: true,
        },
        password: {
            type: String, // bcrypt hash
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ["admin", "member"],
            default: "member", //default role
        },
    },
    {
        timestamps: true, //createdAt, updatedAt
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password; // Never expose password hash in API responses
                delete ret.__v; // Remove version key
                return ret;
            },
        },
        toObject: {
            transform: (doc, ret) => {
                delete ret.password;
                delete ret.__v;
                return ret;
            },
        },
    }
);

export const User = mongoose.model("User", userSchema); //mongo model ve koleksiyon

export async function findOrCreateUser({ email }) {
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({ email, role: "member" });
    }
    return user;
}

export async function findUserById(id) {
    //getMe
    return User.findById(id);
}

export async function findUserByEmail(email) {
    return User.findOne({ email });
}

export async function updateUser(id, data) {
    return User.findByIdAndUpdate(id, { $set: data }, { new: true });
}
