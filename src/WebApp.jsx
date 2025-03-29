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


    // if(res.status === 200){
      if(true){
      setCurrentModeConfigs(c => ({...c, profiles: [
        ...c.profiles, 
        ...[
          {
            "id": 1,
            "profilePicUrl": "",
            "reached": true,
            "name": "Nishant Patel",
            "bio": "Who cares??",
            "socials": [
              {
                "profile_link": "https://instagram.com/nishant_3009",
                "socialMedia": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNL9uH8qSuCqWym1y6fqx-nU4KLADXtzFnpw&s"
              }
            ]
          },
          {
            "id": 2,
            "profilePicUrl": "",
            "reached": false,
            "name": "Aarav Shah",
            "bio": "Live. Laugh. Code.",
            "socials": [
              {
                "profile_link": "https://linkedin.com/in/aaravshah",
                "socialMedia": "https://cdn-icons-png.flaticon.com/512/174/174857.png"
              }
            ]
          },
          {
            "id": 3,
            "profilePicUrl": "",
            "reached": true,
            "name": "Pooja Mehta",
            "bio": "Tech enthusiast & coffee addict ☕",
            "socials": [
              {
                "profile_link": "https://twitter.com/pooja_mehta",
                "socialMedia": "https://cdn-icons-png.flaticon.com/512/733/733579.png"
              }
            ]
          },
          {
            "id": 4,
            "profilePicUrl": "",
            "reached": false,
            "name": "Rohan Desai",
            "bio": "Just another human in the digital world.",
            "socials": [
              {
                "profile_link": "https://facebook.com/rohandesai",
                "socialMedia": "https://cdn-icons-png.flaticon.com/512/124/124010.png"
              }
            ]
          },
          {
            "id": 5,
            "profilePicUrl": "",
            "reached": true,
            "name": "Sneha Patel",
            "bio": "Exploring life, one step at a time!",
            "socials": [
              {
                "profile_link": "https://snapchat.com/add/snehapatel",
                "socialMedia": "https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Snapchat_logo.svg/1024px-Snapchat_logo.svg.png"
              }
            ]
          }
        ]
        
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

    // if(getCookie('stale_authenticated') !== 'true'){
    if(false){
      window.location.href = `../signin?msg_code=required_signin&next=${encodeURIComponent(window.location.href)}`
      
    }else{

      setCredentialsChecked(true);
    }


  }

  const getUserInitialInfo = async () => {
    // const res = await axios.get('/api/profile')
    // const res_data = res.data
    if (true){
      // set_user_info({profile_id: res_data.profileId, name: res_data.name, bio: res_data.bio, avatar: res_data.profilePicUrl, touch_ups: res_data.touch_ups });
      set_user_info({profile_id: 1, name: "Krishnan Pandya", bio: "Code enthusiast, Let's listen to chill music...", avatar: "data:image/jpeg;base64,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", touch_ups: ['link_socials'] });
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