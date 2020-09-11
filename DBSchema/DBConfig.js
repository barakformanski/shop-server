var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    quantity: Number,
    pdf_description: String,
});
const Product = mongoose.model('Product', ProductSchema);


module.exports = Product;


// const aloeVereGel = new Product({
//     title: "ג'ל אלוורה  למריחה",
//     image: "https://gallery.foreverliving.com/gallery/ISR/image/products/skincare/aloeveragelly200.png",
//     price: 81,
//     description: "ג'ל האלוורה ידוע מזה אלפי שנים כמוצר על",
//     quantity: 40,
//     pdf_description: "https://gallery.foreverliving.com/gallery/ISR/download/products/Skin_care/61_Heb.pdf"
// });
// aloeVereGel.save();


