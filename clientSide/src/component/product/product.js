import React, { useState, useEffect, useContext } from "react";
import "./Product.css";
import Context from '../Context';
import axios from 'axios';
import { BrowserRouter as Router, Link } from "react-router-dom";

const Product = (props) => {
  const [quantity, setquantity] = useState(props.quantity);
  const [checkIfClicked, setCheckIfClicked] = useState(true);
  const [quantityInCart, setQuantityInCart] = useState(0);
  const {
    PREFIX,cartCount, setCartCount, itemsInCart, setItemsInCart, name, email, password, cartId, setCartId, userLogin
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
      axios.post(`http://localhost:5000${PREFIX}/userCart`, userAndProduct).then((res) => {
        console.log("responsed arrived");
        console.log("res: cartId:", res.data);
        // console.log("res.data:", res.data);
        // setCartId(res.data);
      });
    };

    if (props.quantity) {
      setCartCount(cartCount + 1)
      setquantity(quantity - 1);

      if (checkIfClicked === true) {

        setItemsInCart(itemsInCart.concat([{ id: props.id, title: props.title, price: props.price, image: props.src, quantity: 1 }]));
        setCheckIfClicked(false);

      } else {

        const productIndex = itemsInCart.findIndex(product => product.id === props.id);
        let newItemsInCartArray = [...itemsInCart];
        newItemsInCartArray[productIndex] = { ...newItemsInCartArray[productIndex], quantity: itemsInCart[productIndex].quantity + 1 };
        setItemsInCart(newItemsInCartArray);

      };

    }
  }
  const remove_from_cart = () => {
    if
      (quantity + 1 === props.quantity) {

      setCartCount(cartCount - 1)

      removeFromCart()

    }
    else if
      (quantity < props.quantity) {

      setCartCount(cartCount - 1)
      setquantity(quantity + 1);
      const productIndex = itemsInCart.findIndex(product => product.id === props.id);
      let newItemsInCartArray = [...itemsInCart];
      newItemsInCartArray[productIndex] = { ...newItemsInCartArray[productIndex], quantity: itemsInCart[productIndex].quantity - 1 };
      setItemsInCart(newItemsInCartArray);

    }
  };


  const removeFromCart = () => {
    setItemsInCart(itemsInCart.filter((productToRemoveFromCart) =>
      props.id !== productToRemoveFromCart.id,
      setCheckIfClicked(true),
      setquantity(quantity + 1)

    ))
  };
  // מה שימוש של הuse efect הזה?
  useEffect(() => {
    setquantity(props.quantity);
  }
    , [props.quantity]
  )
  return (
    <div>
      <Link to={`/products/${props.id}`}>
        <div>{props.title}</div>
        <div>ש"ח {props.price}</div>

        <div>

          <img src={props.src} />

        </div>
      </Link>
      <div className="quantity"> פריטים במלאי{quantity}</div>


      <button onClick={add_to_cart
      }>+</button>
      <button onClick={remove_from_cart}>-</button>
    </div>
  );
};

export default Product;
