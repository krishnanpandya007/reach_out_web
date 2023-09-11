import './components/styles/SignIn.css'
import {Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Center, HStack, PinInput, PinInputField, Spinner, useColorModeValue, useToast} from '@chakra-ui/react'
import React from 'react'
import ReachOutTitle from './components/ReachOutTitle'
import ModalEndHelperLinks from './components/ModalEndHelperLinks';
import { BACKEND_ROOT_URL, GOOGLE_CLIENT_ID, base_json_header } from './constants';
import PageTransition from "./components/configs/PageTransition"
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import axios from './components/configs/customAxios'
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const PHONE_REGEX = /^\+\d{2,3}\s\d{5}\-\d{5}$/

const codeToMessage = {
    'required_signin': 'Sign in is required to proceed further...',
    'signin_to_continue': 'To continue, please sign in!'
}

function SignIn(){

    const [mode, setMode] = React.useState('google') // google | OTP

    return (
        <PageTransition>
            <Center h="calc(100vh - 10vh)" alignItems={'flex-start'} marginTop={'10vh'}>
        
                <motion.div className='modal_container' style={{height: 'max-content'}}>
                    <ReachOutTitle style={{marginBottom: '0.8rem'}}>
                        <b style={{fontSize: '1.5rem'}}>Sign In</b>
                    </ReachOutTitle>
                    <center>
                        <small>Choose Sign-In method</small>
                    </center>
                    <div style={{display: 'flex', marginTop: '1rem', gap: '2rem', alignItems: 'center', justifyContent: 'center'}}>
                        <button onClick={() => {setMode('google')}} style={{color: mode === 'google' ? '#59CE8F': '#49494980', fontSize: '0.9rem', fontWeight: mode === 'google' ? '600': '500', boxShadow: mode === 'google' ? '0 0 5px 2px #59CE8F50': '0 0 5px 2px #49494930', padding: '0.4rem 0.8rem', borderRadius: '9px'}}>Google</button>
                        <button onClick={() => {setMode('OTP')}} style={{color: mode === 'OTP' ? '#59CE8F': '#49494980', fontSize: '0.9rem', fontWeight: mode === 'OTP' ? '600': '500', boxShadow: mode === 'OTP' ? '0 0 5px 2px #59CE8F50': '0 0 5px 2px #49494930', padding: '0.4rem 0.8rem', borderRadius: '9px'}}>App Code</button>
                    </div>
                    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                        {
                            mode === 'google' ? <SignInByGoogle /> : <SignInByOTP />
                        }
                    </GoogleOAuthProvider>
                    <ModalEndHelperLinks />
                </motion.div>

            </Center>
        </PageTransition>
    )
}

function SignInByGoogle() {

    const [currentState, setCurrentState] = React.useState('idle') // idle | loading | success
    const toast = useToast();
    
    const loginSuccessCb = (response) => {
        setCurrentState('loading')
        axios.post(`/oauth2/web/login/`, {
            mode: 'google_token',
            token: response.access_token
        }).then((res) => {
            setCurrentState('success');
            window.location.href = '/web'
        }).catch((res) => {
            // aloing with message
            console.log('err::', res);
            if(res.response.status === 400){

                if(res.response.data['message'] === 'UNKNOWN_GOOGLE_TOKEN_EMAIL'){
                    // Email not linked with any ReachOut profile, please login through ReachOutProfile ones
                    toast({
                        description: 'Email doesn\'t exists, Choose google email which is associated to your ReachOut profile',
                        status: 'error',
                        isClosable: true,
                        duration: 100000
                    })
                }
            }
            setCurrentState('idle'); // restart mode
        }) 

    }

    const login = useGoogleLogin({
        onSuccess: loginSuccessCb,
        onError: (error) => console.error('Client Side {GOOGLE_LOGIN_ATTEMPT_FAILED}:', error)
    });

    return (
        <div className='sign_in_by_google_container' style={{gap: '1rem', display: 'flex', alignItems: 'center', flexDirection: 'column'}} >
            {/* <b>Follow these steps:</b> */}
            <center ><small style={{fontWeight: '600', textDecoration: 'underline'}}>Before you go,</small></center>
            <ol>
                <li><span>You already have profile on ReachOut.</span></li>
                <li><span>Login through that ReachOut profile's associated email account.</span></li>
            </ol>

            {
                currentState === 'loading' ?
                <button style={{justifyContent: 'center'}}><Spinner
                    thickness='3px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='green.500'
                    size='md'
                />
                </button> :  
                <button onClick={login}>
                    <img width="30" height="30" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABQVBMVEX////qQzU0qFNChfT7vAU9g/RomvYvfPP2+v/X4/z7uQD7twDqQTL/vQDqPzAvp1AopUvpNyYUoUA3gPTpMiDpOSn85OPe7+LpLRlDgv38wQAho0eSy5/62df1sq7oKxXxjYfylpDpOzf80XL+8tfS6dcap1YzqkIzqUqq1rT98vH+9vX3wr/zpKDwhn/ucmnsVkvtZFrvfXXrSz793p38zWPr8v6pw/mHrvf946///PH+7Mj81HqZufj7xj+/4MaHxpXL2/tVj/VYtG7s9u9Jr2P4x8T2tbHua2L63dvsXFH2nxTsUzHwcyj+6Lv0lBz4rhDuYy3zhSH3qCz8y1NwoPbYvTsVc/OtszF3rkPouhTEtieSsDtcq0qStPjXuB5wvIG6z/ong9Y8lbc4noo+kMs6mqA3onRBieVmuHmh0qz/OM8/AAAJIElEQVR4nO2aaXvbxhVGIYi0bIkEQAggEYMSTNu0rIUiJbpeksakxUVL0iVtHKdNmtJtUlf8/z8gGG4iQAAzgzvAEH7mfPBjfwiBkztz31kgSQKBQCAQCAQCgUAgEAgEAoFAIBAIBF6OynvDk8tGo7F/Ody7Pjrm/T4MuT5pnJ61S5ZlGUYJYRiG+3el1Xy0Pyzzfjsg5cvTlitjmkphY4WCYpYMp3RWOzni/Z7xKO83S1bJVFbVvCim4WycZs5yr9Z2Sli5u3K6lmf72Rmx5dqGZQYMS0wtS9bNfhYqeXx549DrLSTP93gLYCg/MigGZ5Ck1b7kLRHBXtMxIXoTCkapsaZhuXdmgcp3R8lo8JYJ4PqKld/E0dznLeTj6Nxh6LeBxmp7yFtqmQaD+bfi6FytTXbstUvM/RCKsybT8dSJGX94jNYarHP2FPYD9A7F4d5xaskVcIrV5BqOR61kZuAypnLNT3BosI2IYAoOt3Vcw0nBD2E94iN4bqQk6PbUKw5+xzfJT8E7zFbq/eaonWRIBCgWUhYsw3aB1BSMlKO/XEo4Bf2CpbQFjZQFP/sKpi14hD8DzbbgceEzF5RaKQum3WSkZro5mH4Fa+kt1fgIngAW24pimpPbNTP4LmotBMsxBdH9ktFqPqrtIxq106u2RXAvlb6g1I7RZQqmZTYbw5Vzs/JJ7cYyomY1B8FT6i5TMJ12I/yy5Xh4aobuojkIUk9CxVBq2LccnluB/+M4CB5TbggV5+aE6IePGsbqT3MQlJpUk1BxriiuAhslXx15CJ5YFH4Fo0V51VnzXHykv5JBY5RiQ2Ga9Mdj5bO7xQSPClL1Uec81qnK/ryMXASvyfuoYsS9FytPD3+4CEo3xG2mdAY4FkMnlHwEh8RtxqmBHtRweDQZlzZpmwGfwJ84XAQvCfdMBQd+Nc3nqumbx2SCFsdrIhBvcjvfEjgWjKwKSrlc7uGf8IrOun+xFcqfd5DiX3CKDOYgL97mEA//Woh0tLjfuMfm6U5uxncRiqVT3u8Znyfbc8OHfwtVVG54vyaARQldxW82QhyNtfl+iZ4327klxZDYsMh28+vJ25yHwNhQmrzfEsCXOzmfYkBsWGv6ySsRL7ZzfsWV2DCyGxTSyiANio1Cm/dLQlgZpAGxYWV3MSP5OmlwbChnvF8SxB+CDXMPtxexYWV2wT0hRHApNpQW73cE8TRwGs4Up7FhZDnsg7JiWRHFRsHk/Y4wwqbhnO8em7CzNe5E+6HYsNbgW3MAwWnoUfw773eE8RXWcPsF5U8+uLjHkouXMMPIRjNh5ymt4VaeJVvvYIZPsIY52p98sLXJkt1XMMPAZbdnkD7hbfgaZoit4PYbzob5eyBBfCulnoasDTc3QYZRa7ZZDal/k7Xh1n2IIT4s3vI3BMVFyOZwqYTUjYa94QOIITYOqfOeveEuKBD/iDWkbqXsDT8marjzFX9DUOTj9k4xwoK94dcQw+8xgrmdL/kbghY12EXbGhjm3wvDzBuCFqafv2EWOg3MMAtpATPMQuLDOk0WVm15UB5mYuUNMszC7gm2asvCDhi28s7CKQZs95SFkyjYDjjifnReQ96nicBTjAycCANPojJwqg88TUzmZoatYR4kOP06OHqYUt+uMT7Vv4AZ4ptp8Qdaww9bFOxiDYE3M9irmeKPep/yJ+/TgK04bEkj4fZPxeI/nmlV4CMi+YgrIizwJUyrKf5TfibLKhOVEF7nMYbAsIhetxV/cv1k2e4wcQkGNw03d8GPCK1hsfjzRFBWewxMQniJm4bAC1JE2EQs5v41FZRlvc7AJZhX2Gn4C/gZIVvE4r9VeU6CRbzATUNwowlLxOKPz+Q7EisidpDCG40UuPhGIbEkKKsD+GMC+QUb+LBb/CmreTENiWXsQwYPCgBbQvCKBrEyTGch4VVk8KBVsH2GxTSU/MN0ERIetBGLJ/nBj9EPsK3TDE83XQoJD3oCsY8vIXRjMWN5mC6HhG+c0i7AsdzHb7OgH7XNudvoe0PCA/tQfI8fpCyyAjFfm/pDwlfELpunzXmHLyGjQSrNe81qSPimItPIuI+vILNBOjvLCAoJnyLLpc093HqN4SCV0E4/OCT8ihVmT/yaoIQM9hUL3uyEhIR/LrJS/EhyXLXFJO5nhIaEF5VRFQm6zCaLze8ShzaRIaO5SCgIPYPyIpMVkcnihkwQetjtp6MTGso69OztFZkg9BP2FXqkRZTtHmgB95rwTJxhVEypEBdRVu34k/HlBUFMIGCfYATS1YgVZX0U8yHj/3xBJsi+hC6k7RShaXEaTmVgH/yXTJH5LESQNxuE3aMdqv2u7s71g193CdZriZRQkm6Jmw1C1W9p4t/1m06D54P/46ci4yxcvATNOJ049kjHan2kL6a5+vw37EgFXouGQjdO0cvaWhVfyP5Y1j1t7OB/GEWmK1IPI4p+OkPTB+OoGVmvDnTNP/wPPm1GjdQEkmIB8eJtuZCart2O6yvLgH6lU+3Zq3qI52pUbDBer3mgyH2fpasyGHWrh4hxtTvqybZuB9pN/4OI2EhujCKop+LyW6vaAhU7GEJjYzfBMYqoUjbU+ITFRj7BMTrhlr7bxEQ9CIoN4FdeJAxidJuYBMTGFrPztXD6+DnETtEfG0lPwpminZ6iLzbYnQFHU0lR0RMb+c2kuwwPRTc28vPYSGZHwV9xERsptNE70pyL89hIVdBVjLNEjY0bG/mUBV0GqUW/y/NPm6kLunup1BZwaFvM7taHgjFgGU6HNmB+iU5GR09nMtq3fPxc+oM0Rir4ogBENfGRqib6ASsBdTXZngq8BmFCN8HZqOpj3nqIupzUbLQHXEIigLGexFDV2H7AAqM/Yj5UVb3LfwYuU7ll6kh57ZEO9R4zR1WnvrpKh/otk/mo6bfr6YeodHXgzlG19e76jU8PhwNAITV9sEb9M5RKVQ6+cMFUT9Nlgsu4NQFdmlENV83WB9nRm9I/HGlR10tLtbN1edRZr/AjpXLYHeiuZrCnitx0u1fNqN2CSmfc7cm6i227spr7p43+JfdG1cPVm9Ps0q/U653JDWmnU69UPiMzgUAgEAgEAoFAIBAIBAKBQCAQCAQCMn4HhX1H8VpTN58AAAAASUVORK5CYII=" />
                    Select google account
                </button>
            }
        </div>
    )

}

function SignInByOTP() {

    const [signInData, setSignInData] = React.useState({mode: 'email', mode_value: '', code: '', mode_error: false, code_error: false});
    const modeValue = signInData.mode_value;
    const codeValue = signInData.code;
    const [status, setStatus] = React.useState({loading: false, success: '', error: '', show: false});
    const toast = useToast();


    const validateModeValue = () => {

        if(signInData.mode === 'email'){
            return EMAIL_REGEX.test(signInData.mode_value);
        }
        return PHONE_REGEX.test(signInData.mode_value);

    }

    const isSafeForm = () => {

        if(!validateModeValue()){
            setSignInData(curr => ({...curr, mode_error: true}));
            return false;
        }
        
        if(signInData.code.length !== 5){
            setSignInData(curr => ({...curr, mode_error: false, code_error: true}));
            return false;
        }

        setSignInData(curr => ({...curr, code_error: false, mode_error: false}));

        return true;

    }

    const submitForm = async () => {

        if(isSafeForm()){
            // alert('Making API CALL');
            setStatus({...status, loading: true});

            const response = await fetch(`${BACKEND_ROOT_URL}/auth2/web/login/`, {
                method: 'POST',
                withCredntials: true,
                credentials: 'include',
                headers: base_json_header,
                body: JSON.stringify({
                    mode: signInData.mode,
                    mode_value: signInData.mode_value,
                    signin_code: signInData.code
                })
            })

            
            if (response.status === 200){
                const urlParams = new URLSearchParams(window.location.search);
                let nextUrl = urlParams.get('next') ?? false;
        
                toast({
                    title: `Logged In! 😎`,
                    status: 'success',
                    isClosable: true,
                });
                if(nextUrl){
                    // Redirecting back
                    nextUrl = decodeURIComponent(nextUrl);
                    setStatus({...status, loading: false});
                    setTimeout(() => {

                        window.location.href = nextUrl;
                    }, 1000)
                    return;
                }
                // Usual flow redirects to webApp page
            } else {
                const dataj = await response.json();
                toast({
                    title: dataj['message'],
                    status: 'error',
                    isClosable: true,
                  });
                  setStatus({...status, loading: false});
                  return;

            }

            setStatus({...status, loading: false});
            setTimeout(() => {

                window.location.href = '/web'
            }, 500)
        }
        

    }

    React.useEffect(() => {

        if(signInData.mode_error){
            isSafeForm();
        }

        if(signInData.code_error){
            isSafeForm();
        }

    }, [modeValue, codeValue])

    React.useEffect(() => {

        const urlParams = new URLSearchParams(window.location.search);
        const msgCode = urlParams.get('msg_code');

        if(msgCode){
            const message = codeToMessage[msgCode] ?? "Oops! looks like sign in is required."
    
            toast({
                description: message,
                status: 'info',
                isClosable: true,
            });
        }


    }, [])

    React.useEffect(() => {
        document.title = "SignIn - ReachOut"
     }, []);

  return (

        <>
            <Accordion allowToggle mt={10} mb={8}>

                <AccordionItem style={{border: '2px solid #59CE8F', borderRadius: '8px', backgroundColor: '#59CE8F10'}}>
                    <h2>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                        <small>Steps to get Sign-In Code:</small>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} fontSize="0.8rem" ml={4}>
                        <ul>
                            <li>Open <b>ReachOut</b> apk, SignIn there if not already.</li>
                            <li>On home page, Tap your profilePicture/avatar</li>
                            <li>Select <b>Customization &gt; Web SignIn Code &gt; Generate code</b>, Paste generated code below</li>
                        </ul>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
            <br/>


            <div class="credentials_container">
                <div className='input_wrapper' style={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
                    <label for="SignInEmail" style={{position: 'absolute', top: '-50%', fontSize: '0.8rem'}}>Email</label>
                    
                    {
                    signInData.mode === 'email' && signInData.mode_error && 
                    <b style={{position: 'absolute', top: '100%', fontSize: '0.8rem', color: 'tomato'}}><small>Try <code>email@domain.xyz </code> format </small></b>
                    }

                    <input 
                        onFocus={(e) => {setSignInData({...signInData, mode: 'email', mode_value: e.target.value});}} 
                        onChange={(e) => {console.log('asd', e.target.value);signInData.mode === 'email' && setSignInData(c => ({...c, mode_value: e.target.value}))}} 
                        type="email" 
                        name="email" 
                        placeholder='email@domain.com' 
                        id="SignInEmail" 
                    />
                </div>
                <center style={{color: '#494949', fontSize: '0.7rem'}} onClick={() => {alert(signInData.mode_value)}}>or</center>
                <div className='input_wrapper' style={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
                    <label for="SignInPhoneNo" style={{position: 'absolute', top: '-50%', fontSize: '0.8rem'}}>Phone No</label>
                    {
                    signInData.mode === 'phone' && signInData.mode_error && 

                    <b style={{position: 'absolute', top: '100%', fontSize: '0.8rem', color: 'tomato'}}><small>Try <code>+91 12345-67890 </code> format </small></b>
                    }
                    <input 
                        onFocus={(e) => {setSignInData({...signInData, mode: 'phone', mode_value: e.target.value});}} 
                        onChange={(e) => {signInData.mode === 'phone' && setSignInData(c => ({...c, mode_value: e.target.value}))} } 
                        type="text" 
                        name="phone_no" 
                        placeholder='+91 12345-67890' 
                        id="SignInPhoneNo" 
                    />
                </div>
            </div>
            <small><b>Sign-In Code</b></small>
            <div class="submission_container">

                <HStack style={{position: 'relative'}}>
                <PinInput onChange={(newVal) => {setSignInData({...signInData, code: newVal})}} type='alphanumeric'>
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField onKeyUp={({key: pressedKey})=> {if(pressedKey === 'Enter'){submitForm()}}} />
                </PinInput>
                {
                    signInData.code_error && 
                <b for="SignInPhoneNo" style={{position: 'absolute', top: '100%', fontSize: '0.8rem', color: 'tomato'}}><small>Please provide valid code.</small></b>
                }

                </HStack>
                    <Button
                        
                        isLoading={status.loading}
                        onClick={submitForm}
                        colorScheme={'whatsapp'}
                        variant='solid'
                        style={{ padding: '0.5rem 1rem '}}
                    >   <small>Link Profile</small>&nbsp;
                        <svg width="15" height="15" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M19.0085 7.34172C19.4641 6.88609 20.2028 6.88609 20.6584 7.34172L29.9918 16.6751C30.4473 17.1307 30.4473 17.8693 29.9918 18.325L20.6584 27.6584C20.2028 28.1139 19.4641 28.1139 19.0085 27.6584C18.5528 27.2027 18.5528 26.464 19.0085 26.0083L26.3502 18.6667H5.83341C5.18909 18.6667 4.66675 18.1443 4.66675 17.5C4.66675 16.8557 5.18909 16.3333 5.83341 16.3333H26.3502L19.0085 8.99162C18.5528 8.53602 18.5528 7.79733 19.0085 7.34172Z" fill={useColorModeValue("white", "black")}/>
                        </svg>


                    </Button>
            </div>
        </>
  )
}

export default SignIn
// useGoogleOneTapLogin({
//     onSuccess: (response) => {console.log('Hahahah');console.log(response)},
//     onError: (response) => {console.log('Hahahah');console.log(response)},
//     googleAccountConfigs: {
//         client_id: '85619004436-enpfc7ca57gvjmo4ee2ecno3gi2c635b.apps.googleusercontent.com'
//     }

//  })