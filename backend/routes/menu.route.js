const express = require('express')
const app = express()

const menuController = require('../controllers/menu.controller')
const { authorization } = require(`../controllers/auth.controller`)

app.post('/menu', authorization(["admin"]), menuController.addMenu)
app.get('/menu', authorization(["admin", "kasir"]), menuController.getMenu)
app.post('/menu/find', authorization(["admin", "kasir"]), menuController.findMenu)
app.put(`/menu/:id_menu`, authorization(["admin"]), menuController.updateMenu)
app.delete(`/menu/:id_menu`, authorization(["admin"]), menuController.deleteMenu)

module.exports = app