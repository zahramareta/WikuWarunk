const { response } = require("express")
const { Op } = require('sequelize')
const { request } = require("../routes/transaksi.route")

const transaksiModel = require(`../models/index`).transaksi
const detailModel = require(`../models/index`).detail_transaksi
const menuModel = require(`../models/index`).menu 
const userModel = require(`../models/index`).user

const Sequelize = require('sequelize');
const mejaModel = require("../models/index").meja

const sequelize = new Sequelize('wikusama_cafe', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});

exports.addTransaksi = async (request, response) => {
    try {
        let newTransaksi = {
            tgl_transaksi: request.body.tgl_transaksi,
            id_user: request.body.id_user,
            id_meja: request.body.id_meja,
            nama_pelanggan: request.body.nama_pelanggan,
            status: `belum_bayar`
        }

        let insertTransaksi = await transaksiModel.create(newTransaksi)

        let latestID = insertTransaksi.id_transaksi 
        let arrDetail = request.body.detail_transaksi

        for (let i = 0; i < arrDetail.length; i++) {
            arrDetail[i].id_transaksi = latestID
            
            let selectedMenu = await menuModel.findOne({
                where: {id_menu: arrDetail[i].id_menu}
            })

            arrDetail[i].harga = selectedMenu?.harga

        }

        await detailModel.bulkCreate(arrDetail)
        //bulkCreate -> mengcreate dlm jumlah besar

        await mejaModel.update({
            status: 0
        },
        {where: {id_meja: request.body.id_meja}})

        return response.json({
            status: true,
            message: `Data transaksi telah ditambahkan`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

exports.updateTransaksi = async (request, response) => {
    try {
        let id_transaksi = request.params.id_transaksi
        let dataTransaksi = {
            tgl_transaksi: request.body.tgl_transaksi,
            id_user: request.body.id_user,
            id_meja: request.body.id_meja,
            nama_pelanggan: request.body.nama_pelanggan,
            status: request.body.status
        }

        await transaksiModel.update(
            dataTransaksi, {
                where: {id_transaksi: id_transaksi}
            }
        )

        await detailModel.destroy({
            where: {id_transaksi: id_transaksi}
        })

        let arrDetail = request.body.detail_transaksi

        for (let i = 0; i < arrDetail.length; i++) {
            arrDetail[i].id_transaksi = id_transaksi
            
            let selectedMenu = await menuModel.findOne({
                where: {id_menu: arrDetail[i].id_menu}
            })

            arrDetail[i].harga = selectedMenu?.harga
            
        }

        await detailModel.bulkCreate(arrDetail)

        await mejaModel.update({
            status: 1
        }, {where: {id_meja: request.body.id_meja}})

        return response.json({
            status: true,
            message: `Data transaksi telah diupdate`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        }) 
    }
}

exports.deleteTransaksi = async (request, response) => {
    try {
        let id_transaksi = request.params.id_transaksi

        await detailModel.destroy({
            where: {id_transaksi: id_transaksi}
        })

        await transaksiModel.destroy({
            where: {id_transaksi: id_transaksi}
        })

        

        return response.json({
            status: true,
            message: `Data transaksi telah dihapus`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

exports.getTransaksi = async (request, response) => {
    try {
        let result = await transaksiModel.findAll({
            include: [
                "meja",
                "user",
                {model: detailModel, as: "detail_transaksi", include: ["menu"]}
            ],
            order: [
                ['tgl_transaksi', 'DESC']
            ]
        })

        return response.json({
            status: true,
            data: result
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

exports.findTransaksi = async (request, response) => {
    try {
        let keyword = request.body.keyword
        let result = await transaksiModel.findAll({
            include: [
                "meja",
                {
                    model: userModel, as: "user", where: {
                        [Op.or]: {
                            nama_user: { [Op.substring]: keyword }
                        }
                    }
                },
                {model: detailModel, as: "detail_transaksi", include: ["menu"]}
            ]
        })

        return response.json({
            status: true,
            data: result
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

exports.chart = async (request, response) => {
    try {
        const [results, metadata] = await sequelize.query(
            `SELECT m.nama_menu, SUM(dt.jumlah) AS jumlah_beli 
            FROM detail_transaksi dt JOIN menu m ON
            dt.id_menu = m.id_menu GROUP BY m.nama_menu ORDER BY jumlah_beli DESC LIMIT 5`);

            return response.json({
                status: true,
                data: results
            })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}