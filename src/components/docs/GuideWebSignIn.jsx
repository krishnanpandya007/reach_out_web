function GuideWebSignIn() {
  return (
    <>
        <pre>{'>'} Follow below steps</pre>
        <ol style={{marginLeft: '1.5rem'}}>
            <li> Open ReachOut apk. on your phone.</li>
            <li> SignIn there if not already.</li>
            <li> Tap on <b>AvatarPicture</b> select <b>Customization {'>'} Web-Signin - Generate code</b>.</li>
            <li> In browser's signin Page, fill any on of email or phoneNo field.</li>
            <li> Paste the generated code from APK.</li>
            <li> Continue, profile synced!</li>
        </ol>
    </>
  )
}

export default GuideWebSignIn