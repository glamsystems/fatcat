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
            <main className="flex-grow flex flex-col items-center justify-start p-4 sm:p-8 md:p-8 lg:p-4">
                <div className="flex flex-col items-center justify-center space-y-8 md:space-y-2 max-w-6xl w-full">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl text-center opacity-90">Dashboard</h1>
                    <DelegateForm/>
                </div>
            </main>
        </div>
)
}

