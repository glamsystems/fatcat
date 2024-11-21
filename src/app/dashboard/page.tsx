'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Header from '../../components/header'
import DelegateForm from '../../components/delegate-form'

export default function Dashboard() {
    const { connected } = useWallet()
    const router = useRouter()

    useEffect(() => {
        if (!connected) {
            router.push('/')
        }
    }, [connected, router])

    if (!connected) {
        return null // or a loading spinner
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-start py-24">
                    <DelegateForm/>
            </main>
        </div>
)
}

