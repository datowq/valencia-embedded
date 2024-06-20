import React, { useState, useEffect } from "react";
import './styles.css'

const Credits = () => {

    const [click, setClick] = useState(false)
    const [currentCredits, setcurrentCredits] = useState(0)
    const [currentDot, setCurrentDot] = useState(0)

    const dots = ['.', '..', '...', '....', '.....']
    const titles = ['engineering & design', 'modeling & texturing', 'inspirations']
    const credits = [
        {
            'name1': 'andy',
            'name2': 'all',
            'name3': ' ',
            'name4': ' '
        },
        {
            'name1': 'andy',
            'name2': 'all',
            'name3': ' ',
            'name4': ' '
        },
        {
            'name1': 'unbeatable [white label]',
            'name2': 'd-cell games',
            'name3': 'bruno-simon.com',
            'name4': 'bruno simon'
        }
    ]

    const handleClick = () => {
        setcurrentCredits((currentCredits + 1) % titles.length)
        setCurrentDot(0)
        setClick(!click)
    }

    useEffect(() => {
        const titleInterval = setInterval(() => {
            setcurrentCredits((prev) => (prev + 1) % titles.length)
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
                <div className="mb-10 w-3/4 md:w-3/5 lg:w-2/4"> 
                    <h2 className="text-4xl md:text-6xl">{titles[currentCredits]}</h2>
                    <div className='flex flex-col text-xl sm:text-3xl'>
                        <div className='flex justify-between'>
                            <span>{credits[currentCredits]['name1']}</span><span>{credits[currentCredits]['name2']}</span>
                        </div>
                        <div className='flex justify-between whitespace-pre'> 
                            <span>{credits[currentCredits]['name3']}</span><span>{credits[currentCredits]['name4']}</span>
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