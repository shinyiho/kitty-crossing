import React, { useEffect } from "react";
const Score = ({ catLeft, catBottom, addScore }) => {
  let scoreLeft = catLeft;
  let scoreBottom = catBottom;
  return (
    <div>
      <div
        className="Score"
        style={{
          position: "absolute",
          left: `${scoreLeft + 100}px`,
          bottom: `${scoreBottom + 100}px`,
        }}
      >
        {addScore}
      </div>
    </div>
  );
};

export default Score;
