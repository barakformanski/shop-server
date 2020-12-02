import React, { useState, useEffect, useContext } from "react";
import socketIOClient from "socket.io-client";

import "./app.css";
import Header from "../header/Header";
import Products from "../products/Products.js";
import AdminPage from "../../pages/adminPage/AdminPage.js";
import UpdateProducts from "../../pages/UpdateProducts.js";
import { Slider } from "antd";
import Login from "../login/Login.js";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProductPage from "../../pages/productPage.js";
import Search from "../search/Search.js";
import axios from "axios";
import { useRef } from "react";
import createPersistedState from "use-persisted-state";
import { Provider } from "../Context.js";
import Footer from "../footer/Footer.js";
import Payment from "../payment/Payment.js";
// i need to relearn the use of this option
// const useCounterState = createPersistedState("count");

function App(props) {
  const PREFIX = "/api";
  const [productsFromDB, setProductsFromDB] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(null);
  const [cartCharge, setCartCharge] = useState(0);
  const [itemsInCart, setItemsInCart] = useState([]);
  const [count, setCount] = useState("");
  const [quantityInCart, setQuantityInCart] = useState(null);
  const [userSearch, setUserSearch] = useState(null);
  const [deletedProduct, setDeletedProduct] = useState({});
  const [productUpdated, setProductUpdated] = useState({});
  const [newProduct, setNewProduct] = useState({});
  const [userImage, setUserImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cartId, setCartId] = useState("");
  const [userLogin, setUserLogin] = useState(false);
  const [range, setRange] = useState([0, 100]);
  let userRange = (value) => {
    setRange(value);
  };

  const shopContext = {
    PREFIX: PREFIX,
    productsFromDB: productsFromDB,
    products: products,
    setProducts: (value) => setProducts(value),
    cartCount: cartCount,
    setCartCount: (value) => setCartCount(value),
    // cartCharge: cartCharge,
    // setCartCharge: (value) => setCartCharge(value),
    itemsInCart: itemsInCart,
    setItemsInCart: (value) => setItemsInCart(value),
    userSearch: userSearch,
    setUserSearch: (value) => setUserSearch(value),

    deletedProduct: deletedProduct,
    setDeletedProduct: (value) => setDeletedProduct(value),
    newProduct: newProduct,
    setNewProduct: (value) => setNewProduct(value),
    userImage: userImage,
    setUserImage: (value) => setUserImage(value),
    email: email,
    setEmail: (value) => setEmail(value),
    password: password,
    setPassword: (value) => setPassword(value),
    name: name,
    setName: (value) => setName(value),
    cartId: cartId,
    setCartId: (value) => setCartId(value),
    userLogin: userLogin,
    setUserLogin: (value) => setUserLogin(value),
    quantityInCart: quantityInCart,
    setQuantityInCart: (value) => setQuantityInCart(value),
  };

  // localStorage.setItem("check", JSON.stringify([
  //   {
  //     id: 1,
  //     title: "myProduct"
  //   }
  // ])
  // );
  const localStorageValue =
    ("localStorage:", JSON.parse(localStorage.getItem("check")));
  // console.log("localStorage:", localStorageValue[0].title);

  // console.log("value search:", value);

  // moved to seperate component and to Cart component
  // const [userImage, setUserImage] = useState("");

  // const fileInput = useRef();
  // const uploadImage = () => {
  //   const uploadedFile = fileInput.current;
  //   axios.post("http://localhost:5000/upload", uploadedFile.files[0], {
  //     params: { filename: uploadedFile.files[0].name },
  //     onUploadProgress: (progressEvent) => {
  //       const percentCompleted = Math.round(
  //         (progressEvent.loaded * 100) / progressEvent.total
  //       );
  //       console.log("percentCompleted:", percentCompleted);
  //       setUserImage("http://localhost:5000/images/" + uploadedFile.files[0].name);
  //     },
  //   });
  // };
  // console.log(userImage);

  // giving the user the full list of the products

  async function getProductsList() {
    let data;
    try {
      // ({ data } = await axios.get(`http://localhost:5000${PREFIX}/products`));
      ({ data } = await axios.get(`${PREFIX}/products`));
    } catch (e) {
      data = loadProducts();
    }
    const products = document.getElementById("products");
    data.forEach((product) => {
      const productLi = `<li>${product.title}</li>`;
      products.innerHTML += productLi;
    });
    saveProducts(data);
  }
  // local storage - need to b use
  // i need to move this method and to use it (the local storage) to users and not to all the products
  function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("products", JSON.stringify(products));
  }
  function loadProducts() {
    const products = localStorage.getItem("products");
    return products ? JSON.parse(products) : [];
  }
  // const PORT = process.env.PORT ? process.env.PORT : 5000;

  // const socket = socketIOClient(`http://localhost:5000`);
  // בשורה למעלה עבור סוקט לוקאלי
  // בשורה מתחת עבור סוקט להירוקו
  // const socket = socketIOClient(`/` &&  `http://localhost:5000`);
  // const socket = socketIOClient(`http://localhost:5000`);
  // const [socket, SetSocket] = useState(socketIOClient(`http://localhost:5000`));
  // const [socket, SetSocket] = useState(socketIOClient(`http://localhost:5000`));

  // search
  useEffect(() => {
    axios
      .get(`${PREFIX}/products/?search=${userSearch}`)

      .then((res) => {
        console.log("userSearch:", userSearch);

        const products = res.data;
        console.log(products);
        setProducts(products);
      });
  }, [userSearch]);

  // let userRange = (value) => {
  //   setRange(value);
  // };
  // const [range, setRange] = useState([0, 100]);

  // new product added- update products DB and client with socket io
  useEffect(() => {
    // const socket = socketIOClient(`http://localhost:5000`);
    let address = "";
    if (process.env.NODE_ENV === "development") {
      address = "http://localhost:5000";
      // SetSocket(socketIOClient(`http://localhost:5000`));
    } else if (process.env.NODE_ENV === "production") {
      // SetSocket(socketIOClient(`/` ));
      address = "/";
    }
    const socket = socketIOClient(address);
    socket.on("product_deleted", (data) => {
      setDeletedProduct(data);

      setTimeout(() => setDeletedProduct({}), 3000);
    });

    socket.on("product_added", (data) => {
      setNewProduct(data);

      setTimeout(() => setNewProduct({}), 3000);
    });

    socket.on("product_updated", (data) => {
      setProductUpdated(data);
      setTimeout(() => setProductUpdated({}), 3000);
    });
  }, [newProduct]);

  // עוגיות - כדי לשמור פרטי משתמש
  // JWTבינתיים לא פונקציונאלי, להמיר שימוש עבור שמירת הלוג אין של המשתמש ולצרף שימוש ב
  if (!userLogin) {
    if (!name) {
      document.cookie = "isLogIn= לקוח אנונימי מחובר";
    } else {
      document.cookie = `isLogIn=${name} מתחבר`;
    }
  }
  if (userLogin) {
    document.cookie = `isLogIn=${name} מחובר`;
  }

  document.cookie = `username=${name}; expires= sun, 1 aug 2021; path=/Login`;
  document.cookie = `email=${email}; expires= sun, 1 aug 2021; path=/Login`;
  document.cookie = `password=${password}; expires= sun, 1 aug 2021; path=/Login`;
  // console.log("cookies:",document.cookie);

  return (
    <Provider value={shopContext}>
      <Router>
        <div className="app">
          <Header className="heder_component" />
          <div className="notification">
            {newProduct && newProduct.title && (
              <div>שים לב! מוצר חדש אפשרי לקניה {newProduct.title}</div>
            )}
            {deletedProduct && deletedProduct.title && (
              <div>{deletedProduct.title} שים לב מוצר כבר לא זמין לקניה </div>
            )}
            {productUpdated && productUpdated.title && (
              <div>{productUpdated.title} שים לב המוצר הבא התעדכן </div>
            )}
          </div>

          {/* <button className="get_products_button" onClick={getProductsList}>
            products list
          </button> */}
          {/* <button
            className="local_storage_button"
            onClick={() => setCount((currentCount) => +currentCount + 1)}
          >
            {count}localstorage
          </button> */}

          {/* now i need to use this option to save on localstorage the users coose of products to bye so he won't loose his chooses from time to time/ i need to use this speacal state option on the buttons that count the bumbers in cartm,for example */}
          <ul id="products"></ul>

          <Search />
          <Switch>
            <Route exact path={`/adminLogIn`}>
              <AdminPage />
            </Route>

            <Route exact path={`/Login`}>
              <Login />
            </Route>

            <Route exact path={`/Payment`}>
              <Payment />
            </Route>

            <Route exact path={`/adminLogin/UpdateProducts`}>
              <UpdateProducts />
            </Route>

            <Route exact path={`/`}>
              <Slider range defaultValue={[0, 100]} onChange={userRange} />
              <div className="productANDcartComponents">
                {/* <div className="productsComponent"> */}
                <Products
                  identity="shop"
                  products={products}
                  range={range}
                  userSearch={userSearch}
                  userImage={userImage}
                />
                {/* </div> */}

                <div className="cartComponent">
                  <span> {cartCount} פריטים בסל </span>
                  <img
                    alt="עגלת"
                    src="https://static.wixstatic.com/media/63c9e6_4b3dd6fe61aa4548b5882a312746171e~mv2_d_1266_1280_s_2.png/v1/fill/w_350,h_350,al_c,q_85,usm_0.66_1.00_0.01/63c9e6_4b3dd6fe61aa4548b5882a312746171e~mv2_d_1266_1280_s_2.webp"
                  />
                  <Products
                    identity="cart"
                    products={itemsInCart}
                    range={range}
                    userSearch={userSearch}
                  />
                </div>
              </div>
              <Footer />
              <div
                className="notification_new\delete_product"
                style={{ padding: "30px" }}
              >
                {newProduct && newProduct.title && (
                  <div>שים לב! מוצר חדש אפשרי לקניה {newProduct.title}</div>
                )}
                {deletedProduct && deletedProduct.title && (
                  <div>
                    כבר לא זמין לקניה{deletedProduct.title}שים לב! המוצר{" "}
                  </div>
                )}
              </div>
            </Route>

            <Route path={`/products/:id`}>
              <ProductPage />
            </Route>
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
