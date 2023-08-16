const express = require(`express`)
const app = express()
const userController = require(`../controllers/user.controller`)
const { authorization } = require(`../controllers/auth.controller`)

app.use(express.json())

app.get(`/user`, authorization(["admin", "manajer"]), userController.getUser)
app.post(`/user/find`, authorization(["admin", "manajer"]), userController.findUser)
app.post(`/user`, authorization(["admin", "manajer"]), userController.addUser)
app.put(`/user/:id_user`, authorization(["admin", "manajer"]), userController.updateUser)
app.delete(`/user/:id_user`, authorization(["admin", "manajer"]), userController.deleteUser)

module.exports = app
