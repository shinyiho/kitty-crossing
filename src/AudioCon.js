import React, { useState, useEffect } from "react";
import ReactAudioPlayer from "react-audio-player";
const AudioCon = () => {
  const [audiosrc, setaudiosrc] = useState({});
  let audioid = Math.floor(Math.random() * 96);
  useEffect(() => {
    let fetchingDataFromAudo = () => {
      fetch(`https://acnhapi.com/v1/songs/${audioid}`)
        .then((response) => response.json())
        .then((data) => {
          setaudiosrc({
            music_uri: data.music_uri,
            image_uri: data.image_uri,
            name: data.name["name-JPja"],
            price: data.name["sell-price"],
          });
          console.log();
          console.log(data);
        });
    };
    fetchingDataFromAudo();
  }, []);

  return (
    <div className="audioplayer">
      <div>{audiosrc.name}</div>
      <img src={audiosrc.image_uri} alt="" />
      <ReactAudioPlayer src={`${audiosrc.music_uri}`} autoPlay={true} loop={true} />
    </div>
  );
};

export default AudioCon;
