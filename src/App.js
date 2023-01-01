import { useEffect, useRef } from "react"

export default function App() {
  const appRef = useRef(null);

  useEffect(() => {
    if(appRef.current != null){
      appRef.current.click();
    }
  }, [appRef.current]);

  return (
    <a ref={appRef} href="reachoutapp://reachout.org.in/welcome">Open the APK</a>
  )

}