import "./App.css";
import React, { useState, useEffect } from "react";
import Shop from "./Shop";
import RouterOpt from "./RouterOpt";
import firebase from "firebase";
import AudioCon from "./AudioCon";
import Game from "./Game";
import Furniture from "./Furniture";
import MeowBot from "./MeowBot";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
function App() {
  const [furniturelist, setfurniturelist] = useState([]);
  useEffect(() => {
    firebase
      .database()
      .ref("furniture")
      .on("value", (snapshot) => {
        let ob = snapshot.val();
        if (ob) {
          setfurniturelist(Object.values(ob));
        }
      });
  }, []);
  let funiturelistupdatefromchild = (arr) => {
    setfurniturelist(arr);
  };
  return (
    <Router>
      <div className="App">
        <div className="header">
          <AudioCon />
          <RouterOpt />
        </div>
        <Switch>
          <Route path="/shop">
            <Shop furniturelist={furniturelist} funiturelistupdatefromchild={funiturelistupdatefromchild} />
          </Route>
          <Route path="/earnMoney">
            <Game />
          </Route>
          <Route path="/chat">
            <MeowBot />
          </Route>
          <Route path="/">
            <div className="container">
              {furniturelist
                .sort((a, b) => a.timeStamp - b.timeStamp)
                .map((post) => {
                  return (
                    <Furniture
                      key={post.name}
                      name={post.name}
                      url={post.img_url}
                      size={post.size}
                      price={post.price}
                    />
                  );
                })}
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
