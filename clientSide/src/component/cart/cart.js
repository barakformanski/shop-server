import React, { useState, useEffect, useContext } from "react";
// import Products from "../products/Products.js";
import "./cart.css";
import CartWithProdcts from "../cartwithproducts/CartWithProducts.js";
import UploadImage from "../uploadComponent/Uploadimage.js";
import Context from '../Context';

function Cart(props) {
  const {
    cartCount, setCartCount, itemsInCart, userImage, setUserImage,
  } = useContext(Context);

  const defultCartImage = '../../images/cart.jpg';

  console.log('itemsInCart:', itemsInCart);
  return (
    <div className="cart">

      <div className="cartHeader">
        <span>עגלת המוצרים שלך</span>
        {userImage ?
          < img src={userImage} />
          :
          <img className="userCartImage" src={defultCartImage} />}

        <div className="cartNumber"> סך המוצרים בעגלה {cartCount}</div>
        <div> <UploadImage /> </div>

      </div>
      <div className="productsInCart">
        <div>
          {itemsInCart.map((itemInCart) =>
            <CartWithProdcts
              id={itemInCart.id}
              title={itemInCart.title}
              price={itemInCart.price}
              src={itemInCart.image}
              quantity={itemInCart.quantity}
            />
          )}
        </div>
      </div>
    </div>




  );
}

export default Cart;
