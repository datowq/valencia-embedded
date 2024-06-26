import { useState, useEffect, useCallback, useRef } from "react";

// could update with a quadtree, but a resume really doesn't need it
// fix movement, add jump
const collisionDetection = (player, collisionBoxes) => {
  let collisionSides = [];

  for (let i = 0; i < collisionBoxes.length; i++) {
    const box = collisionBoxes[i];
    const playerRight = player.x + player.width;
    const playerBottom = player.y + player.height;
    const boxRight = box.x + box.width;
    const boxBottom = box.y + box.height;

    if (
      player.x < boxRight &&
      playerRight > box.x &&
      player.y < boxBottom &&
      playerBottom > box.y
    ) {
      const overlapLeft = playerRight - box.x;
      const overlapRight = boxRight - player.x;
      const overlapTop = playerBottom - box.y;
      const overlapBottom = boxBottom - player.y;

      collisionSides.push({
        index: i,
        top:
          overlapTop < overlapLeft &&
          overlapTop < overlapRight &&
          overlapTop < overlapBottom,
        bottom:
          overlapBottom < overlapLeft &&
          overlapBottom < overlapRight &&
          overlapBottom < overlapTop,
        left:
          overlapLeft < overlapRight &&
          overlapLeft < overlapTop &&
          overlapLeft < overlapBottom,
        right:
          overlapRight < overlapLeft &&
          overlapRight < overlapTop &&
          overlapRight < overlapBottom,
      });
    }
  }

  return collisionSides;
};

const Player = ({
  startGame,
  currentCollisionBoxes,
  renderScale,
  isDocumentLoaded,
}) => {
  const playerSpeed = useRef(30);
  const playerJump = useRef(50);
  const gravity = useRef(20);

  const playerRef = useRef();
  const requestRef = useRef();
  const [position, setPosition] = useState({ x: 100, y: 10 });
  const [opacity, setOpacity] = useState(0);
  const velocity = useRef({ x: 0, y: 0 });
  const isOnGround = useRef(false);
  const isJumping = useRef(false);

  const deltaTime = useRef(0);
  const prevTime = useRef(0);
  const [fps, setFps] = useState(0);

  const keys = useRef({
    reset: false,
    left: false,
    right: false,
    up: false,
  });

  const handleKeyDown = useCallback(
    (e) => {
      e.preventDefault();
      if (e.key === "r") {
        keys.current.reset = true;
        velocity.current = { x: 0, y: 0 };
        setPosition({ x: 100, y: 10 });
      }
      if (e.key === "a" || e.key === "ArrowLeft") {
        keys.current.left = true;
      }
      if (e.key === "d" || e.key === "ArrowRight") {
        keys.current.right = true;
      }
      if (e.key === "w" || e.key === " " || e.key === "ArrowUp") {
        keys.current.up = true;
        if (isOnGround.current && !isJumping.current) {
          velocity.current.y = -playerJump.current;
          isJumping.current = true;
          isOnGround.current = false;
        }
      }
    },
    [isJumping, isOnGround]
  );

  const handleKeyUp = useCallback((e) => {
    e.preventDefault();
    if (e.key === "a" || e.key === "ArrowLeft") {
      keys.current.left = false;
    }
    if (e.key === "d" || e.key === "ArrowRight") {
      keys.current.right = false;
    }
    if (e.key === "w" || e.key === " " || e.key === "ArrowUp") {
      keys.current.up = false;
    }
    if (e.key === "r") {
      keys.current.reset = false;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const handleMovement = useCallback(() => {
    const scaledDeltaTime = deltaTime.current / 100;

    velocity.current.x = keys.current.left
      ? -playerSpeed.current
      : keys.current.right
      ? playerSpeed.current
      : 0;

    if (!isOnGround.current) {
      velocity.current.y += gravity.current * scaledDeltaTime;
    }

    let nextX = position.x + velocity.current.x * scaledDeltaTime * renderScale;
    let nextY = position.y + velocity.current.y * scaledDeltaTime * renderScale;

    const pheight = playerRef.current.clientHeight;
    const pwidth = playerRef.current.clientWidth;

    const collisionSides = collisionDetection(
      { x: nextX, y: nextY, height: pheight, width: pwidth },
      currentCollisionBoxes.current
    );

    isOnGround.current = false;
    if (collisionSides.length === 0) {
      setPosition({ x: nextX, y: nextY });
    } else {
      collisionSides.forEach((side) => {
        if (side.top && velocity.current.y >= 0) {
          nextY = position.y;
          isOnGround.current = true;
          isJumping.current = false;
        }
        if (side.bottom && velocity.current.y < 0) {
          nextY = position.y;
        }
        if (side.left && velocity.current.x >= 0) {
          nextX = position.x;
        }
        if (side.right && velocity.current.x <= 0) {
          nextX = position.x;
        }

        setPosition({ x: nextX, y: nextY });
      });
    }
  }, [position, currentCollisionBoxes, renderScale]);

  const animate = useCallback(
    (currTime) => {
      deltaTime.current = currTime - prevTime.current;
      prevTime.current = currTime;

      setFps(1000 / deltaTime.current);

      handleMovement();

      requestRef.current = requestAnimationFrame(animate);
    },
    [handleMovement]
  );

  useEffect(() => {
    if (!startGame) return;
    if (!isDocumentLoaded) return;
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate, startGame, isDocumentLoaded]);

  useEffect(() => {
    if (!startGame) return;
    if (!isDocumentLoaded) return;
    setTimeout(() => {
      setPosition({ x: 100, y: 10 });
      velocity.current = { x: 0, y: 0 };
      isOnGround.current = false;
      isJumping.current = false;
      setOpacity(1);
    }, 1000);
  }, [startGame, isDocumentLoaded]);

  const playerStyle = {
    position: "absolute",
    left: position.x,
    top: position.y,
    width: "1.5vw",
    height: "3.5vw",
    scale: renderScale,
    opacity: opacity,
    color: "red",
    backgroundColor: "black",
  };

  return (
    startGame &&
    isDocumentLoaded && (
      // <img src={catgif} ref={playerRef} style={playerStyle}/>
      <div ref={playerRef} style={playerStyle}>
        {fps}
      </div>
    )
  );
};

export default Player;
