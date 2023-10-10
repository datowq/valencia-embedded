import React, { useState, useEffect, useCallback, useRef } from 'react'

// could update with a better data structure, but a resume really doesn't need it
function isPlayerCollidingWith(player, collisions) {

  return collisions.some(box => {
    if ((player.x + player.width) >= box.x &&
        player.x <= (box.x + box.width) &&
        (player.y + player.height) >= box.y &&
        player.y <= (box.y + box.height)) {
      // collision detected
      return true
    }
    return false
  })
}


const Player = (props) => {
  const playerRef = useRef()
  const requestRef = useRef()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const gravity = 0

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

    if (!isPlayerCollidingWith({ x: nextX, y: nextY, height: 50, width: 50 }, props.collisions)) {
      setPosition({ x: nextX, y: nextY })
    }
  }, [position, velocity])

  const animate = useCallback(() => {
    updatePlayerPosition()
    requestRef.current = requestAnimationFrame(animate)
  }, [updatePlayerPosition])
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate) // Initial call to start the animation loop
    return () => cancelAnimationFrame(requestRef.current)
  }, [animate])
  

  const playerStyle = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: '50px',
    height: '50px',
    color: 'red'
    // backgroundColor: 'black',
  }

  return (
    <img src='/catdance.gif' ref={playerRef} style={playerStyle}/>
  )
}

export default Player
