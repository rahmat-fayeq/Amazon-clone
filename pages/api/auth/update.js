import { getSession } from "next-auth/react";
import User from "../../../models/User";
import db from "../../../utils/db";
import bcrypt from "bcryptjs";

const handler = async (req, res) => {
  if (req.method !== "PUT") {
    return res
      .status(400)
      .send({ message: `Method ${req.method} not allowed` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(422).json({ message: "You are not logged in" });
  }

  const { user } = session;
  const { name, email, password } = req.body;

  if (!name || !email || !email.includes("@") || !password.trim().length > 5) {
    return res.status(422).send({ message: "Validation error" });
  }

  await db.connect();
  const userExists = await User.findById(user._id);
  if (!userExists) {
    return res.status(422).send({ message: "User not found" });
  }

  userExists.name = name;
  userExists.email = email;
  if (password) {
    userExists.password = bcrypt.hashSync(password);
  }
  await userExists.save();

  return res.status(200).send({ message: "Profile updated successfully" });
};
export default handler;
