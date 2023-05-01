// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {SessionData} from "@/types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SessionData>
) {
    const payload = {
        // Some payload
    }

    const fetchRes = await fetch(process.env.BACKEND_GET_SESSION_URL ?? "",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        })
    const fetchData = await fetchRes.json()

    res.status(200).json({
        id: fetchData.session.adyen_session_id,
        data: fetchData.session.adyen_session_data,
    })
}
