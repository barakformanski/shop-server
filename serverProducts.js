const express = require("express");
const fs = require("fs");
const util = require('util');
const app = express();
const bodyParser = require("body-parser");
// the next line prefer to Routes.js file that i not useing yet
// const Routes = require('./Routes');
const mongoose = require('mongoose');
const Product = require('./DBSchema/DBConfig');

const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT ? process.env.PORT : 8000;
console.log("PORT:", process.env.PORT);
app.use(bodyParser.json());
const path = require("path");
const accesLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    { flags: "a" }
);

// const myLogger = (req, res, next) => {
//     console.log("someone enterd to my site", Date.now());
//     next();
// };
const morgan = require('morgan');

// app.use(myLogger);
// const socketServer = require('./src/modules/SocketServer.js')
const http = require("http");
const socketIo = require("socket.io");
// const { connect } = require("http2");
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
    console.log("שים לב! לקוח נוסף התחבר");
    socket.on("disconnect", () => {
        console.log("שים לב! לקוח פלוני סיים התנתק");
    });
});
app.use(cors());



app.use(
    morgan(

        "METHOD: :method :url :status :res[content-length] - :response-time ms"
    )
);
app.use(morgan('combined', { stream: accesLogStream }));

// not working
app.use("/images", express.static("src/images"));

app.post("/login", (req, res) => {
    const { email, pass } = req.body;
    if (email === process.env.ADMIN_EMAIL && pass === process.env.ADMIN_PASS) {

    }

})

app.post("/upload", (req, res) => {
    const userImage = req.pipe(fs.createWriteStream(`src/images/${req.query.filename}`));
    console.log("userImage:", userImage);
    res.send("your image recived sucssesfuly")

})




function connectToDB() {
    return mongoose.connect('mongodb://localhost/shop',
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        }
    );
}


connectToDB().then(() => {
    server.listen(process.env.PORT, () => {
        console.log("Example app listening on port", process.env.PORT)
    });
});


app.get("/products", async (req, res) => {
    console.log("res:", res);
    const productsFromDB = await Product.find();
    console.log("got products");
    console.log("products:", productsFromDB);

    try {
        res.send(productsFromDB);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get("/products/?search=userSearch", async (req, res) => {
    const { userSearch } = req.query;
    // const products = await Product.find();
    const products = await Product.find({ title: { $regex: "userSearch", $options: "i" } }, function (err, docs) {
        console.log("Partial Search Begins");
        console.log(docs);
    });
    console.log("got search");
    console.log("QUERY:", req.query);
    console.log("QUERY:", req.query.search);
    console.log("products:", products);

    try {
        res.send(products);
    } catch (err) {
        res.status(500).send(err);
    }
    // io.emit("product_added", product)
});

app.post('/products', async (req, res) => {
    const product = new Product(req.body);

    try {
        await product.save();
        res.send(product);
        io.emit("product_added", product)

    } catch (err) {
        res.status(500).send(err);
    }

});



app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)

        if (!product) res.status(404).send("No item found")
        res.status(200).send()
    } catch (err) {
        res.status(500).send(err)
    }
    // io.emit("product_deleted", products)

})

// //  for admin only - update quantity
// app.put("/update_quantity/:id", (req, res) => {
//     fs.readFile("products.json", (err, data) => {
//         const products = JSON.parse(data);
//         const productId = +req.params.id;
//         const productIndex = products.findIndex((product) => product.id === productId);
//         products[productIndex].quantity = req.body.quantity;
//         const newQuantityOfProuduct = {
//             id: productId,
//             quantity: products[productIndex].quantity
//         }
//         fs.writeFile("products.json", JSON.stringify(products), (err) => {
//             res.send("quantity updated!!!");
//         });
//         io.emit("quantity_updated", newQuantityOfProuduct)
//     });
// });


app.put('/update_product/:id', async (req, res) => {
    try {
        mongoose.set('useFindAndModify', false);
        await Product.findByIdAndUpdate(req.params.id, req.body)
        console.log("test", "req.params.id:", req.params.id, "req.body:", req.body);
        console.log("Product saved:", Product);
        await Product.save();
        console.log("Product saved:", Product);
        io.emit("product_updated", 1);
        // io.emit("product_updated", Product);

        res.send(Product);
        console.log("updatedproduct", Product);
        console.log("updatedproduct after emit", Product);

    } catch (err) {
        res.status(500).send(err)
    }
})
// app.use('/', Routes);
//  for admin only - add new product
// app.post("/products", (req, res) => {
//     console.log("for admin only: Adding new product");
//     // console.log(req.body);
//     fs.readFile("products.json", (err, data) => {
//         const products = JSON.parse(data);
//         const productToAdd = req.body;
//         products.push(productToAdd);
//         fs.writeFile("products.json", JSON.stringify(products), (err) => {
//             // console.log(err);
//             res.send("YOU SUCCEED to add a new product!!!");
//         });

//         io.emit("FromAPI", productToAdd)
//     });
// });



// for admin only- delete a product

// app.delete("/products/:id", (req, res) => {
//     fs.readFile("products.json", (err, data) => {
//         const products = JSON.parse(data);
//         const productId = +req.params.id;
//         console.log(" const productId = +req.params.id:", productId);
//         const productIndex = products.findIndex((product) => product.id === productId);
//         const deletedItemTitle = products[productIndex].title;
//         products.splice(productIndex, 1);
//         fs.writeFile("products.json", JSON.stringify(products), (err) => {
//             res.send(deletedItemTitle + (" deleted from products"));
//             // res.send(products[productIndex]);
//         })
//         io.emit("product_deleted", products)

//     })
// });


// //  for admin only - update quantity
// app.put("/update_quantity/:id", (req, res) => {
//     fs.readFile("products.json", (err, data) => {
//         const products = JSON.parse(data);
//         const productId = +req.params.id;
//         const productIndex = products.findIndex((product) => product.id === productId);
//         products[productIndex].quantity = req.body.quantity;
//         const newQuantityOfProuduct = {
//             id: productId,
//             quantity: products[productIndex].quantity
//         }
//         fs.writeFile("products.json", JSON.stringify(products), (err) => {
//             res.send("quantity updated!!!");
//         });
//         io.emit("quantity_updated", newQuantityOfProuduct)
//     });
// });



// connectToDB().then(async (res) => {
//     console.log("consol log:connected to DB");
//     const productSchema = new mongoose.Schema({
//         id: Number,
//         title: String,
//         image: String,
//         price: Number,
//         description: String,
//         quantity: Number,
//         pdf_description: String,
//     });

//     const Product = mongoose.model('Product', productSchema);
//     const data = await Product.find().exec();
// console.log("data:", data);

// // loading all the products to application
// app.get("/products", async (req, res) => {
//     console.log("products from mongoDB can be used now");
//     console.log("QUERY:", req.query);
//     const { search } = req.query;
//     // const data = await readFile("products.json");
//     // const products = JSON.parse(data);
//     if (search) {
//         const filteredProducts = data.filter((product) => product.title.includes(search));
//         res.send(filteredProducts);
//     } else {
//         res.send(data);
//     }

// });

// const searchedData = await Product.find({ title: "ג'ל אלוורה  למריחה" }).exec();
// console.log("searchedData:", searchedData);

//  for admin only - update quantity
// app.put("/update_quantity/:id", (req, res) => {
//     const productId = +req.params.id;
//     const productIndex = data.findIndex((product) => product.id === productId);
//     data[productIndex].quantity = req.body.quantity;
//     data[productIndex].image = req.body.image;
//     const newQuantityOfProuduct = {
//         id: productId,
//         quantity: data[productIndex].quantity
//     }
//     // const newimageOfProuduct = {
//     //     id: productId,
//     //     image: data[productIndex].image
//     // }
//     res.send("quantity/image updated!!!");

//     io.emit("quantity_updated", newQuantityOfProuduct
//         // , newimageOfProuduct
//     )

// });




// console.log("QUERY:", req.query);
// const { search } = req.query;
// // const data = await readFile("products.json");
// // const products = JSON.parse(data);
// if (search) {
//     const filteredProducts = data.filter((product) => product.title.includes(search));
//     res.send(filteredProducts);
// } else {
//     res.send(data);
// }