import React, { useState, useEffect, useCallback, useRef } from 'react'
import catgif from '/catdance.gif'

const Player = (props) => {
  const playerRef = useRef()
  const requestRef = useRef()
  const [position, setPosition] = useState({ x: 100, y: 0 })
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const [deltaTime, setDeltaTime] = useState(0)
  const [lastTime, setLastTime] = useState(0)
  const [isOnGround, setIsOnGround] = useState(false)
  const [isJumping, setIsJumping] = useState(false)
  const gravity = 9.8
  const frametime = 1000 / 120

  // could update with a quadtree, but a resume really doesn't need it
  // fix movement, add jump  
  const getCollisionDirection = useCallback((player, collisions) => {

    let collisionSides = []
    
    for(let i = 0; i < collisions.length; i++) {
      const box = collisions[i]
      const playerRight = player.x + player.width
      const playerBottom = player.y + player.height
      const boxRight = box.x + box.width
      const boxBottom = box.y + box.height

      if((player.x + player.width) >= box.x &&
      player.x <= (box.x + box.width) &&
      (player.y + player.height) >= box.y &&
      player.y <= (box.y + box.height)) {
          collisionSides.push({
            index: i,
            top: playerBottom >= box.y && player.y <= box.y,
            bottom: player.y <= boxBottom && playerBottom >= boxBottom,
            left: playerRight >= box.x && player.x <= box.x,
            right: player.x <= boxRight && playerRight >= boxRight,
          })
      }
    }
  
    return collisionSides
  })

  const handleKeyDown = useCallback((event) => {
    event.preventDefault()
    if (event.key === 'r') {
      setVelocity({ x: 0, y: 0})
      setPosition({ x: 100, y: 0})
    }
    if (event.key === 'a') {
      setVelocity(prevVelocity => ({ x: -5, y: prevVelocity.y }))
    }
    if (event.key === 'd') {
      setVelocity(prevVelocity => ({ x: 5, y: prevVelocity.y }))
    }
    if (event.key === 's') {
      setVelocity(prevVelocity => ({ x: prevVelocity.x, y: 5 }))
    }
    if ((event.key === ' ' || event.key === 'w') && isOnGround && !isJumping) {
      setVelocity(prevVelocity => ({ x: prevVelocity.x, y: -20 }))
      setIsJumping(true)
      setIsOnGround(false)
    }

  }, [isOnGround, isJumping])

  const handleKeyUp = useCallback((event) => {
    if (event.key === 'a' || event.key === 'd') {
      setVelocity(prevVelocity => ({ x: 0, y: prevVelocity.y }))
    }
    if (event.key === ' ' || event.key == 's' || event.key === 'w') {
      setIsJumping(false)
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
    if(isJumping) {
      setVelocity(prevVelocity => ({ x: prevVelocity.x, y: prevVelocity.y * 0.9 }));
    }
    let nextX = position.x + velocity.x * deltaTime
    let nextY = position.y + velocity.y * deltaTime + (0.5 * gravity * deltaTime**2)

    const pheight = playerRef.current.clientHeight
    const pwidth = playerRef.current.clientWidth
  
    const collisionSides = getCollisionDirection(
      { x: nextX, y: nextY, height: pheight, width: pwidth },
      props.collisions
    )
      
    setIsOnGround(false)
    if (collisionSides.length === 0) {
      setPosition({ x: nextX, y: nextY })
    } else {
      for(let i = 0; i < collisionSides.length; i++) 
      {
        if (collisionSides[i].left && velocity.x >= 0) {
          nextX = position.x
        }
        if (collisionSides[i].right && velocity.x <= 0) {
          nextX = position.x
        }
        if (collisionSides[i].top && (velocity.y + gravity) >= 0) {
          nextY = position.y
          setIsOnGround(true)
        }
        if (collisionSides[i].bottom && (velocity.y + gravity) <= 0) {
          nextY = position.y
        }
      }
  
      setPosition({ x: nextX, y: nextY })
    }
  }, [position, velocity, playerRef, gravity])

  const animate = useCallback((timestamp) => {
    setDeltaTime((timestamp - lastTime) / frametime)
    setLastTime(timestamp)
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
    width: '1.5vw',
    height: '3.5vw',
    color: 'red',
    backgroundColor: 'black',
  }

  return (
    // <img src={catgif} ref={playerRef} style={playerStyle}/>
    <div ref={playerRef} style={playerStyle}></div>
  )
}

export default Player
