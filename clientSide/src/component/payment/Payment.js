import React, { useEffect, useState, useContext } from "react";

import Product from "../product/product.js";
import axios from "axios";
import Context from "../Context";

const Payment = (props) => {
  const {
    PREFIX,
    products,
    setProducts,
    itemsInCart,
    deletedProduct,
    newProduct,
    setNewProduct,
    name,
    email,
    password,
  } = useContext(Context);

  const newCart = {
    itemsInCart: itemsInCart,
    name: name,
    email: email,
    password: password,
  };

  const pay = () => {
    console.log(
      " יש להשמיש אפשרות תשלום, בינתיים נתוני הלקוח והעגלה מועברים לשרת"
    );
    sendToDB();
  };

  const sendToDB = () => {
    console.log(name, password, email);
    if (name && password) {
      console.log("now need to send to server");
      axios.post("/api/shop/newCart", newCart).then((res) => {
        console.log(res.data);
      });
    }
  };

  return (
    <div className="paymentComponent">
      <h1>העגלה שלך</h1>
      <div productsToPay>
        {itemsInCart.map((product) => (
          <Product
            identity={props.identity}
            key={product._id}
            id={product._id}
            title={product.title}
            price={product.price}
            src={product.image}
            quantityInCart={product.quantity}
          />
        ))}
      </div>
      <button onClick={pay}>המשך לתשלום</button>
    </div>
  );
};
export default Payment;
