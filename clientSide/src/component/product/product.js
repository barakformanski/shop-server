import React, { useContext } from "react";
import "./Product.css";
import Context from "../Context";
import axios from "axios";
import { BrowserRouter as Router, Link } from "react-router-dom";

const Product = (props) => {
  const {
    PREFIX,
    cartCount,
    setCartCount,
    products,
    setProducts,
    itemsInCart,
    setItemsInCart,
    name,
    email,
    password,
    cartId,
    userLogin,
  } = useContext(Context);

  const userAndProduct = {
    name: name,
    email: email,
    password: password,
    cartId: Number,
    productTitle: props.title,
  };

  const add_to_cart = () => {
    let productIndex = products.findIndex(
      (product) => product._id === props.id
    );

    // לשמור את הנתונים localstorage'
    if (userLogin) {
      console.log("user details arrived:", name, email, password, cartId);
      // axios.post(`${PREFIX}/userCart`, userAndProduct).then((res) => {
      // console.log("responsed: cartId:", res.data);
      // });
    }

    //  הוספת מוצרים מתוך לחצן המוצרים שבתוך החנות
    if (props.identity === "shop") {
      if (products[productIndex].quantity) {
        setCartCount(cartCount + 1);

        const itemsInCartIndex = itemsInCart.findIndex(
          (item) => item._id === props.id
        );

        if (itemsInCartIndex === -1) {
          setItemsInCart(
            itemsInCart.concat([
              {
                _id: props.id,
                title: props.title,
                price: props.price,
                image: props.src,
                quantity: 1,
              },
            ])
          );
          let newProductsArray = [...products];
          newProductsArray[productIndex] = {
            ...newProductsArray[productIndex],
            quantity: products[productIndex].quantity - 1,
          };
          setProducts(newProductsArray);
        } else {
          const productIndex = products.findIndex(
            (product) => product._id === props.id
          );

          const itemsInCartIndex = itemsInCart.findIndex(
            (item) => item._id === props.id
          );

          let newItemsInCartArray = [...itemsInCart];

          newItemsInCartArray[itemsInCartIndex] = {
            ...newItemsInCartArray[itemsInCartIndex],
            quantity: itemsInCart[itemsInCartIndex].quantity + 1,
          };
          setItemsInCart(newItemsInCartArray);

          let newProductsArray = [...products];
          newProductsArray[productIndex] = {
            ...newProductsArray[productIndex],
            quantity: products[productIndex].quantity - 1,
          };
          setProducts(newProductsArray);
        }
      } else {
        // להוסיף הודעה למנהל שהמוצר אזל
        alert("מלאי מוצר זה אזל");
      }
    }

    // הוספת מוצרים מתוך מוצר שכבר בעגלה
    else if (props.identity === "cart") {
      const itemsInCartIndex = itemsInCart.findIndex(
        (item) => item._id === props.id
      );
      productIndex = products.findIndex((product) => product._id === props.id);

      if (products[productIndex].quantity) {
        let newItemsInCartArray = [...itemsInCart];

        newItemsInCartArray[itemsInCartIndex] = {
          ...newItemsInCartArray[itemsInCartIndex],
          quantity: itemsInCart[itemsInCartIndex].quantity + 1,
        };

        setItemsInCart(newItemsInCartArray);

        let newProductsArray = [...products];
        newProductsArray[productIndex] = {
          ...newProductsArray[productIndex],
          quantity: products[productIndex].quantity - 1,
        };
        setProducts(newProductsArray);

        setCartCount(cartCount + 1);
      }
      if (!products[productIndex].quantity) {
        alert("אזל");
        // להוסיף הודעה למנהל שהמוצר אזל
        // alert("מלאי מוצר זה אזל")
      }
      // }
    }
  };

  const remove_from_cart = () => {
    const itemsInCartIndex = itemsInCart.findIndex(
      (item) => item._id === props.id
    );
    const productIndex = products.findIndex(
      (product) => product._id === props.id
    );
    let newProductsArray = [...products];
    let newItemsInCartArray = [...itemsInCart];

    // הורדת מוצרים מהכפתור שעל המוצרים שבחנות
    if (props.identity === "shop") {
      if (itemsInCart[itemsInCartIndex]) {
        if (itemsInCart[itemsInCartIndex].quantity === 1) {
          newItemsInCartArray[itemsInCartIndex] = null;
          setItemsInCart(newItemsInCartArray);

          newProductsArray[productIndex] = {
            ...newProductsArray[productIndex],
            quantity: products[productIndex].quantity + 1,
          };
          setProducts(newProductsArray);

          setCartCount(cartCount - 1);

          removeFromCart();
        } else {
          setCartCount(cartCount - 1);
          newItemsInCartArray[itemsInCartIndex] = {
            ...newItemsInCartArray[itemsInCartIndex],
            quantity: itemsInCart[itemsInCartIndex].quantity - 1,
          };
          setItemsInCart(newItemsInCartArray);

          newProductsArray[productIndex] = {
            ...newProductsArray[productIndex],
            quantity: products[productIndex].quantity + 1,
          };
          setProducts(newProductsArray);
        }
      }
    }

    // הורדת מוצרים מתוך מוצר שבעגלה
    else if (props.identity === "cart") {
      if (itemsInCart[itemsInCartIndex].quantity === 1) {
        newItemsInCartArray[itemsInCartIndex] = null;
        setItemsInCart(newItemsInCartArray);

        newProductsArray[productIndex] = {
          ...newProductsArray[productIndex],
          quantity: products[productIndex].quantity + 1,
        };
        setProducts(newProductsArray);

        setCartCount(cartCount - 1);

        removeFromCart();
      } else {
        setCartCount(cartCount - 1);

        newItemsInCartArray[itemsInCartIndex] = {
          ...newItemsInCartArray[itemsInCartIndex],
          quantity: itemsInCart[itemsInCartIndex].quantity - 1,
        };
        setItemsInCart(newItemsInCartArray);

        newProductsArray[productIndex] = {
          ...newProductsArray[productIndex],
          quantity: products[productIndex].quantity + 1,
        };
        setProducts(newProductsArray);
      }
    }
  };

  const removeFromCart = () => {
    setItemsInCart(
      itemsInCart.filter(
        (productToRemoveFromCart) => props.id !== productToRemoveFromCart._id
      )
    );
  };

  return (
    <div>
      {props.identity === "shop" ? (
        <div className="productInShop">
          <Link to={`/products/${props.id}`}>
            <div>{props.title}</div>
            <div>ש"ח {props.price}</div>

            <div className="productImage">
              <img src={props.src} />
            </div>
          </Link>
          <div className="quantity"> פריטים במלאי{props.quantityInShop}</div>

          <div className="productButtons">
            <button onClick={add_to_cart}>+</button>
            <button onClick={remove_from_cart}>-</button>
          </div>
        </div>
      ) : (
        <div className="productInCart">
          {/* <Link to={`/products/${props.id}`}> */}
          <div>{props.title}</div>
          <div>כמות בעגלה: {props.quantityInCart}מוצרים</div>
          <div>לתשלום {props.price * props.quantityInCart}ש"ח</div>
          <div className="productImage">
            <img src={props.src} />
          </div>
          <button onClick={add_to_cart}>+</button>

          <button onClick={remove_from_cart}>-</button>
          {/* </Link> */}
        </div>
      )}
    </div>
  );
};

export default Product;
