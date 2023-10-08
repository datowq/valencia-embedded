import React, { useState } from "react"

const Resume = () => {

    const [num, setNum] = useState(0)

    return <button onClick={() => setNum(num + 1)}>{num}bal</button>
}

export default Resume