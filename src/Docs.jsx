import {Flex, Heading, Show, Popover, PopoverTrigger, useColorMode, PopoverContent, PopoverBody, Button, Stack, Kbd, InputRightElement, Link, Accordion, InputLeftElement, InputGroup, Input, AccordionItem, AccordionButton, Box, AccordionPanel, Container, Badge, IconButton, Breadcrumb, BreadcrumbItem, BreadcrumbLink, useToast, Center, Divider, useDisclosure, useMediaQuery} from '@chakra-ui/react'
import {TbLayoutNavbarExpand, TbExternalLink, TbMoodHappy, TbMoodSad, TbCopy} from 'react-icons/tb'
import {RiSearchLine, RiMenuFill, RiArrowRightSLine} from 'react-icons/ri'
import {BiBoltCircle} from 'react-icons/bi'
import {MdOutlineDarkMode, MdOutlineLightMode} from 'react-icons/md'
import {Link as ReactRouterLink, useLocation, useNavigate} from 'react-router-dom'
import { useEffect, useState, useRef, lazy, createElement } from 'react'
import { Suspense } from 'react'
import PageTransition from "./components/configs/PageTransition"

export default function Docs(){

    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();
    const { isOpen, onClose: closeSidebar,onToggle } = useDisclosure();
    const [isLargerThan700] = useMediaQuery('(min-width: 700px)') // Interception CSS (Expensieve) [in future will optimize it!]
    const { colorMode, toggleColorMode } = useColorMode();
    
    const sections = Object.keys(docs_tree)
    const url_section = location.pathname.split('/').length > 2 ? location.pathname.split('/')[2] : null
    const url_doc = location.pathname.split('/').length > 3 ? location.pathname.split('/')[3] : null

    useEffect(() => {
        // Assert that page should be opened with closed sidebar on PhoneOrientation!
        closeSidebar();

        // Below code redirects from non-whitelisted path to first docs entry in `docs_path`
        let docs_path = location.pathname.split('/').filter(val => val !== '');
        if(docs_path.length !== 3 || (!(Object.keys(docs_tree).includes(docs_path[1])) || !(docs_tree[docs_path[1]][docs_path[2]]))){
            // path: /docs => redirect to /docs/Legal/terms-and-conditions default
            navigate(`${sections[0]}/${Object.keys(docs_tree[sections[0]])[0]}`);
        } 

    }, [location.pathname])

    useEffect(() => {
        document.title = "Docs - ReachOut"
     }, []);

    return  (
        <PageTransition>
            <Flex>
                <Flex position='sticky' p={5} width='clamp(250px, 28vw, 360px)' alignItems='center' borderRight='1px solid #c4c4c430' borderBottom='1px solid #c4c4c430'>
                    <Link as={ReactRouterLink} to='/'>
                        <img width='50' height='50px' style={{borderRadius: '10px'}} src='/social_logo/ReachOut.png' />
                    </Link>
                    <Heading variant='h5' fontFamily='Poppins' fontSize='1.8rem' pl={4}>Docs</Heading>

                </Flex>
                <Flex flex={1} p={5} pl={8} gap='1rem' justifyContent={'space-between'} borderBottom='1px solid #c4c4c430' alignItems={'center'}>
                    <Show breakpoint='(min-width: 600px)'>
                        <SearchModule />
                    </Show>
                    <Flex gap='0.7rem'>
                        <IconButton onClick={toggleColorMode} icon={colorMode === 'light' ? <MdOutlineDarkMode/> : <MdOutlineLightMode/>}/>
                        <Show breakpoint='(max-width: 700px)'>
                            <IconButton onClick={onToggle} icon={<RiMenuFill/>}/>
                        </Show>
                    </Flex>
                </Flex>
            </Flex>
            <Flex height='100%' w='100%'>
                {
                    !isLargerThan700 ?
                    // mobile
                    isOpen && <Flex position='sticky' flexDirection={'column'} height='calc(100vh - 2.5rem - 51px )' justifyContent='flex-start' p={5} width='100vw'  borderRight='1px solid #c4c4c430'>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '1.5rem', paddingLeft: '1rem', borderLeft: '3px solid #c4c4c4'}}>
                        <pre style={{color: '#b4b4b4', fontSize: 'small'}}>Documentation Version: </pre><Badge size='lg' colorScheme='green'>BETA</Badge>
                    </div>
                    <Stack direction='column' w='100%' justifyContent='flex-start'>
                        <Accordion allowMultiple key={location.pathname} defaultIndex={sections.indexOf(location.pathname.split('/')[2])}>
                        {
                            sections.map((section_label, idx) => (

                                    <AccordionItem >
                                        <h2>
                                        <AccordionButton>
                                            <Box as="span" flex="1" textAlign='left'>
                                            {section_label}
                                            </Box>
                                            <TbLayoutNavbarExpand />
                                        </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4} >
                                            <Stack>

                                            {
                                                Object.keys(docs_tree[section_label]).map((label_link, idx) => (
                                                    <Link as={ReactRouterLink} w='100%' to={`${section_label}/${label_link}`}>
                                                        <Button colorScheme={location.pathname.includes(`${section_label}/${label_link}`) ? 'whatsapp' : 'gray'} justifyContent='space-between' size='sm' rightIcon={<TbExternalLink/>}>
                                                            {label_link.replaceAll('-', ' ')}    
                                                        </Button>
                                                    </Link>

                                                ))
                                            }
                                            </Stack>
                                        </AccordionPanel>
                                    </AccordionItem>
                                    
                                ))
                                
                            }
                    </Accordion>
                    </Stack>

                </Flex>
                    : 
                <Show breakpoint='(min-width: 700px)'>
                    <Flex flexDirection={'column'} height='calc(100vh - 2.5rem - 51px )' justifyContent='flex-start' p={5} width='clamp(250px,28vw, 360px)'  borderRight='1px solid #c4c4c430'>
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '1.5rem', paddingLeft: '1rem', borderLeft: '3px solid #c4c4c4'}}>
                            <pre style={{color: '#b4b4b4', fontSize: 'small'}}>Documentation Version: </pre><Badge size='lg' colorScheme='green'>BETA</Badge>
                        </div>
                        <Stack direction='column' w='100%' justifyContent='flex-start'>
                            <Accordion allowMultiple key={location.pathname} defaultIndex={Object.keys(docs_tree).indexOf(url_section)}>
                            {
                                sections.map((section_label, idx) => (

                                        <AccordionItem >
                                            <h2>
                                            <AccordionButton>
                                                <Box as="span" flex="1" textAlign='left'>
                                                {section_label}
                                                </Box>
                                                <TbLayoutNavbarExpand />
                                            </AccordionButton>
                                            </h2>
                                            <AccordionPanel pb={4} >
                                                <Stack>

                                                {
                                                    Object.keys(docs_tree[section_label]).map((label_link, idx) => (
                                                        <Link as={ReactRouterLink} w='100%' to={`${section_label}/${label_link}`}>
                                                            <Button colorScheme={location.pathname.includes(`${section_label}/${label_link}`) ? 'whatsapp' : 'gray'} justifyContent='space-between' size='sm' rightIcon={<TbExternalLink/>}>
                                                                {label_link.replaceAll('-', ' ')}    
                                                            </Button>
                                                        </Link>

                                                    ))
                                                }
                                                </Stack>
                                            </AccordionPanel>
                                        </AccordionItem>

                                        
                                    ))
                                    
                                }
                        </Accordion>
                        </Stack>

                    </Flex>
                </Show>
                }
                {
                    !isOpen &&
                <Flex flex={1} p={5} flexDirection={'column'}>
                    <Flex>
                        <IconButton isRound onClick={() => {navigator.clipboard.writeText(window.location.href);toast({description :'URL copied!', position: 'bottom-right', containerStyle: {fontSize: 'sm'}})}} size='sm' icon={<TbCopy />} />
                    <Breadcrumb spacing='8px' fontSize={'0.8rem'} width={'fit-content'} p='0.35rem 0.8rem' borderRadius={'100px'}  separator={<RiArrowRightSLine color='#59CE8F' />}>
                        <BreadcrumbItem>
                            <BreadcrumbLink as={ReactRouterLink} to='/docs'>Docs</BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbItem>
                            <BreadcrumbLink as={ReactRouterLink} to={`/docs/${url_section}`}>{url_section}</BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink as={ReactRouterLink} textTransform={'capitalize'}>{url_doc?.replaceAll('-', ' ')}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    </Flex>
                    <Heading variant='h1' fontWeight={'600'} m='1rem 0' mt='2.5rem' textTransform={'capitalize'} fontFamily={'Poppins'}>{url_doc?.replaceAll('-', ' ')}</Heading>
                    <div style={{margin: '1rem 0.8rem', fontFamily: 'Poppins', maxWidth: '900px', fontWeight: '500', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        {/* Add Outlet customly */}
                        <Suspense fallback={<p>Loading...</p>}>
                            {   
                                url_section && url_doc && createElement(docs_tree[url_section][url_doc], {key: url_section+'/'+url_doc})
                            }
                        </Suspense>
                    </div>
                    <FeedbackForm />
                    
                    {/* Descr */}
                </Flex>
                }
            </Flex>

        </PageTransition>

    )

}

// Load up descriptive components (LAZYily)
// so we are just loading the location/reference to that component, wi'll load whole entity when rendering required
const LazyLegalTerms = lazy(() => import('./components/docs/LegalTerms'));
const LazyLegalPolicy = lazy(() => import('./components/docs/LegalPolicy'));
const LazyHelpSocialLinking = lazy(() => import('./components/docs/HelpSocialLinking'));
const LazyGuidesWebSignIn = lazy(() => import('./components/docs/GuideWebSignIn'));
const LazyGuidesMakeFullProfile = lazy(() => import('./components/docs/GuideMakeFullProfile'));
const LazyBasicsEncryptionPromise = lazy(() => import('./components/docs/SecurityEncryptionPromise'))
const LazyHelpSignIn = lazy(() => import('./components/docs/HelpSignIn'))
const LazyBasicsAbout = lazy(() => import('./components/docs/BasicsAbout'))

export const docs_tree = {

    'Legal': {
        'terms-and-conditions': LazyLegalTerms,
        'policy': LazyLegalPolicy,
    },

    'Basics': {
        'about': LazyBasicsAbout,
    },

    'Security': {
        'encryption-promise': LazyBasicsEncryptionPromise,
    },

    'Help': {
        'sign-in': LazyHelpSignIn,
        'social-linking': LazyHelpSocialLinking,
    },

    'Guides': {
        'web-sign-in': LazyGuidesWebSignIn,
        'make-full-profile': LazyGuidesMakeFullProfile
    }

}

function is_valid_result(checker, val){
    val = val.replaceAll(' ', '');
    checker = checker.replaceAll('-', '');
    return checker.includes(val)
}

function SearchModule() {

    const [value, setValue] = useState([]);
    const [queryResults, setQueryResults] = useState([]);
    const searchInputRef = useRef(null);
    const {colorMode} = useColorMode();

    // Result windowed by max 5 ans. (links)
    const get_filtered_list = (currVal) => {

        // use .filter
        // fallback to top 5 docs link if no result is there
        let filtered_links = [];

        Object.entries(docs_tree).map((label_links, idx) => {
            Object.keys(label_links[1]).map((link) => {
                if(is_valid_result(link, currVal)){
                    filtered_links.push([label_links[0], link])
                }
            })
        })
        console.log(filtered_links)
        
        setQueryResults(filtered_links)

    }

    const key_to_focus_cb = (e) => {

        if(e.key === '/'){
            searchInputRef.current.focus();
        }

    }

    useEffect(() => {

        window.addEventListener('keyup', key_to_focus_cb)

        return () => {
            window.removeEventListener('keyup', key_to_focus_cb)
        }

    }, [])


    return (
            <Popover isOpen={value.length > 0} autoFocus={false} placement='bottom-start'>
            <PopoverTrigger >
                <Stack>
                    <InputGroup alignItems={'center'}>
                        <InputLeftElement
                        pointerEvents='none'
                        height='100%'
                        children={<RiSearchLine color='gray' size='1.2rem' />}
                        />
                        <Input value={value} onChange={(e) => {setValue(e.target.value);get_filtered_list(e.target.value);}} ref={searchInputRef} inputMode='search' fontSize={'0.9rem'} placeholder='Search docs...'  size='lg' />
                        <InputRightElement
                        pointerEvents='none'
                        height='100%'
                        children={<Kbd fontSize={'md'}>/</Kbd>}
                        />
                    </InputGroup>
                {/* <Button>Trigger</Button> */}
                </Stack>
            </PopoverTrigger>
            <PopoverContent >
                <PopoverBody >
                    <Stack spacing={'0'} alignItems={'center'}>

                        {   queryResults.length === 0 ? <b style={{fontSize: '0.8rem', color: '#b4b4b4'}}>No results found!</b>:
                            queryResults.map((lbl_lnk, idx) => (
                                
                                <Link _hover={{bgColor: colorMode === 'light' ? '#00000007' : '#ffffff07'}} display={'flex'} borderRadius={'8px'} padding={'10px'} flexDirection={'column'} onClick={() => {setValue('')}} key={idx} as={ReactRouterLink} br='8px'  w='100%' to={`${lbl_lnk[0]}/${lbl_lnk[1]}`}>
                                    {/* <Button colorScheme={location.pathname.includes(`${section_label}/${label_link}`) ? 'teal' : 'gray'} justifyContent='space-between' size='sm' rightIcon={<TbExternalLink/>}> */}
                                        <div style={{display: 'flex'}}>
                                            {lbl_lnk[1].replaceAll('-', ' ')}&nbsp;&nbsp; <TbExternalLink/>   
                                        </div>
                                        <div style={{display: 'flex', paddingLeft: '5px'}}>
                                            <div style={{border: `1px solid ${colorMode === 'light' ? '#00000050' : '#ffffff50'}`, width: '8px', height: '9px', borderBottomLeftRadius: '4px', borderTop: 'none', borderRight: 'none'}} />
                                            <small style={{opacity: '0.8', fontSize: '0.75rem', marginLeft: '2px'}}>{` ${lbl_lnk[0]}`}</small>
                                        </div>
                                    {/* </Button> */}
                                </Link>
                            ))
                        }
                    </Stack>
                </PopoverBody>
            </PopoverContent>
            </Popover>
    )

}

function FeedbackForm(){

    const [state, setState] = useState('initiate') // initiate | loading | submitted

    const submitFeedback = (e) => {
        // get value by (e.target.value)
        setState('loading');

        setTimeout(() => {
            setState('submitted');
        }, 2000)

    }

    return (
        // <Center mt='10%'>
        <>
            <br/>
            <Divider />
            <br/>
            <div style={{padding: '1rem', borderRadius: '10px', backgroundColor: '#ffd70009', width: 'fit-content'}}>

                <Flex gap='0.5rem' alignItems={'center'}>
                    <BiBoltCircle color='gold' size='1.5rem'/>
                    <small><b>Help us improve</b></small>
                </Flex>

                <Box mt='0.6rem' background={'Background'} borderRadius='10px' opacity={state === 'loading' ? 0.5 : 1} display={'flex'} p='0.5rem 1rem' width='fit-content' alignItems={'center'} shadow={'md'} gap='1.5rem'>
                    {
                        state === 'submitted' ? 
                        <b style={{color: 'green'}}>Thanks for feedback!</b>:
                        <>  

                            <span style={{fontSize: '0.8rem'}}>Was this doc. helpfull?</span>
                            <Flex gap='0.7rem'>
                                <IconButton isRound isDisabled={state === 'loading'} onClick={submitFeedback} value='helpfull' icon={<TbMoodHappy size='1.3rem' color='#57C5B6' />} />
                                <IconButton isRound isDisabled={state === 'loading'} onClick={submitFeedback} value='not-helpfull' icon={<TbMoodSad size='1.3rem' color='#EA5455' />} />
                            </Flex>
                        </>
                    }
                </Box>
            </div>
            </>
        // </Center>
    )

}