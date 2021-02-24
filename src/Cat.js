import React from "react";
import net from "./assets/net.png";
import "./Cat.css";
const Cat = ({ catBottom, catLeft, catWidth, catHeight }) => {
  return (
    <div>
      <img
        className="Cat"
        alt=""
        src={net}
        style={{
          //  transform: rotate(45deg); /
          position: "absolute",
          left: `${catLeft}px`,
          bottom: `${catBottom}px`,
          width: `${catWidth}px`,
          height: `${catHeight}px`,
          transform: `scale(2)`,
        }}
      />
    </div>
  );
};

export default Cat;
