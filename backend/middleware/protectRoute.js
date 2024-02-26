import jwt from 'jsonwebtoken'
import User from '../model/user.model.js';

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.status(401).send({ msg: "No token, authorization denied" });
        //Verify Token
        const verifiedToken = jwt.verify(token, process.env.JWT_KEY);
        if (!verifiedToken)
            return res.status(403).send({ msg: 'Invalid Token' });
        const {userId}=verifiedToken;
        const user = await User.findById(userId).select("-password")
        if (!user) return res.status(401).send({ msg: "No user found" });

        req.user = user;
        next();

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error })
    }
}
export default protectRoute