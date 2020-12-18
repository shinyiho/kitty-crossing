import React, { useEffect, useState } from "react";
import { db } from "./firebase";
// import ReactDOM from "react-dom";
const Furniture = ({ name, url, size, price }) => {
  const [dragging, setdragging] = useState(false);
  const [pos, setpos] = useState({});

  size.trim();
  const w = size.slice(0, size.indexOf("x")) * 100;
  const h = size.slice(size.indexOf("x") + 1, size.length) * 100;

  useEffect(() => {
    console.log("once");
    var docRef = db.collection("furniturelist");
    docRef.get().then((shot) => {
      shot.docs.forEach((doc) => {
        if (doc.data().name === name) {
          setpos({ x: doc.data().x, y: doc.data().y });
        }
      });
    });
  }, []);

  useEffect(() => {
    if (dragging) {
      let onMouseUp = (e) => {
        console.log("up");

        db.collection("furniturelist").onSnapshot((snapshot) => {
          snapshot.docs.forEach((doc) => {
            if (doc.data().name === name) {
              db.collection("furniturelist").doc(doc.id).update({
                x: pos.x,
                y: pos.y,
              });
            }
          });
        });
        setdragging(false);

        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        e.stopPropagation();
        e.preventDefault();
      };
      let onMouseMove = (e) => {
        console.log(pos, "move");
        setpos({
          x: e.clientX - w / 2,
          y: e.clientY - h / 2 - 50,
        });

        e.stopPropagation();
        e.preventDefault();
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }
  }, [dragging, h, w]);

  let onMouseDown = (e) => {
    console.log("down");
    console.log(e);
    setdragging(true);

    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      className="dragable"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${w}px`,
        height: `${h}px`,
      }}
      onMouseDown={onMouseDown}
    >
      <img src={url} alt="" />
    </div>
  );
};

export default Furniture;
