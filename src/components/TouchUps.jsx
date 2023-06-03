import { Flex, IconButton, Image, ScaleFade, useToast } from '@chakra-ui/react'
import React from 'react'
import { APP_URL } from '../constants'
import { UserInfoContext } from '../WebApp'

const touchUpsConfigs = {
    link_social: {
        title: 'Link all socials',
        descr: 'Let\'s make you social links engagive by linking it easily here!',
        // 'icon': Icons.sync_lock_sharp,
        redirect_route_name: `${APP_URL}/${'link/socials'}`,
        theme: '#8EC3B0' // For BG, use it with .withOpacity(0.2)
    },
    add_avatar: {
        title: 'Upload Profile Pic',
        descr: 'Grab best click of yourself, upload and get recognized!',
        // 'icon': Icons.cloud_upload_sharp,
        redirect_route_name: `${APP_URL}/${'customization'}`,
        theme: '#7895B2' // For BG, use it with .withOpacity(0.2)
    },
    add_bio: {
        title: 'Add Bio',
        descr: 'Tell what Identifies you. skills, profession, hobby, etc... (in-brief)',
        // 'icon': Icons.contact_emergency_sharp,
        redirect_route_name: `${APP_URL}/${'customization'}`,
        theme: '#865DFF' // For BG, use it with .withOpacity(0.2)
    }
}

function TouchUps({hideTouchUps}) {

    const {touch_ups: touchUps} = React.useContext(UserInfoContext);

    if(touchUps == null || touchUps == undefined){
        return (
            <></>
        )
    }

      return (
    
    <Flex m={'1.5rem 0.5rem'} gap='1rem' border={'2px solid #59CE8F50'} position='relative' p='0.8rem 1rem' borderRadius='10px'>

        <IconButton onClick={hideTouchUps} size={'sm'} style={{position: 'absolute', right: '0.5rem', top: '0.5rem'}} icon={
            <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M22.934 7.45367C23.5118 7.83147 23.674 8.60615 23.2962 9.18395L14.7962 22.184C14.5959 22.4904 14.2714 22.6934 13.9083 22.7398C13.5452 22.7862 13.18 22.671 12.9092 22.4248L7.40916 17.4248C6.89834 16.9604 6.8607 16.1699 7.32508 15.6591C7.78946 15.1482 8.58002 15.1106 9.09084 15.575L13.5061 19.5888L21.2038 7.81583C21.5816 7.23803 22.3562 7.07589 22.934 7.45367Z" fill="#59CE8F"/>
            </svg>
        } />

        <Image w={'80px'} h='80px' src="./assets/yo.png" fallbackSrc="https://via.placeholder.com/150" />

        <Flex flexDirection="column" >
            <h2 style={{fontWeight: '600', margin: '0.8rem 0 0.2rem 0'}}>Touch Ups</h2>
            <small style={{flex: '1', color: '#a4a4a4', marginBottom: '1.5rem', fontWeight: '300'}}>
                Open your app and finish these steps to make your profile 😎
            </small>
            {/* <div style=""></div> */}
        {/* <div style={{width: 'max(240px,40vw)'}}> */}
            <Flex gap={'0.8rem'}  flexWrap='wrap'>

            {
                touchUps.map((title) => {
                    return <ScaleFade key={title} in >
                        <TouchUpCard theme={touchUpsConfigs[title]['theme']} redirectionUrl={touchUpsConfigs[title]['redirect_route_name']} title={touchUpsConfigs[title]['title']} descr={touchUpsConfigs[title]['descr']} />
                    </ScaleFade>
                })
            }
            </Flex>
        </Flex>

    </Flex>

  )
}

function TouchUpCard({title, descr, theme, redirectionUrl}){

    const toast = useToast();

    const appLinkOpener = () => {
        // we try to open App on current OS
        let isMobile = window.orientation > -1;
        if(isMobile){

            window.location.href = redirectionUrl;
        } else {
            toast({
                title: 'Mobile Device required!',
                description: 'Make sure ReachOut app is installed there!',
                status: 'info',
                containerStyle: {
                    fontSize: 'small'
                },
                isClosable: true,
                variant: 'left-accent',
                position: 'bottom-right',
                // render: () => (<div>chodu</div>),
                duration: 4000
            })
        }
    }

    return (
        <button onClick={appLinkOpener} style={{padding: '5px', borderRadius: '10px', border: `2px solid ${theme}`, width: '200px' }}>
            <div style={{backgroundColor: theme + '20', borderRadius: '10px', padding: '0.5rem 0.8rem'}}>
                <b style={{color: theme, float: 'left', fontSize: 'clamp(12px, 3vw, 0.9rem)'}}>{title}</b>
                <br/>
                <p style={{fontSize: '0.6rem', textAlign: 'left', lineHeight: '2.2ch', marginTop: '0.2rem'}}>{descr}</p>
            </div>
        </button>
    )

}

export default TouchUps