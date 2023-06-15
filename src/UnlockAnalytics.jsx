import { useState, useEffect, createContext, useContext, Fragment, useRef } from 'react'
import axios from './components/configs/customAxios'
import { Alert, AlertDescription, AlertIcon, AlertTitle, Badge, Box, Button, ButtonGroup, Center, CloseButton, Container, Heading, Link, Skeleton, useDisclosure, useToast } from '@chakra-ui/react';
import { getCookie } from './components/configs/utils'
import { ANALYTICS_PLANS, FRONTEND_ROOT_URL } from './constants'
import { Link as ReactLink } from 'react-router-dom';
import {BiDownArrowAlt} from 'react-icons/bi'
import coreAxios from 'axios'
const PaymentDataContext = createContext({ currentPlan: null, currentCurrency: null, isIpIndian: false, paid: false, changePlan: (plan) => {} });

export default function UnlockAnalytics() {

    // Time to retrieve plans
    // const [loadingPlans, setLoadingPlans] = useState(false);
    // plans = [{duration: 12, amount: 19.0},...]
    const [paymentData, setPaymentData] = useState({currentPlan: null, isIpIndian: null, currentCurrency: null, paid: false});

    const changePlan = (new_planIdx) => {

        setPaymentData(curr => ({...curr, currentPlan: new_planIdx}))

    }

    const buildPaymentConfigs = async () => {

            coreAxios.get('https://ipapi.co/json/').then((response) => {
                setPaymentData(c=>({...c,currentCurrency: String(response.data.country_name).toLowerCase() === 'india' ? 'inr' : 'usd', isIpIndian: String(response.data.country_name).toLowerCase() === 'india'}))
            })
            setPaymentData(curr => ({...curr, currentPlan: 0}))


    }

    useEffect(() => {
        // Authentication is required at first!! or at the time of clicking buy button
        
        buildPaymentConfigs()

    }, [])

    useEffect(() => {
        document.title = "Unlock Analytics - ReachOut"
     }, []);


    return (

        <Center bg="url('/assets/unlock_analytics_bg.svg')" fontFamily={'Poppins,Roboto,monospace'} bgSize={'cover'} w='100vw' h='100vh'>
            <PaymentDataContext.Provider value={{...paymentData, changePlan: changePlan}}>
                <Container paddingLeft={'3rem'} borderLeft={'4px solid white'}>
                    <div style={{position: 'relative', marginBottom: '3rem'}}>

                        <img width={80} height={80} src='./assets/hello.png' style={{position: 'absolute', left: 'calc(-3rem - 40px)', top:'-12px'}} />

                        <Heading variant={'h1'} color='white' fontFamily={'Poppins,Roboto,monospace'} fontSize={'3.5rem'}>Unlock Analytics</Heading>
                        <b style={{color: 'white', fontWeight: '600', fontFamily: 'Poppins', fontSize :'1.1rem'}}>Get Your profile’s Interactivity stats/graphs and more...</b>
                    </div>

                    <div style={{borderRadius: '15px', position: 'relative', marginBottom: '3rem', backgroundColor: 'white', padding:'1rem 1.5rem'}}>
                        <img width={60} height={60} src='./assets/astronaut.png' style={{position: 'absolute', left: 'calc(-3rem - 30px)'}} />
                        <div style={{display :'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom :'1rem',borderBottom: '2px dashed #D0D0D0'}}>

                            <p style={{color: '#59CE8F', fontSize: '0.9rem'}}>Select Plan</p>
                            
                        </div>

                        <Plans />
                        
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Link as={ReactLink} to='/contact'>
                                <a style={{fontSize: '0.7rem'}}>
                                Support/Contact
                                </a>
                            </Link>
                            <ButtonGroup size='sm' isAttached variant='outline'>
                                <Button onClick={() => {setPaymentData(c => ({...c, currentCurrency: 'inr'}))}} isActive={paymentData.currentCurrency === 'inr'} isDisabled={paymentData.currentCurrency === null}>INR</Button>
                                <Button onClick={() => {setPaymentData(c => ({...c, currentCurrency: 'usd'}))}} isActive={paymentData.currentCurrency === 'usd'} isDisabled={paymentData.currentCurrency === null}>USD</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                    
                    <Payment />
                    
                </Container>
            </PaymentDataContext.Provider>

        </Center>

    )

}

function Plans () {

    const plans = ANALYTICS_PLANS;

    const { currentPlan, currentCurrency, changePlan } = useContext(PaymentDataContext);

    return (
        <div style={{margin: '2rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap', width: 'fit-content'}}>
            {   plans.length === 0 ? 'Strange, no plans retrieved! try again after some time' :
                plans.map((plan, idx) => (
                    <button key={idx} onClick={() => {changePlan(idx)}} style={{border: `1px solid ${currentPlan === idx ? '#59CE8F' : '#9A9A9A'}`, position: 'relative', cursor: 'pointer', borderRadius: '100px', display: 'flex', width: 'fit-content', margin: '0.5rem 0', transition: 'box-shadow 0.2s linear', boxShadow: currentPlan === idx && '0px 4px 10px 2px rgba(89, 206, 143, 0.25)'}}>
                        <div style={{width: '30px', height: '30px', transition :'background 0.2s ease', borderRadius: '100px', backgroundColor: currentPlan === idx ?'#59CE8F80':'#DADADA60', margin: '1rem'}} />
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', alignItems :'flex-start', marginRight: '30px'}}>
                            <b style={{fontSize: '0.8rem'}}>{plan.duration_in_days} days</b>
                            <small>{currentCurrency === 'inr' ? '₹' : '$'} {Number(plan[`amount_in_${currentCurrency ?? 'usd'}`]['original']).toFixed(2)}</small>
                        </div>
                        {plan.tag && <Badge size='x-small' style={{position: 'absolute', backgroundColor :'transparent', bottom: '-22px', color: 'lime', borderRadius: '100px', left: '0', right: '0'}}>{plan.tag}</Badge>}
                    </button>
                ))
            }

        </div>

    )

}

function Payment () {

    const [userStaleAuthenticated, setUserStaleAuthenticated] = useState(false);
    const [prePaymentStatus, setPrePaymentStatus] = useState('covered') // covered | exposed | initiating | error

    const [preload, setPreload] = useState(null);

    const plans = ANALYTICS_PLANS;
    const {isIpIndian, currentCurrency, currentPlan} = useContext(PaymentDataContext);

    const {
        isOpen: isVisible,
        onClose,
    } = useDisclosure({ defaultIsOpen: true })

    const {
        isOpen: isPhonePeVisible,
        onClose: onPhonePeClose,
    } = useDisclosure({ defaultIsOpen: true })

    useEffect(() => {
        if(getCookie('stale_authenticated') !== 'true' || true){
            setUserStaleAuthenticated(true);
        }
    }, [])

    const initiatePrePayment = async () => {

        setPrePaymentStatus('initiating');

        setTimeout(() => {
            // Along the request send if ip is indian or not.
            const res = {
                status: 200,
                data: {
                    payload: {
                        paypal: {
                            txn_id: '89u32e98h3r32Xx989'
                        },
                        gpay: {
                            txn_id: 'd83uywefewf'
                        }
                    }
                }
            }
    
            if(res.status === 200){
                setPrePaymentStatus('exposed');
                setPreload(res.data.payload);
            } else {
                setPrePaymentStatus('error');
                
            }
        }, 1000)


    } 


    return (
        <div style={{borderRadius: '15px', position: 'relative', marginBottom: '3rem', backgroundColor: 'white', padding:'1rem 1.5rem'}}>           

            {
                !userStaleAuthenticated ? <div style={{width: '100%', display: 'grid', placeItems :'center', height: '100%', backgroundColor: '#FFFFFF99', backdropFilter: 'blur(2px)', position: 'absolute', top: '0', left: '0', borderRadius: '15px'}}>
                    <center style={{paddingTop :'1rem'}}>
                        <b>Login to make payment!</b>
                        <br/>
                        <Link as={ReactLink} to='/signin'>
                            <Button colorScheme='whatsapp' size='sm' mt='0.8rem'>Login</Button>
                        </Link>
                    </center>
                    </div> : prePaymentStatus !== 'exposed' && <div style={{width: '100%', display: 'grid', placeItems :'center', height: '100%', backgroundColor: '#FFFFFF99', backdropFilter: 'blur(2px)', position: 'absolute', top: '0', left: '0', borderRadius: '15px'}}>
                    <center style={{paddingTop :'1rem'}}>
                        {prePaymentStatus !== 'error' ? <b>Continue for payment?</b> : <><b style={{'color': 'tomato'}}>Unable to initiate payment now,</b><br/><small>Try again after sometime.</small></>}
                        <br/>
                        {

                        prePaymentStatus !== 'error' && <Button  onClick={prePaymentStatus === 'covered' && initiatePrePayment} colorScheme='whatsapp' isLoading={prePaymentStatus === 'initiating'} size='sm' mt='0.8rem'>Continue...</Button>
                        }
                    </center>
                    </div>
            }
            <img width={60} height={60} src='./assets/dont-know.png' style={{position: 'absolute', left: 'calc(-3rem - 30px)'}} />

            <div style={{display :'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom :'0.5rem',borderBottom: '2px dashed #D0D0D0'}}>

                <p style={{color: '#59CE8F', fontSize: '0.9rem'}}>Make payment</p>
                {currentPlan !==  null && <div style={{ padding: '0rem 0.7rem', textAlign: 'right'}}>
                    <small style={{fontSize: '0.6rem'}}>plan<span style={{color: 'green', fontWeight :'600'}}>({currentCurrency === 'inr' ? '₹' : '$'} {Number(plans[currentPlan][`amount_in_${currentCurrency ?? 'usd'}`]['original']).toFixed(2)})</span> + addon<span style={{color: 'green', fontWeight :'600'}}>({currentCurrency === 'inr' ? '₹' : '$'} {Number(plans[currentPlan][`amount_in_${currentCurrency ?? 'usd'}`]['addon']).toFixed(2)})</span></small>
                    <br/>
                    <b style={{fontSize: '0.8rem'}}>Total: <span style={{color: '#59CE8F'}}>{currentCurrency === 'inr' ? '₹' : '$'} {Number(Number(plans[currentPlan][`amount_in_${currentCurrency ?? 'usd'}`]['original'])+Number(plans[currentPlan][`amount_in_${currentCurrency ?? 'usd'}`]['addon'])).toFixed(2)}</span></b>
                </div>}
            </div>
            <small style={{fontSize :'0.6rem'}}>
                You agree to our <Link as={ReactLink} to>
                    <i>payment policy</i>
                </Link> by continuing for payment and unlocking the analytics.

            </small>
            {isIpIndian  && <div style={{border: '1px solid gold', borderRadius: '5px', padding: '0.3rem 0.5rem', marginTop: '1rem'}}>
                <Badge bgColor={'goldenrod'} color={'white'}>Poppular in india</Badge><br/>
                {/* <GooglePayButton
                    environment="TEST"
                    buttonColor="default"
                    buttonType="buy"
                /> */}
                  {/* {isVisible && prePaymentStatus === 'exposed' && <Alert status='info'fontSize={'0.8rem'} borderRadius={'10px'} m='1rem 0 0 0'>
                        <AlertIcon />
                        <Box>
                        <AlertTitle>Paytm will available soon!</AlertTitle>

                        <AlertDescription fontSize={'0.7rem'} lineHeight={'0.7rem'}>
                                Paytm isn't available at the moment due to it's pending payment Aggregator license to rbi, <Link isExternal href='https://paytm.com/blog/investor-relations/update-on-pa-license-paytm-payments-services-receives-extension-from-rbi-for-resubmission-of-application-remains-hopeful-of-getting-necessary-approvals/'>learn more</Link>
                        </AlertDescription>
                        </Box>
                        <CloseButton
                            alignSelf='flex-start'
                            
                            right={-1}
                            top={-1}
                            onClick={onClose}
                        />
                    </Alert>} */}
                    {/* {isPhonePeVisible && prePaymentStatus === 'exposed' && <Alert  status='info'fontSize={'0.8rem'} borderRadius={'10px'}  m='1rem 0 0 0 '>
                        <AlertIcon />
                        <Box>
                        <AlertTitle>PhonePe will be available soon!</AlertTitle>

                        <AlertDescription fontSize={'0.7rem'} lineHeight={'0.9rem'}>
                                Currently, PhonePe isn't accepting new merchants we are still working on it with them.
                        </AlertDescription>
                        </Box>
                        <CloseButton
                            alignSelf='flex-start'
                            
                            right={-1}
                            top={-1}
                            onClick={onPhonePeClose}
                        />
                    </Alert>
                    } [NOTE: Production unCommented]*/}
                    <br/>
                    <GpayUpiButton />

            </div>}
            {/* <div style={{border: '1px solid #c4c4c4', marginTop: '0.7rem', borderRadius: '5px', padding: '0.3rem 0.5rem'}}>
                NOTE: TEMPERORILY DISABLED
                <Badge>Worlwide acceptable</Badge><br/>
            </div> */}

        </div>
    )

}


function GpayUpiButton() {

    const toast = useToast();

    const plans = ANALYTICS_PLANS;
    const {currentPlan, currentCurrency} = useContext(PaymentDataContext);

    const txId = useRef(String(Date.now()));


    const canMakePaymentCache = 'canMakePaymentCache';
    const checkCanMakePayment = async (request)=> {
        // Check canMakePayment cache, use cache result directly if it exists.
        if (sessionStorage.hasOwnProperty(canMakePaymentCache)) {
          return Promise.resolve(JSON.parse(sessionStorage[canMakePaymentCache]));
        }
      
        // If canMakePayment() isn't available, default to assume the method is
        // supported.
        var canMakePaymentPromise = Promise.resolve(true);
      
        // Feature detect canMakePayment().
        if (request.canMakePayment) {
          canMakePaymentPromise = request.canMakePayment();
        }
      
        return canMakePaymentPromise
            .then((result) => {
              // Store the result in cache for future usage.
              sessionStorage[canMakePaymentCache] = result;
              return result;
            })
            .catch((err) => {
              console.log('Error calling canMakePayment: ' + err);
            });
      }

    /** Launches payment request flow when user taps on buy button. */
    function onBuyClicked() {
        if(!window){
            toast({
                status: 'error',
                description: 'Window j nathi',
                isClosable: true,
                duration: 9000
            })
            return;

        }
        if (!PaymentRequest) {
        // console.log('Web payments are not supported in this browser.');
            // NOTE: STUCKEDDD
        toast({
                status: 'error',
                description: 'Web payments are not supported in this browser.',
                isClosable: true,
                duration: 9000
            })
            return;
        }
        // Create supported payment method.
        const supportedInstruments = [
        {
            supportedMethods: ['https://tez.google.com/pay'],
            data: {
            pa: '9510539042@paytm',
            pn: 'ReachOut',
            tr: txId.current,  // Your custom transaction reference ID
            url: window.location.href,
            mc: '5816', //originally: 7372
            tn: `UnlockAnalytics - Plan duration: (${plans[currentPlan]['duration_in_days']} days)`,
            },
        }
        ];
    
        // Create order detail data.
        const details = {
        total: {
            label: 'Total',
            amount: {
            currency: String(currentCurrency).toUpperCase(),
            value: String(Number(plans[currentPlan][`amount_in_${currentCurrency}`]['original']+plans[currentPlan][`amount_in_${currentCurrency}`]['addon']).toFixed(2)), // sample amount
            },
        },
        displayItems: [{
            label: `Analytics plan - (${plans[currentPlan]['duration_in_days']} days)`,
            amount: {
            currency: String(currentCurrency).toUpperCase(),
            value: String(Number(plans[currentPlan][`amount_in_${currentCurrency}`]['original']).toFixed(2)),
            },
        },{
            label: 'Extra addon',
            amount: {
            currency: String(currentCurrency).toUpperCase(),
            value: String(Number(plans[currentPlan][`amount_in_${currentCurrency}`]['addon']).toFixed(2)),
            },
        }],
        };
    
        // Create payment request object.
        let request = null;
        try {
        request = new PaymentRequest(supportedInstruments, details);

        } catch (e) {
            console.log('Payment Request Error: ' + e.message);
            toast({
                status: 'error',
                description: 'oops, something went wrong while making payment.',
                isClosable: true,
                duration: 9000
            })
            return;
        }
        if (!request) {

            toast({
                status: 'error',
                description: 'Web payments are not supported in this browser.',
                isClosable: true,
                duration: 9000
            })
            return;
        }
    
        var canMakePaymentPromise = checkCanMakePayment(request).then((result) => {
            showPaymentUI(request, result);
            })
            .catch((err) => {
                toast({
                    status: 'error',
                    title: 'Unable to check for paymentable device',
                    description: 'Looks like we can\'t view if this device can make payment or not!',
                    isClosable: true,
                    duration: 9000
                })
            console.log('Error calling checkCanMakePayment: ' + err);
            });
    }


    /**
    * Show the payment request UI.
    *
    * @private
    * @param {PaymentRequest} request The payment request object.
    * @param {Promise} canMakePayment The promise for whether can make payment.
    */
    function showPaymentUI(request, canMakePayment) {
    if (!canMakePayment) {
        // handleNotReadyToPay();
        alert("Not reaady")
        return;
    }
    
    // Set payment timeout.
    let paymentTimeout = window.setTimeout(function() {
        window.clearTimeout(paymentTimeout);
        request.abort()
            .then(function() {
            // console.log('Payment timed out after 20 minutes.');
                toast({
                    status: 'error',
                    title: 'Too long to proceed payment',
                    description: 'Payment timed out after 20 minutes.',
                    isClosable: true,
                    duration: 9000
                })
            })
            .catch(function() {
                
                console.log('Unable to abort, user is in the process of paying.');
            });
    }, 20 * 60 * 1000); /* 20 minutes */
    
    request.show().then(function(instrument) {
    
            window.clearTimeout(paymentTimeout);
            console.log(instrument);
            completePayment(instrument, 200, "Wohoo, buddy");
            // processResponse(instrument); // Handle response from browser.
        }).catch(function(err) {
            toast({
                status: 'error',
                title: 'Something went wrong',
                // description: 'You can contact us with details you have along with this transaction if needed.',
                description: String(err.name),
                isClosable: true,
                duration: 9000
            })
            // console.log(err);
        });
    }

    function completePayment(instrument, result, msg) {
        instrument.complete({"Status":"SUCCESS","amount":String(Number(plans[currentPlan][`amount_in_${currentCurrency}`]['original']+plans[currentPlan][`amount_in_${currentCurrency}`]['addon']).toFixed(2)),"txnRef":"reference ID","toVpa":"9510539042@paytm","txnId":txId.current,"responseCode":"00"})
            .then(function() {
              console.log(msg);
              alert('payment successfull')
            })
            .catch(function(err) {
                alert('payment failed')
              console.log(err);
            });
       }

    return (
        <button style={{border: '2px solid grey', borderRadius: '100px', padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem'}} onClick={onBuyClicked}>
            <img style={{height: '20px'}} src="/assets/gpay.svg" /> 
        </button>
    )

}