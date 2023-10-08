import { useState, useRef, useEffect } from 'react'
import catdance from '/catdance.gif';

function Emote() {
  const [position, setPosition] = useState({ top: 0, left: 0})
  const [velocity, setVelocity] = useState({ x:0.01, y:0.01 })
  const emoteRef = useRef(null)

  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const mins = 0.008
  const maxs = 0.012

  const getRandomArbitrary = (sign, min, max) => {
    return sign * (Math.random() * (max - min) + min);
  }

  const updatePosition = () => {
    let newTop = position.top + velocity.y
    let newLeft = position.left + velocity.x
    let signy = Math.sign(velocity.y)
    let signx = Math.sign(velocity.x)
  
    if(newTop >= windowHeight || newTop <= 0) {
      setVelocity(prevVelocity => ({ x: getRandomArbitrary(signx, mins, maxs), y: -prevVelocity.y }))
    }
    if(newLeft >= windowWidth || newLeft <= 0) {
      setVelocity(prevVelocity => ({ x: -prevVelocity.x, y: getRandomArbitrary(signy, mins, maxs) }))
    }
  
    setPosition({
      top: newTop,
      left: newLeft
    })
  }

  useEffect(() => {
    updatePosition()
  }, [position])


  return (
    <>
      <div>
        <img 
        src={catdance}
        ref={emoteRef}
        style={{ 
          position: 'absolute', 
          top: position.top, 
          left: position.left,
          scale: '500%'}}/>
      </div>
    </>
  )
}

export default Emote