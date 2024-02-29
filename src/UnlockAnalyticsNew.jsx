import React from 'react';
import { BaseHeader } from './components/Header';
import ReachOutTitle from './components/ReachOutTitle';
import { getCookie } from './components/configs/utils';
import { Button, ButtonGroup, Checkbox, Divider } from '@chakra-ui/react';
import { ANALYTICS_PLANS, FRONTEND_ROOT_URL } from './constants';
import { RxCheck, RxCross2 } from "react-icons/rx";
import { BsArrowRight } from 'react-icons/bs';

const UnlockAnalyticsNew = () => {

    const checkIsAuthenticated = () => {

        if(getCookie('stale_authenticated') !== 'true'){
          return false;
        }
    
        return true;
    
      }
    
      const isAuthenticated = checkIsAuthenticated();

    return (
        <>
            <BaseHeader style={{display: 'flex', alignItems: 'center', borderBottom: '1px solid #c4c4c460', justifyContent: 'space-between', width: '100%', padding: '1.5rem', backgroundColor: 'Background'}}>
                <ReachOutTitle imgStyle={{width: '40px', height: '40px'}}>
                    <small>ReachOut</small>
                </ReachOutTitle>
                <div className="header__action__bars" style={{gap: '0.7rem', display: 'flex'}}>
                    <a href={`${FRONTEND_ROOT_URL}/${isAuthenticated ? 'web' : 'signin'}`}>
                        <Button variant='outline' rightIcon={<BsArrowRight size={'15px'} />} fontWeight={300} fontSize={'0.8rem'} p={"0 2.3rem"} borderRadius={'100px'}>
                        {isAuthenticated ? 'Web App' : 'Sign In'}&nbsp;
                        </Button>
                    </a>
                </div>
            </BaseHeader>

            <AnalyticsSection />

        </>
    );
}

function AnalyticsSection() {

    return (

        <div className="analytics_section" style={{display: 'flex', flexWrap: 'wrap', padding: '2rem 0', width: '100%', justifyContent: 'space-around'}}>

            <AnalyticsInfo />
            <AnalyticsPurchase />

        </div>

    )

}

function AnalyticsInfo() {

    return (

        <div className="analytics_info" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '65vh'}}>

            <h2 style={{fontSize: '2rem', fontWeight: 'bold'}}>Get <span style={{color: '#59CE8F'}}>insights</span> of your profile,<br/>
            <span style={{color: '#59CE8F'}}>by</span> enabling <span style={{color: '#59CE8F'}}>Analytics feature</span>.</h2>

            <PricingTable />

            <div className="notice" style={{maxWidth: '500px', color: '#676767'}}>
                <small>*Mentioned services are subject to avaibility of site or in other words may be unavailable due to technical issues in future.</small>
                <br/>
                <br/>
                <small>*Above mentioned details are constrainted over <a style={{textDecoration: 'underline'}} href="/docs/Legal/terms-and-conditions">terms and conditions</a> and <a style={{textDecoration: 'underline'}} href="/docs/Legal/policy">policy</a> associated to it, after pre decided period of time, your service will be discontinued. We highly consider you ackowledge legals before making further purchase.</small>
                <br/>
                <br/>
                <br/>
                <Divider />
                <br/>
            </div>

        </div>

    )

}

function AnalyticsPurchase() {

    const [selectedPlan, setSelectedPlan] = React.useState({ currency: 'inr', duration: 28, amount: 19.23 }) // duration is matching component among other plans and responsible to rendered as "selected plan" in UI.

    return (
        <div style={{height: '55vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div className="analytics_purchase">
                <ChoosePlan currentPlan={selectedPlan} setPlan={setSelectedPlan} />
                <MakePayment />

            </div>
        </div>

    )

}

function ChoosePlan({ currentPlan, setPlan }) {

    return (
        <div className="about_analytics_parent">
            <div className="about_analytics" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%'}}>
                <b style={{fontSize:'0.8rem', fontWeight: '600'}}>1. Select analytics plan duration.</b>
                <ButtonGroup size='sm' isAttached variant='outline'>
                    <Button onClick={() => {setPlan(c => ({...c, currency: 'inr'}))}} isActive={currentPlan.currency === 'inr'} isDisabled={currentPlan.currency === null}>INR</Button>
                    <Button onClick={() => {setPlan(c => ({...c, currency: 'usd'}))}} isActive={currentPlan.currency === 'usd'} isDisabled={currentPlan.currency === null}>USD</Button>
                </ButtonGroup>
            </div>
            <br/>
            <div className="plans_showcase">
                {
                    ANALYTICS_PLANS.map((val, idx) => {
                        return (
                        <div className="plan_layout" onClick={() => { setPlan({ currency: currentPlan.currency, duration: val.duration_in_days, amount: currentPlan.currency === 'inr' ? val.amount_in_inr.original : val.amount_in_usd.original }) }} onMouseOver={(e) => {e.target.style.cursor="pointer"}} key={idx} style={{display: 'flex', width: '25rem', marginBottom: '1rem', justifyContent: 'space-between', borderRadius: '6px', padding: '1rem', boxShadow: currentPlan.duration === val.duration_in_days ? '0 0 0 2px #59CE8F' : '0 0 0 1px #CECECE90'}}>
                            <small><b>Duration: </b>{val.duration_in_days} days</small>
                            <small style={{color: '#c4c4c4'}}>—</small>
                            <small style={{}}><b>Amount: </b>{currentPlan.currency.toUpperCase()} {currentPlan.currency === 'inr' ? val.amount_in_inr.original : val.amount_in_usd.original}</small>
                            <Checkbox colorScheme='green' isChecked={currentPlan.duration === val.duration_in_days} />
                        </div>)
                    })
                }
            </div>

        </div>
    )

}

function MakePayment () {

    return (
        <div style={{marginTop: '3rem'}}>
        <b style={{fontSize:'0.8rem', fontWeight: '600'}}>2. Checkout.</b>
        <br/>
        <Button bgColor={"#59CE8F"} colorScheme='whatsapp' mt={3} w={"25rem"} p={7}>Pay now</Button>
        </div>

    )

}

function PricingTable() {
  return (
    <table cellPadding={10}  style={{tableLayout: 'fixed', fontSize: '0.85rem'}}>
      <thead>
        <tr style={{padding: '0'}}>
          <th></th>
          <th colSpan={2} style={{ textAlign: 'center', padding: '0', fontSize: '0.6rem', backgroundColor: '#59CE8F', color: 'white'}}>PLANS</th> 
        </tr>
        <tr style={{fontWeight: '500'}}>
          <td style={{width: '200px', border: '1px solid #c4c4c460', borderBottom: '1px solid #b4b4b4', borderLeft: 'none'}}>Insights</td>
          <th style={{fontWeight: '500', width: '100px', border: '1px solid #c4c4c460', borderTop: 'none', borderBottom: '1px solid #b4b4b4'}}>Free</th>
          <th style={{fontWeight: '500', width: '100px', border: '1px solid #c4c4c460', borderTop: 'none', borderBottom: '1px solid #b4b4b4'}}>Analytics</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{color: '#00000099', border: '1px solid #c4c4c460', borderTop: 'none', borderRight: 'none', borderLeft: 'none', fontSize: 'smaller'}}>Interactions stats</td>
          <td style={{textAlign: 'center', border: '1px solid #c4c4c460', borderTop: 'none'}}><div style={{display: 'grid', placeItems:'center'}}><RxCross2 size={18}/></div></td>
          <td style={{textAlign: 'center', border: '1px solid #c4c4c460', borderTop: 'none', borderLeft: 'none', borderRight: 'none'}}><div style={{display: 'grid', placeItems:'center'}}><RxCheck size={18}/></div></td>
        </tr>
        <tr>
          <td style={{color: '#00000099', border: '1px solid #c4c4c460', borderTop: 'none', borderRight: 'none', borderLeft: 'none', fontSize: 'smaller'}}>Progressive report</td>
          <td style={{textAlign: 'center', border: '1px solid #c4c4c460', borderTop: 'none'}}><div style={{display: 'grid', placeItems:'center'}}><RxCross2 size={18}/></div></td>
          <td style={{textAlign: 'center', border: '1px solid #c4c4c460', borderTop: 'none', borderLeft: 'none', borderRight: 'none'}}><div style={{display: 'grid', placeItems:'center'}}><RxCheck size={18} /></div></td>
        </tr>
        <tr>
          <td style={{color: '#00000099', border: '1px solid #c4c4c460', borderTop: 'none', borderRight: 'none', borderLeft: 'none', fontSize: 'smaller'}}>Popularity regions</td>
          <td style={{display: 'flex', justifyContent: 'center', border: '1px solid #c4c4c460', borderTop: 'none'}}><div style={{display: 'grid', placeItems:'center'}}><RxCross2 size={18}/></div></td>
          <td style={{textAlign: 'center', border: '1px solid #c4c4c460', borderTop: 'none', borderLeft:'none', borderRight: 'none'}}><div style={{display: 'grid', placeItems:'center'}}><RxCheck size={18}/></div></td>
        </tr>
      </tbody>
    </table>
  );
}

export default UnlockAnalyticsNew;
