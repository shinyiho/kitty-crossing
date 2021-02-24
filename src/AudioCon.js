import React, { useState, useEffect, useRef } from "react";
import ReactAudioPlayer from "react-audio-player";
import SkipNextRoundedIcon from "@material-ui/icons/SkipNextRounded";
import SkipPreviousRoundedIcon from "@material-ui/icons/SkipPreviousRounded";
import PauseSharpIcon from "@material-ui/icons/PauseSharp";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import "./AudioCon.css";
const AudioCon = () => {
  const playerRef = useRef();
  const [pause, setPause] = useState(false);
  const [audiosrc, setaudiosrc] = useState({});
  const [open, setOpen] = useState(false);
  const [audioid, setAudioid] = useState(Math.floor(Math.random() * 96));
  useEffect(() => {
    fetchingDataFromAudo(audioid);
  }, [audioid]);
  let fetchingDataFromAudo = (audioid) => {
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

  return (
    <div className="audioplayer">
      {open ? (
        <div className="playerOption">
          <div className="closebtn" onClick={() => setOpen(false)}>
            -
          </div>
          <img src={audiosrc.image_uri} alt="" />
          <h3 className="songName">{audiosrc.name}</h3>

          <SkipPreviousRoundedIcon
            onClick={() => {
              audioid === 0 ? setAudioid(96) : setAudioid(audioid - 1);
            }}
          />
          {pause ? (
            <PlayArrowIcon
              onClick={() => {
                setPause(false);
                playerRef.current.audioEl.current.play();
                console.log(playerRef.current.audioEl.currentTime);
              }}
            />
          ) : (
            <PauseSharpIcon
              onClick={() => {
                setPause(true);
                playerRef.current.audioEl.current.pause();
              }}
            />
          )}

          <SkipNextRoundedIcon
            onClick={() => {
              audioid === 96 ? setAudioid(0) : setAudioid(audioid + 1);
            }}
          />
        </div>
      ) : (
        <div className="musicmenubtn">
          <img src={audiosrc.image_uri} alt="" onClick={() => setOpen(true)} />
        </div>
      )}
      <ReactAudioPlayer
        ref={playerRef}
        src={`${audiosrc.music_uri}`}
        autoPlay={true}
        loop={true}
        onEnded={() => {
          setAudioid(audioid + 1);
        }}
      />
    </div>
  );
};

export default AudioCon;
