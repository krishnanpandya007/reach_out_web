import React from 'react'
import { Link } from 'react-router-dom'

function HelpSignIn() {
  return (
    <>
        <p>We are providing non-password (credential less) login. on which you can sign-in to your account from APK from below steps.</p>

        <pre>{'>'} 1. Using Email <b>(preferred)</b></pre>
        <small>Your email can be easily accessible and hence also our preferred way for you to login, cuz its easy and relevant way weather you had your phone or not, Your emails are portable and can accessed remotely. this also works by sending you OTP in beautiful form, enter that otp our system authenticates you.</small>

        <pre>{'>'} 2. Using Already Linked Socials</pre>
        <small>If profile has any linked social with it, you can direct sign-in through that social button on Sign-In screen on APK. Once you login we authenticate the user based on that social and identify the profile.</small>

        <pre>{'>'} 3. Using Phone Number</pre>
        <small>You can login using the phone-number, it gonna sent an OTP (One Time Password) to that phone number and verifies the otp, and authenticates your profile.</small>

        <div style={{border:'1px solid #c4c4c4', padding: '0.8rem'}}><b>Note: </b>For Web sign-In reference <Link to='/docs/Guides/web-sign-in' style={{color: 'blue'}}> this doc</Link></div>

    </>
  )
}

export default HelpSignIn