import { Button, Flex, Heading, Alert, AlertDescription, Menu, useToast, MenuButton, MenuDivider, MenuItemOption, MenuList, MenuOptionGroup, Stack, Skeleton, Badge, AlertTitle } from '@chakra-ui/react'
import React from 'react'
import axios from '../configs/customAxios'
import {TbReload, TbFilter, TbArrowDownBar} from 'react-icons/tb'
import { LineChart, LabelList, Bar, Line, Label, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart } from 'recharts';
import { IoTimerOutline } from 'react-icons/io5';
import {RiArrowDropDownLine, RiAlertFill, RiPieChartLine} from 'react-icons/ri'


const week_duration_endpoints = {
  'week_1': [0, 7],
  'week_2': [7, 14],
  'week_3': [14, 21],
  'week_4': [21, 28],
}

const duration_colors = {
  'week_1': '#27E1C1',
  'week_2': '#E11299',
  'week_3': '#FFD966',
  'week_4': '#7AA874',
  'all_time': '#B2A4FF',
}

function GraphView() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [mode, setMode] = React.useState('Impressions')
  const [duration, setDuration] = React.useState(['week_4']) // week_4,week_3,week_1 | all_time
  const [chartMode, setChartMode] = React.useState('line') // line|bar
  const originalDataRef = React.useRef(null)
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState(null)
  
  const formatData = () => {
    if(originalDataRef.current === null){
      return
    }
    // originalDataRef = [{name: 'Day 1', score: 2}, {name: 'Day 2'}, {name: 'Day 3', score: 1}]
    if(duration.includes('all_time')){
      setData(originalDataRef.current);
    } else {
      let temp = [{name: 'Day 1'}, {name: 'Day 2'}, {name: 'Day 3'}, {name: 'Day 4'}, {name: 'Day 5'}, {name: 'Day 6'}, {name: 'Day 7'}]
      duration.map((week_code) => {

        originalDataRef.current.slice(week_duration_endpoints[week_code][0], week_duration_endpoints[week_code][1]).map((d, idx) => {
          if(typeof d.all_time !== 'undefined'){
            temp[idx+1][week_code] = d.all_time
          }
        })

      })

      console.log("My Temp", temp);

      setData(temp)
    }
  
  }  

  const loadData = () => {

    setIsLoading(true)

    axios.get(`/api/analytics/graph/?type=${mode.toLowerCase().replace(' ', '_')}`).then((res) => {

      setIsLoading(false);
      setError(null)
      console.log(res.data)
      // alert(!res.data['error'])

      if(res.status === 200){
        originalDataRef.current = res.data;
        formatData();
        // setStats(res.data);

      }
    }).catch((err) => {
      // console.log(err)
      setError(err.response.data.message)
      

    })


  }
  /*
  TODO: HANDLE ERROR
  */

  React.useEffect(formatData, [duration])

  React.useEffect(loadData, [mode]);

  return (
    <>
        <Flex justifyContent={'space-between'} alignItems='center'>

          <Heading variant={'h2'} style={{borderLeft: '5px solid #73E0A6', paddingLeft: '0.8rem', fontFamily: 'Poppins'}} position='relative'>Graphs<Badge colorScheme='green' position={'absolute'} bottom='-1.5rem' left='0.5rem'>{mode}</Badge></Heading>
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
                    <MenuItemOption value='Impressions'>Impressions</MenuItemOption>
                    <MenuItemOption value='Profile Views'>Profile Views</MenuItemOption>
                    <MenuItemOption value='Reports'>Reports</MenuItemOption>
                  </MenuOptionGroup>
                </MenuList>
              </Menu>

              <Menu closeOnSelect={false}>
                <MenuButton size='sm' isDisabled={error !== null} rightIcon={<IoTimerOutline size='1.2rem'/>} as={Button}>
                  Duration
                </MenuButton>
                <MenuList minWidth='240px'>
                  <MenuOptionGroup value={duration} onChange={(vals) => {setDuration(vals[vals.length-1] === 'all_time' ? ['all_time'] : vals.filter(x => x!== 'all_time'))}} type='checkbox'>
                    <MenuItemOption value='week_4'>Current Week</MenuItemOption>
                    <MenuItemOption value='week_3'>Week 3</MenuItemOption>
                    <MenuItemOption value='week_2'>Week 2</MenuItemOption>
                    <MenuItemOption value='week_1'>Week 1</MenuItemOption>
                  <MenuDivider />
                    <MenuItemOption value='all_time'>All time</MenuItemOption>                                          
                  </MenuOptionGroup>
                </MenuList>
              </Menu>

              <Menu >
                <MenuButton size='sm' rightIcon={<RiPieChartLine size='1.2rem'/>} as={Button}>
                  Chart Type
                </MenuButton>
                <MenuList minWidth='240px'>
                  <MenuOptionGroup value={chartMode} onChange={setChartMode} type='radio'>
                    <MenuItemOption value='line'>Line View</MenuItemOption>
                    <MenuItemOption value='bar'>Bar View</MenuItemOption>
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
        </Stack>
        <br/>
        <br/>
        <br/>
        {
          error !== null ? <Alert
          status='warning'
          variant='top-accent'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          textAlign='center'
          height='200px'
        >
          <RiAlertFill size='2rem' color='orange' />
          <AlertTitle mt={4} mb={1} fontSize='lg'>
            Oops!
          </AlertTitle>
          <AlertDescription maxWidth='md'>
            {error}
          </AlertDescription>
        </Alert> : isLoading ? 
        <Skeleton><div style={{height: '60vh', width: '100%'}} /></Skeleton>
        : 
      <ResponsiveContainer width="100%" height={400}>
        {
          chartMode === 'bar' ? 
          <BarChart 
          width={500}
          height={300} 
          data={data} 
          fontSize='0.8rem'
          margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name">
            <Label value="Duration" offset={0} position="insideBottom" />
          </XAxis>
          <YAxis label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
          {
            duration.map((dur_code, idx) => (
              <Bar key={idx} dataKey={dur_code} fill={duration_colors[dur_code]}>
                {/* <LabelList dataKey="name" position="top" /> */}
              </Bar>
            ))
          }
        </BarChart>
          :
        <LineChart
          width={500}
          height={300}
          data={data}
          fontSize='0.8rem'
          margin={{
            top: 5,
            right: 30,
            // left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          {/* Add expanded version by opening <Modal/> */}
          <Label value="Duration" offset={0} position="insideBottom" />
          <YAxis label={{ value: 'Score', angle: -90, left: '50', position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {duration.map((dur_code, idx) => (
            <Line connectNulls key={idx} type="monotone" dataKey={dur_code} stroke={duration_colors[dur_code]} activeDot={{ r: 8 }} />
          ))}
          {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        </LineChart>
        }
      </ResponsiveContainer>
      }
    </>
  )
}

export default GraphView