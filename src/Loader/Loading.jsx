import React from 'react'
import './loader.css'

const Loading = () => {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 50,
                backgroundColor: "[rgba(0,0,0,0.5)",
                display: 'flex',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <span className="loader"></span>
        </div>
    )
}

export default Loading
