import User from "../models/User.js";

export const getUserById = async (id) => {
  await User.findById(id);
}