import User from "../model/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUser=req.user._id;
        const allUsers=await User.find({_id:{$ne:loggedInUser }}).select("-password")
        return res.status(201).json(allUsers);
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Error getting users for sidebar" });
    }
}