import React, { useState, useEffect } from "react";
import Cat from "./Cat";
import { Link } from "react-router-dom";
import firebase from "firebase";
import Fish from "./Fish";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const Game = () => {
  const [open, setOpen] = React.useState(false);
  const [catBottom, setcatBottom] = useState(300);
  const [fishLeft, setfishLeft] = useState(window.innerWidth);
  const [id, setid] = useState(Math.floor(Math.random() * 81) + 1);
  let [fishBottom, setfishBottom] = useState(400);
  let [score, setscore] = useState(0);
  let [isEnd, setisEnd] = useState(false);
  let catLeft = window.innerWidth / 2;
  let fishWidth = 50;
  let fishHeight = 50;
  let catWidth = 50;
  let catHeight = 50;
  let catdrop;
  let fishmove;
  const handleClose = () => {
    setscore(0);
    setOpen(false);
  };

  useEffect(() => {
    let handleKeyPress = (e) => {
      // e.preventDefault();
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
      if (
        catLeft + catWidth >= fishLeft &&
        catLeft < fishLeft + fishWidth &&
        catBottom + catHeight > fishBottom &&
        catBottom < fishBottom + fishHeight
      ) {
        console.log("touch");
        fetch(`http://acnhapi.com/v1/fish/${id}`)
          .then((response) => response.json())
          .then((data) => {
            setscore((score) => score + data.price);
          });

        setid(Math.floor(Math.random() * 81) + 1);

        setfishLeft(-50);
      }
      catdrop = setTimeout(() => {
        setcatBottom((catBottom) => catBottom - 3);
      }, 30);
      return () => {
        clearTimeout(catdrop);
      };
    } else {
      clearTimeout(catdrop);
      clearTimeout(fishmove);
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
  }, [catHeight, catLeft, catBottom, catWidth, fishBottom, fishHeight, fishLeft, fishWidth, score, id, isEnd]);
  useEffect(() => {
    if (!isEnd && fishLeft + fishWidth > 0) {
      fishmove = setTimeout(() => {
        setfishLeft((fishLeft) => fishLeft - 3);
      }, 30);
      return () => {
        clearTimeout(fishmove);
      };
    } else {
      setfishBottom((window.innerHeight - fishHeight * 2) * Math.random());
      setfishLeft(window.innerWidth + 50);
      setid(Math.floor(Math.random() * 81) + 1);
    }
  }, [fishLeft, fishWidth, fishHeight, isEnd]);

  return (
    <div>
      <div>{score}</div>

      <Fish fishBottom={fishBottom} fishLeft={fishLeft} fishWidth={fishWidth} fishHeight={fishHeight} id={id} />

      <Cat catLeft={catLeft} catBottom={catBottom} catWidth={catWidth} catHeight={catHeight} />
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {score > 5000 ? " We have a plenteous harvest this trip! " : "Next time would be better"}
        </DialogTitle>
        {score}
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
