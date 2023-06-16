import { useEffect, useRef } from "react"
import Header from "./components/StaticHeader"
import {FRONTEND_ROOT_URL} from "./constants"
import PageTransition from "./components/configs/PageTransition"

export default function Policy () {

    const contactsLinkingRef = useRef(null);

    useEffect(() => {
        if(window.location.href === `${FRONTEND_ROOT_URL}/docs/policy/#contacts-linking`){
            contactsLinkingRef.current.scrollIntoView()
        }
    }, [])

    return (
        <PageTransition>
        <Header title="Docs - ReachOut" />
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            
            <div style={{width: 'clamp(300px, 80%, 800px)'}}>
                <h1 style={{borderBottom: '3px solid #59CE8F', display: 'inline-block'}}>Policy</h1>

                <p>At reachout.org.in, we are committed to protecting the privacy of our users. This privacy policy outlines the types of information we collect, how we use it, and the steps we take to protect it.</p>
                <h2>1. Information We Collect</h2>
                <p>reachout.org.in collects information from its users in several ways, including but not limited to:</p>
                <ul>
                    <li>Information provided by users through forms, such as name, email address, and postal address</li>
                    <li>Information provided by users through the use of cookies and other tracking technologies</li>
                </ul>
                <h2>2. How We Use Information</h2>
                <p>reachout.org.in uses the information we collect to provide users with the services and information they request, to improve the content and services we offer, and to send users news and updates about reachout.org.in and its initiatives.</p>
                <h2>3. Sharing of Information</h2>
                <p>reachout.org.in will not share your personal information with third parties without your consent, except in limited circumstances as required by law. We may share aggregated and anonymous information for research and marketing purposes.</p>
                <h2>4. Data Security</h2>
                <p>reachout.org.in takes reasonable steps to protect the security of your personal information. However, we cannot guarantee that your information will never be disclosed in a manner inconsistent with this privacy policy (e.g. as a result of unauthorized acts by third parties that breach our security measures).</p>
                <h2>5. Changes to Privacy Policy</h2>
                <p>reachout.org.in reserves the right to modify this privacy policy at any time without prior notice. Your continued use of reachout.org.in following the posting of changes to this privacy policy constitutes your acceptance of any such changes.</p>
                <h2>6. Contact Information</h2>
                <p>If you have any questions or comments regarding this privacy policy, please contact us at info@reachout.org.in.</p>
                <h2 ref={contactsLinkingRef}>7. Contacts Linking</h2>
                <p>At ReachOut, we understand the importance of privacy and take great care in protecting the information of our users, including their contacts. We assure that your contact information is securely stored and will never be shared with third-party organizations without your express consent. We are committed to maintaining the confidentiality and privacy of your data and will only use it for the purpose of providing our services to you. Rest assured that your contacts are in safe hands with us.</p>
                <b>To provide an extra layer of security, we store all of our users' contacts in an encrypted format. This means that even if any unauthorized access were to occur, the data would be unreadable and protect your privacy. Our encryption techniques meet industry standards and are regularly reviewed to ensure the protection of your information. You can have peace of mind knowing that your contacts are stored safely with us.</b>
                <p>In addition to secure storage, we also implement robust security measures to protect against unauthorized access to your contacts. Our systems are regularly monitored for potential vulnerabilities, and we continuously update our security protocols to stay ahead of any potential threats.

We believe in transparency and give our users control over their data. You can access, modify, or delete your contacts at any time through our secure platform.

Your privacy is our top priority, and we are dedicated to maintaining the trust you have placed in us. If you have any questions or concerns about the privacy of your contacts, please do not hesitate to contact our support team</p>

                <pre>Last updated: January 30, 2023</pre>
            </div>
        </div>
        </PageTransition>
          )

} 