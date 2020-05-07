const User = require('../models/user.js');
const vm = require('v-response');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const create = async (req, res) => {
    if(!req.body.email || !req.body.password) {
        return res.status(400)
            .json(vm.ApiResponse(false, 400, 'Email y password son obligatorios'))
    } else {
        // extraer email y password
        try {
            const { email } = req.body;
            //Comprobamos si el usuario existe
            let user = await User.findOne({ email});
            if (user) {
                return res.status(400)
                    .json(vm.ApiResponse(false, 400, 'El usuario ya existe'))
            }
            //SI no existe
            req.body.password = await bcrypt.hash(req.body.password, 10);
            user = new User(req.body);
            await user.save();

            const payload = {
                user : {
                    id : user.id
                }
            }
            let token = jwt.sign(payload, process.env.PASS_TOKEN, {
                expiresIn: 3600 //Una hora
            })
            return res.json({
                success: true,
                token: token,
                message: "Usuario creado"
            })

        } catch (e) {
            console.log("Ojito", e);
            return res.status(500)
                .json(vm.ApiResponse(false, 500, "Ocurrio un error", e))
        }
    }
}
const profile = async (req, res) => {
    try {
        let user = await User.findById(req.user.id).select('-password');
        res.json({user});
    } catch (e) {
        return res.status(500)
            .json(vm.ApiResponse(false, 500, "", e));
    }
}
const login = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email});
        if ( user ) {
            let math = await bcrypt.compare(req.body.password, user.password);
            if (math) {
                const payload = {
                    user : {
                        id : user.id
                    }
                }
                let token = jwt.sign(payload, process.env.PASS_TOKEN, {
                    expiresIn: 3600 //Una hora
                })
                res.status(200).json({ user, token });
            } else {
                return res.status(404)
                    .json(vm.ApiResponse(false, 404, "La contraseña es incorreta"));
            }
        } else {
            return res.status(404)
                    .json(vm.ApiResponse(false, 404, "El usuario no existe"));
        }
    } catch (e) {
        console.log(e);
        return res.status(500)
            .json(vm.ApiResponse(false, 500, "Ojito",e));
    }
}

module.exports = {
    create,
    profile,
    login
}