import React, { useState, useEffect, useParams } from "react";

import "./AppPage.css";
import Header from "./component/header/Header";
import "./component/products/products.css";
import Product from "./component/product/product.js";
import Products from "./component/products/Products.js";
import Cart from "./component/cart/cart";
import { Slider } from "antd";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

const AppPage = () => {
  // const { id } = useParams();

  return (
    <Router>
      <div className="app">
        <Header />
        <Products />
        <Switch>
          <Route exact path="/">
            <Products />
          </Route>{" "}
          */
          <Route path="/product/:id">
            <Product />
          </Route>{" "}
          */
        </Switch>{" "}
        */
      </div>
    </Router>
  );
};

export default App;
