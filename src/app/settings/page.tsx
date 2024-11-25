'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Header from '../../components/header'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

    export default function Dashboard() {
        const {connected} = useWallet()
        const router = useRouter()

        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                username: "",
            },
        })

        function onSubmit(values: z.infer<typeof formSchema>) {
            console.log(values)
        }

        useEffect(() => {
            if (!connected) {
                router.push('/')
            }
        }, [connected, router])

        if (!connected) {
            return null // or a loading spinner
        }

        return (<motion.div className="min-h-screen flex flex-col"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
        >
            <main className="flex-grow flex flex-col items-center justify-start py-24 gap-y-4 mt-12 md:mt-10">
                <div className="w-full max-w-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <Card className="select-none text-card-foreground p-0 sm:p-4 rounded border-muted">
                        <div className="p-6">
                            <CardHeader className="p-0 pb-4">
                                <CardTitle className="text-xl mb-1">Settings</CardTitle>
                                <CardDescription>
                                    <Link href="/" className="hover:underline hover:text-primary">
                                        &#60; Back
                                    </Link>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({field}) => (<FormItem>
                                                    <FormLabel>Priority Fee</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="123456" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        <code>LAMPORTS</code>
                                                    </FormDescription>
                                                    <FormMessage/>
                                                </FormItem>)}
                                        />
                                        <Button type="submit" className="text-foreground dark:text-background">Set Priority Fee</Button>
                                    </form>
                                </Form>

                            </CardContent>
                        </div>
                    </Card>
                </div>
            </main>
            <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
        </motion.div>)
    }