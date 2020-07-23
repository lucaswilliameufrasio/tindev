const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
    async index(req, res) {
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);

        if (!loggedDev) {
            return res.json({ message: 'Usuário não encontrado!' })
        }

        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } },
                { _id: { $nin: loggedDev.likes } },
                { _id: { $nin: loggedDev.dislikes } }
            ]
        })

        return res.json(users);
    },
    async store(req, res) {
        const { username } = req.body;

        const usersExists = await Dev.findOne({ user: username })

        if (usersExists) {
            return res.json(usersExists);
        }
        const response = await axios.get(`https://api.github.com/users/${username}`)

        if (!response) {
            return res.json({
                message: "User not found"
            })
        }

        const { name, bio, avatar_url: avatar } = response.data;

        const userName = !!name ? name : username;

        const dev = await Dev.create({
            name: userName,
            user: username,
            bio,
            avatar
        }).catch(error => console.log(error))

        return res.json(dev);
    }
}