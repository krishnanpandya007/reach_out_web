import { Alert, AlertIcon, Badge, Box, Button, Flex, Heading, SimpleGrid, Skeleton, Stack, Table, TableCaption, TableContainer, Tag, Tbody, Td, Text, Tfoot, Th, Thead, Tr, useToast } from '@chakra-ui/react'
import React from 'react'
import { IoFilter, IoReload, IoReloadCircle } from 'react-icons/io5'
import {MdFilterAlt} from 'react-icons/md'
import {TbReload, TbFilter} from 'react-icons/tb'
import {HiSparkles, HiEye, HiBookmark} from 'react-icons/hi2'
import {HiThumbDown} from 'react-icons/hi'
import axios from '../configs/customAxios'


function StatsView() {

  const [isLoading, setIsLoading] = React.useState(true)
  const [stats, setStats] = React.useState(null)
  const toast = useToast();

  const loadData = () => {

    setIsLoading(true)

    axios.get('/api/analytics/stats/').then((res) => {

      setIsLoading(false);

      if(res.status === 200){

        setStats(res.data);

      } else {
        toast({
          description: 'Unable to retrive analytics stats!',
          status: 'error',
          variant: 'left-accent'
        })
      }

    })


  }
  
  React.useEffect(loadData, [])

  return (
    <>
        <Flex justifyContent={'space-between'}>

            <Heading variant={'h2'} style={{borderLeft: '5px solid #73E0A6', paddingLeft: '0.8rem', fontFamily: 'Poppins'}}>Stats</Heading>
            <Stack direction={'row'}>
                {/* <Button rightIcon={<TbFilter />}>Filter</Button> */}
                <Button isDisabled={isLoading} onClick={loadData} rightIcon={<TbReload size='1rem' />}>Reload</Button>
            </Stack>
        </Flex>
        <br/>
        <br/>
        {isLoading ? <Skeleton><div style={{height: '60vh', width: '100%'}} /></Skeleton> : 
          <>
            <Badge letterSpacing={1} variant={'outline'}>PRIMARY STATS</Badge>
            <SimpleGrid columns={2} mt={5} spacingX='40px' spacingY='20px' maxWidth={'450px'}>
              <StatCard title={'IMPRESSIONS'} score={stats?.impressions.total} color={'#000000'} monthly={stats?.impressions.this_month} bg_icon={<HiSparkles size={'2.5rem'} color='#F7DB6A60' />} />
              <StatCard title={'PROFILE VIEWS'} score={stats?.profile_views.total} color={'#000000'} monthly={stats?.profile_views.this_month} bg_icon={<HiEye size={'2.5rem'} color='#59CE8F40' />} />
              <StatCard title={'REPORTS'} score={stats?.reports.total} color={'#FC2947'}  bg_icon={<HiThumbDown size={'2.5rem'} color='#FF646440' />} />
              <StatCard title={'BOOKMARKERS'} score={stats?.bookmarkers} color={'#362FD9'} bg_icon={<HiBookmark size={'2.5rem'} color='#2192FF40' />} />

            </SimpleGrid>
            <br/>
            <br/>
            <Badge letterSpacing={1} variant={'outline'}>SOCIAL STATS</Badge>
            <br/>
            <br/>
            {
              Object.keys(stats.social_stats).length === 0 ? <i>Link social first to see their clicks/hits here.🤙</i> : 
            <TableContainer>
              <Table variant='simple' maxWidth={'max-content'}>
                <TableCaption>shows number of clicks on your profile card</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Social Media</Th>
                    <Th isNumeric>Hits/Clicks</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {
                    Object.keys(stats.social_stats).map((mediaName, idx) => {

                      return (<Tr key={idx}>
                        <Td>{mediaName}</Td>
                        <Td isNumeric>{stats.social_stats[mediaName]}</Td>
                      </Tr>)
                    })
                  }
                </Tbody>
                
              </Table>
            </TableContainer>
          }
          {
            stats.extracted_tags.length > 0 &&
            <> 
            <br/>
            <br/>
            <Badge letterSpacing={1} variant={'outline'}>EXTRACTED TAGS</Badge>
            <br/>
            <br/>
            <Alert status='info' borderRadius={'8px'}>
              <AlertIcon/>
              <div>

              <b>Note</b><br/>
              These keyword(s) are extracted from your bio. to regenerate it, update bio accordingly!
              </div>
            </Alert>
            <br/>
            {stats.extracted_tags.map((val, idx) => {
              return(
                <Tag colorScheme={'whatsapp'} borderRadius='full' key={idx} mr='1rem'>
                  {val}
                </Tag>
              )
            })}
            </>
          }
          <br/>
          <br/>
          <br/>
            {
              !stats.email_verified || !stats.phone_verified && 
            <Badge letterSpacing={1} variant={'outline'}>ALERTS</Badge>
            }
            <br/>

            {
              stats.email_verified && 
              <Alert fontSize={'small'} mt='1rem' borderRadius={'8px'} status='warning'>
                <AlertIcon />
                <p >Your Email is not verified yet, in order to verify it kindly login using email from App.</p>
              </Alert>
            }
            {
              !stats.phone_verified && 
              <Alert fontSize={'small'} mt='1rem' borderRadius={'8px'} status='warning'>
                <AlertIcon />
                Your PhoneNo. is not verified yet, in order to verify it kindly login using Phone No. from App.
              </Alert>
            }



          </>
        }

    </>
  )
}

function StatCard({title, score, color, bg_icon, monthly=null}){

  return (
    <Box width='auto' bg style={{ padding: '1px', backgroundColor: `${color}15`, borderRadius: '15px' }}>

      <div style={{ padding: '1rem 1.3rem', position: 'relative', paddingRight: '1rem', borderRadius: '15px', background: 'white' }}>

        <b style={{ borderRadius: '15px', color: `${color}60`, fontSize: '0.85rem', marginBlock:"2rem" }}>{title}</b>

        <Heading variant={'h3'} style={{fontFamily: 'Poppins', color: color}}>{score}</Heading>

        <div style={{position: 'absolute', right: '1rem', bottom: '10px'}}>
          {bg_icon}
        </div>        

      </div>
      {
        monthly !== null ?  <span style={{marginLeft: '1rem', fontSize :'0.75rem'}}>This month: <Text as='b'fontSize={'0.8rem'}> +{monthly}</Text></span>:null
      }
    </Box>

  )

}

export default StatsView

// TODO: Make Alerts