import React from "react";
const Fish = ({ fishLeft, fishBottom, fishWidth, fishHeight, id }) => {
  return (
    <div>
      <img
        className="Fish"
        alt=""
        src={`https://acnhapi.com/v1/icons/fish/${id}`}
        style={{
          position: "absolute",
          left: `${fishLeft}px`,
          bottom: `${fishBottom}px`,
          width: `${fishWidth}px`,
          height: `${fishHeight}px`,
        }}
      />
    </div>
  );
};

export default Fish;
