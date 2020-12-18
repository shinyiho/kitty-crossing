import React from "react";
const Cat = ({ catBottom, catLeft, catWidth, catHeight }) => {
  return (
    <div>
      <img
        className="Cat"
        alt=""
        src="https://img.icons8.com/cotton/64/000000/cat--v4.png"
        style={{
          position: "absolute",
          left: `${catLeft}px`,
          bottom: `${catBottom}px`,
          width: `${catWidth}px`,
          height: `${catHeight}px`,
        }}
      />
    </div>
  );
};

export default Cat;
