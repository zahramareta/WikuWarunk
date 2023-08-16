const jwt = require(`jsonwebtoken`)
const userModel = require(`../models/index`).user
const md5 = require(`md5`)

async function verifyToken(token) {
    try {
        let secretKey = `sixnature`
        let decode = jwt.verify(token, secretKey)
        return true
    } catch (error) {
        return false
    }
}

exports.authentication = async (request, response) => {
    try {
        //grab username & password
        let params = {
            username: request.body.username,
            password: md5(request.body.password)
        }

        //check user exist
        let result = await userModel.findOne({ where: params })

        //validate result
        if (result) {
            //if exist -> generate token, define secret key of jwt
            let secretKey = `sixnature`

            //define header of jwt
            let header = {
                algorithm: "HS256"
            }

            //define payload
            let payload = JSON.stringify(result)

            //generate token 
            let token = jwt.sign(payload, secretKey, header)

            //give response
            return response.json({
                status: true,
                token: token,
                message: `Login berhasil`,
                data: result
            })
        } else {
            return response.json({
                status: false,
                message: `Invalid username / password`
            })
        }

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

exports.authorization = (roles) => {
    return async function (request, response, next) {
        try {
            // grab data header
            let headers = request.headers.authorization

            // grab data token
            let token = headers?.split(" ")[1] //? -> antisipasi jika variabel tsb null / undefined, split -> string mnjd array

            if (token == null) {
                return response.status(401).json({
                    status: false,
                    message: `Unauthorized`
                })
            }

            // verify token
            if (!await verifyToken(token)) {
                return response.status(401).json({
                    status: false,
                    message: `Invalid Token`
                })
            }

            // decrypt token to plain text
            let plainText = jwt.decode(token)

            // check allowed roles
            if (!roles.includes(plainText?.role)) {
                return response.status(403).json({
                    status: false,
                    message: `Forbidden Acces`
                })
            }

            next()

        } catch (error) {
            return response.json({
                status: false,
                message: error.message
            })
        }
    }
}