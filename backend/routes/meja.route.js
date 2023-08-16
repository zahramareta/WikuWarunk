const express = require(`express`)
const app = express()

app.use(express.json())

const mejaController = require(`../controllers/meja.controller`)
const { authorization } = require(`../controllers/auth.controller`)

/** route to get all data meja */
app.get(`/meja`, authorization(["admin", "kasir"]), mejaController.getMeja);

/** route to get available meja */
app.get(`/meja/available`, authorization(["admin", "kasir"]), mejaController.availableMeja)

/** route to add new meja */
app.post(`/meja`, authorization(["admin", "kasir"]), mejaController.addMeja)

/** route to update meja */
app.put(`/meja/:id_meja`, authorization(["admin", "kasir"]), mejaController.updateMeja)

/** route to delete meja */
app.delete(`/meja/:id_meja`, authorization(["admin", "kasir"]), mejaController.deleteMeja)

/** export app object */
module.exports = app