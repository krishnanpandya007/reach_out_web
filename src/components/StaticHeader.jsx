import React from 'react'
import { Link } from 'react-router-dom'
import './styles/StaticHeader.css'

function StaticHeader({title="ReachOut"}) {
  return (
    <center>
        <header id="header__main">
          <Link to='/'>
            <img width="40" height="40" src="/social_logo/ReachOut.png" />
          </Link>
            <h2>{title}</h2>
        </header>
    </center>
  )
}

export default StaticHeader