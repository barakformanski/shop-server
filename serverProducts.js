
const express = require("express");
const fs = require("fs");
const util = require('util');
const readFile = util.promisify(fs.readFile);
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT ? process.env.PORT : 8000;
const JSON_FILE = process.env.JSON_FILE ? process.env.JSON_FILE : "produts.json";
console.log("PORT:", process.env.PORT);
console.log("process.env.JSON_FILE:", process.env.JSON_FILE);
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
const { connect } = require("http2");
const server = http.createServer(app);
const io = socketIo(server);
const mongoose = require('mongoose');


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
// app.get("/", (req, res) => {
//     res.send("welcome to the store!");
// });

app.get("/products", async (req, res) => {
    console.log("products file can ce used now");
    console.log("QUERY:", req.query);
    // const search = req.query.search;
    const { search } = req.query;
    const data = await readFile("products.json");
    const products = JSON.parse(data);
    if (search) {
        const filteredProducts = products.filter((product) => product.title.includes(search));
        res.send(filteredProducts);
    } else {
        res.send(products);
    }

});
// בלי אסינכ אוויט
//     fs.readFile("products.json", (err, data) => {

//         const products = JSON.parse(data);
//         if (search) {
//             const filteredProducts = products.filter((product) => product.title.includes(search));
//             res.send(filteredProducts);
//         } else {
//             res.send(products);
//         }
//     });
// });
// productPage description about the products
app.get("/products/:id", (req, res) => {
    fs.readFile("products.json", (err, data) => {
        const products = JSON.parse(data);
        const productId = +req.params.id;
        console.log(" const productId = +req.params.id:", productId);
        const productIndex = products.findIndex((product) => product.id === productId);
        const chosenItem = products[productIndex];
        res.send(chosenItem);
    })
})




//  for admin only - add new product
app.post("/products", (req, res) => {
    console.log("for admin only: Adding new product");
    // console.log(req.body);
    fs.readFile("products.json", (err, data) => {
        const products = JSON.parse(data);
        const productToAdd = req.body;
        products.push(productToAdd);
        fs.writeFile("products.json", JSON.stringify(products), (err) => {
            // console.log(err);
            res.send("YOU SUCCEED to add a new product!!!");
        });

        io.emit("FromAPI", productToAdd)
    });
});



// for admin only- delete a product

app.delete("/products/:id", (req, res) => {
    fs.readFile("products.json", (err, data) => {
        const products = JSON.parse(data);
        const productId = +req.params.id;
        console.log(" const productId = +req.params.id:", productId);
        const productIndex = products.findIndex((product) => product.id === productId);
        const deletedItemTitle = products[productIndex].title;
        products.splice(productIndex, 1);
        fs.writeFile("products.json", JSON.stringify(products), (err) => {
            res.send(deletedItemTitle + (" deleted from products"));
            // res.send(products[productIndex]);
        })
    })
});


// for admin only- update a product
app.put("/products/:id", (req, res) => {
    fs.readFile("products.json", (err, data) => {
        const products = JSON.parse(data);
        const productId = +req.params.id;
        const productIndex = products.findIndex((product) => product.id === productId);
        products[productIndex].price = req.body.price;
        fs.writeFile("products.json", JSON.stringify(products), (err) => {
            res.send("YOU SUCCEED!!!");
        });
    });
});

//  for admin only - update quantity
app.put("/update_quantity/:id", (req, res) => {
    fs.readFile("products.json", (err, data) => {
        const products = JSON.parse(data);
        const productId = +req.params.id;
        const productIndex = products.findIndex((product) => product.id === productId);
        products[productIndex].quantity = req.body.quantity;
        const newQuantityOfProuduct = {
            id: productId,
            quantity: products[productIndex].quantity
        }
        fs.writeFile("products.json", JSON.stringify(products), (err) => {
            res.send("quantity updated!!!");
        });
        io.emit("quantity_updated", newQuantityOfProuduct)
    });
});

// const getApiAndEmit = (socket) => {
//     const response = Date.now();
//     socket.emit("FromAPI", response);
// };

// let interval;

// io.on("connection", (socket) => {
//     console.log("new client connected");
//     // if (interval) {
//     //     clearInterval(interval);
//     // }
//     // interval = setInterval(() => getApiAndEmit(socket), 1000);
//     socket.on("disconnect", () => {
//         console.log("client disconnected");
//         cleanInterval(interval);
//     });
// });



// app.listen(process.env.PORT, () => {
// console.log("Example app listening on port", process.env.PORT);
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

    const productSchema = new mongoose.Schema({
        id: Number,
        title: String,
        image: String,
        price: Number,
        description: String,
        quantity: Number,
        pdf_description: String,
    });

    const Product = mongoose.model('Product', productSchema);

    const aloeVereGel = new Product({
        id: 1,
        title: "ג'ל אלוורה  למריחה",
        image: "https://gallery.foreverliving.com/gallery/ISR/image/products/skincare/aloeveragelly200.png",
        price: 81,
        description: "ג'ל האלוורה ידוע מזה אלפי שנים כמוצר על",
        quantity: 40,
        pdf_description: "https://gallery.foreverliving.com/gallery/ISR/download/products/Skin_care/61_Heb.pdf"
    });
    aloeVereGel.save();

    const aloeHit = new Product({
        id: 2,
        title: "אלו היט לושן",
        image: "https://gallery.foreverliving.com/gallery/ISR/image/products/skincare/Aloe-Heat-Lotion_200.png",
        price: 81,
        description: "אנחנו מכירים את ההרגשה של עייפות ושרירים דואבים",
        quantity: 100,
        pdf_description: "https://gallery.foreverliving.com/gallery/ISR/download/products/Skin_care/64_Heb.pdf"
    });
    aloeHit.save();

    const aloeFirst = new Product({
        id: 3,
        title: "אלו פירסט",
        image: "https://gallery.foreverliving.com/gallery/ISR/image/products/skincare/Aloe-Heat-Lotion_200.png",
        price: 109,
        description: "אף ערכת עזרה ראשונה אינה שלמה ללא האלו-פירסט",
        quantity: 100,
        pdf_description: "https://gallery.foreverliving.com/gallery/ISR/download/products/Skin_care/40_Heb.pdf"
    });
    aloeFirst.save();


    server.listen(process.env.PORT, () => {
        console.log("Example app listening on port", process.env.PORT);
    });

});

