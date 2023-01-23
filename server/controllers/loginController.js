const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginController = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required' })
    const user = await User.findOne({ username }).exec()
    if (!user) return res.sendStatus(401)
    const match = await bcrypt.compare(password, user.password)
    if (match) {
        const accessToken = jwt.sign({ username: user.username, userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign({ username: user.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
        user.refreshToken = refreshToken
        await user.save()
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
        res.json({ userId: user._id, accessToken })
    } else {
        res.sendStatus(401)
    }
}

module.exports = loginController