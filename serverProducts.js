const express = require("express");
const fs = require("fs");
const util = require('util');
const app = express();
const bodyParser = require("body-parser");
// the next line prefer to Routes.js file that i not useing yet
// const Routes = require('./Routes');
const mongoose = require('mongoose');
// const Product = require('./DBSchema/DBConfig');
const PREFIX = "/api";

const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT ? process.env.PORT : 8000;
const url = process.env.MONGO_URI || 'mongodb://localhost:27017';

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
const { stringify } = require("querystring");
const { title } = require("process");
// const { connect } = require("http2");
const server = http.createServer(app);
const io = socketIo(server);

const gatApiAndEmit = (socket) => {
    const respone = Date.now();
    // Emitting a new messege. will be commited by the client
    socket.emit("FromApi", respone)
}
let interval;

io.on("connection", (socket) => {
    console.log("שים לב! לקוח נוסף התחבר");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => gatApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        console.log("שים לב! לקוח פלוני סיים התנתק");
        clearInterval(interval);
    });
});

app.use(cors());

app.use(express.static(path.join(__dirname, 'client/build')));


app.use(
    morgan(

        "METHOD: :method :url :status :res[content-length] - :response-time ms"
    )
);
app.use(morgan('combined', { stream: accesLogStream }));

// not working
app.use("/images", express.static("src/images"));



const ProductSchema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    quantity: Number,
    pdf_description: String,
});

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    Password: String,
    cellPhone: Number,
    cartId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }],
})

const CartSchema = new mongoose.Schema({
    title: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductInCart' }],
    total_cash: Number
});


const ProductInCartScehma = new mongoose.Schema({
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    products: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    total_cash: Number,
    quantityOnCart: Number,
})


const Product = mongoose.model('Product', ProductSchema);
const User = mongoose.model("User", UserSchema);
const Cart = mongoose.model("Cart", CartSchema);
const ProductInCart = mongoose.model("ProductInCart", ProductInCartScehma);

function connectToDB() {
    // return mongoose.connect('mongodb://localhost/shop', 
    return mongoose.connect(`${url}`,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        }
    );
}


// connectToDB().then(async (res) => {
connectToDB().then(async (res) => {
    console.log("connected to DB");

    const Productdata = await Product.find().exec();
    console.log("Productdata:", Productdata);


});


app.get(`${PREFIX}/products`, async (req, res) => {
    console.log("QUERY:", req.query);
    const userSearch = req.query.search;
    console.log("userSearch:", userSearch);
    if (userSearch) {
        const filterdProducts = await Product.find(
            { title: { $regex: userSearch, $options: "i" } },
            (err, filterdProducts) => {
                if (err) return console.error(err);
                console.log("filterdProducts:", filterdProducts);
                console.log("got search");
                res.send(filterdProducts);
            });
    }
    else {
        console.log("res:", res);
        const productsFromDB = await Product.find();
        console.log("got products");
        console.log("products from Mongo DB:", productsFromDB);

        try {
            res.send(productsFromDB);
        } catch (err) {
            res.status(500).send(err);
        }
    };
})

app.get(`${PREFIX}/products/:id`, async (req, res) => {
  
    const productsFromDB = await Product.find();
    console.log("got products");
    console.log("products from Mongo DB:", productsFromDB);
    try {
        res.send(productsFromDB);
    } catch (err) {
        res.status(500).send(err);
    }
});

    // module.exports = { User, Product, Cart, ProductInCart }

    // const exampleUser = new User({
    //     name: "fake user",
    //     cart: [{ product: "fake product", quantity: 10, cash: 10 }]
    // });

    // const userExample = await User
    //     .findOne({ _id: "5f79a3dffcec3c143c2b2d1c" })
    //     .populate("cart") // key to populate
    //     .then(user => {
    //         res.json(user);
    //     });
    // userExample.save();
    // console.log("userExample:", userExample);

    // app.post('/userCart', async (req, res) => {
    //     console.log("req:", req.body);
    //     const userCart = await new User(req.body);
    //     userCart.save();

    //     try {
    //         await console.log("userCart:", userCart);
    //         userCart.save();
    //         res.send(userCart);
    //         // io.emit("product_added", product)

    //     } catch (err) {
    //         res.status(500).send(err);
    //     }

    // });


// cheking git

app.post(`${PREFIX}/userCart`, async (req, res) => {

    const { name, password, email, productTitle } = req.body;
    let user = await User.findOne({
        name: name,
        password: password,
        email: email,
        productTitle: productTitle
    })
    console.log("req:", req.body);

    if (!user) {
        user = new User(req.body);
        await user.save();
    }

    let cartId = user.cartId[0];

    const userId = user._id;

    // try {
    console.log("user:", user);
    console.log("userId:", userId);

    if (!cartId) {
        console.log("no cart id, let's create new one:");
        const newCart = new Cart({ user: user._id });
        await newCart.save();
        console.log("newCart:", newCart);
        cartId = newCart._id;
        console.log("cartId:", cartId);

        await User.findByIdAndUpdate(
            { _id: userId }, { cartId: [...user.cartId, cartId] },

        );
        // }
        // io.emit("product_added", product)

        // } catch (err) {
        //     res.status(500).send(err);
        // }

    }
    const product = await Product.findOne(
        { title: productTitle }
    ).exec();
    console.log("product:", product);

    const oldCart = await Cart.findOne({ _id: cartId })
    const productInCart = await ProductInCart.findOne({ cart: cartId })
    const quantityOnCart = 0;
    if (!productInCart) {
        const productInCart = new ProductInCart({
            title: product.title,
            cart: cartId,
            quantityOnCart: quantityOnCart
        })
        await productInCart.save();

        await Cart.findByIdAndUpdate(
            { _id: cartId },
            { products: [...oldCart.products, productInCart._id] }
        ).exec();
    } else {
        await ProductInCart.findOneAndUpdate(
            { _id: productInCart._id },
            { quantityOnCart: quantityOnCart + 1 }
        )
    };
    // res.send("cartId:", cartId);
    res.status(200).send((cartId).toString());

    // res.send("finisehd!, productInCart:", ProductInCart);
});





app.post(`${PREFIX}/login`, (req, res) => {
    const { email, pass } = req.body;
    if (email === process.env.ADMIN_EMAIL && pass === process.env.ADMIN_PASS) {

    }

})

app.post(`${PREFIX}/upload`, (req, res) => {
    const userImage = req.pipe(fs.createWriteStream(`src/images/${req.query.filename}`));
    console.log("userImage:", userImage);
    res.send("your image recived sucssesfuly")

})
app.post(`${PREFIX}/uploadNewProductImage`, (req, res) => {
    const userImage = req.pipe(fs.createWriteStream(`src/images/${req.query.filename}`));
    console.log("userImage:", userImage);
    res.send("your image recived sucssesfuly")

})







app.post(`${PREFIX}/products`, async (req, res) => {
    const product = new Product(req.body);

    try {
        await product.save();
        res.send(product);
        io.emit("product_added", product)

    } catch (err) {
        res.status(500).send(err);
    }

});



app.delete(`${PREFIX}/products/:id`, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)

        if (!product) res.status(404).send("No item found");
        res.status(200).send(product);
        io.emit("product_deleted", product)

    } catch (err) {
        res.status(500).send(err)
    }


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


app.put(`${PREFIX}/update_product/:id`, async (req, res) => {
    try {
        mongoose.set('useFindAndModify', false);
        await Product.findByIdAndUpdate(req.params.id, req.body)
        console.log("test", "req.params.id:", req.params.id, "req.body:", req.body);
        console.log("Product saved:", Product);
        await Product.save();
        console.log("Product saved:", Product);
        // io.emit("product_updated", Product);

        res.send(Product, "product updated sucssefully!!!");
        io.emit("product_updated", req.params.id, req.body);
        console.log("updatedproduct", Product);
        console.log("updatedproduct after emit", Product);

    } catch (err) {
        res.status(500).send(err)
    }
})// app.use('/', Routes);
    ;

connectToDB().then(() => {
    server.listen(PORT, () => {

        console.log("app is listening on port:", PORT, "   and connected to Mongo DB")
    });
});
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