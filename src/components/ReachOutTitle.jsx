import React from 'react'

function ReachOutTitle({children, style, imgStyle}) {
  return (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        ...style
        // width: '100%'
    }}>
        <img src='/social_logo/ReachOut.png' width="50" height="50" style={{borderRadius: '10px', ...imgStyle}} />
        <div style={{width: '8px', height: '8px', borderRadius: '100px', backgroundColor: '#D9D9D9'}} />
        {children}
    </div>
  )
}

export default ReachOutTitle