const mongoose = require('mongoose');

function connectToDB() {
    return mongoose.connect('mongodb://localhost/shop',
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        }
    );
}

connectToDB().then((res) => {
    console.log("consol log:connected to DB");
    const productSchema = new mongoose.Schema({
        id: Number,
        title: String,
        image: String,
        price: Number,
        description: String,
        quantity: Number,
        pdf_description: String,
    });

    const Product = mongjoose.model('Product', productSchema);
});