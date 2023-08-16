'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail_transaksi extends Model {

    static associate(models) {
      this.belongsTo(models.transaksi, {
        foreignKey: `id_transaksi`, as: `transaksi`
      })

      this.belongsTo(models.menu, {
        foreignKey: `id_menu`, as: `menu`
      })
    }
  }
  detail_transaksi.init({
    id_detail_transaksi: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER 
    },
    id_transaksi: DataTypes.INTEGER,
    id_menu: DataTypes.INTEGER,
    harga: DataTypes.DOUBLE,
    jumlah: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'detail_transaksi',
    tableName: 'detail_transaksi'
  });
  return detail_transaksi;
};