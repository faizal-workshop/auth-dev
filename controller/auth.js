const { APP_NAME } = require('../src/configs');
const supabase = require('../src/supabase');
const jwt = require('jsonwebtoken');
const validateToken = require('../service/validateToken');

module.exports = {
    login: async (req, res) => {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (!error) {
            return res.status(200).send({
                application: APP_NAME,
                message: 'Get user success',
                data: data.session.access_token,
            });
        }

        return res.status(401).send({
            application: APP_NAME,
            message: error.message,
        });
    },
    register: async (req, res) => {
        const { name, email, password } = req.body;
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });

        if (!error) {
            return res.status(201).send({
                application: APP_NAME,
                message: 'Create user success',
                data,
            });
        }

        return res.status(401).send({
            application: APP_NAME,
            message: error.message,
        });
    },
    checkToken: async (req, res) => {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];

        if (token) {
            const error = await validateToken(token);

            if (error) {
                return res.status(401).send({
                    application: APP_NAME,
                    message: error.message,
                });
            }

            const decodedToken = jwt.decode(token);
            const expirationTime = decodedToken.exp;
            const currentTimeInSeconds = Math.floor(Date.now() / 1000);
            const remainingTimeInSeconds = expirationTime - currentTimeInSeconds;
            const remainingTime = {
                hours: Math.floor(remainingTimeInSeconds / 3600),
                minutes: Math.floor((remainingTimeInSeconds % 3600) / 60),
                seconds: remainingTimeInSeconds % 60,
            };

            return res.status(201).send({
                application: APP_NAME,
                message: 'Token valid',
                data: {
                    remainingTime,
                    token,
                },
            });
        } else {
            return res.status(401).send({
                application: APP_NAME,
                message: 'Missing authentication token!',
            });
        }
    },
    getUser: async (req, res) => {
        // const { data: { users }, error } = await supabase.auth.admin.listUsers();
    },
    getUserId: async (req, res) => {
        // const { data: { user } } = await supabase.auth.getUser();
    },
    updateUser: async (req, res) => {
        const id = req.params.id;
        const { name, email, password } = req.body;

        // const data = {};
        // if (name) data.name = name;
        // if (email) data.email = email;
        // if (password) data.password = await bcrypt.hash(password, 10);

        // await supabase.auth.updateUser(data);

        // return res.status(200).send({
        //     application: APP_NAME,
        //     message: 'Update user success',
        // });
    },
    deleteUser: async (req, res) => {

        // return res.status(204).send({
        //     application: APP_NAME,
        //     message: 'Delete all user success',
        // });
    },
    deleteUserId: async (req, res) => {
        const id = req.params.id;

        // return res.status(204).send({
        //     application: APP_NAME,
        //     message: 'Delete user success',
        // });
    },
}
