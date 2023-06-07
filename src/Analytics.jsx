import { Badge, Button, Center, Divider, Flex, Heading, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, StatNumber } from '@chakra-ui/react'
import React from 'react'
import ReachOutTitle from './components/ReachOutTitle'
import { Link as ReactLink } from 'react-router-dom'
import { Link } from '@chakra-ui/react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { IoMdArrowDropdown } from 'react-icons/io'
import StatsView from './components/analytic_views/StatsView'
import GraphView from './components/analytic_views/GraphView'
import GeoView from './components/analytic_views/GeoView'
import axios from './components/configs/customAxios'
import { FRONTEND_ROOT_URL } from './constants'
import { getCookie } from './components/configs/utils'

function Analytics() {

    const [mode, setMode] = React.useState('stats');
    const [permissionGranted, setPermissionGranted] = React.useState(false)

    React.useEffect(() => {

        if(getCookie('stale_authenticated') !== 'true'){
            // The top-level cookie not set, anyway considering user as un-authenticated
            window.location.href = `${FRONTEND_ROOT_URL}/signin?msg_code=required_signin`
        }else{
            axios.get('/api/user_check_perm?perms=has_unlocked_analytics').then((res) => {
            
                setPermissionGranted(true);
            }).catch((err) => {
                // must be un-authorized or un-authenticated
                if(err.response.status === 401){

                    window.location.href = `/signin?msg_code=required_signin`

                } else if(err.response.status === 403){

                    window.location.href = `/unlock_analytics`

                }
            })
        }

    }, [])

    if(!permissionGranted){
        return (
            <center style={{marginTop: '2rem'}}><b>Oi, hold on tight!🙃</b><br/><small>Checking permissions...</small></center>
        )
    }

  return (
    <Center>
        <div style={{width:"min(800px, 100vw)", padding: '0.5rem 1rem'}}>
            <Flex justifyContent='space-between' alignItems={'center'} m='1rem 0'>
                <ReachOutTitle>
                    <b style={{fontSize: '1.3rem'}}>Analytics</b>
                </ReachOutTitle>

                <Link as={ReactLink} href="/contact"><Button variant={'outline'} fontWeight='400' fontSize={'small'} rightIcon={<FaExternalLinkAlt size='0.7rem' />}>Contact</Button></Link>

            </Flex>
            <Divider />
            <br/>

            <Menu>
                <MenuButton size='sm' as={Button} rightIcon={<IoMdArrowDropdown />}>
                    Change Mode
                </MenuButton>
                <MenuList minWidth='240px'>
                    <MenuOptionGroup onChange={setMode} value={mode} type='radio'>
                        <MenuItemOption value='stats'> Stats</MenuItemOption>
                        <MenuItemOption value='graph'>Graph</MenuItemOption>
                        <MenuItemOption value='geo'>Geographical</MenuItemOption>
                    </MenuOptionGroup>
                </MenuList>
            </Menu>
            <br/>
            <br/>
            <br/>

            {
                mode === 'stats' ? <StatsView /> : mode === 'graph' ? <GraphView /> : <GeoView />
            }

        </div>
    </Center>
  )
}

export default Analytics
