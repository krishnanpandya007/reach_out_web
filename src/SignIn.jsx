import './components/styles/SignIn.css'
import {Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Center, HStack, PinInput, PinInputField, useColorModeValue, useToast} from '@chakra-ui/react'
import React from 'react'
import ReachOutTitle from './components/ReachOutTitle'
import ModalEndHelperLinks from './components/ModalEndHelperLinks';
import { BACKEND_ROOT_URL, base_json_header } from './constants';

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const PHONE_REGEX = /^\+\d{2,3}\s\d{5}\-\d{5}$/

function SignIn() {

    const [signInData, setSignInData] = React.useState({mode: 'email', mode_value: '', code: '', mode_error: false, code_error: false});
    const modeValue = signInData.mode_value;
    const codeValue = signInData.code;
    const [status, setStatus] = React.useState({loading: false, success: '', error: '', show: false});
    const toast = useToast();


    const validateModeValue = () => {

        if(signInData.mode === 'email'){
            return EMAIL_REGEX.test(signInData.mode_value);
        }
        console.log(signInData.mode_value);
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
                toast({
                    title: `Logged In! 😎`,
                    status: 'success',
                    isClosable: true,
                });
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
            }, 1000)
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

  return (
    <Center h="100vh">

        <div className='modal_container'>
            <ReachOutTitle>
                <b style={{fontSize: '1.5rem'}}>Sign In</b>
            </ReachOutTitle>

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
                <PinInput onComplete={(e) => {alert(e)}} onChange={(newVal) => {setSignInData({...signInData, code: newVal})}} type='alphanumeric'>
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
            <ModalEndHelperLinks />

        </div>
    </Center>
  )
}

export default SignIn