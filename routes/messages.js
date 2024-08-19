/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

const Router = require('express').Router;
const router = new Router();
const expressError = require('../expressError');
const Message = require('../models/message');
const { ensureLoggedIn } = require("../middleware/auth");

router.get('/:id', ensureLoggedIn, async (req, res, next) => {
    try {
        let { id } = req.params;
        const message = await Message.get(id);
        if (message.to_user.username !== username && message.from_user.username !== username) {
            throw new expressError("Not authorized to read this message", 401);
        }

        return res.json({ message });

    } catch (e) {
        return next(e);
    }
})

router.post('/', ensureLoggedIn, async (req, res, next) => {
    try {
        let { from_username, to_username, body } = req.body;
        let message = await Message.create({ from_username, to_username, body });
        return res.json({ 'message': message });

    } catch (e) {
        return next(e);
    }
})

router.post('/:id/read', ensureLoggedIn, async (req, res, next) => {
    try {
        let username = req.user.username;
        let { id } = req.params;
        let message = await Message.get(id);

        if (message.to_user.username !== username) {
            throw new expressError("Not authorized to set this message to read", 401);
        }
        let readMessage = await Message.markRead(id);

        return res.json({ readMessage });

    } catch (e) {
        return next(e);
    }
})