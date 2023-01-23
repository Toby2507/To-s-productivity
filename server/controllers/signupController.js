const User = require('../models/User');
const bcrypt = require('bcrypt');
const errorHandler = require('../middlewares/errorHandler');

const signupController = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required' });
    const user = await User.findOne({ username }).exec();
    if (user) return res.sendStatus(409);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });
        res.status(201).json({ 'message': `New user ${username} created.` });
    } catch (err) {
        errorHandler(err, req, res);
    }
}

module.exports = signupController;