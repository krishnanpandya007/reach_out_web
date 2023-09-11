import { Divider, Link } from '@chakra-ui/react'
import React from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'

function ModalEndHelperLinks({style}) {
  return (
    <>
    <Divider bgColor={'#b4b4b450'} mt={'3rem'} style={{...style}} />

        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6rem', marginTop: '0.7rem', color: '#a4a4a4'}}>
            <Link as={ReactRouterLink} href="/privacy">Privacy</Link>
            {/* <Link as={ReactRouterLink} to='/home'>
            Home
            </Link> */}
            <Link as={ReactRouterLink} href="/terms_and_conditions">Terms</Link>
            <Link as={ReactRouterLink} href="/contact">Contact/Support</Link>
        </div>
    </>
  )
}

export default ModalEndHelperLinks