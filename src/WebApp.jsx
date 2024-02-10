import { Badge, Button, Center, Container, Divider, Fade, Flex, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, Progress, SlideFade, Text, Tooltip } from '@chakra-ui/react'
import { IoFilter } from 'react-icons/io5'
import React from 'react'
import { getCookie } from './components/configs/utils'
import Header from './components/Header'
import ProfileCardSection from './components/ProfileCard'
import TouchUps from './components/TouchUps'
import { FRONTEND_ROOT_URL } from './constants'
import axios from './components/configs/customAxios'
import Footer from './components/Footer'
import PageTransition from "./components/configs/PageTransition"
import {Link} from 'react-router-dom'

export const UserInfoContext = React.createContext({profile_id: -1, name: '', bio: '', avatar: '', touch_ups: ['link_socials'], set_user_info: (newVal) => {}, update_user_info: (field_name, field_value) => {}})

function WebApp() {

  const [userInfo, setUserInfo] = React.useState({profile_id: -1, name: '', bio: '', avatar: '', touch_ups: ['link_socials', 'add_avatar', 'add_bio']})
  const [infoLoaded, setInfoLoaded] = React.useState(false);

  const [showTouchUps, setShowTouchUps] = React.useState(true);
  const [currentModeConfigs, setCurrentModeConfigs] = React.useState({mode: 'standard', profiles: [], loading: false}) // nocacheothertypecontent

  const updateUserInfo = (field_name, field_val) => {
    setUserInfo(cur => ({...cur, field_name, field_val}));
  }

  const changeFeedMode = (newMode) => {

    console.log("This thing can be logged here..");
    console.log(newMode);

    setCurrentModeConfigs({mode: newMode, profiles: [], loading: false});

  }

  const loadMoreProfiles = React.useCallback(async () => {

    /*
    prevents re-render of profileCards on state updation on this component
    TODO: Lateron, replace it with API call

    Currently FAKE:GENERATED
    */

    let res;

    console.log("Regenerating posts at");
    console.log(currentModeConfigs.mode)

    if(currentModeConfigs.mode === 'my_reaches'){

      res = await axios.get('/api/feed/');

    } else {

      res = await axios.get(`/api/feed/?feed_type=${currentModeConfigs.mode}`);
    }


    if(res.status === 200){
      setCurrentModeConfigs(c => ({...c, profiles: [
        ...c.profiles, 
        ...res.data.profile_cards
      ]}))
    }

  }, [currentModeConfigs.mode])

  const displayTouchUps = () => {

    localStorage.setItem('base-show_touchups', 'false')

    setShowTouchUps(true);

  }

  const hideTouchUps = () => {

    localStorage.setItem('base-show_touchups', 'true')

    setShowTouchUps(false);

  }

  React.useEffect(() => {

    switch(localStorage.getItem('base-show_touchups')){

      case 'true':
        setShowTouchUps(true);
        break;
      case null:
        displayTouchUps();
        break;
      case 'false':
        setShowTouchUps(false);

    }

  }, [])

  return (
    <UserInfoContext.Provider value={{...userInfo, set_user_info: (newVal) => {setUserInfo(curr => newVal)}, update_user_info: updateUserInfo}}>
      <PageTransition>

      <Center>
        {infoLoaded ?
        // Add Fade animation here
          <SlideFade direction='bottom' in>
            <div style={{width:"min(800px, 100vw)", padding: '0.5rem'}}>
              <Header displayTouchUps={displayTouchUps} />
              <Divider />
              {showTouchUps && <TouchUps hideTouchUps={hideTouchUps} />}
              {/*
              On Modechange revalue the currentModeConfigs.profiles to []
              */}
              <Flex p='0 1rem' justifyContent={'space-between'} m='3rem 0 1rem 0'>
                <div>
                  <Text fontSize='xl' fontWeight='bold'>
                    Quick Picks
                  </Text>
                  <Tooltip fontSize={'0.7rem'} label='Current Feed Mode' placement='bottom-start'>
                    <Badge  mt='-0.5rem' fontSize='0.7em' colorScheme='green'>
                      {currentModeConfigs.mode === 'nearme' ? "You may know" : currentModeConfigs.mode}
                    </Badge>
                  </Tooltip>
                  
                </div>
                <Menu>
                  <MenuButton as={Button} fontSize='0.8rem' borderRadius={'10px'} size='md' leftIcon={<IoFilter />} variant='solid'>
                      Filter
                  </MenuButton>
                  <MenuList minWidth='180px'>
                    <MenuOptionGroup defaultValue='standard' type='radio' onChange={changeFeedMode}>
                      <MenuItemOption fontSize={'0.85rem'} _checked={{backgroundColor: '#03C98820', color: '#03C988'}} value='standard'>Reach Out</MenuItemOption>
                      <MenuItemOption fontSize={'0.85rem'} _checked={{backgroundColor: '#03C98820', color: '#03C988'}} value='nearme'>You may know</MenuItemOption>
                      {/* <MenuItemOption fontSize={'0.85rem'} _checked={{backgroundColor: '#03C98820', color: '#03C988'}} value='my_reaches'>My Reaches</MenuItemOption> */}
                    </MenuOptionGroup>
                  </MenuList>

                </Menu>
              </Flex>
              <Fade in key={currentModeConfigs.mode}>
                <ProfileCardSection profiles={currentModeConfigs.profiles} loadMoreProfiles={loadMoreProfiles} />
              </Fade>
              <Footer />
            </div>
          </SlideFade>
           : <Fade in>
              <SplashScreen triggerDataLoaded={() => {setInfoLoaded(true)}} />
             </Fade>
         }
      </Center>
      </PageTransition>
    </UserInfoContext.Provider>

  )
}

function SplashScreen({ triggerDataLoaded }) {

  const { set_user_info } = React.useContext(UserInfoContext);
  const [credentialsChecked, setCredentialsChecked] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const checkCredentials = () => {

    if(getCookie('stale_authenticated') !== 'true'){
      window.location.href = `../signin?msg_code=required_signin&next=${encodeURIComponent(window.location.href)}`
      
    }else{

      setCredentialsChecked(true);
    }


  }

  const getUserInitialInfo = async () => {
    const res = await axios.get('/api/profile')
    const res_data = res.data
    if (res.status === 200){
      set_user_info({profile_id: res_data.profileId, name: res_data.name, bio: res_data.bio, avatar: res_data.profilePicUrl, touch_ups: res_data.touch_ups });
      triggerDataLoaded();
    }else{
      setHasError(true);
    } 
  }

  React.useEffect(() => {

    const credentialsTimerId = setTimeout(() => {

      checkCredentials();

    }, 1500)

    return () => {

      clearTimeout(credentialsTimerId);

    }

  }, [])

  React.useEffect(() =>{

    if(credentialsChecked){
      const userInfoTimerId = setTimeout(() => {

        getUserInitialInfo();
  
      }, 3000)
      return () => {
        clearTimeout(userInfoTimerId);
      }
    }


  }, [credentialsChecked])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', width: 'min(700px, 80vw)', height: '100vh' }}>

      <Link to='/'>
        <img src='/social_logo/ReachOut.png' width="70" height="70" style={{borderRadius: '10px'}} />
      </Link>

      <small style={{opacity: '0.8'}}>{credentialsChecked ? 'Syncing data...' : 'Checking Credentials...'}</small>

      <Progress width="100%" height="5px" colorScheme='whatsapp' isIndeterminate />

      <br/>

      {hasError ? <b>Something went wrong, 😕</b> : <b>Keep smiling. 😀</b>}

    </div>
  )

}

export default WebApp