import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./RouterOpt.css";
// import AudioCon from "./AudioCon";
import map from "./assets/map.png"; // with import
// import mapIcon from "./assets/mapIcon.png";
import cellphoneIcon from "./assets/cellphoneIcon.png";
import houseIcon from "./assets/houseIcon.png";
import shopIcon from "./assets/shopIcon.png";
import fishIcon from "./assets/fishIcon.png";

const RouterOpt = () => {
  const [open, setOpen] = useState(false);
  let quit = () => {
    if (open) setOpen(false);
  };

  return (
    <div className={open ? "RouterOptOnTop" : "RouterOpt"} onClick={quit}>
      {/* <AudioCon /> */}
      {open ? (
        <div className="routerOption">
          <Link to="/">
            <img onClick={() => setOpen(false)} className="house" alt="" src={houseIcon} />
          </Link>
          <Link to="/shop">
            <img onClick={() => setOpen(false)} className="shop" alt="" src={shopIcon} />
          </Link>
          <Link to="/earnMoney">
            <img onClick={() => setOpen(false)} className="earnMoney" alt="" src={fishIcon} />
          </Link>
          <Link to="/chat">
            <img onClick={() => setOpen(false)} className="chat" alt="" src={cellphoneIcon} />
          </Link>
        </div>
      ) : (
        <div>
          <img onClick={() => setOpen(true)} className="menubtn" alt="MAP" src={map} />
        </div>
      )}
    </div>
  );
};

export default RouterOpt;
