import React from 'react'
import QRCodeStyling from "qr-code-styling";
import ErrorBoundary from './configs/ErrorBoundry';

const qrCode = new QRCodeStyling({
    width: 200,
    height: 200,
})

function ProfileQr({ profileId }) {

    const QrCodeStylerRef = React.useRef(null);

    React.useEffect(() => {
        qrCode.append(QrCodeStylerRef.current);
        qrCode.update({
            data: `profile:${profileId}` 
        });
    }, [])



  return (
    <div ref={QrCodeStylerRef} />
  )
}

function ProfileQrX({ profileId }) {

    return (
        <ErrorBoundary>
            {/* <ProfileQrContent profileId={profileId} /> */}
        </ErrorBoundary>
    )

}

export default ProfileQr