import React, { useState, useEffect } from "react";
import "./Card.css";
const Card = ({ name, url, size, onClick, sellprice, buyprice, furniturelist }) => {
  size.trim();
  const [showInfo, setshowInfo] = useState(false);
  const [exist, setexist] = useState(false);
  useEffect(() => {
    for (let i = 0; i < furniturelist.length; i++) {
      if (furniturelist[i]["name"] === name) {
        setexist(true);
        return;
      }
    }
    setexist(false);
  }, [furniturelist]);

  return (
    <div className="Card" onMouseLeave={() => setshowInfo(false)}>
      <img src={url} alt="" onMouseEnter={() => setshowInfo(true)} />

      <div>{name}</div>

      {showInfo ? (
        <div className="CardInfo">
          <div>Buy:${buyprice === null ? sellprice : buyprice}</div>
          <div>Sell:${buyprice === null ? Math.floor(sellprice / 7) : sellprice}</div>
          {exist ? (
            <div className="buybtn" onClick={() => onClick(name, url, size, sellprice, buyprice)}>
              sell
            </div>
          ) : (
            <div className="buybtn" onClick={() => onClick(name, url, size, sellprice, buyprice)}>
              buy
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Card;
