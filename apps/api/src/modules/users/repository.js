import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        role: {
            type: String,
            enum: ["admin", "member"],
            default: "member",
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

export async function findOrCreateUser({ email }) {
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({ email, role: "member" });
    }
    return user;
}

export async function findUserById(id) {
    return User.findById(id);
}
