import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  socialOnly: { type: Boolean, required: true, default: false },
  social: { type: String },
  avatarUrl: { type: String },
});

// pre는 첫번째 파라미터로 설정된 event가 발생하기 전에 callback 함수를 실행시킨다.
// "save" 이벤트는 Model.create / Model.save에 발생한다.
userSchema.pre("save", async function () {
  // isModified()는 해당값이 db에 기록된 값과 비교해서 변경된 경우 true, 그렇지 않은 경우 false를 반환한다.
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
