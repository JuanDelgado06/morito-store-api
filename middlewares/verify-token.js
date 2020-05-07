const jwt = require('jsonwebtoken');
const vm = require('v-response');

module.exports = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers["authorization"];
    let checkBearer = "Bearer ";
    
    if(token) {
        if (token.startsWith(checkBearer)) {
            token = token.slice(checkBearer.length, token.length);
        }
        try {
            let decoded = jwt.verify(token, process.env.PASS_TOKEN);
            req.user = decoded.user;
            next();
        } catch (e) {
            return res.status(400)
                .json(vm.ApiResponse(false, 400, 'Token no valido'))
        }
    } else {
        return res.status(400)
            .json(vm.ApiResponse(false, 400, "Sin token"))
    }
}
