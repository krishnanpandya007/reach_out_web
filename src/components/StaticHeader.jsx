import React from 'react'
import './styles/StaticHeader.css'

function StaticHeader({title="ReachOut"}) {
  return (
    <center>
        <header id="header__main">
            <img width="40" height="40" src="/social_logo/ReachOut.png" />
            <h2>{title}</h2>
        </header>
    </center>
  )
}

export default StaticHeader