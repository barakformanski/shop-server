import React, { useState, useEffect, useContext } from "react";
import "./Product.css";
import Context from '../Context';
import axios from 'axios';
import { BrowserRouter as Router, Link } from "react-router-dom";
import Products from "../products/Products";

const Product = (props) => {
  const [checkIfClicked, setCheckIfClicked] = useState(true);
  // const [quantityInShop, setQuantityInShop] = useState(props.quantityInShop);
  const {
    PREFIX,cartCount, setCartCount, products,setProducts,itemsInCart, setItemsInCart, name, email, password, cartId, setCartId, userLogin,quantityInCart, setQuantityInCart
  } = useContext(Context);

  const userAndProduct = {
    name: name,
    email: email,
    password: password,
    cartId: Number,
    productTitle: props.title
  }

  const add_to_cart = () => {
    if (userLogin) {

      console.log("user details arrived:", name, email, password, cartId);
      // axios.post(`http://localhost:5000${PREFIX}/userCart`, userAndProduct).then((res) => {
      axios.post(`${PREFIX}/userCart`, userAndProduct).then((res) => {
        console.log("responsed arrived");
        console.log("res: cartId:", res.data);
        // console.log("res.data:", res.data);
        // setCartId(res.data);
      });
    };

    const productIndex = products.findIndex(product => product._id === props.id);
    
    if (products[productIndex].quantity) {

      setCartCount(cartCount + 1)
      
      if (checkIfClicked === true) {
        setItemsInCart(itemsInCart.concat([{ id: props.id, title: props.title, price: props.price, image: props.src, quantity: 1 }]));
        let newProductsArray = [...products];
        newProductsArray[productIndex] = { ...newProductsArray[productIndex], quantity: products[productIndex].quantity - 1 };
        setProducts(newProductsArray);


        setCheckIfClicked(false);


        
      } else {
        const productIndex = products.findIndex(product => product._id === props.id);
        const itemsInCartIndex = itemsInCart.findIndex(product => product.id === props.id);
      
        let newItemsInCartArray = [...itemsInCart];
        newItemsInCartArray[itemsInCartIndex] = { ...newItemsInCartArray[itemsInCartIndex], quantity: itemsInCart[itemsInCartIndex].quantity +1 };
        setItemsInCart(newItemsInCartArray);

        let newProductsArray = [...products];
        newProductsArray[productIndex] = { ...newProductsArray[productIndex], quantity: products[productIndex].quantity - 1 };
        setProducts(newProductsArray);



      };

    }
    else {
      // להוסיף הודעה למנהל שהמוצר אזל
      alert("מלאי מוצר זה אזל")
    }
  }
  // console.log("itemsInCart:",itemsInCart);
  const remove_from_cart = () => {
    const itemsInCartIndex = itemsInCart.findIndex(product => product.id === props.id);
    const productIndex = products.findIndex(product => product._id === props.id);
    let newProductsArray = [...products];
    let newItemsInCartArray = [...itemsInCart];

    if (
      itemsInCart[itemsInCartIndex]

    )
    
    {


      if
        (itemsInCart[itemsInCartIndex].quantity === 1) {

        // let newItemsInCartArray = [...itemsInCart];
        newItemsInCartArray[itemsInCartIndex] = null;
        setItemsInCart(newItemsInCartArray);

        newProductsArray[productIndex] = { ...newProductsArray[productIndex], quantity: products[productIndex].quantity + 1 };
        setProducts(newProductsArray);
      
        setCartCount(cartCount - 1)

        removeFromCart()

      }
     
      else 
      {

        setCartCount(cartCount - 1)

        newItemsInCartArray[itemsInCartIndex] = { ...newItemsInCartArray[itemsInCartIndex], quantity: itemsInCart[itemsInCartIndex].quantity -1 };
        setItemsInCart(newItemsInCartArray);

        newProductsArray[productIndex] = { ...newProductsArray[productIndex], quantity: products[productIndex].quantity + 1 };
        setProducts(newProductsArray);
      
      }
    };
  };

  const removeFromCart = () => {
    setItemsInCart(itemsInCart.filter((productToRemoveFromCart) =>
      props.id !== productToRemoveFromCart.id,
      setCheckIfClicked(true),

    ))
  };

 
  return (
  <div>
    {props.identity === "shop" ? (

        <div  className="productInShop">
          <Link to={`/products/${props.id}`}>
            <div>{props.title}</div>
            <div>ש"ח {props.price}</div>

            <div>

              <img src={props.src} />

            </div>
          </Link>
          <div className="quantity"> פריטים במלאי{ props.quantityInShop}</div>


          <button onClick={add_to_cart}>+</button>
          <button onClick={remove_from_cart}>-</button>
        </div>
      ) :
      <div className="productInCart">
      <Link to={`/products/${props.id}`}>
            <div>{props.title}</div>
            <div>כמות בעגלה: {props.quantityInCart}מוצרים</div>
        <div>ש"ח {props.price}סה"כ לתשלום</div>

        <div><img src={props.src} /></div>
      </Link>
    </div>
      }
      </div>
  );
};

export default Product;
