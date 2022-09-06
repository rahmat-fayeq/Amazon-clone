import bcrypt from "bcryptjs";
import User from "../../../models/User";
import db from "../../../utils/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }
  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 5
  ) {
    return res.status(422).json({ message: "Please enter valid credentials" });
  }

  await db.connect();

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.status(422).json({ message: "User already exists" });
    db.disconnect();
    return;
  }

  const newUser = new User({
    name,
    email,
    password: bcrypt.hashSync(password),
    isAdmin: false,
  });
  const user = await newUser.save();

  return res.status(201).send({
    message: "User created successfully",
    _id: user._id,
    name: user.name,
    email: user.email,
    password: user.password,
    isAdmin: user.isAdmin,
  });
}
export default handler;
