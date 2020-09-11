const Express = require('express');
const router = Express.Router();
const Product = require('/DBSchema/DBConfig.js')
const {
    insertProduct,
    updateProduct,
    deleteProduct,
    search,
    searchAll
} = require('./Controller.js');

router.get("/", async (req, res) => {
    const products = await Product.find();
    console.log("got products");
    try {
        res.send(products);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete('/:id', (req, res) => {
    deleteProduct(req.params.id).then(data => {
        res.status(data.status).send({ message: data.message });
    }).catch(err => {
        res.status(err.status).send({ message: err.message });
    });
});

router.post('/', async (req, res) => {
    const data = await insertProduct(req.body)
    res.status(data.status).send({ message: data.message })
});
router.put('/:id', function (req, res) {
    updateProduct(req.params.id, req.body).then(data => {
        res.status(data.status).send({ message: data.message });
    }).catch(err => {
        res.status(err.status).send({ message: err.message });
    });
});
router.get('/:id', function (req, res) {
    search(req.params.id).then(data => {
        res.status(data.status).send({ message: data.message });
    }).catch(err => {
        res.status(err.status).send({ message: err.message });
    });
});
router.get('/', function (req, res) {
    Controller.searchAll().then(data => {
        res.status(data.status).send({ data: data.message });
    }).catch(err => {
        res.status(err.status).send({ message: err.message });
    });
});

module.exports = router;