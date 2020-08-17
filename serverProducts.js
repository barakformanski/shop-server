
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
console.log("PORT:", process.env.PORT);

app.use(bodyParser.json());

app.use(cors());




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



//  for admin only - add new product
app.post("/products", (req, res) => {
    console.log("for admin only: Adding new product");
    // console.log(req.body);
    fs.readFile("products.json", (err, data) => {
        const products = JSON.parse(data);
        const title = req.body.title;
        const image = req.body.image;
        const alt_image = req.body.alt_image;
        const price = req.body.price;
        const description = req.body.description;
        const quantity = req.body.quantity;
        const pdf_description = req.body.pdf_description;
        products.push({
            "id": products.length + 1,
            "title": title,
            "image": image,
            "alt_image": alt_image,
            "price": price,
            "description": description,
            "quantity": quantity,
            "pdf_description": pdf_description,
        });
        fs.writeFile("products.json", JSON.stringify(products), (err) => {
            // console.log(err);
            res.send("YOU SUCCEED!!!");
        });
    });
});
// for admin only- delete a product
app.get("/products/:id", (req, res) => {
    console.log(req.params);
    fs.readFile("products.json", (err, data) => {
        const products = JSON.parse(data);
        const productId = +req.params.id;
        const productIndex = products.findIndex((product) => product.id === productId);
        console.log(products[productIndex]);
        res.send(products[productIndex]);
        // res.send(req.params);
    });
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

app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});