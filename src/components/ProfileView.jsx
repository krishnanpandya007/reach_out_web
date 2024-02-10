import React, { useEffect, useMemo, useState, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import axios from './configs/customAxios'
import {isNumeric} from './configs/utils'
import { Text, Center, IconButton, useMediaQuery, Flex, useToast, Modal, ModalOverlay, ModalCloseButton, ModalHeader, useDisclosure, ModalContent, ModalBody, Link, useColorMode, WrapItem, Wrap, Tooltip, ButtonGroup, Button, Skeleton, Divider, Grid } from '@chakra-ui/react';
import {BaseHeader, GreetSection} from './Header'
import ReachOutTitle from './ReachOutTitle'
import {getCookie} from './configs/utils'
import {BsPeople, BsBookmarkDash, BsQrCodeScan, BsBookmark, BsArrow90DegRight, BsArrowRight} from 'react-icons/bs'
import {IoClose} from 'react-icons/io5'
import { FiArrowRight } from 'react-icons/fi';
import {Link as ReactRouterLink} from 'react-router-dom'
import {motion} from 'framer-motion'
import { BACKEND_ROOT_URL, FRONTEND_ROOT_URL } from '../constants';
const ProfileQr = React.lazy(() => import('./ProfileQr.jsx'));

const variants =  {

    open: { width: 300 , padding:15, marginLeft: 10 },
    close: { width : 0, padding: 0, marginLeft: 0}

}

function ProfileView() {

    const { profile_id } = useParams();
    const { colorMode } = useColorMode();
    const toast = useToast();
    const backPath = useMemo(() => {
        // Has or not back option if then store value of it as string otherwise null
        let back_path = new URL(window.location).searchParams.get('back_path')
        if (back_path != null) {
            // Decode it and store it
            back_path = decodeURIComponent(back_path)
        }
        return back_path;

    }, [])

    const [userConfig, setUserConfig] = useState({ loading: true, data: null, error: false });
    
    const [currentAction, setCurrentAction] = useState({name: null, loading: false, error: false})
    
    const { isOpen: isQrModalOpen, onOpen: onQrModalOpen, onClose: onQrModalClose } = useDisclosure();
    const { isOpen: isSideViewOpen, onOpen: getReachers, onClose: onSideViewClose } = useDisclosure();

    const [isLargerThan800] = useMediaQuery('(min-width: 800px)')
    const [reachers, setReachers] = useState(null)// null indicates loading signal

    const fetchReachers = async () => {

        getReachers();

        setCurrentAction({loading: true, error: false, name: 'reachers'})

        axios.get(`/api/profile/list/followers/${profile_id}/`).then((res) => {

            setCurrentAction({loading: false, error: false, name: 'reachers'})
            setReachers(res.data['followers'])

        }).catch((err) => {
            console.log(err)
            setCurrentAction({loading: false, error: true, name: 'reachers'})

        })

    }

    const assertIsAuthenticated = useMemo(() => (preventDefault= false) => {
        if(getCookie('stale_authenticated') !== 'true'){
            if(preventDefault){
                return false;
            }else{
                window.location.href = `../signin?msg_code=required_signin&next=${encodeURIComponent(window.location.href)}`
            }
        } else {
            return true;
        }
    }, []) 

    

    useEffect(() => {
        
        axios.get(`/api/profile/${profile_id}`).then((res) => {

            setUserConfig({loading: false, error: false, data: res.data})

        }).catch((err) => {
            console.log(err)
            setUserConfig({loading: false, error: true, data: null})

        })
        

    }, [])

    const bookmarkProfile = async () => {
        
        setCurrentAction({name: 'mark', loading: true, error: false})

        axios.get(`api/profile/mark/${profile_id}`).then((res) => {
            setCurrentAction({name: 'mark', loading: false, error: false})
            if(res.status === 201){
                setUserConfig({loading: false, error: false, data: {...userConfig.data, marked: false}})
            }else if(res.status === 200){
                setUserConfig({loading: false, error: false, data: {...userConfig.data, marked: true}})                
            }
        }).catch((r) => {
            console.log("fk")
            setCurrentAction({name: 'mark', loading: false, error: true})
            toast({
                title: 'Failed to mark',
                description: 'Try again later',
                status: 'error',
                containerStyle: {
                    fontSize: 'small'
                },
                variant: 'top-accent',
                position: 'bottom-right',
                duration: 3000
            })
        })



    }


    const reachOut = (userId) => {
        assertIsAuthenticated();
        if(typeof userConfig.data == null){
            return
        }
        setCurrentAction({name: 'reach', loading: true, error: true})
        axios.get(`/api/profile/reach/${profile_id}/?assert_action=${userConfig.data?.reached ? 'reach' : 'un-reach'}`).then((response) => {
            console.log(response.data)
            console.log(`Current status: ${userConfig.data?.reached}`)
            if(userConfig.data?.reached){
                console.log('Fall1')
                if(response.status !== 201){

                    // Failed to reach
                    toast({
                        title: 'Failed to reach',
                        description: 'Try again later',
                        status: 'error',
                        containerStyle: {
                            fontSize: 'small'
                        },
                        variant: 'top-accent',
                        position: 'bottom-right',
                        duration: 3000
                    })
                    setCurrentAction({name: 'reach', loading: false, error: true})
                } else {
                    setCurrentAction({name: 'reach', loading: false, error: false})
                    setUserConfig({...userConfig, data: {...userConfig.data, reached: false}})
                    // setReached(true); // Show ui for UnReach
                }
            } else {

                if(response.status !== 200){

                    // Failed to reach
                    toast({
                        title: 'Failed to UnReach',
                        description: 'Try again later',
                        status: 'error',
                        containerStyle: {
                            fontSize: 'small'
                        },
                        variant: 'top-accent',
                        position: 'bottom-right',
                        duration: 3000
                    })
                    setCurrentAction({name: 'reach', loading: false, error: true})

                } else {
                    setCurrentAction({name: 'reach', loading: false, error: false})
                    console.log("Currently updating the values")
                    setUserConfig({...userConfig, data: {...userConfig.data, reached: true}})
                    // setReached(false); //Asserting/Toggling 
                }
            }

        })
    }

    if(!isNumeric(profile_id)){
        return (
            <Center h='100vh' flexDirection='column'>
                <Text as={'b'}>Invalid URL.</Text>
                <Text as='small'>Double check the url</Text>
            </Center>
        )
    }

    if(userConfig.error){
        return (
            <p>Error retrieving profile, try sometime later</p>
        )
    }

    return (
        <Center flexDirection='column' gap='10vh'>
            <BaseHeader style={{borderBottom: '2px solid #c4c4c430',width: 'clamp(300px, 80%, 800px)'}}>
                <ReachOutTitle style={{padding: '1rem 0', backgroundColor: colorMode === 'dark' ? '#1A202C' : 'white'}}>
                    {backPath && <IconButton as={ReactRouterLink} to={backPath}>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    </IconButton>}
                    <GreetSection>
                        <b style={{fontSize: '1rem'}}>ReachOut</b>
                        <span style={{fontSize: '0.9rem'}}>Profile view</span>
                    </GreetSection>
                    {
                        assertIsAuthenticated(true) ? 
                            
                            <Button borderRadius={'100px'} as={ReactRouterLink} to='/web' p='0 1rem' rightIcon={<FiArrowRight />} size='sm' fontWeight={'400'} fontSize={'0.8rem'} variant={'outline'}>Web app</Button>
                            
                        :
                            <Button borderRadius={'100px'} as={ReactRouterLink} to='/signin' p='0 1rem' rightIcon={<FiArrowRight />} size='sm' fontWeight={'400'} fontSize={'0.8rem'} variant={'outline'}>Sign In</Button>
                    }
                </ReachOutTitle>
            </BaseHeader>
            <Flex>

            {!(isSideViewOpen && !(isLargerThan800)) && <Grid placeItems='center' display='relative'>
                <Skeleton isLoaded>
                    <img style={{borderRadius: '5px', height: '100px'}} src={userConfig.data?.profilePicUrl} />
                </Skeleton>
                <br/>
                <Skeleton isLoaded={!userConfig.loading} textAlign='center'>
                    <b>{userConfig.data?.name}</b><br/>
                    <small>{userConfig.data?.bio ?? 'No bio.'}</small>
                </Skeleton>
                <br/>

                <ButtonGroup isDisabled={userConfig.loading} size='md' colorScheme='whatsapp'>
                    <Button onClick={fetchReachers} variant='outline' leftIcon={<BsPeople size={18} />}>{userConfig.loading ? '--' : userConfig.data?.reaches}</Button>
                    <Tooltip  label={!assertIsAuthenticated(true) && 'Sign In required'}>
                        <Button isDisabled={!assertIsAuthenticated(true)} onClick={reachOut} isLoading={currentAction.name === 'reach' && currentAction.loading} p='0 2rem' fontSize='0.9rem' colorScheme={!userConfig.data?.reached && assertIsAuthenticated(true) ? 'red' : 'whatsapp'}>{!userConfig.data?.reached&& assertIsAuthenticated(true) ? 'Un-reach' : 'Reach out'}</Button>
                    </Tooltip>
                    <Modal
                        isOpen={isQrModalOpen}
                        onClose={onQrModalClose}
                        > 
                        <ModalOverlay />
                        <ModalContent>
                        <ModalHeader>Profile QR</ModalHeader>
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
                    <Button onClick={onQrModalOpen} p='0' variant='outline'><BsQrCodeScan size={18}/></Button>
                    <Tooltip label={!assertIsAuthenticated(true) ? 'Sign In required' : (!userConfig.data?.marked ? "Remove mark" : "Mark profile")}>
                        <Button onClick={bookmarkProfile} isDisabled={!assertIsAuthenticated(true) || (currentAction.name === 'mark' && currentAction.loading)} p='0' variant='outline'>{ (!assertIsAuthenticated(true) || userConfig.data?.marked) ? <BsBookmark size={18}/> : <BsBookmarkDash />}</Button>
                    </Tooltip>
                </ButtonGroup>
                <br/>
                <Divider/>
                <br/>
                <b style={{color: '#464646', fontSize: '0.8rem'}}>Linked socials</b>
                <br/>
                <Skeleton isLoaded={!userConfig.loading}>
                    <Wrap spacing='30px'>
                        {
                            (userConfig.data?.socials === undefined) || userConfig.data?.socials?.length === 0 ? <p style={{color: '#c4c4c450'}}>No socials linked!</p> : 
                            userConfig.data?.socials?.map((social) => (
                                <WrapItem key={social.socialMedia}>
                                    <Link isExternal href={social.profile_link}>
                                        <Tooltip label={social.socialMedia}>
                                            <img style={{width: '30px'}} src={`/social_logo/${social.socialMedia}.png`} />
                                        </Tooltip>
                                    </Link>
                                </WrapItem>
                            ))
                        }
                    </Wrap>
                </Skeleton>

            </Grid>}

            <motion.div variants={variants} style={{display: !isSideViewOpen ? 'none' : isLargerThan800 ? '' : 'absolute',maxHeight: '60vh', overflow: 'auto', overflowX: 'hidden'}} transition={{duration: 0.3, type: 'spring'}} animate={isSideViewOpen ? 'open' : 'close'}>
                {
                    isSideViewOpen && <motion.div animate={{opacity: 1, x: 0}} transition={{delay: 2}} exit={{x: -100, opacity: 0}}>
                        <Flex pl={'0.8rem'} alignItems='center' justifyContent='space-between'>
                            <h2>Reachers</h2>
                            <IconButton colorScheme='whatsapp' style={{marginRight: '1rem'}} onClick={onSideViewClose} size='sm' p={0}><IoClose /></IconButton>
                        </Flex>
                        <br/>
                        <Divider />
                        {reachers === null ? <center style={{opacity: '0.6'}}><b><small>Just a sec...</small></b></center> : <Grid p={'1rem 0'} gap='0.5rem'>
                            {
                                reachers.map((reacher, idx) => (
                                    <a href={`${FRONTEND_ROOT_URL}/web/profile/${reacher['profile_id']}`}>
                                        <Flex p='0.4rem 0.8rem' borderRadius={15} _hover={{cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 0.05)'}} gap='1rem' alignItems='center'>
                                            <img src={`${reacher['profile_pic_url']}`} style={{height: '40px', width: '40px', borderRadius: '100px', objectFit: 'cover'}} /> 
                                            <Text as='b' fontSize={12}>{`${reacher['name']}`}</Text>
                                        </Flex>
                                    </a>
                                ))
                            }
                            {/* <Flex p='0.4rem 0.8rem' borderRadius={15} _hover={{cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 0.05)'}} gap='1rem' alignItems='center'>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH2sLQBfjQKkXbtI-85X0O_VkvsXiAXOQ-Yg&usqp=CAU" style={{height: '40px', width: '40px', borderRadius: '100px', objectFit: 'cover'}} /> 
                                <Text as='b' fontSize={12}>Krishnan Pandya</Text>
                            </Flex>
                            <Flex p='0.4rem 0.8rem' borderRadius={15} _hover={{cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 0.05)'}} gap='1rem' alignItems='center'>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH2sLQBfjQKkXbtI-85X0O_VkvsXiAXOQ-Yg&usqp=CAU" style={{height: '40px', width: '40px', borderRadius: '100px', objectFit: 'cover'}} /> 
                                <Text as='b' fontSize={12}>Krishnan Pandya</Text>
                            </Flex>
                            <Flex p='0.4rem 0.8rem' borderRadius={15} _hover={{cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 0.05)'}} gap='1rem' alignItems='center'>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH2sLQBfjQKkXbtI-85X0O_VkvsXiAXOQ-Yg&usqp=CAU" style={{height: '40px', width: '40px', borderRadius: '100px', objectFit: 'cover'}} /> 
                                <Text as='b' fontSize={12}>Krishnan Pandya</Text>
                            </Flex>
                            <Flex p='0.4rem 0.8rem' borderRadius={15} _hover={{cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 0.05)'}} gap='1rem' alignItems='center'>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH2sLQBfjQKkXbtI-85X0O_VkvsXiAXOQ-Yg&usqp=CAU" style={{height: '40px', width: '40px', borderRadius: '100px', objectFit: 'cover'}} /> 
                                <Text as='b' fontSize={12}>Krishnan Pandya</Text>
                            </Flex>
                            <Flex p='0.4rem 0.8rem' borderRadius={15} _hover={{cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 0.05)'}} gap='1rem' alignItems='center'>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH2sLQBfjQKkXbtI-85X0O_VkvsXiAXOQ-Yg&usqp=CAU" style={{height: '40px', width: '40px', borderRadius: '100px', objectFit: 'cover'}} /> 
                                <Text as='b' fontSize={12}>Krishnan Pandya</Text>
                            </Flex>
                            <Flex p='0.4rem 0.8rem' borderRadius={15} _hover={{cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 0.05)'}} gap='1rem' alignItems='center'>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH2sLQBfjQKkXbtI-85X0O_VkvsXiAXOQ-Yg&usqp=CAU" style={{height: '40px', width: '40px', borderRadius: '100px', objectFit: 'cover'}} /> 
                                <Text as='b' fontSize={12}>Krishnan Pandya</Text>
                            </Flex>
                            <Flex p='0.4rem 0.8rem' borderRadius={15} _hover={{cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 0.05)'}} gap='1rem' alignItems='center'>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH2sLQBfjQKkXbtI-85X0O_VkvsXiAXOQ-Yg&usqp=CAU" style={{height: '40px', width: '40px', borderRadius: '100px', objectFit: 'cover'}} /> 
                                <Text as='b' fontSize={12}>Krishnan Pandya</Text>
                            </Flex> */}

                        </Grid>}
                    </motion.div>
                }

                

            </motion.div>

            </Flex>
        </Center>

    )
}



export default ProfileView