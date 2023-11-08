import React, { useState, useEffect } from "react";
import './styles.css'

const Credits = () => {

    const [click, setClick] = useState(false)

    const dots = ['.', '..', '...', '....', '.....']
    const [currentDot, setCurrentDot] = useState(0)

    const titles = ['engineering & design', 'modeling & texturing', '2d art', 'inspirations']
    const [currentTitle, setCurrentTitle] = useState(0)

    const handleClick = () => {
        setCurrentTitle((currentTitle + 1) % titles.length)
        setCurrentDot(0)
        setClick(!click)
    }

    useEffect(() => {
        const titleInterval = setInterval(() => {
            setCurrentTitle((prev) => (prev + 1) % titles.length)
        }, 5000)

        const dotInterval = setInterval(() => {
            setCurrentDot((prev) => (prev + 1) % dots.length)
        }, 1000)

        return () => {
            clearInterval(titleInterval)
            clearInterval(dotInterval)
        }
    }, [click])

    return(
        <>
           <div 
           className="select-none flex flex-col w-full h-full font-chronotype justify-center items-center text-center"
           onClick={() => handleClick()}
           >
                <div className="mb-10">
                    <h1 className="text-4xl sm:text-6xl">credits</h1>
                    <div className='w-full flex justify-between text-sm sm:text-xl'>
                        <span>valencia</span><span>2023</span>
                    </div>
                </div>
                <div className="mb-10"> 
                    <h2 className="text-4xl sm:text-6xl">{titles[currentTitle]}</h2>
                    <div className='flex flex-col text-xl sm:text-3xl'>
                        <div className='flex justify-between'>
                            <span>andy</span><span>all</span>
                        </div>
                        <div className='flex justify-between'> 
                            <span>lauren</span><span>all</span>
                        </div>
                    </div>
                </div>
                <div className="text-3xl">
                    <div></div>
                    <div>{dots[currentDot]}</div>
                </div>
           </div>
        </>
    )
}

export default Credits