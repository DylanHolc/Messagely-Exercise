/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
const Router = require('express').Router;
const router = new Router();
const expressError = require('../expressError');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const User = require('../models/user');

router.post('/login', async (req, res, next) => {
    try {
        let { username, password } = req.body;
        if (await User.authenticate(username, password)) {
            let token = jwt.sign({ username }, SECRET_KEY);
            User.updateLoginTimestamp(username);
            return res.json({ token });
        }
        else {
            throw new expressError('Invalid username and/or password', 401);
        }

    } catch (e) {
        return next(e);
    }
})

router.post('/register', async (req, res, next) => {
    try {
        let { username } = await User.register(req.body);
        let token = jwt.sign(username);
        User.updateLoginTimestamp(username);
        return res.json({ token });
    } catch (e) {
        return next(e);
    }
})

module.exports = router;