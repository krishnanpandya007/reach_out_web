export const socials = [
    'Instagram',
    'LinkedIn',
    'Snapchat',
    // Twitter is disabled as authentication service is not working well
    'Facebook',
    // 'Twitter',
    'Reddit',
    'Discord'
];

// export const FRONTEND_ROOT_URL = "https://reach-out-web.vercel.app";
export const FRONTEND_ROOT_URL = "https://www.reachout.org.in";
export const BACKEND_ROOT_URL = 'https://backend-61489.reachout.org.in'
export const GOOGLE_CLIENT_ID = "85619004436-enpfc7ca57gvjmo4ee2ecno3gi2c635b.apps.googleusercontent.com"
export const base_json_header = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'raw-platform': 'Web'
}

export const ANALYTICS_PLANS = [
    {
        'duration_in_days': 28,
        'amount_in_inr': {
            'original': 19.00,
            'addon': 0.00
        },
        'amount_in_usd': {
            'original': 0.35,
            'addon': 0.00
        },
        'tag': null
    },
    {
        'duration_in_days': 84,
        'amount_in_inr': {
            'original': 49.00,
            'addon': 0.00
        },
        'amount_in_usd': {
            'original': 0.75,
            'addon': 0.00
        },
        'tag': 'Suggested'
    },
    {
        'duration_in_days': 180,
        'amount_in_inr': {
            'original': 99.00,
            'addon': 0.00
        },
        'amount_in_usd': {
            'original': 1.29,
            'addon': 0.00
        },
        'tag': null
    },
]

export const ANONYMOUS_AVATAR_URL = `${BACKEND_ROOT_URL}/media/images/profile_pics/anonymous.png`

// export const CLIENT_BORDER_AROUND_TIMEOUT = 5 // 5 seconds
export const LOGIN_QR_SESSION_TIMEOUT = 5*60 // 5 minutes
export const LOGIN_QR_EXPIRY_TIME = 1*60 // 1 minute
/*
This is specifically used for adding specific value to some threshold to fullfill theoratical timeline and core- cases
currently only being used at-- Login Qr manipulation
*/

export const APP_URL = 'reachoutapp://reachout.org.in';