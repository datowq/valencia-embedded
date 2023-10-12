import React, { useState, useEffect, useCallback, useRef } from 'react'
import catgif from '/catdance.gif'

// could update with a better data structure, but a resume really doesn't need it
//fix movement, add jump
function isPlayerCollidingWith(player, collisions) {
  let collisionList = []
  for (let i = 0; i < collisions.length; i++) {
    const box = collisions[i];
    if ((player.x + player.width) >= box.x &&
      player.x <= (box.x + box.width) &&
      (player.y + player.height) >= box.y &&
      player.y <= (box.y + box.height)) {
      collisionList.push({ collision: true, index: i })
    }
  }
  if(collisionList.length === 0) { 
    collisionList.push({ collision: false, index: -1 })
  }
  return collisionList;
}

const Player = (props) => {
  const playerRef = useRef()
  const requestRef = useRef()
  const [position, setPosition] = useState({ x: 100, y: 0 })
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const [isOnGround, setIsOnGround] = useState(false)
  const gravity = 4

  function getCollisionDirection(player, collisions, collisionList) {

    let collisionSides = []
    
    for(let i = 0; i < collisionList.length; i++) {
      const box = collisions[collisionList[i].index];
      const playerRight = player.x + player.width;
      const playerBottom = player.y + player.height;
      const boxRight = box.x + box.width;
      const boxBottom = box.y + box.height;
    
      collisionSides.push({
        top: playerBottom >= box.y && player.y <= box.y,
        bottom: player.y <= boxBottom && playerBottom >= boxBottom,
        left: playerRight >= box.x && player.x <= box.x,
        right: player.x <= boxRight && playerRight >= boxRight,
      })
    }
  
    return collisionSides;
  }

  const handleKeyDown = useCallback((event) => {
    event.preventDefault()
    if (event.key === 'r') {
      setVelocity({ x: 0, y: 0})
      setPosition({ x: 100, y: 0})
    }
    if (event.key === 'a') {
      setVelocity(prevVelocity => ({ x: -3, y: prevVelocity.y }))
    }
    if (event.key === 'd') {
      setVelocity(prevVelocity => ({ x: 3, y: prevVelocity.y }))
    }
    if (event.key === 's') {
      setVelocity(prevVelocity => ({ x: prevVelocity.x, y: 10 }))
    }
    if (event.key === ' ' || event.key === 'w') {
      setVelocity(prevVelocity => ({ x: prevVelocity.x, y: -10 }))
    }
  }, [])

  const handleKeyUp = useCallback((event) => {
    if (event.key === 'a' || event.key === 'd') {
      setVelocity(prevVelocity => ({ x: 0, y: prevVelocity.y }))
    }
    if (event.key === ' ' || event.key == 's' || event.key === 'w') {
      setVelocity(prevVelocity => ({ x: prevVelocity.x, y: 0}))
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])
  
  const updatePlayerPosition = useCallback(() => {
    let nextX = position.x + velocity.x;
    let nextY = position.y + velocity.y + gravity;
  
    const collisionList = isPlayerCollidingWith(
      { x: nextX, y: nextY, height: 30, width: 20 },
      props.collisions
    );

    // console.log(isOnGround)
  
    if (!collisionList[0].collision) {
      setPosition({ x: nextX, y: nextY });
      setIsOnGround(false)
    } else {
      setIsOnGround(false)
      const collisionSides = getCollisionDirection(
        { x: nextX, y: nextY, height: 30, width: 20 },
        props.collisions,
        collisionList
      )

      for(let i = 0; i < collisionSides.length; i++) 
      {
        if (collisionSides[i].left && velocity.x >= 0) {
          nextX = position.x;
        }
        if (collisionSides[i].right && velocity.x <= 0) {
          nextX = position.x;
        }
        if (collisionSides[i].top && (velocity.y + gravity) >= 0) {
          nextY = position.y;
          setIsOnGround(true)
        }
        if (collisionSides[i].bottom && (velocity.y + gravity) <= 0) {
          nextY = position.y;
        }
      }
  
      setPosition({ x: nextX, y: nextY });
    }
  }, [position, velocity, props.collisions, gravity]);

  const animate = useCallback(() => {
    updatePlayerPosition()
    requestRef.current = requestAnimationFrame(animate)
  }, [updatePlayerPosition])
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [animate])
  

  const playerStyle = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: '20px',
    height: '30px',
    color: 'red',
    backgroundColor: 'black',
  }

  return (
    // <img src={catgif} ref={playerRef} style={playerStyle}/>
    <div style={playerStyle}></div>
  )
}

export default Player
