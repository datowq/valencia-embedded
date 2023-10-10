import React, { useState, useEffect, useCallback, useRef } from 'react'
import catgif from '/catdance.gif'

// could update with a better data structure, but a resume really doesn't need it
//fix movement, add jump
function isPlayerCollidingWith(player, collisions) {
  for (let i = 0; i < collisions.length; i++) {
    const box = collisions[i];
    if (
      (player.x + player.width) >= box.x &&
      player.x <= (box.x + box.width) &&
      (player.y + player.height) >= box.y &&
      player.y <= (box.y + box.height)
    ) {
      return { collision: true, index: i };
    }
  }
  return { collision: false, index: -1 };
}

const Player = (props) => {
  const playerRef = useRef()
  const requestRef = useRef()
  const [position, setPosition] = useState({ x: 100, y: 0 })
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const gravity = 4

  const handleKeyDown = useCallback((event) => {
    event.preventDefault()
    if (event.key === 'r') {
      setVelocity({ x: 0, y: 0})
      setPosition({ x: 0, y: 0})
    }
    if (event.key === 'a') {
      setVelocity(prevVelocity => ({ x: -5, y: prevVelocity.y }))
    }
    if (event.key === 'd') {
      setVelocity(prevVelocity => ({ x: 5, y: prevVelocity.y }))
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
    
    let nextX = position.x + velocity.x
    let nextY = position.y + velocity.y + gravity

    const { collision, index } = isPlayerCollidingWith(
      { x: nextX, y: nextY, height: 50, width: 20 },
      props.collisions
    );

    if (!collision) {
      setPosition({ x: nextX, y: nextY })
    } else {
      props.handleCollision(index)
    }
  }, [position, velocity])

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
    height: '50px',
    color: 'red',
    backgroundColor: 'black',
  }

  return (
    // <img src={catgif} ref={playerRef} style={playerStyle}/>
    <div style={playerStyle}></div>
  )
}

export default Player
