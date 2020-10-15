import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios'
import Product from '../component/product/product.js'
import Context from '../../src/component/Context.js';

const ProductPage = (props) => {
    const [product, setProduct] = useState(null);
    const { id } = useParams();
    console.log(id);

    const { products } = useContext(Context);
    console.log(products);
    // useEffect(() => {
    //     const url = `http://localhost:5000/products/${id}`
    //     axios.get(url)
    //         .then(({ data }) => {
    //             setProduct(data);

    //         })
    // }, [])


    // useEffect(() => {
    //     // const params = { search: search }
    //     axios.get("http://localhost:5000/products", { params: params })
    //       .then((res) => {
    //         // console.log(res);
    //         const productsArray = res.data;
    //         console.log(productsArray);
    //         setProducts(res.data);
    //       });
    //   }, [search]);
    //   console.log(useProductsState);
    return (
        product &&
        <div>
            <h1>{product.title}</h1>
            <img src={product.image} />
            <h2>description:</h2>
            <h2>  {product.description}</h2>
            <h2>price:{product.price}$</h2>



        </div >
    );
};

export default ProductPage;
