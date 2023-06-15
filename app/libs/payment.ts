import axios from 'axios';

const bepaid = axios.create({
    auth: {
        username: process.env.BEPAID_ID || '',
        password: process.env.BEPAID_SECRET_KEY || ''
    },
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Version': 2
    },
    baseURL: 'https://checkout.bepaid.by/ctp/api/checkouts'
});

export async function getTokenAndUrl(name: string) {
    const data = {
        checkout: {
            test: true,
            transaction_type: 'payment',
            attempts: 3,
            settings: {
                return_url: process.env.NEXTAUTH_URL + '/profile',
                button_text: 'Pay',
                button_next_text: 'Return',
                language: 'en',
                credit_card_fields: {
                    holder: name,
                    read_only: ['holder']
                }
            },
            payment_method: {
                types: ['credit_card']
            },
            order: {
                currency: 'BYN',
                amount: 500,
                description: 'Transaction for increacing balance'
            }
        }
    }
    const res = await bepaid.post('/', data)
    return res?.data?.checkout;
}

export async function checkPayment(token: string) {
    const { data } = await bepaid.get(token);
    return data?.checkout?.status;
}

