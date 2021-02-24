import React, { useState, useEffect } from "react";
import Cat from "./Cat";
import Score from "./Score";
import { Link } from "react-router-dom";
import firebase from "firebase";
import Fish from "./Fish";
import "./Game.css";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

const Game = () => {
  let fishWidth = 50;
  let fishHeight = 50;
  let catWidth = 50;
  let catHeight = 50;
  const [open, setOpen] = React.useState(false);
  const [addScore, setaddScore] = useState(false);
  const [scoreLeft, setscoreLeft] = useState(0);
  const [scoreBottom, setscoreBottom] = useState(0);
  const [catBottom, setcatBottom] = useState(300);
  const [fishes, setfishes] = useState([
    {
      id: Math.floor(Math.random() * 80) + 1,
      fishBottom: 200,
      fishLeft: window.innerWidth,
    },
    {
      id: Math.floor(Math.random() * 80) + 1,
      fishBottom: 400,
      fishLeft: window.innerWidth * 1.2,
    },
    {
      id: Math.floor(Math.random() * 80) + 1,
      fishBottom: 700,
      fishLeft: window.innerWidth * 1.2,
    },
  ]);
  let [score, setscore] = useState(0);
  let [isEnd, setisEnd] = useState(false);
  let [istouch, setistouch] = useState(false);
  let catLeft = window.innerWidth / 2;
  let catdrop;
  let fishmove;
  const handleClose = () => {
    setscore(0);
    setOpen(false);
  };

  useEffect(() => {
    let handleKeyPress = (e) => {
      if (!isEnd && e.keyCode === 32 && catBottom < window.innerHeight - 80) {
        setcatBottom((catBottom) => catBottom + 40);
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [catBottom, isEnd]);

  useEffect(() => {
    if (!isEnd && catBottom > 0) {
      catdrop = setTimeout(() => {
        setcatBottom((catBottom) => catBottom - 3);
      }, 30);
      let updatedfishlist = fishes.map((fish) => {
        if (
          catLeft + catWidth >= fish.fishLeft &&
          catLeft < fish.fishLeft + fishWidth &&
          catBottom + catHeight > fish.fishBottom &&
          catBottom < fish.fishBottom + fishHeight
        ) {
          console.log("touch");
          showAddScore();
          fetch(`http://acnhapi.com/v1/fish/${fish.id}`)
            .then((response) => response.json())
            .then((data) => {
              setaddScore(Math.floor(data.price / 100));
            });
          setscore((score) => score + addScore);
          return {
            id: Math.floor(Math.random() * 80) + 1,
            fishBottom: (window.innerHeight - fishHeight * 2) * Math.random(),
            fishLeft: window.innerWidth,
          };
        }
        return fish;
      });
      setfishes(updatedfishlist);
    } else {
      clearTimeout(catdrop);
      setisEnd(true);
      setOpen(true);
      const ref = firebase.database().ref("wallet");
      const getData = (ref) => {
        return new Promise((resolve, reject) => {
          const onError = (error) => reject(error);
          const onData = (snap) => resolve(snap.val());
          ref.on("value", onData, onError);
        });
      };
      getData(ref)
        .then((value) => {
          firebase
            .database()
            .ref("wallet")
            .set(value + score);
        })
        .catch((error) => {
          console.log("endgameerror");
        });
    }
    return () => {
      clearTimeout(catdrop);
    };
  }, [catBottom, istouch]);

  useEffect(() => {
    fishmove = setTimeout(() => {
      let updatedfishlist = fishes.map((fish) => {
        if (!isEnd && fish.fishLeft + fishWidth > 0) {
          fish.fishLeft -= 1;
          return fish;
        } else {
          fish.id = Math.floor(Math.random() * 80) + 1;
          fish.fishBottom = (window.innerHeight - fishHeight * 2) * Math.random();
          fish.fishLeft = window.innerWidth;
          return fish;
        }
      });
      setfishes(updatedfishlist);
    }, 3);
    return () => {
      clearTimeout(fishmove);
    };
  }, [fishes]);
  let showAddScore = () => {
    setistouch(true);
    fishmove = setTimeout(() => {
      setistouch(false);
    }, 1000);
    //  setscore(false)
  };

  return (
    <div className="game">
      <div>{score + addScore}</div>
      {fishes.map((f, i) => {
        return (
          <Fish
            key={i}
            fishBottom={f.fishBottom}
            fishLeft={f.fishLeft}
            fishWidth={fishWidth}
            fishHeight={fishHeight}
            id={f.id}
          />
        );
      })}
      <Cat catLeft={catLeft} catBottom={catBottom} catWidth={catWidth} catHeight={catHeight} />
      {istouch && <Score addScore={addScore} catLeft={catLeft} catBottom={catBottom} />}
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {score > 200 ? " We have a plenteous harvest this trip! " : "Next time would be better"}
        </DialogTitle>
        <h1>${score + addScore}</h1>
        <DialogActions>
          <Link to="/">
            <Button onClick={handleClose} color="primary" autoFocus>
              Go home
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Game;
