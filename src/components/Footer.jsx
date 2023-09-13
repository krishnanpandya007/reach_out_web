import { Flex, Link } from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import React from 'react'

function Footer() {
  return (
    <Flex justifyContent='space-between' fontSize={'0.7rem'} mt='1rem'>
        <span>&copy;ReachOut 2023</span>
        <Flex gap='1rem'>
            <Link as={ReactRouterLink} to='/docs/terms_and_conditions'>Terms</Link>
            <Link to='/docs/about' as={ReactRouterLink}>About</Link>
            <Link to='/contact' as={ReactRouterLink}>Contact/Support</Link>
        </Flex>
    </Flex>
  )
}

export default Footer