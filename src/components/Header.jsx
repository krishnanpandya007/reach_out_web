import React, { Suspense } from 'react'
import styled from '@emotion/styled'
import ReachOutTitle from './ReachOutTitle'
import './styles/Header.css'
import { Button, Center, Divider, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Skeleton, useColorMode, useDisclosure } from '@chakra-ui/react'
import { UserInfoContext } from '../WebApp'
import UpdateProfile from './UpdateProfile'
import axios from './configs/customAxios'

const GreetSection = styled.div`

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
                <img width="20" height="20" src="./assets/menu_edit.png" />
                <span>Edit Info</span>
                <UpdateProfile isOpen={editInfoOpen} onClose={editInfoHandleClose} />
              </MenuItem>

              <MenuItem onClick={onOpen} as={Button} borderRadius={0} justifyContent="flex-start" gap="1rem" fontWeight={'400'} fontSize='0.8rem' w="100%" p={6}>
                <img width="20" height="20" src="./assets/menu_qr.png" />
                <span>Profile QR</span>
              </MenuItem>

              <MenuItem onClick={displayTouchUps} as={Button} borderRadius={0} justifyContent="flex-start" gap="1rem" fontWeight={'400'} fontSize='0.8rem' w="100%" p={6}>
                <img width="20" height="20" src="./assets/menu_touchups.png" />
                <span>Touch ups</span>
              </MenuItem>

              <MenuItem onClick={toggleColorMode} as={Button} borderRadius={0} justifyContent="flex-start" gap="1rem" fontWeight={'400'} fontSize='0.8rem' w="100%" p={6}>
                <img width="20" height="20" src="./assets/menu_theme.png" />
                <span>Change theme</span>
              </MenuItem>

              <Divider />

              <MenuItem isLoading={loggingOut} closeOnSelect={false} onClick={logout} as={Button} color="tomato" borderRadius={0} justifyContent="flex-start" gap="1rem" fontWeight={'400'} fontSize='0.8rem' w="100%" p={6}>
                <img width="20" height="20" src="./assets/menu_logout.png" />
                <span>Logout</span>
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