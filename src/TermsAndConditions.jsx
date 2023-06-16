import Header from "./components/StaticHeader"
import PageTransition from "./components/configs/PageTransition"


export default function TermsAndConditions () {
    return (
        <PageTransition>
        <Header title="Docs - ReachOut" />
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            
            <div style={{width: 'clamp(300px, 80%, 800px)'}}>
                <h1 style={{borderBottom: '3px solid #59CE8F', display: 'inline-block'}}>Terms and Conditions</h1>

                <p>Welcome to reachout.org.in! This page outlines the terms and conditions that govern your use of our website and the services provided by reachout.org.in.</p>
                <h2>1. Agreement to Terms</h2>
                <p>By accessing or using reachout.org.in, you agree to be bound by these terms and conditions. If you do not agree to these terms, you may not use reachout.org.in.</p>
                <h2>2. Changes to Terms and Conditions</h2>
                <p>reachout.org.in reserves the right to modify these terms and conditions at any time without prior notice. Your continued use of reachout.org.in following the posting of changes to these terms constitutes your acceptance of any such changes.</p>
                <h2>3. Content and Services</h2>
                <p>reachout.org.in provides information and resources for various causes and initiatives. The content provided on reachout.org.in is for general informational purposes only and should not be relied upon as a substitute for professional advice.</p>
                <h2>4. Proprietary Rights</h2>
                <p>All content and materials available on reachout.org.in, including but not limited to text, graphics, website name, code, images, and logos, are the proprietary property of reachout.org.in and are protected by copyright and trademark laws. Any unauthorized use of any material on reachout.org.in may violate copyright, trademark, and other laws.</p>
                <h2>5. Limitation of Liability</h2>
                <p>reachout.org.in will not be liable for any damages or losses resulting from the use of reachout.org.in, including but not limited to indirect, incidental, special, punitive, or consequential damages.</p>
                <h2>6. Indemnification</h2>
                <p>You agree to indemnify, defend, and hold harmless reachout.org.in, its officers, directors, employees, agents, licensors, and suppliers from and against all losses, expenses, damages, and costs, including reasonable attorneys' fees, resulting from any violation of these terms and conditions or any activity related to your use of reachout.org.in.</p>
                <h2>7. Governing Law</h2>
                <p>These terms and conditions shall be governed by and construed in accordance with the laws of the India and any disputes arising hereunder shall be resolved in the courts of the India.</p>
                <h2>8. Contact Information</h2>
                <p>If you have any questions or comments regarding these terms and conditions, please contact us at info@reachout.org.in.</p>
                <p>Last updated: January 30, 2023</p>
            </div>
        </div>
        </PageTransition>
          )

} 