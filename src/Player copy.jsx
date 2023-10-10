import React, { useState, useEffect, useRef } from 'react'

const Player = (props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const [gravity, setGravity] = useState(-9.8)
  const [nextPosition, setNextPosition] = useState({ x: 0, y: 0 })
  const playerRef = useRef()

  // FIX THIS
  function isCollide(a, b) {
   
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setNextPosition(prevPosition => ({
        x: prevPosition.x + velocity.x,
        y: prevPosition.y + velocity.y
      }))
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [velocity]);

  useEffect(() => {
    const playerRect = playerRef.current.getBoundingClientRect();
    let willCollide =  false;
    props.collisions.forEach((box) => {
        const direction = isCollide({...playerRect, x: nextPosition.x, y: nextPosition.y}, box);
        if (direction) {
            console.log(`Collision detected from the ${direction}!`);
            willCollide = true;
        }
    });
    if (!willCollide) {
        setPosition(nextPosition);
    }
  }, [nextPosition]);


  useEffect(() => {
  
    const handleKeyDown = (event) => {
      event.preventDefault()
      if (event.key === 'r') {
        setVelocity({ x: 0, y: 0})
        setPosition({ x: 0, y: 0})
        setNextPosition({ x: 0, y: 0})
      } else if (event.key === 'a') {
        setVelocity(prevVelocity => ({ ...prevVelocity, x: -5 }))
      } else if (event.key === 'd') {
        setVelocity(prevVelocity => ({ ...prevVelocity, x: 5 }))
      } else if (event.key === 's') {
        setVelocity(prevVelocity => ({ ...prevVelocity, y: 10 }))
      } else if (event.key === ' ' || event.key === 'w') {
        setVelocity(prevVelocity => ({ ...prevVelocity, y: -10 }))
      }
    }

    const handleKeyUp = (event) => {
      if (event.key === 'a' || event.key === 'd') {
        setVelocity(prevVelocity => ({ ...prevVelocity, x: 0 }))
      }
      else if (event.key === ' ' || event.key == 's' || event.key === 'w') {
        setVelocity(prevVelocity => ({ ...prevVelocity, y: 0}))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <div
      ref={playerRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: '20px',
        height: '30px',
        backgroundColor: 'black',
      }}
    />
  )
}

export default Player
