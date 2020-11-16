import React, { useEffect, useContext } from "react";
import "./products.css";
import socketIOClient from "socket.io-client";

import Product from "../product/product.js";
import axios from "axios";
import Context from '../Context';
import createPersistedState from "use-persisted-state";


const Products = (props) => {
  const {
   PREFIX, products, setProducts, userSearch, deletedProduct, 
    newProduct, setNewProduct, name, email, password
  } = useContext(Context);




  useEffect(() => {
    axios.get(`${PREFIX}/products`)
      .then((res) => {
        const productsarray = res.data;
        setProducts(productsarray);
        console.log("costumer details:", name, email, password);
        console.log("products from server:",res.data);

      });
  }, [])
   
  
  useEffect(() => {
    axios.get(`${PREFIX}/products`)
      .then((res) => {
        const productsarray = res.data;
        setProducts(productsarray);

      });
  }, [deletedProduct, newProduct,]);



  // search
  useEffect(() => {
    axios.get(`${PREFIX}/products/?search=${userSearch}`)

      .then((res) => {
        console.log("userSearch:", userSearch);

        const products = res.data;
        console.log(products);
        setProducts(products);
      });
  }, [userSearch]);

// console.log(products);


// console.log(   props.products
//   .filter(
//     (product) =>
//       product.price >= props.range[0] && product.price <= props.range[1]
//   ));


  return (
    <div className="mapOfProducts">
      {
        props.products
          // .filter(
          //   (product) =>
          //     product.price >= props.range[0] && product.price <= props.range[1]
          // )
          .map((product) => (
            // <div className="product" >
              <Product identity={props.identity}
            
                key={product._id}
                id={product._id}
                title={product.title}
                price={product.price}
                src={product.image}
                quantityInShop={product.quantity}
                description={product.description}
              quantityInCart={product.quantity}
            
              />
            // </div>

          ))
      }

    </div >
  );
};
export default Products;
