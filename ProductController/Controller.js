const mongoose = require("../DBSchema/DBConfig.js");
const ProductSchema = require("../DBSchema/DBConfig.js");
const Schema = require("../DBSchema/DBConfig.js");

const Controller = {
    insertProduct: async (data) => {
        try {
            const product = new Product(data);
            await product.save()
            return {
                status: 200,
                message: "Product inserted Successfully"
            }
        } catch (err) {
            return {
                status: 500,
                message: "Error " + err
            }
        }
    },
    deleteProduct: async (id) => {
        try {

        }
        return new Promise(function (resolve, reject) {
            ProductSchema.remove({ _id: id }).then(() => {
                resolve({ status: 200, message: "Product Removed" });
            }).catch(err => {
                reject({ status: 500, message: err });
            });
        })
    },
    deleteProduct: function (id) {
        return new Promise(function (resolve, reject) {
            ProductSchema.remove({ _id: id }).then(() => {
                resolve({ status: 200, message: "Product Removed" });
            }).catch(err => {
                reject({ status: 500, message: err });
            });
        })
    },
    updateProduct: function (id, data) {
        return new Promise((resolve, reject) => {
            ProductSchema.update({ _id: id }, data).then(() => {
                resolve({ status: 200, message: "Product updated Successfully" });
            }).catch(function (err) {
                reject({ status: 500, message: err });
            })
        });
    },
    searchAll: function () {
        return new Promise(function (resolve, reject) {
            ProductSchema.find().exec().then(function (data) {
                resolve({ status: 200, message: data });
            }).catch(function (err) {
                reject({ status: 500, message: err });
            });
        });
    },
    search: function (id) {
        return new Promise(function (resolve, reject) {
            ProductSchema.find({ _id: id }).exec().then(function (user) {
                resolve({ status: 200, message: user });
            }).catch((err) => {
                reject({ status: 500, message: err });
            })
        });
    },

};
module.exports = Controller;