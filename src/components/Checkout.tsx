import React, {useEffect, useRef} from "react";
import AdyenCheckout from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";
import useSWR, {Fetcher} from "swr";
import {SessionData} from "@/types";
// import {initiateCheckout} from "../../app/paymentSlice";
// import {getRedirectUrl} from "../../util/redirect";

export const PaymentContainer = () => {
    return (
        <div id="payment-page">
            <div className="container">
                <Checkout/>
            </div>
        </div>
    );
}

const fetcher: Fetcher<SessionData, string> = (...args) =>
    fetch(...args).then((res) => res.json())

const Checkout = () => {
    const paymentContainer = useRef(null);

    const {data, error} = useSWR('/api/session', fetcher)

    // useEffect(() => {
    //     const {error} = payment;
    //
    //     if (error) {
    //         navigate(`/status/error?reason=${error}`, {replace: true});
    //     }
    // }, [payment, navigate])
    //

    console.log(data)

    useEffect(() => {
        if (!data) return

        console.log('use effect')
        const session = {
            id: data.id,
            sessionData: data.data,
        }
        // const session =
        // {
        //     id: "CS715A3A6541F11DCE",
        //     sessionData: "Ab02b4c0!BQABAgBhS/gQCj7GS+aUbByyZ04fyhP3Ux66pn9ti9KyxB/hSPppQAFQFQ9YLpXAg8XWhq9GhiR7g2bE+WQehxgGt9e42crmdYM+UhnviwQboal8hPkibzSwpvLbtK3fPz3Hg6ATvrJuAbl+aguiAlnaklJovoq9vysRVEIdUtcvk9DzjNE+1k94OJUwf7QE3pFN7qR1b7DCSkSerX8bMPMkXTJ19+uiGPquGJ80tHTvcbZK/TaAFKgCPwxa5M8ZlCaA4NZfEgQAYPDlRmR5L1LMluivek37k5DNjEKBpDYg+nfhTbiDY2Eyv9YXxuzMPO0yO7B1eVYUN/qJdUHZH6105SkI6JXFqM7Au4y9Pm6yKyKBC+1L5w/wiYFICoHmEJGAPIuI/7UrjtPgD4ckQcwUma0DM98T3Y5/1qghqagg9QdgTP1Jp9P/0B4yvwDA79LaFYBigzUbI0GSGTSWhiTpF4S6SFp0PjLgei28m3afBjF0AUpqyMzImle7STim2NofoGSdzpV0tgFt+C/NpuHJZJ1nARunwTdDhLJdsv760W3njU3BMVAzSB1NeTiDWDJmH3jOZNKA7muf5hzxjpIrnkOMoEs6lRibgfGfrLYZqiDYYvoKuayshho4NGLJB/UAg+3tK9lJaCSruG/jfPaz4j9dtnGCIGoqSvoZkHFyqqv5GgzTOZztIsvhqTIXWx0ASnsia2V5IjoiQUYwQUFBMTAzQ0E1MzdFQUVEODdDMjRERDUzOTA5QjgwQTc4QTkyM0UzODIzRDY4REFDQzk0QjlGRjgzMDVEQyJ9UA+IqaqMmb2u75IkCtknGv0BnSEraza2P7P9phqTvpLeOp13oNP42dmza3LgtYdicLhZXAQAiJwoQ9bAoA0W1oMOfmOtLtkyKIVQGVHu2sK2817Prpyyr+aODgZFE3mXgfa0vmLEb3YBzXmaPn1ZsgRznv2l2Mw344vtwEnGohRgD75hc3BXnYp69Mgl69eefDrvrnf4IH86NuMNE4QAlFF96etTXRzMEFGmBfsF5GMadbPMpwVjeQUTBkYxl26qVLnUb/IaT5Hbe4EnRaj95+Z/j4hQvcIOgJ7ra4tmWuIeLPN2o77QNXlVE/oF88kkdug41qlYdgfXq2zt6UYhDJg12CK5ZCJMOOX3+NaSDgeBHbPZb/cvPGyEKIw4vVJ54mcZiVyZcdaIb7ygKU71QykMrdOhPO97Qt7oBNWrLpCxORJjiRQLo/xNnsYxvryDa/ZrZSq6zTckMsOd7Y+6+uZkLCt+Zdiopfg0dUMrDTmQcXR6ly+W+gw19UWlpOjtqWjwYy8+ht68wp93/Uq/Eh81ebMGydd3rWKM8Ha3L0eQpn8PGfoaFfJC7EYS+6HiqudvvWrAIZ9+wRVJ3R0GPuQUytYJfVVis3b/J7dqqC0hZOjR06Eb2sy2vsaq6rucK7LQhCE5gXDl7THMwIZ/kmrbJVU8L62osA=="
        // }
        console.log('session', session)
        let ignore = false;

        if (!session || !paymentContainer.current) {
            // initiateCheckout is not finished yet.
            return;
        }

        const config = {
            environment: process.env.NEXT_PUBLIC_ADYEN_ENVIRONMENT,
            clientKey: process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY,
        }
        console.log('config', config)

        const createCheckout = async () => {
            const checkout = await AdyenCheckout({
                ...config,
                session,
                onPaymentCompleted: (response, _component) =>
                    console.log("Payment completed", response),
                // navigate(getRedirectUrl(response.resultCode), {replace: true}),
                onError: (error, _component) => {
                    console.error(error);
                    // navigate(`/status/error?reason=${error.message}`, {replace: true});
                },
            });

            // The 'ignore' flag is used to avoid double re-rendering caused by React 18 StrictMode
            // More about it here: https://beta.reactjs.org/learn/synchronizing-with-effects#fetching-data
            if (paymentContainer.current && !ignore) {
                checkout.create("dropin").mount(paymentContainer.current);
            }
        }

        createCheckout();

        return () => {
            ignore = true;
        }
    }, [data])

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    return (
        <div className="payment-container">
            <div ref={paymentContainer} className="payment"></div>
        </div>
    );
}