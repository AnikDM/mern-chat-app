import User from "../model/user.model.js";
import generateTokenAndSetCookie from "../utils/getToken.js";

export const signup = async (req, res) => {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = new User({
            fullname,
            username,
            password,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        })
        await newUser.save();
        generateTokenAndSetCookie(newUser._id, res)
        return res.status(201).json(newUser);

    } catch (error) {
        return res.status(500).json({ error: error })
    }

}
export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password)
        return res.status(400).send({error:"Missing fields"});
    const user = await User.findOne({ username });
    generateTokenAndSetCookie(user._id, res)
    if (user) {
        if (user.password === password)
            return res.status(201).json({ _id: user._id, username: user.username, fullname: user.fullname, profilePic: user.profilePic });
        else
            return res.status(201).json({ error: 'Wrong Password' })
    } else {
        return res.status(404).json({error:'No Account Found'})
    }
    } 
    catch (error) {
        console.log(error)
        if(error.message==="Cannot read properties of null (reading '_id')")
        return res.status(404).json({ error:"User doesn't exist!" })

        return res.status(500).json({ error:"Internal Error" })
    }
}
export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge:0 });
        return res.status(201).json({message:"succesfully logged out"})
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}