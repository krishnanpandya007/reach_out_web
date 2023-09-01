import React from 'react'
import { createContext } from 'react'
import Header from './StaticHeader'
import './styles/ContactAndSupport.css'
import { Badge, Center, Flex, IconButton, Link, Popover, useToast, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Stack } from '@chakra-ui/react'
import {MdOutlineLocalPhone, MdOutlineMail} from 'react-icons/md'
import {TfiLinkedin} from 'react-icons/tfi'
import PageTransition from "../components/configs/PageTransition"

const ContactDataContext = createContext({tracePath: [], otherReasonTitle: '', currentStep: 1, info: {firstName: '', lastName: '', email: '', descr: ''}, changeTrace: (newTrace) => {}, changeOtherReasonTitle: (new_title) => {}, changeStep: (toStep) => {}, changeInfo: (field_name, new_value) => {}, submitForm: () => {}})

const contactReasonTree = {
  'Bug / Issue': {
    'Web platform': {
      'Account Specific': null
    },
    'App platform': {
      'Account Specific': null,
      'App Specific': null
    },
    'Account': {
      'Personal Information': null,
      'Personalizations': null,
      'Social Links': null,
      
    }
  },
  'Inappropriate': {
    'Harmfull': {
      'Bullying Content': null,
      'Abusive/Offensieve Content': null
    },
    'Adult Context': {
      'Sexual Content': null,
    }
  },
  'Login': {
    'Linking Error': null,
    'Account Not Found': null,
    'LinkedIn ProfileLink Taken': null
  },
  'Suggest': {
    'Design': {
      'Readibility Improvement': null,
      'Detail Improvement': null
    },  
    'Feature': null
  },
  'Beta closed access': {
    'Add me': null,
    'Remove me': null
  }
}

function ContactAndSupport() {

  const [data, setData] = React.useState({tracePath: [], otherReasonTitle: '', currentStep: 1, info: {firstName: '', lastName: '', email: '', descr: ''},loading :false});

  const [success, setSuccess] = React.useState(false);
  const toast = useToast();



  const changeStep = (step_no) => {

    setData(curr => ({...curr, currentStep: step_no}));

  }

  const changeTrace = (new_trace) => {
    setData(curr => ({...curr, tracePath: new_trace}));
  }

  const changeOtherReasonTitle = (new_title) => {
    setData(curr => ({...curr, otherReasonTitle: new_title}));

  }

  const changeInfo = (field, new_val) => {

    setData(curr => ({...curr, info: {...(curr.info), [field]: new_val}}));

  }

  const submitForm = async () => {
    setData(curr => ({...curr, loading: true}));
    // setTimeout(() => {
      // setData(curr => ({...curr, loading: false}));
      // setSuccess(true);
      // }, 2000)
      axios.post(`${BACKEND_ROOT_URL}/api/contact_and_support/`, {
        trace_path: data.tracePath,
        otherReasonTitle: data.otherReasonTitle,
        info: data.info}).then((res) => {
       setData(curr => ({...curr, loading: false}));
        setSuccess(true);
      }).catch((res) => {

        setData(curr => ({...curr, loading: false}));
        toast({
          title: `Unable to fulfill your contact request, currently!`,
          description: res.status === 400 ? res.data['message'] : 'Try sending query by email provided in header portion.',
          status: 'error',
          isClosable: true,
        });
        
      })
  }

  React.useEffect(() => {
    document.title = "Contact & Support - ReachOut"
  }, []);

  return (
    <PageTransition>  
    <Center>

      <Flex alignItems={'center'} flexWrap={'wrap'} mb='1rem' width='clamp(300px, 80%, 800px)' justifyContent={'space-between'}>
        <Header title='Contact & Support' />
        <Stack direction={'row'}>
          <Link isExternal href='https://www.linkedin.com/company/reachoutconnects/'>
              <IconButton>
                <TfiLinkedin />
              </IconButton>
          </Link>
          <Popover>
            <PopoverTrigger>
              <IconButton>
                <MdOutlineMail />
              </IconButton>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Contact email</PopoverHeader>
              <PopoverBody><a href='mailto:server.reachout@gmail.com'><Badge textTransform={'initial'} size={'lg'} colorScheme='facebook'>server.reachout@gmail.com</Badge></a> <br/> <small><b>Suggestion:</b> prefix your email title with "urgent:" for quick support.</small></PopoverBody>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger>
              <IconButton>
                <MdOutlineLocalPhone />
              </IconButton>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Contact PhoneNo.</PopoverHeader>
              <PopoverBody><Badge textTransform={'initial'} size={'lg'} colorScheme='facebook'>+91 95105-39042</Badge> <br/> <small><b>Note:</b> Call support only available from 9:00 to 20:00 IST.</small></PopoverBody>
            </PopoverContent>
          </Popover>

        </Stack>
      </Flex>
    </Center>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div class="contact_container">
            { success
             ? <center style={{marginTop: '5rem'}}><b style={{fontSize: '1rem'}}>Thanks, for letting us know.</b><br/><span style={{fontSize  : '0.85rem', color: '#a4a4a4'}}>We've got your message, we'll look into it ASAP! 😊</span></center>
             :<ContactDataContext.Provider value={{changeStep: changeStep, changeTrace :changeTrace,changeOtherReasonTitle: changeOtherReasonTitle, changeInfo: changeInfo, submitForm: submitForm, ...data}}>

                <StatusIndicator currentStep={data.currentStep} />
                {data.currentStep === 1 ? <ContactReasonScreen /> : data.currentStep === 2 ? <ProvideInformationScreen /> : <ReviewAndSubmitScreen />} 
              </ContactDataContext.Provider>
             }
             
        </div>
      </div>
    </PageTransition>
  )
}

function StatusIndicator(){

  const { currentStep, changeStep } = React.useContext(ContactDataContext);

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>

      <div class="indicator_container">
        <div class="contact__indicator" onClick={() => {changeStep(1);}}>1<b style={{fontWeight: currentStep === 1 ? '700' : '300'}}>Issue Catagory</b></div>
        <div class="contact__connector">
          <span class="connector_line"></span>
        </div>
        <div class="contact__indicator" onClick={() => {changeStep(2);}}>2<b style={{fontWeight: currentStep === 2 ? '700' : '300'}}>Information</b></div>
        <div class="contact__connector">
          <span class="connector_line"></span>
        </div>
        <div class="contact__indicator" onClick={() => {changeStep(3);}}>3<b style={{fontWeight: currentStep === 3 ? '700' : '300'}}>Review & Submit</b></div>
      </div>
    </div>
  )

}

function ContactReasonScreen(){

  // Make an array to make a trace
  const {tracePath, changeTrace, changeStep, changeOtherReasonTitle} = React.useContext(ContactDataContext);
  // const [trace, setTrace] = React.useState([]);


/*
Note: Push TracePath as String only cause it can be `Other reason` also...
Also make a mechanism for updating the `Other` title to contextAPI
*/

  return (
    <>

    <h2 style={{borderBottom: '3px solid #59CE8F', display: 'inline-block'}}>Catagorize your Contact or Support Reason</h2>
    <div class="trace_container">
      <div onClick={() => {changeTrace(tracePath.slice(0,-1))}} class="undo_trace">
        <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M4.53001 2.14645C4.71227 2.34171 4.71227 2.65829 4.53001 2.85355L3.46 4H8.40004C10.7196 4 12.6 6.01472 12.6 8.5C12.6 10.9853 10.7196 13 8.40004 13H4.6667C4.40897 13 4.20003 12.7761 4.20003 12.5C4.20003 12.2239 4.40897 12 4.6667 12H8.40004C10.2042 12 11.6667 10.433 11.6667 8.5C11.6667 6.567 10.2042 5 8.40004 5H3.46L4.53001 6.14645C4.71227 6.34171 4.71227 6.65829 4.53001 6.85355C4.34777 7.04882 4.0523 7.04882 3.87005 6.85355L2.00339 4.85355C1.82114 4.65829 1.82114 4.34171 2.00339 4.14645L3.87005 2.14645C4.0523 1.95118 4.34777 1.95118 4.53001 2.14645Z" fill="black"/>
        </svg>

      </div>
      <div>
        {
          tracePath.length === 0 ? 
            <p style={{color: '#c4c4c4', fontFamily: 'Poppins', fontSize: '0.7rem'}}>Select Reason tags to build trace Path</p> 
            : tracePath.map((reason_title) => (
              <>
                <span className="reason_title">{reason_title}</span>
                &nbsp;<b>{'>'}</b>&nbsp;
              </>
            ))
        }
      </div>
    </div>
    

    <span style={{fontFamily: 'Poppins', fontSize: '0.85rem'}}>Select Reason</span>
    <div style={{border: '1px solid #c4c4c480', borderRadius: '10px', padding: '0.5rem',paddingBottom: '1.5rem', marginBottom: '1rem'}}>
        {
          !(tracePath.length>0 && (tracePath.reduce((acc, curr) => curr === 'Other' ? null : acc[curr], contactReasonTree) == null)) ? (tracePath.length === 0 ? 
            [...Object.keys(contactReasonTree), 'Other'].map((reason_title) => {
              return (
                <button onClick={() => {changeTrace([...tracePath, reason_title])}} key={reason_title} className='reason_button' style={{margin: '0.8rem', marginBottom: '0'}}>{reason_title}</button>
              )
            }) : [...Object.keys(tracePath.reduce((acc, curr) => curr === 'Other' ? [] : acc[curr], contactReasonTree)), 'Other'].map((reason_title) => (
              <button onClick={() => {changeTrace([...tracePath, reason_title])}} key={reason_title} className='reason_button' style={{margin: '0.8rem', marginBottom: '0'}}>{reason_title}</button>

            ))): <b style={{color: '#c4c4c4', fontFamily: 'Poppins', fontSize: '0.7rem'}}>Wohoo, You&#39;ve made up trace successfully!</b>
        }
    </div>
    {
      tracePath[tracePath.length - 1] === 'Other' ?
      <>
        <label for="contact_other" style={{marginBottom: '1rem', fontFamily: 'Poppins', fontSize: '0.85rem'}}>Enter relevantReasonTitle:</label> 
        <input maxLength="30" onBlur={(e) => {changeOtherReasonTitle(e.target.value)}} className='contact_title' type="text" name="contact_other" id="contact_other" />
      </>
      :null
    }
    <br/>
    <br/>
    <button onClick={() => {changeStep(2)}} className='contact__continue'>Continue</button>
    </>
  )

}

function ProvideInformationScreen(){

  const {changeStep, info, changeInfo} = React.useContext(ContactDataContext);

  return (
    <>
      <h2 style={{borderBottom: '3px solid #59CE8F', display: 'inline-block'}}>Provide Information.</h2>
      <div className={'info_container'}>
      
      <div>
        <div style={{display: 'flex', width: '100%', alignItems: 'baseline'}}>

          <label for="contactFirstName" style={{flex: '1', fontWeight: '600', fontSize: '12px', color: ''}}>First Name</label>
          <label for="contactFirstName" style={{flex: '1', fontWeight: '600', marginLeft: '1rem', fontSize: '12px', color: ''}}>Last Name</label>
        </div>
        <div style={{display: 'flex'}}>

          <input value={info.firstName} onChange={(e) => {changeInfo('firstName', e.target.value)}} className='info_input' style={{flex: '1', minWidth: '0'}} placeholder="John" type="text" name="firstName" id="contactFirstName"/>
          <input value={info.lastName} onChange={(e) => {changeInfo('lastName', e.target.value)}} className='info_input' style={{flex: '1', minWidth: '0', marginRight: "0"}} placeholder="Doe" type="text" name="lastName" id="contactFirstName"/>
        </div>


      </div>

      <label for="contactEmail" style={{flex: '1', fontWeight: '600', marginTop: '1.5rem', fontSize: '12px', color: ''}}>Contact Email</label>
      <input value={info.email} onChange={(e) => {changeInfo('email', e.target.value)}} className='info_input' style={{flex: '1', minWidth: '0', marginRight: '0'}} placeholder="johndoe@abc.xyz" type="email" name="email" id="contactEmail"/>


      <label for="contactEmail" style={{flex: '1', fontWeight: '600', marginTop: '1.5rem', fontSize: '12px', color: ''}}>Provide In-Brief Detail</label>
      <textarea value={info.descr} onChange={(e) => {changeInfo('descr', e.target.value)}} name="descr" id="descr" cols="30" rows="5" style={{borderRadius: '8px', padding: '0.8rem 1rem', fontFamily: 'Poppins', border: '1px solid #c4c4c4', resize: 'vertical', marginBottom: '1rem'}}></textarea>
      {/* <input className='info_input' style={{flex: '1', minWidth: '0', marginRight: '0'}} placeholder="johndoe@abc.xyz" type="email" name="email" id="contactEmail"/> */}

      <button onClick={() => {changeStep(3)}} className='contact__continue' style={{borderRadius: '15px'}}>Review and Submit</button>


      </div>
    </>
  )

}

function ReviewAndSubmitScreen(){

  const {tracePath, otherReasonTitle, changeStep, submitForm, info, loading} = React.useContext(ContactDataContext);

  const [error, setError] = React.useState(null);

  const verifyFormAndSubmit = () => {

    // Collect Errors
    // Set Errors
    
    if((tracePath.reduce((acc, curr) => curr === 'Other' ? null : acc[curr], contactReasonTree) != null)){
      // Means tracePath can be specified more
      setError('Trace path can be specified more clearly')
      return;
    }

    if(info.firstName.replaceAll(' ', '').length <= 2){
      setError('First Name must be at least 2 character long')
      return;

    }

    if(info.lastName.replaceAll(' ', '').length <= 2){
      setError('Last Name must be at least 2 character long')
      return;

    }

    if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(info.email)){
      setError('Please provide valid email');
      return;
    }

    if(info.descr.length < 50){
      if(info.descr.replaceAll(' ', '').length > 30){
        setError('Provide valid In-Brief Detail');
        return;
      } else {
        setError('In-Brief detail must be atleast 50 char(s) long');
        return;
      }
    }

    // No Errors detected
    submitForm();


  }

  return (
    <>

    <h2 style={{borderBottom: '3px solid #59CE8F', display: 'inline-block', marginBlockEnd: '0'}}>Review your inputs,</h2>
    {error && (<div className='erorr_message_container'>
        <svg preserveAspectRatio='none' width="15" height="15" viewBox="0 0 15 15" fill="tomato" xmlns="http://www.w3.org/2000/svg"><path d="M8.4449 0.608765C8.0183 -0.107015 6.9817 -0.107015 6.55509 0.608766L0.161178 11.3368C-0.275824 12.07 0.252503 13 1.10608 13H13.8939C14.7475 13 15.2758 12.07 14.8388 11.3368L8.4449 0.608765ZM7.4141 1.12073C7.45288 1.05566 7.54712 1.05566 7.5859 1.12073L13.9798 11.8488C14.0196 11.9154 13.9715 12 13.8939 12H1.10608C1.02849 12 0.980454 11.9154 1.02018 11.8488L7.4141 1.12073ZM6.8269 4.48611C6.81221 4.10423 7.11783 3.78663 7.5 3.78663C7.88217 3.78663 8.18778 4.10423 8.1731 4.48612L8.01921 8.48701C8.00848 8.766 7.7792 8.98664 7.5 8.98664C7.2208 8.98664 6.99151 8.766 6.98078 8.48701L6.8269 4.48611ZM8.24989 10.476C8.24989 10.8902 7.9141 11.226 7.49989 11.226C7.08567 11.226 6.74989 10.8902 6.74989 10.476C6.74989 10.0618 7.08567 9.72599 7.49989 9.72599C7.9141 9.72599 8.24989 10.0618 8.24989 10.476Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
        &nbsp;<b>{error}</b>
        </div>)}
      <div className={'info_container'} style={{marginTop: '2rem'}}>
        <div id="contact-trace-review-title">
          <b>Trace</b>
          <svg onClick={() => {changeStep(1)}} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M16.1953 1.52859C16.4557 1.26824 16.8778 1.26824 17.1381 1.52859L19.8047 4.19526C20.0651 4.45561 20.0651 4.87771 19.8047 5.13806L14.5479 10.3949C14.4466 10.4962 14.3295 10.5806 14.2014 10.6447L8.96487 13.2629C8.7082 13.3913 8.39823 13.3409 8.19532 13.1381C7.99242 12.9352 7.94211 12.6252 8.07044 12.3685L10.6887 7.13195C10.7528 7.00377 10.8371 6.88675 10.9385 6.78542L16.1953 1.52859ZM16.6667 2.94281L11.8813 7.72823L10.497 10.4969L10.8365 10.8364L13.6051 9.45209L18.3906 4.66666L16.6667 2.94281ZM13.3334 2.66666L12.0001 3.99999H6.53342C5.96236 3.99999 5.57416 4.00051 5.27411 4.02502C4.98183 4.0489 4.83236 4.09219 4.7281 4.14531C4.47722 4.27315 4.27324 4.47713 4.1454 4.72801C4.09228 4.83227 4.049 4.98174 4.02512 5.27402C4.0006 5.57407 4.00008 5.96227 4.00008 6.53333V14.8C4.00008 15.3711 4.0006 15.7592 4.02512 16.0593C4.049 16.3516 4.09228 16.5011 4.1454 16.6053C4.27324 16.8563 4.47722 17.0601 4.7281 17.188C4.83236 17.2412 4.98183 17.2844 5.27411 17.3083C5.57416 17.3328 5.96236 17.3333 6.53342 17.3333H14.8001C15.3711 17.3333 15.7593 17.3328 16.0594 17.3083C16.3517 17.2844 16.5011 17.2412 16.6054 17.188C16.8563 17.0601 17.0602 16.8563 17.1881 16.6053C17.2413 16.5011 17.2845 16.3516 17.3083 16.0593C17.3329 15.7592 17.3334 15.3711 17.3334 14.8V9.3333L18.6667 7.99997V14.8V14.8276C18.6667 15.3641 18.6667 15.8071 18.6373 16.1679C18.6066 16.5427 18.541 16.8871 18.3761 17.2107C18.1205 17.7124 17.7125 18.1204 17.2107 18.376C16.8871 18.5409 16.5427 18.6065 16.1679 18.6372C15.8071 18.6667 15.3642 18.6667 14.8277 18.6667H14.8001H6.53342H6.50587C5.96923 18.6667 5.52632 18.6667 5.16554 18.6372C4.7908 18.6065 4.44634 18.5409 4.12278 18.376C3.62102 18.1204 3.21306 17.7124 2.9574 17.2107C2.79254 16.8871 2.72683 16.5427 2.69622 16.1679C2.66674 15.8071 2.66674 15.3641 2.66675 14.8276V14.8V6.53333V6.50579C2.66674 5.96918 2.66674 5.52623 2.69622 5.16545C2.72683 4.79071 2.79254 4.44625 2.9574 4.12269C3.21306 3.62091 3.62102 3.21297 4.12278 2.95731C4.44634 2.79245 4.7908 2.72674 5.16554 2.69613C5.52632 2.66665 5.96922 2.66665 6.50584 2.66666H6.53342H13.3334Z" fill="white"/>
          </svg>

        </div>
        <div id="contact-trace-review-content" style={{flexDirection: 'column'}}>
          
        {
          tracePath.length === 0 ? 
            <p style={{color: '#c4c4c4', fontFamily: 'Poppins', fontSize: '0.7rem'}}>Select Reason tags to build trace Path</p> 
            : <b style={{textDecoration: 'underline'}}>{tracePath.join(' > ')}</b>
        }
        <br/>
        {
          tracePath[tracePath.length-1] === 'Other' ? `(${otherReasonTitle})` : null
        }

        

        </div>


        <div style={{marginTop: '1rem'}} id="contact-trace-review-title">
          <b>Provided Information</b>
          <svg onClick={() => {changeStep(2)}} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M16.1953 1.52859C16.4557 1.26824 16.8778 1.26824 17.1381 1.52859L19.8047 4.19526C20.0651 4.45561 20.0651 4.87771 19.8047 5.13806L14.5479 10.3949C14.4466 10.4962 14.3295 10.5806 14.2014 10.6447L8.96487 13.2629C8.7082 13.3913 8.39823 13.3409 8.19532 13.1381C7.99242 12.9352 7.94211 12.6252 8.07044 12.3685L10.6887 7.13195C10.7528 7.00377 10.8371 6.88675 10.9385 6.78542L16.1953 1.52859ZM16.6667 2.94281L11.8813 7.72823L10.497 10.4969L10.8365 10.8364L13.6051 9.45209L18.3906 4.66666L16.6667 2.94281ZM13.3334 2.66666L12.0001 3.99999H6.53342C5.96236 3.99999 5.57416 4.00051 5.27411 4.02502C4.98183 4.0489 4.83236 4.09219 4.7281 4.14531C4.47722 4.27315 4.27324 4.47713 4.1454 4.72801C4.09228 4.83227 4.049 4.98174 4.02512 5.27402C4.0006 5.57407 4.00008 5.96227 4.00008 6.53333V14.8C4.00008 15.3711 4.0006 15.7592 4.02512 16.0593C4.049 16.3516 4.09228 16.5011 4.1454 16.6053C4.27324 16.8563 4.47722 17.0601 4.7281 17.188C4.83236 17.2412 4.98183 17.2844 5.27411 17.3083C5.57416 17.3328 5.96236 17.3333 6.53342 17.3333H14.8001C15.3711 17.3333 15.7593 17.3328 16.0594 17.3083C16.3517 17.2844 16.5011 17.2412 16.6054 17.188C16.8563 17.0601 17.0602 16.8563 17.1881 16.6053C17.2413 16.5011 17.2845 16.3516 17.3083 16.0593C17.3329 15.7592 17.3334 15.3711 17.3334 14.8V9.3333L18.6667 7.99997V14.8V14.8276C18.6667 15.3641 18.6667 15.8071 18.6373 16.1679C18.6066 16.5427 18.541 16.8871 18.3761 17.2107C18.1205 17.7124 17.7125 18.1204 17.2107 18.376C16.8871 18.5409 16.5427 18.6065 16.1679 18.6372C15.8071 18.6667 15.3642 18.6667 14.8277 18.6667H14.8001H6.53342H6.50587C5.96923 18.6667 5.52632 18.6667 5.16554 18.6372C4.7908 18.6065 4.44634 18.5409 4.12278 18.376C3.62102 18.1204 3.21306 17.7124 2.9574 17.2107C2.79254 16.8871 2.72683 16.5427 2.69622 16.1679C2.66674 15.8071 2.66674 15.3641 2.66675 14.8276V14.8V6.53333V6.50579C2.66674 5.96918 2.66674 5.52623 2.69622 5.16545C2.72683 4.79071 2.79254 4.44625 2.9574 4.12269C3.21306 3.62091 3.62102 3.21297 4.12278 2.95731C4.44634 2.79245 4.7908 2.72674 5.16554 2.69613C5.52632 2.66665 5.96922 2.66665 6.50584 2.66666H6.53342H13.3334Z" fill="white"/>
          </svg>

        </div>
        <div style={{flexDirection: 'column'}} id="contact-trace-review-content">
          
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M7.49988 0.875C5.49785 0.875 3.87488 2.49797 3.87488 4.5C3.87488 6.15288 4.98112 7.54738 6.49361 7.98351C5.29958 8.12901 4.27545 8.55134 3.50395 9.31167C2.52204 10.2794 2.0249 11.72 2.0249 13.5999C2.0249 13.8623 2.23757 14.0749 2.4999 14.0749C2.76224 14.0749 2.9749 13.8623 2.9749 13.5999C2.9749 11.8799 3.42774 10.7206 4.17079 9.9883C4.91524 9.25463 6.02662 8.87499 7.49983 8.87499C8.97305 8.87499 10.0845 9.25463 10.829 9.98831C11.572 10.7206 12.0249 11.8799 12.0249 13.5999C12.0249 13.8623 12.2375 14.0749 12.4999 14.0749C12.7622 14.075 12.9749 13.8623 12.9749 13.6C12.9749 11.72 12.4777 10.2794 11.4958 9.31166C10.7243 8.55135 9.70013 8.12903 8.50613 7.98352C10.0186 7.5474 11.1249 6.15289 11.1249 4.5C11.1249 2.49797 9.50191 0.875 7.49988 0.875ZM4.82488 4.5C4.82488 3.02264 6.02252 1.825 7.49988 1.825C8.97724 1.825 10.1749 3.02264 10.1749 4.5C10.1749 5.97736 8.97724 7.175 7.49988 7.175C6.02252 7.175 4.82488 5.97736 4.82488 4.5Z" fill="black"/>
            </svg>

            <b>{info.firstName} {info.lastName}</b>

          </div>
          
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #c4c4c4', paddingBottom: '1rem', marginTop: '1rem'}}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M1 2C0.447715 2 0 2.44772 0 3V12C0 12.5523 0.447715 13 1 13H14C14.5523 13 15 12.5523 15 12V3C15 2.44772 14.5523 2 14 2H1ZM1 3H14V3.92494C13.9174 3.92486 13.8338 3.94751 13.7589 3.99505L7.5 7.96703L1.24112 3.99505C1.16621 3.94751 1.0826 3.92486 1 3.92494V3ZM1 4.90797V12H14V4.90797L7.74112 8.87995C7.59394 8.97335 7.40606 8.97335 7.25888 8.87995L1 4.90797Z" fill="black"/>
            </svg>


            <b>{info.email}</b>

          </div>

          <p style={{width: '80%', color: 'grey', wordWrap: 'break-word'}}>{info.descr}</p>

        </div>
        <br/>
        
        <button style={{borderRadius: '14px', borderColor: loading ? '#59CE8F60' : '#59CE8F', color: loading ? '#59CE8F60' : '#59CE8F'}} onClick={verifyFormAndSubmit} className='contact__continue'>{loading ? 'Submitting...' : 'Submit'}</button>

      </div>
    </>
  )

}

export default ContactAndSupport