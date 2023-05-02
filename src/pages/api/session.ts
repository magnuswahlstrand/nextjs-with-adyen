import type {NextApiRequest, NextApiResponse} from 'next'

import {randomUUID} from "crypto";
import {CheckoutAPI, Client, Config} from "@adyen/api-library";

const config = new Config({
    apiKey: process.env.ADYEN_API_KEY,
    environment: "TEST",
});

// 1. Initialize the client & checkout
const client = new Client({config});
const checkout = new CheckoutAPI(client);

const merchantAccount = process.env.ADYEN_MERCHANT_ACCOUNT ?? "";

// 2. Define the return data
export type SessionData = {
    id: string
    sessionData: string
}

// 3. NextJS handler
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SessionData>
) {

    // 4. Use Adyen SDK to create a session
    const response = await checkout.sessions({
        amount: {currency: "EUR", value: 10000}, // value is 100€ in minor units
        countryCode: "NL",
        merchantAccount,
        reference: randomUUID(), // Merchant reference
        returnUrl: `http://localhost.com`, // Not important for our use case
    });

    // 5. Return the session data to the caller
    res.status(200).json({
        id: response.id,
        sessionData: response.sessionData ?? "",
    })
}