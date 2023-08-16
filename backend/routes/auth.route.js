const express = require(`express`)
const app = express()
const authController = require(`../controllers/auth.controller`)

app.use(express.json())
app.post(`/auth`, authController.authentication)

module.exports = app