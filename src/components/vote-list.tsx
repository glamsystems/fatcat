'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { CheckCircleIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import Link from 'next/link'

interface VoteItem {
    name: string;
    description: string;
    voted: boolean;
    votedDetails: string;
    status: 'upcoming' | 'ongoing' | 'completed';
    start: string;
    end: string;
}

const mockVotes: VoteItem[] = [
    {
        name: "Budget Allocation 2025",
        description: "Vote on the proposed budget distribution for various departments in 2025",
        voted: false,
        votedDetails: "",
        status: "upcoming",
        start: "2024-12-01T09:00:00Z",
        end: "2024-12-15T18:00:00Z"
    },
    {
        name: "Remote Work Policy",
        description: "Vote on the new hybrid work policy proposal",
        voted: false,
        votedDetails: "",
        status: "ongoing",
        start: "2024-11-15T09:00:00Z",
        end: "2024-11-30T17:00:00Z"
    },
    {
        name: "Company Values Review",
        description: "Vote on proposed updates to our core company values",
        voted: true,
        votedDetails: "Voted for Proposal B",
        status: "completed",
        start: "2024-09-01T10:00:00Z",
        end: "2024-09-15T18:00:00Z"
    }
];

export default function VoteList() {
    const [filter, setFilter] = useState<'active' | 'all'>('active')
    const voteItems = mockVotes;

    const filteredVotes = filter === 'active'
        ? voteItems.filter(item => item.status === 'upcoming' || item.status === 'ongoing')
        : voteItems;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    const getBadgeVariant = (status: VoteItem['status']) => {
        switch (status) {
            case 'ongoing': return 'default';
            case 'completed': return 'secondary';
            case 'upcoming': return 'outline';
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <Card className="bg-card text-card-foreground p-4 rounded border-muted">
                <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-xl mb-1">Proposals</CardTitle>
                    <CardDescription>
                        For full details visit the{' '}
                        <Link href="https://vote.jup.ag/" target="_blank" className="underline hover:text-primary">
                            Jupiter Voting Platform.
                        </Link>
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <ToggleGroup type="single" value={filter} onValueChange={(value) => setFilter(value as 'active' | 'all')} className="mb-4">
                        <ToggleGroupItem value="active">Active</ToggleGroupItem>
                        <ToggleGroupItem value="all">All</ToggleGroupItem>
                    </ToggleGroup>
                    <ScrollArea className="h-[240px] w-full rounded">
                        {filteredVotes.length === 0 ? (<p className="text-center text-muted-foreground">No votes available</p>) : (filteredVotes.map((item, index) => (<div key={index} className="mb-2 last:mb-0 p-3 bg-accent rounded-lg">
                            <div className="flex justify-between items-center mb-1 gap-x-4">
                                <span className="flex-grow flex justify-start">
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-base">{item.name}</h3>
                                    {/*<p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>*/}

                                </div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                                                                                <Badge
                                                                                                    variant={getBadgeVariant(item.status)}
                                                                                                    className={`text-xs h-6 rounded-full shadow-none pointer-events-none ${
                                                                                                        getBadgeVariant(item.status) === 'default' ? 'text-foreground dark:text-background' : ''
                                                                                                    }`}
                                                                                                >
                                                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                    </Badge>

                                        </TooltipTrigger>
                                        <TooltipContent className="bg-background border text-foreground border-border">
                                            <p className="text-xs"><span className="font-bold">Start:</span> {formatDate(item.start)}</p>
                                            <p className="text-xs"><span className="font-bold">End:</span> {formatDate(item.end)}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                </span>
                                <Button variant="default" size="sm" className="bg-background hover:bg-muted text-foreground text-xs h-8 px-2 shadow-none">View Details</Button>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            {item.voted ? (<CheckCircleIcon className="h-6 w-6 text-primary ml-2 flex-shrink-0"/>) : (<EllipsisHorizontalIcon className="h-5 w-5 text-muted-foreground ml-2 flex-shrink-0"/>)}
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-background text-foreground border border-border">
                                            {item.voted ? item.votedDetails : "Not voted yet"}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>)))}
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent pointer-events-none"></div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>)
}