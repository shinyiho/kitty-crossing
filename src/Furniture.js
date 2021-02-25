import React, { useEffect, useState } from "react";
import firebase from "firebase";
import "./Furniture.css";
const Furniture = ({ name, url, size, price }) => {
  const [dragging, setdragging] = useState(false);
  const [pos, setpos] = useState({});
  size.trim();
  const w = size.slice(0, size.indexOf("x")) * 100;
  const h = size.slice(size.indexOf("x") + 1, size.length) * 100;

  // download(x,y) last rendering from database
  useEffect(() => {
    firebase
      .database()
      .ref("furniture")
      .once("value")
      .then((snapshot) => {
        let ob = snapshot.val();
        setpos({ x: ob[name]["x"], y: ob[name]["y"] });
      });
  }, [name]);
  useEffect(() => {
    //update (x,y)after mouseup
    let updateFirebase = (endX, endY) => {
      firebase
        .database()
        .ref("furniture/" + name)
        .update({
          x: endX,
          y: endY,
          timeStamp: Date.now(),
        });
    };
    if (dragging) {
      let onMouseUp = (e) => {
        updateFirebase(e.clientX - w / 2, e.clientY - h / 2);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        e.stopPropagation();
        e.preventDefault();
      };
      let onMouseMove = (e) => {
        setpos({
          x: e.clientX - w / 2,
          y: e.clientY - h / 2,
        });
        e.stopPropagation();
        e.preventDefault();
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);

      setdragging(false);
    }
  }, [dragging, h, w, name]);

  let onMouseDown = (e) => {
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
