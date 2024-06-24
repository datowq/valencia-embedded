import { useEffect, useRef, useState } from "react";

import Resume from "./Resume";
import StartScreen from "./StartScreen";
import Player from "./Player";

const ResumeGameManager = () => {
  const currentCollisionBoxes = useRef([]);
  const [startGame, setStartGame] = useState(false);

  useEffect(() => {
    console.log("from resumegamemanager", currentCollisionBoxes.current);
  }, [currentCollisionBoxes]);

  return (
    <>
      <StartScreen startGame={startGame} setStartGame={setStartGame} />
      <Resume
        startGame={startGame}
        currentCollisionBoxes={currentCollisionBoxes}
      />
      <Player
        startGame={startGame}
        currentCollisionBoxes={currentCollisionBoxes}
      />
    </>
  );
};

export default ResumeGameManager;
