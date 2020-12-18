import React, { useState, useEffect } from "react";
import Cat from "./Cat";
import Fish from "./Fish";
const Game = () => {
  const [catBottom, setcatBottom] = useState(300);
  const [fishLeft, setfishLeft] = useState(window.innerWidth);
  const [id, setid] = useState(Math.floor(Math.random() * 81));
  let [fishBottom, setfishBottom] = useState(400);
  let [score, setscore] = useState(0);
  let catLeft = window.innerWidth / 2;
  let fishWidth = 50;
  let fishHeight = 50;
  let catWidth = 50;
  let catHeight = 50;

  useEffect(() => {
    let handleKeyPress = (e) => {
      e.preventDefault();
      if (e.keyCode === 32 && catBottom < window.innerHeight - 80) {
        setcatBottom((catBottom) => catBottom + 40);
      }
    };
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [catBottom]);
  useEffect(() => {
    if (catBottom > 0) {
      if (
        catLeft + catWidth >= fishLeft &&
        catLeft < fishLeft + fishWidth &&
        catBottom + catHeight > fishBottom &&
        catBottom < fishBottom + fishHeight
      ) {
        console.log("touch");
        setid(Math.floor(Math.random() * 81));
        setscore((score) => score + 1);
        setfishLeft(-50);
      }
      let catdrop = setTimeout(() => {
        setcatBottom((catBottom) => catBottom - 3);
      }, 30);
      return () => {
        clearTimeout(catdrop);
      };
    }
  }, [catHeight, catLeft, catBottom, catWidth, fishBottom, fishHeight, fishLeft, fishWidth, score]);
  useEffect(() => {
    if (fishLeft + fishWidth > 0) {
      let fishmove = setTimeout(() => {
        setfishLeft((fishLeft) => fishLeft - 3);
      }, 30);
      return () => {
        clearTimeout(fishmove);
      };
    } else {
      setfishBottom((window.innerHeight - fishHeight * 2) * Math.random());
      setfishLeft(window.innerWidth + 50);
      setid(Math.floor(Math.random() * 81));
    }
  }, [fishLeft, fishWidth, fishHeight]);

  return (
    <div>
      <div>{score}</div>

      <Fish fishBottom={fishBottom} fishLeft={fishLeft} fishWidth={fishWidth} fishHeight={fishHeight} id={id} />

      <Cat catLeft={catLeft} catBottom={catBottom} catWidth={catWidth} catHeight={catHeight} />
    </div>
  );
};

export default Game;
