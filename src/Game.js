import React, { useState, useEffect } from "react";
import Cat from "./Cat";
// import Score from "./Score";

import firebase from "firebase";
import Fish from "./Fish";
import "./Game.css";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

const Game = () => {
  let fishWidth = 100;
  let fishHeight = 100;
  let catWidth = 100;
  let catHeight = 100;
  const [open, setOpen] = React.useState(false);
  const [addScore, setaddScore] = useState(false);
  const [catBottom, setcatBottom] = useState(300);
  const [catchPhrase, setcatchPhrase] = useState("");
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
          //50 & /2is hard index
          catLeft + 50 + catWidth / 2 >= fish.fishLeft &&
          catLeft + 50 < fish.fishLeft + fishWidth &&
          catBottom + 50 + catHeight / 2 > fish.fishBottom &&
          catBottom + 50 < fish.fishBottom + fishHeight
        ) {
          console.log("touch");
          showAddScore();
          fetch(`http://acnhapi.com/v1/fish/${fish.id}`)
            .then((response) => response.json())
            .then((data) => {
              setaddScore(Math.floor(data.price));
              setcatchPhrase(data["catch-phrase"]);
            });
          setscore((score) => score + addScore);
          return {
            id: Math.floor(Math.random() * 80) + 1,
            fishBottom: (window.innerHeight - fishHeight * 2) * Math.random(),
            fishLeft: window.innerWidth + 100,
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
    if (!isEnd) {
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
    }
    return () => {
      clearTimeout(fishmove);
    };
  }, [fishes]);
  let showAddScore = () => {
    setTimeout(() => {
      setistouch(true);
    }, 280);
    setTimeout(() => {
      setistouch(false);
    }, 3000);
    //  setscore(false)
  };

  return (
    <div className="game">
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
      {istouch && (
        <div>
          <div
            className="Score"
            style={{
              position: "absolute",
              left: `${catLeft + 150}px`,
              bottom: `${catBottom + 150}px`,
            }}
          >
            +${addScore}
          </div>
          <p className="catchPhrase">{catchPhrase}</p>
        </div>
      )}
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
