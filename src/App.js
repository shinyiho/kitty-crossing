import "./App.css";
import React, { useState, useEffect } from "react";
import Card from "./Card";
import Header from "./Header";
import { db } from "./firebase";
import Game from "./Game";
import Furniture from "./Furniture";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const [houseware, sethouseware] = useState([]);
  const [misc, setmisc] = useState([]);
  const [art, setart] = useState([]);
  const [wall, setwall] = useState([]);
  const [fossil, setfossil] = useState([]);
  const [villager, setvillager] = useState([]);
  const [bug, setbug] = useState([]);
  const [seacreature, setseacreature] = useState([]);
  const [target, settarget] = useState([]);
  const [wallet, setwallet] = useState(300000);
  // let [chosenitem, setchosenitem] = useState([]);
  const [furniturelist, setfurniturelist] = useState([]);
  useEffect(() => {
    const unsubscribe = db.collection("furniturelist").onSnapshot((snapshot) => {
      setfurniturelist(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
    });
    return () => {
      unsubscribe();
    };
  }, [wallet]);

  useEffect(() => {
    let fetchingDataFromwall = () => {
      fetch("http://acnhapi.com/v1/wallmounted/")
        .then((response) => response.json())
        .then((data) => {
          let item = [];
          for (const [key, value] of Object.entries(data)) {
            item.push({
              name: key,
              url: value[0].image_uri,
              size: value[0].size,
              price: value[0]["sell-price"],
            });
          }
          setwall(item);
        });
    };
    let fetchingDataMisc = () => {
      fetch("http://acnhapi.com/v1/misc/")
        .then((response) => response.json())
        .then((data) => {
          let item = [];
          for (const [key, value] of Object.entries(data)) {
            item.push({
              name: key,
              url: value[0].image_uri,
              size: value[0].size,
              price: value[0]["sell-price"],
            });
          }

          setmisc(item);
        });
    };
    let fetchingDataArt = () => {
      fetch("http://acnhapi.com/v1/art/")
        .then((response) => response.json())
        .then((data) => {
          let item = [];
          for (const [key, value] of Object.entries(data)) {
            item.push({
              name: key,
              url: value.image_uri,
              size: "2x2",
              price: value["sell-price"],
            });
          }

          setart(item);
        });
    };
    let fetchingDataFromhouseware = () => {
      fetch("http://acnhapi.com/v1/houseware/")
        .then((response) => response.json())
        .then((data) => {
          let item = [];
          for (const [key, value] of Object.entries(data)) {
            item.push({
              name: key,
              url: value[0].image_uri,
              size: value[0].size,
              price: value[0]["sell-price"],
            });
          }
          sethouseware(item);
          settarget(item);
        });
    };

    let fetchingDataFromSeacreature = () => {
      fetch("http://acnhapi.com/v1/sea/")
        .then((response) => response.json())
        .then((data) => {
          let item = [];
          for (const [key, value] of Object.entries(data)) {
            item.push({
              name: key,
              url: value.icon_uri,
              id: value.id,
              size: "1x1",
              price: value.price,
            });
          }
          setseacreature(item);
        });
    };
    let fetchingDataFromBug = () => {
      fetch("http://acnhapi.com/v1/bugs/")
        .then((response) => response.json())
        .then((data) => {
          let item = [];
          for (const [key, value] of Object.entries(data)) {
            item.push({
              name: key,
              url: value.icon_uri,
              id: value.id,
              size: "1x1",
              price: value.price,
            });
          }
          setbug(item);
        });
    };
    let fetchingDataFromFossil = () => {
      fetch("http://acnhapi.com/v1/fossils/")
        .then((response) => response.json())
        .then((data) => {
          let item = [];
          for (const [key, value] of Object.entries(data)) {
            item.push({
              name: key,
              url: value.image_uri,
              id: value.id,
              size: "1x1",
              price: value.price,
            });
          }
          setfossil(item);
        });
    };
    let fetchingDataFromVillagers = () => {
      fetch("http://acnhapi.com/v1/villagers/")
        .then((response) => response.json())
        .then((data) => {
          let item = [];
          for (const [key, value] of Object.entries(data)) {
            item.push({
              name: key,
              url: value.icon_uri,
              id: value.id,
              size: "1x1",
              price: value.price,
            });
          }
          setvillager(item);
        });
    };
    fetchingDataFromVillagers();
    fetchingDataFromFossil();
    fetchingDataFromBug();
    fetchingDataFromSeacreature();
    fetchingDataFromwall();
    fetchingDataFromhouseware();
    fetchingDataMisc();
    fetchingDataArt();
  }, []);
  let purchase = (name, url, size, price) => {
    let add = true;

    var docRef = db.collection("furniturelist");
    docRef.get().then((shot) => {
      shot.docs.map((doc) => {
        if (doc.data().name === name) {
          console.log("samename");
          db.collection("furniturelist").doc(doc.id).delete();
          add = false;
          setwallet(wallet + price);
          console.log(doc.data());
        }
      });
      if (add === true) {
        console.log("difffername", add);
        db.collection("furniturelist").add({
          x: 30,
          size: size,
          price: price,
          name: name,
          y: 50,
          img_url: url,
        });

        setwallet(wallet - price);
      }
    });
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route path="/shop">
            <h2 variant="outlined" color="primary">
              ${wallet}
            </h2>
            <div className="categories">
              <div variant="outlined" color="primary" onClick={() => settarget(houseware)}>
                houseware
              </div>

              <div variant="outlined" color="primary" onClick={() => settarget(wall)}>
                wall
              </div>
              <div variant="outlined" color="primary" onClick={() => settarget(misc)}>
                misc
              </div>
              <div variant="outlined" color="primary" onClick={() => settarget(art)}>
                art
              </div>
              <div variant="outlined" color="primary" onClick={() => settarget(seacreature)}>
                sea creature
              </div>
              <div variant="outlined" color="primary" onClick={() => settarget(bug)}>
                bug
              </div>
              <div variant="outlined" color="primary" onClick={() => settarget(fossil)}>
                fossil
              </div>
              <div variant="outlined" color="primary" onClick={() => settarget(villager)}>
                villager
              </div>
            </div>
            <div className="Cards">
              {target.map((item) => {
                return (
                  <Card
                    key={item.name}
                    name={item.name}
                    url={item.url}
                    size={item.size}
                    price={item.price}
                    onClick={purchase}
                  />
                );
              })}
            </div>
          </Route>
          <Route path="/earnMoney">
            <Game />
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
