import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String },
});

const User = mongoose.model("User", userSchema);
export default User;
