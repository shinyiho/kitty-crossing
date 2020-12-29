import "./App.css";
import React, { useState, useEffect } from "react";
import Shop from "./Shop";
import Header from "./Header";
import { db } from "./firebase";

import Game from "./Game";
import Furniture from "./Furniture";
import MeowBot from "./MeowBot";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
function App() {
  const [furniturelist, setfurniturelist] = useState([]);
  useEffect(() => {
    const unsubscribe = db.collection("furniturelist").onSnapshot((snapshot) => {
      setfurniturelist(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
    });
    return () => {
      unsubscribe();
    };
  }, []);
  // useEffect(() => {
  //   firebase.database().ref("wallet").set(wallet);
  // }, [furniturelist, wallet]);

  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route path="/shop">
            <Shop />
          </Route>
          <Route path="/earnMoney">
            <Game />
          </Route>
          <Route path="/chat">
            <MeowBot />
          </Route>
          <Route path="/">
            <div className="container">
              {furniturelist.map(({ id, post }) => {
                return <Furniture key={id} name={post.name} url={post.img_url} size={post.size} price={post.price} />;
              })}
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
