import React, { useEffect, useState } from 'react'
import { APP_URL, BACKEND_ROOT_URL, socials } from '../constants';
import './styles/AuthRedirect.css'
import { Button, Input, useToast } from '@chakra-ui/react';
import axios from './configs/customAxios';

const  validators = {
  LinkedIn: {
    validator_regex: /^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/(in|pub|company)\/[a-zA-Z0-9_-]+\/?$/,
    hint_text: 'LinkedIn profile URL',
    type: 'url'
  },
  Snapchat: {
    validator_regex: /^[a-zA-Z][a-zA-Z0-9_]{2,14}$/,
    hint_text: 'Snapchat username',
    type: 'text'
  },
  Facebook: {
    validator_regex: /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/,
    hint_text: 'Facebook profile URL',
    type: 'url'
  },

}

function AuthRedirect() {

  const [errorFullURL, setErrorFullURL] = useState(false);
  const [currentSyncState, setCurrentSyncState] = useState('loading');
  const [platform, setPlatform] = useState(null)
  const [primaryLabelConfig, setPrimaryLabelConfig] = useState({checking: true, label: ''})
  const toast = useToast();

  // const 

  const checkPrimaryLabel = () => {
    if(validators[platform]['validator_regex'].test(primaryLabelConfig.label)){
      setPrimaryLabelConfig({...primaryLabelConfig, checking: false})
      validateData();
    }else{
      toast({
        status: 'error',
        title: 'Invalid details',
        description: 'Double check entered details.',
        isClosable: true,
        duration: 9000
    })
    }
  }

  useEffect(() => {
    // redirectToApp('/link/socials/?link_social_status=success&link_social_msg=Krishnan Pandya')
    let params = new URL(window.location.href).searchParams;
    let [ platform, token ] = params.get('state').split('@@');
    setPlatform(platform);
    if(!Object.keys(validators).includes(platform)){
      setPrimaryLabelConfig({checking: false, label: ''});
      validateData();
    }

  }, [])

  const redirectToApp = (customPath=null) => {
    if(customPath === null){
      window.location.href = `${APP_URL}/home`
    }
    window.location.href = `${APP_URL}${customPath}`
  }

  const validateData = async () => {
    /*
    https://reachout.org.in/auth/redirect/
    ?code=AQC_vPcX7Ia0S9zIWqxIv1TiIHr4TBdHzRSjMRmhFGMpNA8m0-T8F7h1HDiIrT_oajdh7yBRr2C0wF5gr73yXXoiN4mhhek4lbWoSTW_TrFE_SsiEQbwF6pdMg23tyKRviCHUw3hITLFPJtwYLwg4hpN6ArUayNsrzaiXur3oBnig7F6aJ6TuSyLv4HBAfeGSO0xxae1QiSSaoHB6DAtSeDUDhsl_79OZKbZ7yQoU7Ig0A
    &state=Instagram--eyJwcm9maWxlX2lkIjoyLCJmbG93X3R5cGUiOiJMaW5raW5nIiwicGxhdGZvcm0iOiJJbnN0YWdyYW0ifQ:k_kIJdIESKy4nll5VkrlZgWNLG57Djr596reGcv3A9U#_
    */
        let params = new URL(window.location.href).searchParams;
        if(!params.has('state') || (params.get('state').split('@').length-1 !== 2)){
          alert('Aha')
          setErrorFullURL(true);
          setCurrentSyncState('failed');
          return;
        } else {
          
          let [ platform, token ] = params.get('state').split('@@');
          setPlatform(platform);
          if(!params.has('code')){
            alert('Aha')
            setCurrentSyncState('failed');
            setErrorFullURL(true);
    
            return;
            // Cancelled by Authorization Server/ Client
          }
          // Make server call for calculation and recieving app redirect url, redirect user to that
    
          axios.post(`${BACKEND_ROOT_URL}/auth2/login/`, {
            mode: 'social',
            code: params.get('code'),
            state: token,
            profile_link: primaryLabelConfig.label
          }).then((res) => {
            const { redirect_app_path } = res.data
            redirectToApp(redirect_app_path);
          }).catch((res) => {
            const { redirect_app_path } = res.data
            setCurrentSyncState('failed');

            redirectToApp(redirect_app_path);
          })          // setTimeout(() => {
          //   setCurrentSyncState(() => {
          //     setCurrentSyncState('success');
          //     redirectToApp();
          //   })
          // }, 10000);
        }
    
      }

  
  return (
    <div class="container">
      <div className='portal__header'><h3>Connection {currentSyncState === 'loading' ? 'processing...' : currentSyncState === 'success' ? 'success' : 'failed'}</h3></div>
        {primaryLabelConfig.checking ? <div style={{display: 'flex', gap: '0.5rem'}}><Input style={{fontSize: '0.8rem'}} onChange={(e)=> {setPrimaryLabelConfig({...primaryLabelConfig, label: e.target.value})}} type={validators[platform]?.type} placeholder={validators[platform]?.hint_text} /><Button style={{fontSize: '0.6rem'}}  onClick={checkPrimaryLabel}>Validate</Button></div> : <><SocialIntegrationGraphicalView currentState={currentSyncState} linkMedia={platform} />
        <br/>
        <br/>
        {
          errorFullURL ?
            (<>
              <p>Looks like you got redirected at Wrong place 🤔</p >
              <br/>
              <button className='relogin__button' onClick={() => {window.location.href=`${APP_URL}/link_socials`}}>Retry from App</button>
            </>):
            <>
            <p>You’ll be automatically redirected to the app when process completed!😎</p>
          </>
        }
        <div className='bottom__banner'>
        
        <a href="https://reachout.org.in/terms_and_conditions">Terms</a>
        <a href="https://www.google.com">Policy</a>
        <div style={{flex: '1'}}/>
        <b>ReachOut&copy; 2023</b>
        </div>
        </>}
    </div>
  )
}

function SocialIntegrationGraphicalView({currentState, linkMedia}){

  return (
    // ReachOut ---currentState--- to
     
      <div className={'social__container'}>
        <img src='/social_logo/ReachOut.png' width="60" height="60" style={{borderRadius: '10px'}} />
        <div className='connector'>
            {
              currentState === 'loading' ?
                <div className='indicator'>
                    <div className="spinner" />
                </div>
            : currentState === 'success' ? 
            <div className='status__icon' >
            <svg width="20" height="20" preserveAspectRatio="none"viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="#54B435" fillRule="evenodd" clipRule="evenodd"></path></svg> 

            </div>
            :
            <div className='status__icon' >
            {/* <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="#54B435" fillRule="evenodd" clipRule="evenodd"></path></svg>  */}

            <svg width="20" height="20" preserveAspectRatio="none" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="#FF6464" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </div>
            }
        </div>
        {
          socials.includes(linkMedia) ?
            <img src={`/social_logo/${linkMedia}.png`}  style={{borderRadius: '10px'}} width="60" height="60"  />:
            <div className="anonymousMedia">
              <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.877075 7.49972C0.877075 3.84204 3.84222 0.876892 7.49991 0.876892C11.1576 0.876892 14.1227 3.84204 14.1227 7.49972C14.1227 11.1574 11.1576 14.1226 7.49991 14.1226C3.84222 14.1226 0.877075 11.1574 0.877075 7.49972ZM7.49991 1.82689C4.36689 1.82689 1.82708 4.36671 1.82708 7.49972C1.82708 10.6327 4.36689 13.1726 7.49991 13.1726C10.6329 13.1726 13.1727 10.6327 13.1727 7.49972C13.1727 4.36671 10.6329 1.82689 7.49991 1.82689ZM8.24993 10.5C8.24993 10.9142 7.91414 11.25 7.49993 11.25C7.08571 11.25 6.74993 10.9142 6.74993 10.5C6.74993 10.0858 7.08571 9.75 7.49993 9.75C7.91414 9.75 8.24993 10.0858 8.24993 10.5ZM6.05003 6.25C6.05003 5.57211 6.63511 4.925 7.50003 4.925C8.36496 4.925 8.95003 5.57211 8.95003 6.25C8.95003 6.74118 8.68002 6.99212 8.21447 7.27494C8.16251 7.30651 8.10258 7.34131 8.03847 7.37854L8.03841 7.37858C7.85521 7.48497 7.63788 7.61119 7.47449 7.73849C7.23214 7.92732 6.95003 8.23198 6.95003 8.7C6.95004 9.00376 7.19628 9.25 7.50004 9.25C7.8024 9.25 8.04778 9.00601 8.05002 8.70417L8.05056 8.7033C8.05924 8.6896 8.08493 8.65735 8.15058 8.6062C8.25207 8.52712 8.36508 8.46163 8.51567 8.37436L8.51571 8.37433C8.59422 8.32883 8.68296 8.27741 8.78559 8.21506C9.32004 7.89038 10.05 7.35382 10.05 6.25C10.05 4.92789 8.93511 3.825 7.50003 3.825C6.06496 3.825 4.95003 4.92789 4.95003 6.25C4.95003 6.55376 5.19628 6.8 5.50003 6.8C5.80379 6.8 6.05003 6.55376 6.05003 6.25Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </div>

        }
      </div>
  )

}

export default AuthRedirect