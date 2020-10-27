import React from "react";
import "./CartWithProducts.css"

function CartWithProducts(props) {
    console.log("props.id in cart", props.quantity);


    const add_to_cart = () => {
        // if (props.quantity) {
        //   setCartCount(cartCount + 1)
        //   setquantity(quantity - 1);
    
        //   if (checkIfClicked === true) {
    
        //     setItemsInCart(itemsInCart.concat([{ id: props.id, title: props.title, price: props.price, image: props.src, quantity: 1 }]));
        //     setCheckIfClicked(false);
    
        //   } else {
    
        //     const productIndex = itemsInCart.findIndex(product => product.id === props.id);
        //     let newItemsInCartArray = [...itemsInCart];
        //     newItemsInCartArray[productIndex] = { ...newItemsInCartArray[productIndex], quantity: itemsInCart[productIndex].quantity + 1 };
        //     setItemsInCart(newItemsInCartArray);
    
        //   };
    
        // }
      }

    return (
        <div className="productInCart" id={props.id}>
            <div>{props.title}</div>

            <div>ש"ח{props.price}</div>

            <div>

                <img src={props.src} />

            </div>

            <div className="quantityInProductInCart">quantity: {props.quantity} </div>


            {/* need to abale those buttons && update the quantity from <Cart/> */}
            <button onClick={add_to_cart}>+</button>
            {/* <button onClick={add_to_cart, add_to_productsInCart}>+</button> */}
          {/* <button onClick={remove_from_cart}>-</button> */}
        </div>
    );

}
export default CartWithProducts;