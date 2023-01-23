const User = require('../models/User');
const jwt = require('jsonwebtoken');

const refreshTokenController = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    const user = await User.findOne({ refreshToken }).exec();
    if (!user) return res.sendStatus(403);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || decoded.username !== user.username) return res.sendStatus(403);
            const accessToken = jwt.sign({ username: user.username, userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            res.json({ userId: user._id, accessToken })
        }
    )
}

module.exports = refreshTokenController;