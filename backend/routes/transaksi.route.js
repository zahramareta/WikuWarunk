const express = require(`express`)
const app = express()
const transaksiController = require(`../controllers/transaksi.controller`)
const { authorization } = require(`../controllers/auth.controller`)

app.use(express.json())
app.get(`/transaksi`, authorization(["admin", "kasir", "manajer"]), transaksiController.getTransaksi)
app.post(`/transaksi`, authorization(["kasir"]), transaksiController.addTransaksi)
app.put(`/transaksi/:id_transaksi`, authorization(["kasir"]), transaksiController.updateTransaksi)
app.delete(`/transaksi/:id_transaksi`, authorization(["admin", "kasir"]), transaksiController.deleteTransaksi)
app.post(`/transaksi/find`, authorization(["kasir", "admin", "manajer"]), transaksiController.findTransaksi)
app.get(`/transaksi/chart`, authorization(["kasir", "manajer"]), transaksiController.chart)

module.exports = app