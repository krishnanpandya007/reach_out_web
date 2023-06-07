import { Button, Flex, Heading, Alert, AlertIcon, Menu, useToast, MenuButton, MenuDivider, MenuItemOption, MenuList, MenuOptionGroup, Stack, Skeleton, Badge, AlertTitle } from '@chakra-ui/react'
import React from 'react'
import axios from '../configs/customAxios'
import {TbReload, TbMap2, TbArrowDownBar} from 'react-icons/tb'
import {RiMapPin3Fill, RiArrowDropDownLine} from 'react-icons/ri'
import { Map, Marker } from "pigeon-maps"
import { stamenTerrain, stamenToner } from 'pigeon-maps/providers'
import ErrorBoundry from '../configs/ErrorBoundry'
import { socials } from '../../constants'

const social_colors = {

  Instagram: 'hotpink',
  Snapchat: 'yellow',
  Facebook: 'deepskyblue',
  LinkedIn: 'blue',
  Discord: 'skyblue',
  Reddit: 'red'

}

function GeoView() {

  const [isLoading, setIsLoading] = React.useState(true)
  const [mode, setMode] = React.useState('profile_views'); // profile_views/reports/SocialTaps
  const [graphMode, setGraphMode] = React.useState('default'); // default/terrain/toner
  const [data, setData] = React.useState(null);
  const toast = useToast();

  const loadData = () => {

    setIsLoading(true)

    axios.get(`/api/analytics/geo/?type=${mode}`).then((res) => {

      setIsLoading(false);
      // setError(null)
      console.log(res.data)
      // alert(!res.data['error'])

      if(res.status === 200){
        // originalDataRef.current = res.data;
        // formatData();
        setData(res.data);

      }
    }).catch((err) => {
      
      // console.log(err)
      // setError(err.response.data.message)
      toast({
        descr: 'Unable to fetch locations! try again after sometime.',
        status: 'error',
        variant: 'top-accent'
      })

    })


  }

  React.useEffect(loadData, [mode]);


  return (
    <>
      <Flex justifyContent={'space-between'} alignItems='center'>

        <Heading variant={'h2'} style={{borderLeft: '5px solid #73E0A6', paddingLeft: '0.8rem', fontFamily: 'Poppins'}} position='relative'>Geograph<Badge colorScheme='green' position={'absolute'} bottom='-1.5rem' left='0.5rem'>{mode}</Badge></Heading>
        <Stack direction={'row'}>
            

            <Button size='sm' isDisabled={isLoading} onClick={loadData} rightIcon={<TbReload size='1rem' />}>Reload</Button>
        </Stack>
      </Flex>
      <Stack direction='row' mt='3rem'>
        <Menu >
                <MenuButton size='sm' rightIcon={<RiArrowDropDownLine size='1.2rem'/>} as={Button}>
                  Action
                </MenuButton>
                <MenuList minWidth='240px'>
                  <MenuOptionGroup value={mode} onChange={setMode} type='radio'>
                    <MenuItemOption value='social_taps'>Social Taps</MenuItemOption>
                    <MenuItemOption value='profile_views'>Profile Views</MenuItemOption>
                    <MenuItemOption value='reports'>Reports</MenuItemOption>
                  </MenuOptionGroup>
                </MenuList>
              </Menu>

              <Menu >
                <MenuButton size='sm' rightIcon={<TbMap2 size='1.2rem'/>} as={Button}>
                  Map theme
                </MenuButton>
                <MenuList minWidth='240px'>
                  <MenuOptionGroup value={graphMode} onChange={setGraphMode} type='radio'>
                    <MenuItemOption value='default'>Default</MenuItemOption>
                    <MenuItemOption value='terrain'>Terrain</MenuItemOption>
                    <MenuItemOption value='toner'>Toner</MenuItemOption>
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
        </Stack>
      <br/>
      <Badge>COORDINATES VIEW</Badge>
      <br/>
      <br/>
      <Alert status='info' borderRadius='8px'>
        <AlertIcon />
        <small>Below mentioned locations are not accurate.</small>
      </Alert>
      <br/>
      <ErrorBoundry>

        <Map height={400} provider={graphMode === 'terrain' ? stamenTerrain: graphMode === 'toner' ? stamenToner : null } key={isLoading} defaultCenter={mode === 'social_taps' && !isLoading ? Object.values(data)[0][0] : data?.cor?.length ?? -1 > 0 ? data.cor[0] : [7, 4]} defaultZoom={13}>
          { mode === 'social_taps' && !isLoading ? 
            Object.entries(data).map((social_cors) => {
              return social_cors[1].map((cor, idx) => {
                
                  return (
                  
                    <Marker key={`${social_cors[0]}-${idx}`} anchor={cor}>
                      <RiMapPin3Fill size='30px' color={social_colors[social_cors[0]]} />
                    </Marker>
      
    
                  )
              } )
            })
            :
            data?.cor?.map((lat_lon, idx) => (

            <Marker key={idx} anchor={lat_lon}>
              <RiMapPin3Fill size='30px' color='green' />
            </Marker>
            ))
          }
        </Map>
      </ErrorBoundry>
      {
        mode === 'social_taps' && 
          <Stack direction='row'>

              {
                Object.entries(social_colors).map((label_color, idx) => {
                  return (
                    <Flex key={idx} style={{marginRight: '1rem', fontSize: 'small'}}>
                        <div style={{backgroundColor: label_color[1], width: '15px', height: '15px', borderRadius: '40px', marginRight: '0.5rem'}} />
                        {label_color[0]}
                    </Flex>
                  )
                } )
              }

          </Stack>
      }
    </>
  )
}

export default GeoView