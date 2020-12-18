import React from "react";
const Card = ({ name, url, size, onClick, price }) => {
  size.trim();

  return (
    <div className="Card" onClick={() => onClick(name, url, size, price)}>
      <img src={url} alt="" />
      <div>{price}</div>
    </div>
  );
};

export default Card;
