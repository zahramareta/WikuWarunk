const { request } = require('express')
const multer = require('multer')
const configStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './menu_image')
    },
    filename: (request, file, callback) => {
        callback(null, `image-${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({
    storage: configStorage,
    fileFilter: (requuest, file,callback) => {
        const extension = [`image/jpg`, `image/png`, `image/jpeg`]
        
        if (!extension.includes(file.mimetype)) {
            callback(null, false)
            return callback(null, 'Invalid type of file')
        }

        const maxSize = (1 * 1024 * 1024)
        const fileSize = request.header[`content-length`]

        if (fileSize > maxSize) {
            callback(null, false)
            return callback(null, `Invalid size of file`)
        }

        callback(null, true)
    }
})

module. exports = upload