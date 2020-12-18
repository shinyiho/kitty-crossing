import React from "react";
import { Link } from "react-router-dom";
import AudioCon from "./AudioCon";
const Header = () => {
  return (
    <div className="Header countainer">
      <AudioCon />
      <Link to="/">
        <img className="house" alt="" src="https://img.icons8.com/carbon-copy/100/000000/shop.png" />
      </Link>
      <Link to="/shop">
        <img className="shop" alt="" src="https://img.icons8.com/carbon-copy/100/000000/shopping-basket-2.png" />
      </Link>
      <Link to="/earnMoney">
        <img className="earnMoney" alt="" src="https://img.icons8.com/ios/100/000000/fish-food.png" />
      </Link>
    </div>
  );
};

export default Header;
