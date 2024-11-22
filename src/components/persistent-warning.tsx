"use client"

import { useState, useRef } from 'react'
import { BeakerIcon } from '@heroicons/react/24/solid'
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"

export function PersistentWarning() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [hasReachedBottom, setHasReachedBottom] = useState(false)
    const scrollViewportRef = useRef<HTMLDivElement>(null)

    const onScroll = () => {
        if (scrollViewportRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollViewportRef.current
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                setHasReachedBottom(true)
            }
        }
    }

    return (
        <>
            <Card className="fixed rounded bottom-4 right-4 z-50 p-4 shadow-lg border-muted max-w-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-2">
                        {/*<BeakerIcon className="h-6 w-6 text-destructive flex-shrink-0" />*/}
                        <div>
                            <p className="font-medium">Unaudited Beta</p>
                            <p className="text-sm hidden sm:block">Use at your own risk.</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsDialogOpen(true)}
                        className="w-full sm:w-auto mt-2 sm:mt-0"
                    >
                        Full Disclaimer
                    </Button>
                </div>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={() => {}} modal={true}>
                <DialogContent className="sm:max-w-[425px] outline-none outline-transparent border-muted">
                    <DialogHeader>
                        <DialogTitle>Full Disclaimer</DialogTitle>
                        <DialogDescription>
                            Please read the following disclaimer carefully:
                        </DialogDescription>
                    </DialogHeader>
                    <div
                        className="h-[400px] w-full overflow-y-auto rounded-md p-4"
                        onScroll={onScroll}
                        ref={scrollViewportRef}
                    >

                        <div className="w-full mx-auto text-justify leading-loose text-sm text-muted-foreground">
                            <h1 className="text-xl font-medium mb-6">GLAM Beta Disclaimer</h1>

                            <section className="mb-6">
                                <h2 className="text-lg font-semibold mb-2">1. Introduction</h2>
                                <p>We welcome you to <strong>GLAM&apos;s unaudited, experimental beta version, comprising GLAM Protocol, GLAM API, GLAM SDK, GLAM GUI, and any other related components, <span className="text-foreground underline">including FatCat (fatcat.vote) and all its associated features and services</span>, (collectively &quot;GLAM&quot;)</strong>. By accessing or using any component of GLAM, you acknowledge that you have read, understood, and agree to be bound by this disclaimer. If you do not agree, please refrain from using any GLAM components.</p>
                            </section>

                            <section className="mb-6">
                                <h2 className="text-lg font-semibold mb-2">2. Active Development Notice</h2>
                                <p>GLAM is currently under <strong>active development</strong>. Features may change without notice, and <strong>breaking changes</strong> could occur. The software may not function as intended.</p>
                            </section>

                            <section className="mb-6">
                                <h2 className="text-lg font-semibold mb-2">3. Use at Your Own Risk</h2>
                                <ul className="list-disc pl-6">
                                    <li>GLAM is provided on an &quot;as is&quot; and &quot;as available&quot; basis <strong>without warranties of any kind</strong>, either express or implied.</li>
                                    <li><strong>You assume all risks</strong> associated with using GLAM.</li>
                                    <li>We <strong>strongly recommend</strong> not storing significant amounts of cryptoassets on the platform during the beta phase.</li>
                                </ul>
                            </section>

                            <section className="mb-6">
                                <h2 className="text-lg font-semibold mb-2">4. Risk Acknowledgment</h2>
                                <ul className="list-disc pl-6">
                                    <li><strong>Security Risks:</strong> The software may contain bugs, errors, or security vulnerabilities that could lead to unauthorized access, data breaches, or other security incidents.</li>
                                    <li><strong>Financial Risks:</strong> There is a potential for <strong>partial or total loss of cryptoassets</strong> due to software issues or security breaches.</li>
                                    <li><strong>Operational Risks:</strong> GLAM may experience interruptions, delays, or errors.</li>
                                </ul>
                            </section>

                            <section className="mb-6">
                                <h2 className="text-lg font-semibold mb-2">5. Limitation of Liability</h2>
                                <p>GLAM <strong>shall not be liable</strong> for any direct, indirect, incidental, consequential, or exemplary damages arising from the use or inability to use GLAM. This includes, but is not limited to, loss of cryptoassets, data loss, or security breaches.</p>
                            </section>

                            <section className="mb-6">
                                <h2 className="text-lg font-semibold mb-2">6. No Warranties</h2>
                                <p>GLAM makes <strong>no warranties or representations</strong> about the accuracy or completeness of GLAM&apos;s content or the content of any services linked to any GLAM component. We do not warrant that:</p>
                                <ul className="list-disc pl-6">
                                    <li>GLAM will meet your requirements.</li>
                                    <li>GLAM will be uninterrupted, timely, secure, or error-free.</li>
                                    <li>Any errors or defects will be corrected.</li>
                                </ul>
                            </section>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={!hasReachedBottom}
                        >
                            {hasReachedBottom ? "I Understand and Accept" : "Please read the entire disclaimer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>)
}
