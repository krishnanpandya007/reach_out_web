import { Button, Center, Container, Divider, Flex, Image, Link, Skeleton, SlideFade, useColorMode, useColorModeValue, useToast } from '@chakra-ui/react'
import {FiDownloadCloud} from 'react-icons/fi'
import {Link as ReactRouterLink} from 'react-router-dom'
import React from 'react'
import axios from './configs/customAxios';

const POST_PER_PAGE = 5;

function ProfileCardSection({ profiles, loadMoreProfiles }) {
    /*
    As an argument `loadMoreProfiles` CB should be wrapped inside useCallback hook to prevent current component re-render
    external factors should be handled outside this component ex.. Filter Profiles
    */

    const [loading, setLoading] = React.useState(false);
    const {colorMode} = useColorMode();

    React.useEffect(() => {setLoading(true);loadMoreProfiles().then(()=> {
        setLoading(false);
    })}, [])

    return (
    <>

    <Flex flexWrap="wrap" p={1} gap={'1rem'} alignItems='center' justifyContent='space-around'>
        {
            (profiles.length === 0) && (!loading) ? <div style={{padding: '3rem 1rem', width: '100%', border: '1px solid #c4c4c460', borderRadius: '10px', color: 'grey', display: 'grid', placeItems: 'center'}}><b>Oops!</b><small>No profiles to show...</small></div> :  profiles.map((profile) => (
                <SlideFade in key={profile.id}>
                    <ProfileCard {...profile} />
                </SlideFade> 
            ))
        } 
        {
            loading && [...Array(POST_PER_PAGE)].map((i, idx) => <Skeleton key={idx}><div style={{width: 'clamp(250px, 70vw, 350px)', aspectRatio: '2.1', marginBottom: '1rem'}} key={i} /></Skeleton>)
        }
    </Flex>
    <br/>
    {
        !loading && <Center><Button onClick={() => {setLoading(true);setTimeout(() => {setLoading(false)}, 3000)}} rightIcon={<FiDownloadCloud size={'18px'} color={colorMode === 'dark' ? 'white' : 'black'} />} fontSize='small'>Load More</Button></Center>
    }

    </>
  )
}

function ProfileCard({ id, profilePicUrl, reached, name, bio, socials }){
    const [isReached, setReached] = React.useState(reached);
    const toast = useToast();

    const logHit = async (mediaLabel) => {
      
        axios.post('/api/social/hitlog/', {tp_id: id, ts_label: mediaLabel})

    }

    const reachProfile = async (action) => {

        // make API call to update
        axios.get(`/api/profile/reach/${id}/?assert_action=${action}`).then((response) => {

            if(action === 'reach'){
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
                } else {
                    setReached(true); // Show ui for UnReach
                }
            } else if(action === 'un-reach'){
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
                } else {
                    setReached(false); //Asserting/Toggling 
                }
            }

        })


    }

    return (
        <Container as={ReactRouterLink} to={`/web/profile/${id}?back_path=${window.location.pathname}`} _hover={{cursor:'pointer'}} style={{display: 'flex', gap: '0.8rem',width: 'clamp(250px, 70vw, 350px)', border: '1px solid ' + useColorModeValue('#DCDCDC', '#87878740'), borderRadius: '10px', padding: '0.7rem', marginBottom: '1rem'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{width: 'max(6vw, 70px)', aspectRatio: '1',background: `url('${profilePicUrl}') 50% 50% no-repeat`, backgroundSize :'cover',borderRadius: '8px', boxShadow: 'box-shadow:0px 0px 5.3px rgba(0, 0, 0, -0.001),0px 0px 17.9px rgba(0, 0, 0, 0.02),0px 0px 80px rgba(0, 0, 0, 0.07);'}} />
                <Button onClick={() => {reachProfile(isReached ? 'un-reach' : 'reach')}} colorScheme={isReached ? 'red' : 'whatsapp'} variant={'outline'} size="sm" fontSize={'small'} w="100%" mt={2}>
                    {isReached ? 'Un Reach' : 'Reach In'}
                </Button>
            </div>
            <div style={{flex: '1', display: 'flex', flexDirection :'column', justifyContent :'flex-start'}}>
                <div style={{flex: '1', display: 'flex',flexDirection: 'column'}}>
                  <b style={{fontSize: '0.9rem', fontWeight: '600'}}>{name}</b>
                  <p style={{display: 'inline', fontSize: 'min(0.75rem, calc(0.4rem + 1vw))', lineHeight: '1rem', opacity: '0.7', fontWeight :'300'}}>{bio ?? 'No bio provided'}</p>
                </div> 
                <div style={{ display: 'flex', alignItems: 'center', margin: '0.3rem 0'}}>
                  <Divider />
                </div>
                <div style={{display: 'flex', gap: '10px', flexWrap :'wrap', alignItems: 'center', padding: '0.25rem 0'}}>

                    {
                        socials.length === 0 ? <b style={{color: '#c4c4c4', fontSize: '0.8rem'}}>&#8226; Peace &#8226;</b> : 
                        socials.map((social, idx) => {
                            return (<Link key={idx} onClick={() => {logHit(social['socialMedia'])}} href={social['profile_link']} isExternal style={{width: 'max(12%, 25px)'}}><Image _hover={{cursor: 'pointer'}} style={{width: 'max(12%, 25px)'}} src={`./social_logo/${social['socialMedia']}.png`} /></Link>)
                        })
                    }
                </div>
            </div>
        </Container>
    )

}

/*

import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: '~Day 1',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: '~Day 2',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: '~Day 3',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default class Example extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/simple-line-chart-kec3v';

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" label={{ value: 'Week days', offset: 20, position: 'top' }} />
          <YAxis tick={false} label={{ value: 'Impressions', angle: -90, position: 'center' }} />
          <Tooltip />
          <Legend verticalAlign="top" />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}


*/





export default ProfileCardSection