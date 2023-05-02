import React, {useEffect, useRef} from "react";
import AdyenCheckout from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";
import {Fetcher} from "swr";
import {SessionData} from "@/types";
import useSWRImmutable from "swr/immutable";


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

type PaymentCompleteResponse = {
    resultCode: "Authorised" | "Refused" | "Cancelled" | "Error";
    sessionDate?: string;
    sessionResult?: string;
}


const Checkout = () => {
    const paymentContainer = useRef(null);
    const {data, error} = useSWRImmutable('/api/session', fetcher)

    console.log(data)

    useEffect(() => {
        let ignore = false;

        if (!data) return

        console.log('use effect')
        const session = data
        console.log("session", session)

        if (!session || !paymentContainer.current) {
            return;
        }

        const config = {
            environment: "TEST",
            clientKey: process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY,
        }


        const createCheckout = async () => {
            console.log('create checkout')
            const checkout = await AdyenCheckout({
                ...config,
                session,
                onPaymentCompleted: (response: PaymentCompleteResponse, _component: any) => {
                    if (response.resultCode !== "Authorised") {
                        alert(`Unhandled payment result "${response.resultCode}!"`);
                        return
                    }

                    // Success!
                },
                onError: (error: any, _component: any) => {
                    alert(`Error: ${error.message}`);
                },
            });


            // The 'ignore' flag is used to avoid double re-rendering caused by React 18 StrictMode
            // More about it here: https://beta.reactjs.org/learn/synchronizing-with-effects#fetching-data
            if (paymentContainer.current && !ignore) {
                console.log('create checkout at the end')
                checkout.create("dropin").mount(paymentContainer.current);
            }
        }

        createCheckout()
            .then(() => {
                console.log('create checkout then')
            })
            .catch((e) => {
                console.log('create checkout error')
            });

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