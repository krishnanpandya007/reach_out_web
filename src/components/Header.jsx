import React, { Suspense } from 'react'
import styled from '@emotion/styled'
import ReachOutTitle from './ReachOutTitle'
import './styles/Header.css'
import { Button, Center, Divider, Link, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Skeleton, useColorMode, useDisclosure } from '@chakra-ui/react'
import { UserInfoContext } from '../WebApp'
import UpdateProfile from './UpdateProfile'
import {Link as ReactRouterLink } from 'react-router-dom'
import axios from './configs/customAxios'

export const GreetSection = styled.div`

    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    & b{
        font-size: 1.7rem;
        margin-bottom: -5px;
    }

    & span{
        opacity: 0.8;
        font-weight: 300;
    }

`

const ProfilePic = styled.div`

border: 3px solid #59CE8F;
padding: 3px;
border-radius: 13px;
position: relative;
transition: 0.2s ease;

&:active{
    animation: popin 0.2s ease-in;
}

@keyframes popin{50%{transform: scale(0.97)}100%{transform: scale(1)}}

&:hover{
    box-shadow: 0 0 30px -5px #59CE8F70;
    cursor:pointer;
}

`

const ProfileQr = React.lazy(() => import('./ProfileQr.jsx'));

export function BaseHeader({children, style}) {

    const scrollDirection = useScrollDirection();


  return (
    <div className={`header-dynamic ${ scrollDirection === "down" ? "down-header" : "show"}`} style={style}>

    {children}

    </div>
  )
}

function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = React.useState(null);
  
    React.useEffect(() => {
      let lastScrollY = window.pageYOffset;
  
      const updateScrollDirection = () => {
        const scrollY = window.pageYOffset;
        const direction = scrollY > lastScrollY ? "down" : "up";
        if (direction !== scrollDirection && (scrollY - lastScrollY > 5 || scrollY - lastScrollY < -5)) {
          setScrollDirection(direction);
        }
        lastScrollY = scrollY > 0 ? scrollY : 0;
      };
      window.addEventListener("scroll", updateScrollDirection); // add event listener
      return () => {
        window.removeEventListener("scroll", updateScrollDirection); // clean up
      }
    }, [scrollDirection]);
  
    return scrollDirection;
  };


function WebAppHeaderContent({displayTouchUps}) {

  const {colorMode, toggleColorMode} = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen:editInfoOpen, onOpen:editInfoHandleOpen, onClose:editInfoHandleClose } = useDisclosure();

  const {profile_id, name, avatar} = React.useContext(UserInfoContext);

  const [loggingOut, setLoggingOut] = React.useState(false);

  const logout = async () => {
    setLoggingOut(true);
    axios.get('/auth2/web/logout/').then((res) => {

      if(res.status === 200){

        window.location.reload()

      }

      setLoggingOut(false);
    })
  }

  return (
    <ReachOutTitle style={{padding: '1rem', backgroundColor: colorMode === 'dark' ? '#1A202C' : 'white'}}>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: '1'}}>
        <GreetSection>
            <b>Welcome,</b>
            <span>{name}</span>
        </GreetSection>
        
        <Menu style={{backgroundColor: 'white'}}>
          <MenuButton>
            <ProfilePic>
                <div style={{background: `url(${avatar})`, backgroundSize: 'cover', width: 'clamp(50px, 8vw, 70px)', height: 'clamp(50px, 8vw, 70px)', borderRadius: '8px'}} />
                <svg style={{position: 'absolute', bottom: '5px', right: '5px', backgroundColor: '#00000099', borderRadius: '7px', color: 'white'}} width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </ProfilePic>
            </MenuButton>
            <MenuList>
              <Modal
                isOpen={isOpen}
                onClose={onClose}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Your profile QR 😎</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>
                    <Center>
                      <Suspense fallback={<Skeleton><div style={{width: '200px', height: '200px'}} /></Skeleton>}>
                        <ProfileQr profileId={profile_id} />
                      </Suspense>
                    </Center>
                  </ModalBody>
                </ModalContent>
              </Modal>
              <MenuItem onClick={editInfoHandleOpen} as={Button} borderRadius={0} justifyContent="flex-start" gap="1rem" fontWeight={'400'} fontSize='0.8rem' w="100%" p={6}>
                  {/* <img width="20" height="20" src="./assets/menu_edit.png" /> */}
                  <svg role="img" xmlns="http://www.w3.org/2000/svg" width="21px" height="21px" viewBox="0 0 22 22" aria-labelledby="editIconTitle" stroke={colorMode === 'light' ? 'black' : 'white'} stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" fill="none" color={colorMode === 'light' ? 'black' : 'white'}> <title id="editIconTitle">Edit</title> <path d="M18.4142136 4.41421356L19.5857864 5.58578644C20.366835 6.36683502 20.366835 7.63316498 19.5857864 8.41421356L8 20 4 20 4 16 15.5857864 4.41421356C16.366835 3.63316498 17.633165 3.63316498 18.4142136 4.41421356zM14 6L18 10"/> </svg>
                <span style={{opacity: '0.7'}}>Edit Info</span>
                <UpdateProfile isOpen={editInfoOpen} onClose={editInfoHandleClose} />
              </MenuItem>

              <MenuItem onClick={onOpen} as={Button} borderRadius={0} justifyContent="flex-start" gap="1rem" fontWeight={'400'} fontSize='0.8rem' w="100%" p={6}>
                {/* <img width="20" height="20" src="./assets/menu_qr.png" /> */}
                <svg width="21px" height="21px" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="qrIconTitle" stroke={colorMode === 'light' ? 'black' : 'white'} stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" color={colorMode === 'light' ? 'black' : 'white'}> <title id="qrIconTitle">QR Code</title> <rect x="10" y="3" width="7" height="7" transform="rotate(90 10 3)"/> <rect width="1" height="1" transform="matrix(-1 0 0 1 7 6)"/> <rect x="10" y="14" width="7" height="7" transform="rotate(90 10 14)"/> <rect x="6" y="17" width="1" height="1"/> <rect x="14" y="20" width="1" height="1"/> <rect x="17" y="17" width="1" height="1"/> <rect x="14" y="14" width="1" height="1"/> <rect x="20" y="17" width="1" height="1"/> <rect x="20" y="14" width="1" height="1"/> <rect x="20" y="20" width="1" height="1"/> <rect x="21" y="3" width="7" height="7" transform="rotate(90 21 3)"/> <rect x="17" y="6" width="1" height="1"/> </svg>
                <span style={{opacity: '0.7'}}>Profile QR</span>
              </MenuItem>

              <MenuItem as={Button} onClick={() => { window.location.pathname = `/analytics` }} to="/analytics" borderRadius={0} justifyContent="flex-start" gap="1rem" fontWeight={'400'} fontSize='0.8rem' w="100%" p={6}>
                {/* <img width="20" height="20" src="./assets/menu_qr.png" /> */}
                <svg role="img" xmlns="http://www.w3.org/2000/svg" width="21px" height="21px" viewBox="0 0 22 22" aria-labelledby="lineChartIconTitle" stroke={colorMode === 'light' ? 'black' : 'white'} stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" fill="none" color={colorMode === 'light' ? 'black' : 'white'}> <title id="lineChartIconTitle">Line Chart</title> <path d="M3,16 L8,11"/> <circle cx="9" cy="10" r="1"/> <circle cx="14" cy="15" r="1"/> <path d="M10 11L13 14M15 14L21 8"/> </svg>
                <span style={{opacity: '0.7'}}>Analytics</span>
              </MenuItem>

              <MenuItem onClick={displayTouchUps} as={Button} borderRadius={0} justifyContent="flex-start" gap="1rem" fontWeight={'400'} fontSize='0.8rem' w="100%" p={6}>
                {/* <img width="20" height="20" src="./assets/menu_qr.png" /> */}
                <svg width="21px" height="21px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="rocketIconTitle" stroke={colorMode === 'light' ? 'black' : 'white'} stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" color="#2329D6"> <title id="rocketIconTitle">Rocket</title> <path d="M12.7526 9.92418C12.2059 10.2861 11.679 10.7057 11.1924 11.1924C10.4754 11.9093 10.4947 11.9482 9.85359 12.682M12.7526 9.92418C16.178 7.65685 20.3848 7.65685 20.3848 7.65685C20.3848 7.65685 20.3848 11.8636 18.1174 15.289M12.7526 9.92418L18.1174 15.289M18.1174 15.289C17.7555 15.8358 17.3359 16.3626 16.8492 16.8492C16.1323 17.5662 16.0934 17.5469 15.3596 18.188M6.11523 17.429C5.74278 17.9526 5.53552 18.2635 5.53552 18.2635L9.77816 22.5061C9.77816 22.5061 10.0891 22.2988 10.6127 21.9264M6.11523 17.429L2.70709 14.0208L8.36394 11.1924L9.85359 12.682M6.11523 17.429C6.83965 16.4105 8.18898 14.5874 9.85359 12.682M10.6127 21.9264L14.0208 25.3345L16.8492 19.6777L15.3596 18.188M10.6127 21.9264C11.6311 21.202 13.4542 19.8526 15.3596 18.188"/> <path d="M5.00003 23C5.35031 21.5825 5.99994 21.0001 6.5 21.5C7.00003 22 6.41751 22.6497 5.00003 23Z"/> </svg>                
                <span style={{opacity: '0.7'}}>Touch ups</span>
              </MenuItem>

              {/* <MenuItem onClick={displayTouchUps} as={Button} borderRadius={0} justifyContent="flex-start" gap="1rem" fontWeight={'400'} fontSize='0.8rem' w="100%" p={6}> */}
              <MenuItem onClick={toggleColorMode} as={Button} borderRadius={0} justifyContent="flex-start" gap="1rem" fontWeight={'400'} fontSize='0.8rem' w="100%" p={6}>

                {/* <img width="20" height="20" src="./assets/menu_touchups.png" /> */}
                <svg width="21px" height="21px" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" aria-labelledby="nightModeIconTitle" stroke={colorMode === 'light' ? 'black' : 'white'} stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" fill="none" color={colorMode === 'light' ? 'black' : 'white'}> <title id="nightModeIconTitle">Night Mode</title> <path d="M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"/> <path d="M15.899 12.899a4 4 0 0 1-4.797-4.797A4.002 4.002 0 0 0 12 16c1.9 0 3.49-1.325 3.899-3.101z"/> <path d="M12 5V3M12 21v-2"/> <path d="M5 12H2h3zM22 12h-3 3zM16.95 7.05L19.07 4.93 16.95 7.05zM4.929 19.071L7.05 16.95 4.93 19.07zM16.95 16.95l2.121 2.121-2.121-2.121zM4.929 4.929L7.05 7.05 4.93 4.93z"/> </svg>
                <span style={{opacity: '0.7'}}>Change theme</span>

              </MenuItem>



              <Divider />

              <MenuItem isLoading={loggingOut} closeOnSelect={false} onClick={logout} as={Button} color="#FF004D" borderRadius={0} justifyContent="flex-start" gap="1rem" fontWeight={'400'} fontSize='0.8rem' w="100%" p={6}>
              <svg role="img" xmlns="http://www.w3.org/2000/svg" width="21px" height="21px" viewBox="0 0 22 22" aria-labelledby="exitIconTitle" stroke="#FF004D" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" fill="none" color="#FF004D"> <title id="exitIconTitle">Exit</title> <path d="M18 15l3-3-3-3"/> <path d="M11.5 12H20"/> <path stroke-linecap="round" d="M21 12h-1"/> <path d="M15 4v16H4V4z"/> </svg>
                <span style={{opacity: '0.8'}}>Logout</span>
              </MenuItem>

              
        </MenuList>
        </Menu>
    </div>
</ReachOutTitle>
  )

}

function WebAppHeader({displayTouchUps}) {

  return (

    <BaseHeader>
      <WebAppHeaderContent displayTouchUps={displayTouchUps} />
    </BaseHeader>

  )


}

// function OptionsMenu ({ isOpen })
export default WebAppHeader