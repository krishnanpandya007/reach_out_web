import { useRef, useEffect, useState } from "react";
import axios from "./components/configs/customAxios";
import { BACKEND_ROOT_URL, FRONTEND_ROOT_URL, base_json_header } from "./constants";
import ReachoutTitle from './components/ReachOutTitle'
import {Heading, Flex, Button, Stack, Badge, Center, useColorMode, Link, ButtonGroup, Tooltip} from '@chakra-ui/react'
import ReachOutTitle from "./components/ReachOutTitle";
import { getCookie } from './components/configs/utils'
import {useCallback} from 'react'
import {BsArrowRight, BsLinkedin, BsTwitter} from 'react-icons/bs'
import {GrDocumentText} from 'react-icons/gr'
import {AnimatePresence, motion} from 'framer-motion'
import {TbBrandAndroid, TbWorld} from 'react-icons/tb'
import {IoEarth, IoLogoApple, IoLogoGooglePlaystore} from 'react-icons/io5'
import { AiFillApple, AiFillAndroid } from 'react-icons/ai'
import PageTransition from "./components/configs/PageTransition"
import {BaseHeader} from './components/Header' 
// import Particles from 'react-tsparticles';
// import { loadFull } from "tsparticles";
/*
ENSURE LIGHT MODE HERE.
HEADER SHOW ON SCROLL DOWN
*/
export default function Home() {
  const {colorMode, toggleColorMode} = useColorMode();
  // useEffect(() => {
  //   // If below dark mode checking gives error, try directly cheking item from localStorage 
  //   if(colorMode === 'dark'){
  //     toggleColorMode()
  //   }
  // }, [])
  return (
    <PageTransition>
      <HomeHeader />
      <Hero />
      
      {/* Features */}
        <HomeFeatures />
        <HomeContent />

      <Footer />
    </PageTransition>
    
  )

}

function HomeHeader() {

  const checkIsAuthenticated = () => {

    if(getCookie('stale_authenticated') !== 'true'){
      return false;
    }

    return true;

  }

  const isAuthenticated = checkIsAuthenticated();

  

  // }, [appRef.current]);
  
  return (
    <BaseHeader style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '1.5rem', backgroundColor: 'Background'}}>
      <ReachOutTitle imgStyle={{width: '40px', height: '40px'}}>
        <small>ReachOut</small>
      </ReachOutTitle>
      

      <a href={`${FRONTEND_ROOT_URL}/${isAuthenticated ? 'web' : 'signin'}`}>
        <Button variant='outline' rightIcon={<BsArrowRight size={'15px'} />} fontWeight={300} fontSize={'0.8rem'} p={"0 2.3rem"} borderRadius={'100px'}>
          {isAuthenticated ? 'Web App' : 'Sign In'}&nbsp;
        </Button>
      </a>
    </BaseHeader>
  )

}

function Hero() {
  const {colorMode} = useColorMode()

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '60vh', position: 'relative' , backgroundColor: '#00DFA2'}}>
      <svg style={{position: 'absolute', bottom: '0'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill={colorMode === 'light' ? "transparent" : "transparent"} fillOpacity="1" d="M0,192L720,288L1440,224L1440,320L720,320L0,320Z"></path></svg>
      <motion.div animate={{rotateX: '0deg', scale: 1, borderWidth: '3px', opacity :'1', lineHeight: '3rem', translateY: '0px', rotateZ: '0deg'}} transition={{duration: 0.8}} initial={{rotateX: '0deg', translateY: '100px', rotateZ: '6deg', borderWidth :'1px', lineHeight :'6.5rem', scale :'1.2'}} style={{border: '5px solid white', textAlign :'center', color: 'white', borderRadius: '5px', padding: '2rem 3rem', width: 'fit-content', background: '#00DFA2', position: 'relative'}}>
        {/* Left */}
        <div style={{position: 'absolute', border: '2px dashed white', right: '100%', width: 'calc(50vw - 50% - 12px)'}}/>
        <div style={{position: 'absolute', backgroundColor: '#00DFA2', border: '3px solid white', left: '-13px', top: '20px', borderRadius :'100px', width: '25px', height: '25px', display :'grid', placeItems: 'center', }}><div style={{height: '10px', width: '10px' , backgroundColor :'white', borderRadius: '100px'}} /></div>
        {/* Right */}
        <div style={{position: 'absolute', border: '2px dashed white', left: '100%', width: 'calc(50vw - 50% - 12px)',bottom: '30px' }}/>
        <div style={{position: 'absolute', backgroundColor: '#00DFA2', border: '3px solid white', right: '-13px', bottom: '20px', borderRadius :'100px', width: '25px', height: '25px',display :'grid', placeItems: 'center' }}><div style={{height: '10px', width: '10px' , backgroundColor :'white', borderRadius: '100px'}} /></div>
        {/* Bottom */}
        <div style={{position: 'absolute', border: '2px dashed white', top: '100%', height: 'calc(30vh - 50%)'}}/>
        <div style={{position: 'absolute', backgroundColor: '#00DFA2', border: '3px solid white', bottom: '-13px', left: '37px', borderRadius :'100px', width: '25px', height: '25px',display :'grid', placeItems: 'center' }}><div style={{height: '10px', width: '10px' , backgroundColor :'white', borderRadius: '100px'}} /></div>
        {/* Top */}
        <div style={{position: 'absolute', border: '2px dashed white', bottom: '100%', right: '32px', height: 'calc(30vh - 50%)', }}/>
        <div style={{position: 'absolute', backgroundColor: '#00DFA2', border: '3px solid white', right: '20px', top: '-13px', borderRadius :'100px', width: '25px', height: '25px',display :'grid', placeItems: 'center' }}><div style={{height: '10px', width: '10px' , backgroundColor :'white', borderRadius: '100px'}} /></div>


        <h2 style={{fontSize: '2.1rem', fontWeight: 'bolder'}}>Sync all socials,</h2>
        <h2 style={{fontSize: '2.1rem', fontWeight: 'bolder'}}>at one place.</h2>
      </motion.div>
    </div>
  )

}

function HomeFeatures() {

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream; // Referenced from stackoverflow.com :D
  const isAndroid = /windows phone|android/i.test(navigator.userAgent); // Referenced from stackoverflow.com :D

  const {colorMode} = useColorMode()

  const currentDevice = isIOS ? 'ios' : isAndroid ? 'android' : 'web'

  const [viewDevice, setViewDevice] = useState(currentDevice);

  return (
    <BodyPart>
      <Flex gap='3rem' flexWrap={'wrap'} width='min(60%, 480px)' alignItems={'flex-start'} justifyContent={'space-between'} textAlign={currentDevice === 'web' ? 'left' : 'center'}>
        <div>
          <BodyCaption text={'Platform'} />

          <ButtonGroup style={{marginTop: '2rem'}}>

            <Button p='0 !important' onClick={()=> {setViewDevice('android')} } borderRadius={'100px'} isActive={viewDevice === 'android'} _active={{backgroundColor: '#0BB65A20'}}>
              <AiFillAndroid size='25px' />
            </Button>

            <Button p='0 !important' onClick={()=> {setViewDevice('ios')} } isActive={viewDevice === 'ios'} _active={{backgroundColor: '#0BB65A20'}} borderRadius={'100px'}>
              <AiFillApple size='25px' />
            </Button>

            <Button p='0 !important' onClick={()=> {setViewDevice('web')} } isActive={viewDevice === 'web'} _active={{backgroundColor: '#0BB65A20'}} borderRadius={'100px'}>
              <TbWorld size='25px' />
            </Button>

          </ButtonGroup>
        </div>
          <Flex flexDirection={'column'} gap='1.6rem'>
          <AnimatePresence mode="wait">
            {
             viewDevice === 'android' &&  
              <motion.div key="android" initial={{translateY: '20px', opacity: 0}} transition={{type: 'tween'}} animate={{ translateY: 0, opacity: 1 }} exit={{ translateY: -20, opacity: 0 }} style={{fontSize: '1.2rem', fontWeight :'700'}}>
                Android
              </motion.div>

            }

            {
             viewDevice === 'ios' &&  
              <motion.div key="ios" initial={{translateY: '20px', opacity: 0}} transition={{type: 'tween'}} animate={{ translateY: 0, opacity: 1 }} exit={{ translateY: -20, opacity: 0 }} style={{fontSize: '1.2rem', fontWeight :'700'}}>
                Ios
              </motion.div>

            }

            {
              viewDevice === 'web' &&  
              <motion.div key="web" initial={{translateY: '20px', opacity: 0}} transition={{type: 'tween'}} animate={{ translateY: 0, opacity: 1 }} exit={{ translateY: -20, opacity: 0 }} style={{fontSize: '1.2rem', fontWeight :'700'}}>
                Web
              </motion.div>

            }
            </AnimatePresence>


            <AnimatePresence mode="wait">
            {
             viewDevice === 'android' &&  
              <motion.div key="android" initial={{translateX: '20px', opacity: 0}} transition={{type: 'tween'}} animate={{ translateX: 0, opacity: 1 }} exit={{ translateX: -20, opacity: 0 }} style={{maxWidth :'250px', color: '#a2a2a2', fontSize: '0.9rem', display: 'inline-block'}}>
              Android ipsum dolor sit amet consectetur adipisicing elit. Sunt, ad.
              <br/>
              <br/>
              <Tooltip label='Comming soon'>
                <Button isDisabled variant={'outline'} color={colorMode === 'dark' ? 'white' : 'black'} fontSize={'0.8rem'} fontWeight={'300'} rightIcon={<IoLogoGooglePlaystore size={'15px'}/>}>
                  Get at playstore
                </Button>
              </Tooltip>
              </motion.div>

            }

            {
             viewDevice === 'ios' &&  
              <motion.div key="ios" initial={{translateX: '20px', opacity: 0}} transition={{type: 'tween'}} animate={{ translateX: 0, opacity: 1 }} exit={{ translateX: -20, opacity: 0 }} style={{maxWidth :'250px', color: '#a2a2a2', fontSize: '0.9rem', display: 'inline-block'}}>
              Ios ipsum dolor sit amet consectetur adipisicing elit. Sunt, ad.
              <br/>
              <br/>
              <Tooltip label='Comming soon'>
                <Button isDisabled variant={'outline'} fontSize={'0.8rem'} color={colorMode === 'dark' ? 'white' : 'black'} fontWeight={'300'} rightIcon={<IoLogoApple size={'15px'}/>}>
                  Direct Download
                </Button>
              </Tooltip>
              </motion.div>

            }

            {
              viewDevice === 'web' &&  
              <motion.div key="web" initial={{translateX: '20px', opacity: 0}} transition={{type: 'tween'}} animate={{ translateX: 0, opacity: 1 }} exit={{ translateX: -20, opacity: 0 }} style={{maxWidth :'250px', color: '#a2a2a2', fontSize: '0.9rem', display: 'inline-block'}}>
              Web ipsum dolor sit amet consectetur adipisicing elit. Sunt, ad.
              <br/>
              <br/>
              <a href={`${FRONTEND_ROOT_URL}/web`}>
                <Button variant={'outline'} fontSize={'0.8rem'} fontWeight={'300'} color={colorMode === 'dark' ? 'white' : 'black'} rightIcon={<IoEarth size={'15px'}/>}>
                  Continue on web
                </Button>
              </a>
              </motion.div>

            }
            </AnimatePresence>

          </Flex>
      </Flex>
    </BodyPart>
  )

}

function HomeContent() {

  return (
    <>
    <BodyPart>
      <Flex flexWrap='wrap' width={'min(60%, 500px)'} justifyContent={'space-between'} gap='2rem'>
        <Flex flexDirection={'column'} width='max(38%, 260px)'>
          <BodyCaption text={<p>Why ReachOut?</p>} />
          <b style={{fontWeight: '300', fontSize: '0.9rem', marginTop: '1.6rem', display: 'block', color: '#6c6c6c'}}>Place where you can find all socials of people who have linked their socials already.
          <br/>
          <br/>Learn more at <a href={`${FRONTEND_ROOT_URL}/docs/Basics/about`} style={{textDecoration: 'underline'}}>About us.</a></b>
        </Flex>
        <div>

        <img width={150} height={150} src='/qr_to_socials.gif' />
        </div>
      </Flex>
    </BodyPart>

    <BodyPart>
      <Flex flexWrap='wrap' gap='4rem' width={'min(70%, 500px)'}>
      <BodyCaption style={{width: 'min(60%, 450px)'}} text={<p>Features</p>} />
        <Flex gap='2rem'>
          <FeatureCard imgSize={150} imgSrc={'/assets/engagive_logo.png'} caption={'ENGAGIVE'} />
          <p style={{fontSize :'0.8rem',color: '#6c6c6c'}}>This platform has given social media effect to make it more engagive for you, recommending your possible friends or people you may know.<br/><br/> Connect their all socials to being updated about them fully!</p>
        </Flex>
        <Flex gap='2rem'>
          <p style={{fontSize :'0.8rem', color: '#6c6c6c'}}>Your Social Information is being synced frequently, keeping the info safe from stale states.<br/><br/> You can also choose your profile pics from on of your linked socials :D</p>
          <FeatureCard imgSize={80} imgSrc={'/assets/social_sync_logo.png'} caption={'SOCIAL SYNC'} />
        </Flex>
        <Flex gap='2rem'>
          <FeatureCard imgSize={80} imgSrc={'/assets/profile_analytics_logo.png'} caption={'PROFILE ANALYTICS'} />
          <p style={{fontSize :'0.8rem', color: '#6c6c6c'}}>This is pre-beta feature, yet to release.View your profile stats by unlocking analytics feature!,<br/> View plans <a href={`${FRONTEND_ROOT_URL}/unlock_analytics`} style={{textDecoration: 'underline', fontWeight: 'bold'}}>here</a></p>
          {/* <p style={{fontSize :'0.8rem', color: '#6c6c6c'}}>This is pre-beta feature, yet to release. You can view all analytics done on your profile such as views, engagements, reports etc... (numerically & visually)</p> */}
        </Flex>

      </Flex>
    </BodyPart>

    <BodyPart>
      <Flex flexWrap='wrap' gap='4rem' width={'min(70%, 500px)'}>
        <BodyCaption style={{width: 'min(60%, 450px)'}} text={<p>Updates</p>} />
        
        <b style={{fontWeight: '300', marginTop: '-2rem', marginLeft: '1.2rem', fontSize: '0.9rem', display: 'block', color: '#6c6c6c'}}>We’ll always update our docs for upcoming changes or future patch releases. connect our socials for regular updates/news/upcoming events.</b>

        <ButtonGroup>
          <a target="_blank" href="https://twitter.com/krishnan_pandya">
            <Button borderRadius={'0px'} variant={'outline'}><BsTwitter size='20px'/></Button>
          </a>
          <a target="_blank" href="https://www.linkedin.com/company/reachoutconnects/">
            <Button borderRadius={'0px'} variant={'outline'}><BsLinkedin size='20px'/></Button>
          </a>
            <a target="_blank" href={`${FRONTEND_ROOT_URL}/docs/Basics/about`}>
              <Button borderRadius={'0px'} variant={'outline'} gap='0.8rem' fontSize={'0.8rem'}>Surf Docs<GrDocumentText size='20px'/></Button>
            </a>
        </ButtonGroup>

      </Flex>
    </BodyPart>

    </>
  )
}

function BodyPart({children}) {

  return (
    <div style={{width: '100%', margin: '20vh 0',display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
      {children}
    </div>
  )

}

function BodyCaption({text, style}) {
  return (

    <caption style={{borderLeft: '1px solid #BDBDBD', display: 'flex', textOverflow: 'initial', position: 'relative', paddingLeft: '1.2rem', color: '#0BB65A', fontSize :'1.1rem', fontWeight: '200', ...style}}>
      <div style={{position: 'absolute', right: '100%', top: '0.75rem', width: '100vw', borderTop: '1px solid #BDBDBD'}}/>
      {text}
    </caption>

  )
}

function FeatureCard({ imgSrc, imgSize, caption }) {

  return (

    <div style={{whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', gap:'0.5rem', alignItems :'center', justifyContent :'center'}}>
      <img width={`${imgSize}px`} height={`${imgSize}px`} src={imgSrc} />
      <p>{caption}</p>
    </div>

  )

}

function Footer() {

  return (

    <Flex justifyContent='space-between' backgroundColor={'#59CE8F'} alignItems={'center'} padding={'1rem'}>
      <div style={{display: 'flex', gap: '1rem'}}>
        <a href={`${FRONTEND_ROOT_URL}/contact`}>
          <Button borderRadius={'100px'} variant={'outline'} fontSize={'0.9rem'} _hover={{backgroundColor: '#00000020'}} color='white' fontWeight={'400'}>Contact Us</Button>
        </a>
        <a href="mailto:server.reachout@gmail.com">
          <Button borderRadius={'100px'} variant={'outline'} fontSize={'0.9rem'} _hover={{backgroundColor: '#00000020'}} color='white' fontWeight={'400'}>E-mail</Button>
        </a>
      </div>

      <b style={{color: 'white'}}>ReachOut &copy; 2023</b>
    </Flex>

  )

}