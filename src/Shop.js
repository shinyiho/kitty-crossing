import React, { useState, useEffect } from "react";
import Card from "./Card";
import firebase from "firebase";
import { db } from "./firebase";
const Shop = () => {
  const [target, settarget] = useState([]);
  const [wallet, setwallet] = useState();
  const [houseware, sethouseware] = useState([]);
  const [misc, setmisc] = useState([]);
  const [art, setart] = useState([]);
  const [wall, setwall] = useState([]);
  const [fossil, setfossil] = useState([]);
  const [villager, setvillager] = useState([]);
  const [bug, setbug] = useState([]);
  const [seacreature, setseacreature] = useState([]);

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
  useEffect(() => {
    firebase
      .database()
      .ref("wallet")
      .once("value")
      .then((snapshot) => {
        setwallet(snapshot.val());
      });
    console.log("updatestate");
    // settarget(houseware);
  }, [houseware]);
  let purchase = (name, url, size, price) => {
    let add = true;
    const ref = firebase.database().ref("wallet");
    const getData = (ref) => {
      return new Promise((resolve, reject) => {
        const onError = (error) => reject(error);
        const onData = (snap) => resolve(snap.val());
        ref.on("value", onData, onError);
      });
    };
    const updatestate = () => {
      firebase
        .database()
        .ref("wallet")
        .once("value")
        .then((snapshot) => {
          setwallet(snapshot.val());
        });
    };

    db.collection("furniturelist")
      .get()
      .then((shot) => {
        shot.docs.forEach((doc) => {
          if (doc.data().name === name) {
            db.collection("furniturelist").doc(doc.id).delete();
            add = false;
            getData(ref)
              .then((value) => {
                firebase
                  .database()
                  .ref("wallet")
                  .set(value + price);
                updatestate();
              })
              .catch((error) => {
                console.log("add wrong");
              });
          }
        });
        if (add === true) {
          db.collection("furniturelist").add({
            size: size,
            price: price,
            name: name,
            img_url: url,
          });
          firebase
            .database()
            .ref("furniture/" + name)
            .set({
              name: name,
              x: 30,
              y: 50,
            });
          getData(ref)
            .then((value) => {
              firebase
                .database()
                .ref("wallet")
                .set(value - price);
              console.log("-value");
              updatestate();
              console.log("updatestate");
            })
            .catch((error) => {
              console.log("minus wrong");
            });
        }
      });
  };
  return (
    <div>
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
    </div>
  );
};

export default Shop;
