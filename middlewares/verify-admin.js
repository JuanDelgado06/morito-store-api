const User = require('../models/user');
const vm = require('v-response');

module.exports = async (req, res, next) => {
    if(req.user) {
        const user = await User.findById(req.user.id);
        req.fullUser = user
        if (req.fullUser.rol === 'admin') {
            console.log('Eres admin');
            next();
        }  else {
            res.status(400)
                .json(vm.ApiResponse(false, 400, 'No tienes permisos'))
            next(new Error('No tienes permisos'));
        }
    }
}