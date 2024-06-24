import { useEffect, useRef, useState } from "react";

import Resume from "./Resume";
import StartScreen from "./StartScreen";
import Player from "./Player";

const ResumeGameManager = () => {
  const currentCollisionBoxes = useRef([]);
  const [startGame, setStartGame] = useState(false);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
  const [renderScale, setRenderScale] = useState(1);

  useEffect(() => {
    console.log("renderscale", renderScale);
  }, [renderScale]);

  return (
    <>
      <StartScreen startGame={startGame} setStartGame={setStartGame} />
      <Resume
        startGame={startGame}
        currentCollisionBoxes={currentCollisionBoxes}
        renderScale={renderScale}
        setRenderScale={setRenderScale}
        isDocumentLoaded={isDocumentLoaded}
        setIsDocumentLoaded={setIsDocumentLoaded}
      />
      <Player
        startGame={startGame}
        currentCollisionBoxes={currentCollisionBoxes}
        renderScale={renderScale}
        isDocumentLoaded={isDocumentLoaded}
      />
    </>
  );
};

export default ResumeGameManager;
