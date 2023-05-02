import {Inter} from 'next/font/google'
import {PaymentContainer} from "@/components/Checkout";

const inter = Inter({subsets: ['latin']})

export default function Home() {
    return (
        <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
            <PaymentContainer/>
        </main>
    )
}
