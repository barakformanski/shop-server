import React, { useState, useContext,useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from 'axios'
import Product from '../component/product/product.js'
import Context from '../../src/component/Context.js';

const ProductPage = (props) => {
    const {PREFIX } = useContext(Context);
    let [chosenProduct, setChosenProduct] =useState ('');

    const { id } = useParams();
            
    useEffect(() => {
        const url = `http://localhost:5000${PREFIX}/products/${id}`
        axios.get(url)
            .then((res) => {
                console.log(res.data);
                const products = res.data;
                const find = products.find((chosenProduct) => chosenProduct._id === id);
                console.log(find);
                setChosenProduct(find)
            })
        console.log(chosenProduct);
    }, []);


    
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
        <div>
        <div>דף מידע</div>
        {/* { chosen } */}
       
        <div>
            
         <h1>{chosenProduct.title}</h1>
            <img src={chosenProduct.image} /> 
             <h2>תיאור:</h2>
             <h2>  {chosenProduct.description}</h2>
          <h2>מחיר:{chosenProduct.price}ש"ח</h2>  

            <Link to="/">Home</Link>

         </div >
         </div >
    );
};

export default ProductPage;
