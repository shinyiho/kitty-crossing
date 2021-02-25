import React, { useState, useEffect } from "react";
import Card from "./Card";
import firebase from "firebase";
import walletIcon from "./assets/wallet.png";
import SearchIcon from "@material-ui/icons/Search";
import "./Shop.css";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
const Shop = ({ furniturelist, funiturelistupdatefromchild }) => {
  const [open, setOpen] = useState(false);
  const [target, settarget] = useState([]);
  const [wallet, setwallet] = useState();
  const [houseware, sethouseware] = useState([]);
  const [misc, setmisc] = useState([]);
  const [art, setart] = useState([]);
  const [wall, setwall] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let fetchingDataFromwall = () => {
      fetch("http://acnhapi.com/v1/wallmounted/")
        .then((response) => response.json())
        .then((data) => {
          let item = [];
          for (const [key, value] of Object.entries(data)) {
            item.push({
              key: key,
              name: value[0].name["name-USen"],
              url: value[0].image_uri,
              size: value[0].size,
              sellprice: value[0]["sell-price"],
              buyprice: value[0]["buy-price"],
              tag: value[0].tag,
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
              key: key,
              name: value[0].name["name-USen"],
              url: value[0].image_uri,
              size: value[0].size,
              sellprice: value[0]["sell-price"],
              buyprice: value[0]["buy-price"],
              tag: value[0].tag,
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
              key: key,
              name: value.name["name-USen"],
              url: value.image_uri,
              size: "2x2",
              sellprice: value["sell-price"],
              buyprice: value["buy-price"],
              tag: "",
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
              key: key,
              name: value[0].name["name-USen"],
              url: value[0].image_uri,
              size: value[0].size,
              sellprice: value[0]["sell-price"],
              buyprice: value[0]["buy-price"],
              tag: value[0].tag,
            });
          }
          sethouseware(item);
          settarget(item);
        });
    };
    // let fetchingDataFromSeacreature = () => {
    //   fetch("http://acnhapi.com/v1/sea/")
    //     .then((response) => response.json())
    //     .then((data) => {
    //       let item = [];
    //       for (const [key, value] of Object.entries(data)) {
    //         item.push({
    //           name: key,
    //           url: value.icon_uri,
    //           id: value.id,
    //           size: "1x1",
    //           price: value.price,
    //         });
    //       }
    //       setseacreature(item);
    //     });
    // };
    // let fetchingDataFromBug = () => {
    //   fetch("http://acnhapi.com/v1/bugs/")
    //     .then((response) => response.json())
    //     .then((data) => {
    //       let item = [];
    //       for (const [key, value] of Object.entries(data)) {
    //         item.push({
    //           name: key,
    //           url: value.icon_uri,
    //           id: value.id,
    //           size: "1x1",
    //           price: value.price,
    //         });
    //       }
    //       setbug(item);
    //     });
    // };
    // let fetchingDataFromFossil = () => {
    //   fetch("http://acnhapi.com/v1/fossils/")
    //     .then((response) => response.json())
    //     .then((data) => {
    //       let item = [];
    //       for (const [key, value] of Object.entries(data)) {
    //         item.push({
    //           name: key,
    //           url: value.image_uri,
    //           id: value.id,
    //           size: "1x1",
    //           price: value.price,
    //         });
    //       }
    //       setfossil(item);
    //     });
    // };
    // let fetchingDataFromVillagers = () => {
    //   fetch("http://acnhapi.com/v1/villagers/")
    //     .then((response) => response.json())
    //     .then((data) => {
    //       let item = [];
    //       for (const [key, value] of Object.entries(data)) {
    //         item.push({
    //           name: key,
    //           url: value.icon_uri,
    //           id: value.id,
    //           size: "1x1",
    //           price: value.price,
    //         });
    //       }
    //       setvillager(item);
    //     });
    // };
    // fetchingDataFromVillagers();
    // fetchingDataFromFossil();
    // fetchingDataFromBug();
    // fetchingDataFromSeacreature();
    fetchingDataFromhouseware();
    fetchingDataFromwall();
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
  }, []);

  let purchase = (name, url, size, sellprice, buyprice) => {
    let add = true;
    const ref = firebase.database().ref("wallet");
    const getData = (ref) => {
      return new Promise((resolve, reject) => {
        const onError = (error) => reject(error);
        const onData = (snap) => resolve(snap.val());
        ref.on("value", onData, onError);
      });
    };
    for (let i = 0; i < furniturelist.length; i++) {
      if (furniturelist[i]["name"] === name) {
        let userRef = firebase.database().ref("furniture/" + name);
        userRef.remove();
        // db.collection("furniturelist").doc(doc.id).delete();
        add = false;

        getData(ref)
          .then((value) => {
            firebase
              .database()
              .ref("wallet")
              .set(value + sellprice);
            setwallet((val) => val + sellprice);
          })
          .catch((error) => {});
        funiturelistupdatefromchild(furniturelist.filter((x) => x.name !== name));
        return;
      }
    }
    if (add === true) {
      if (wallet - buyprice >= 0) {
        firebase
          .database()
          .ref("furniture/" + name)
          .set({
            name: name,
            size: size,
            img_url: url,
            x: 30,
            y: 50,
            timeStamp: Date.now(),
          });
        getData(ref)
          .then((value) => {
            firebase
              .database()
              .ref("wallet")
              .set(value - buyprice);
            setwallet((val) => val - buyprice);
          })
          .catch((error) => {
            console.log("minus wrong");
          });
      } else {
        setOpen(true);
      }
    }
  };
  return (
    <div className="shop">
      <div className="shopHeader">
        <div className="categories">
          <div className="categoriesBtn" onClick={() => settarget(houseware)}>
            HouseWare
          </div>
          <div className="categoriesBtn" onClick={() => settarget(wall)}>
            WallDeco
          </div>
          <div className="categoriesBtn" onClick={() => settarget(misc)}>
            Misc
          </div>
          <div className="categoriesBtn" onClick={() => settarget(art)}>
            Art
          </div>
        </div>
        <div className="searchItem">
          <SearchIcon />
          <input
            className="searchInput"
            placeholder="search"
            type="text"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          ></input>
        </div>
        {/* <div variant="outlined" color="primary" onClick={() => settarget(seacreature)}>
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
        </div> */}
      </div>

      <div>
        <img className="walletIcon" alt="" src={walletIcon}></img>
        <div className="money">${wallet}</div>
      </div>

      <div className="CardsContainer">
        <div className="Cards">
          {target.map((item) => {
            if (item.tag.toLowerCase().includes(search) || item.name.toLowerCase().includes(search)) {
              return (
                <Card
                  furniturelist={furniturelist}
                  key={item.key}
                  name={item.name}
                  url={item.url}
                  size={item.size}
                  sellprice={item.sellprice}
                  buyprice={item.buyprice}
                  tag={item.tag}
                  onClick={purchase}
                />
              );
            } else {
              return <div></div>;
            }
          })}

          {/* {target.map((item) => {
            // if(search&&item.tag.includes(search)){}
            return (
              <Card
                key={item.key}
                name={item.name}
                url={item.url}
                size={item.size}
                sellprice={item.sellprice}
                buyprice={item.buyprice}
                tag={item.tag}
                onClick={purchase}
              />
            );
          })} */}
        </div>
      </div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">" Not enough money! "</DialogTitle>
        <DialogActions>
          <Link to="/earnMoney">
            <Button onClick={() => setOpen(false)} color="primary" autoFocus>
              Go Fishing
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Shop;
