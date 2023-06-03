import React from 'react'
import { socials } from '../../constants'

function HelpSocialLinking() {
  return (
    <>
        <p>Rules for linking socials</p>
        <ul style={{marginLeft :'2rem'}}>
            <li>You can only link one handle per social media at a time.</li>
            <li>Every two months (max), you need to re-verify it to keep it linked.</li>
        </ul>

        <pre>{'>'} Steps for linking socials:</pre>
        <ol style={{marginLeft :'2rem'}}>
            <li>Open ReachOut apk, tap on your avatar/profile_pic.</li>
            <li>Select customization option.</li>
            <li>Click on link socials.</li>
            <li style={{border:'1px solid #c4c4c4', padding: '0.2rem', width: 'fit-content'}}>This will redirect your to login through that social in order to verify that you own that handle.</li>
            <li>After that it'll auto redirect you, and you'll able to see updated linked socials.</li>
            
        </ol>

        <li><b>Currently Whitelisted Socials:</b></li>
        <div style={{display: 'flex', gap: '0.5rem'}}>
            {socials.map((social, idx) => (<mark key={idx}>{social}</mark>))}
        </div>
    </>
  )
}

export default HelpSocialLinking