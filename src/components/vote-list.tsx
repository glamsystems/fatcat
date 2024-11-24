'use client'

import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Loader2 } from 'lucide-react';
import Link from 'next/link'

const PROPOSALS_LIMIT = 10;
const DEFAULT_PROPOSAL = {
    title: 'Untitled Proposal',
};

interface Proposal {
    key: string;
    title: string;
    link: string;
    options: string[];
    index: number;
    proposer: string;
    optionVotes: number[];
    canceledAt: string | null;
    createdAt: string;
    activatedAt: string;
    votingEndsAt: string;
    queuedAt: string | null;
    type: number;
}

import axios from 'axios';

const fetchProposals = async (): Promise<Proposal[]> => {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            console.log(`Fetching proposals (attempt ${retryCount + 1}/${maxRetries})`);
const { data } = await axios.get(`/api/proposals?limit=${PROPOSALS_LIMIT}&_=${Date.now()}`, {
    headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    },
    params: {
        _: Date.now()
    }
});

if (!Array.isArray(data)) {
    console.error('Unexpected API response format:', data);
    throw new Error('Invalid response format from API');
}

return data.sort((a: Proposal, b: Proposal) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);
} catch (error) {
    retryCount++;
    if (axios.isAxiosError(error)) {
        console.error(`Error in fetchProposals (attempt ${retryCount}/${maxRetries}):`, {
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });
    } else {
        console.error(`Error in fetchProposals (attempt ${retryCount}/${maxRetries}):`, {
            error,
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }

    if (retryCount === maxRetries) {
        throw new Error(
            axios.isAxiosError(error)
                ? `Failed to fetch proposals: ${error.response?.data?.message || error.message}`
                : 'Failed to fetch proposals after maximum retries'
        );
    }

    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
}
}

throw new Error('Failed to fetch proposals after maximum retries');
};

const getProposalStatus = (activatedAt: string, votingEndsAt: string): 'upcoming' | 'ongoing' | 'completed' => {
    const now = Date.now();
    const activationDate = new Date(activatedAt).getTime();
    const endDate = new Date(votingEndsAt).getTime();

    if (now < activationDate) return 'upcoming';
    if (now > endDate) return 'completed';
    return 'ongoing';
};

export default function VoteList() {
    const [filter, setFilter] = useState<'active' | 'all'>('active');
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>({});

    useEffect(() => {
        let mounted = true;

        const loadProposals = async () => {
            if (!mounted) return;

            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchProposals();

                if (mounted) {
                    setProposals(data);
                }
            } catch (err) {
                if (mounted) {
                    const errorMessage = err instanceof Error ? err.message : 'Failed to load proposals';
                    setError(errorMessage);
                    console.error('Error loading proposals:', errorMessage);
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        loadProposals();

        const pollInterval = setInterval(loadProposals, 5 * 60 * 1000);

        return () => {
            mounted = false;
            clearInterval(pollInterval);
        };
    }, []);

    const filteredProposals = filter === 'active'
        ? proposals.filter(proposal => {
            const status = getProposalStatus(proposal.activatedAt, proposal.votingEndsAt);
            return status === 'upcoming' || status === 'ongoing';
        })
        : proposals;

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

    const getBadgeVariant = (status: 'upcoming' | 'ongoing' | 'completed') => {
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
                            Jupiter Voting Platform
                        </Link>
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <ToggleGroup
                        type="single"
                        value={filter}
                        onValueChange={(value) => {
                            if (value) setFilter(value as 'active' | 'all');
                        }}
                        className="mb-4"
                    >
                        <ToggleGroupItem value="active" aria-label="Show active proposals">Active</ToggleGroupItem>
                        <ToggleGroupItem value="all" aria-label="Show all proposals">All</ToggleGroupItem>
                    </ToggleGroup>
                    <ScrollArea className="h-[240px] w-full rounded overflow-hidden">
                        <div className="pb-20">
                            {isLoading ? (
                                <div className="h-full w-full flex flex-row items-center justify-center py-4">
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
                                    <p className="text-muted-foreground">Loading proposals...</p>
                                </div>
                            ) : error ? (
                                <div className="h-full w-full flex flex-col items-center justify-center py-8">
                                    <p className="text-destructive">{error}</p>
                                </div>
                            ) : filteredProposals.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">No active or upcoming proposals.</p>
                            ) : (
                                <Accordion type="single" collapsible className="space-y-2">
                                    {filteredProposals.map((proposal) => {
                                        const status = getProposalStatus(proposal.activatedAt, proposal.votingEndsAt);
                                        return (
                                            <AccordionItem
                                                key={proposal.key}
                                                value={proposal.key}
                                                className="border-0"
                                            >
                                                <div className="bg-accent rounded-lg">
                                                    <AccordionTrigger className="px-3 py-2 hover:no-underline [&[data-state=open]>div]:rounded-b-none">
                                                        <div className="flex items-center justify-between gap-x-4 w-full">
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-semibold max-w-48 text-base truncate text-left">
                                                                    {proposal.title || DEFAULT_PROPOSAL.title}
                                                                </h3>
                                                            </div>
                                                            <div className="flex items-center gap-x-2">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            <Badge
                                                                                variant={getBadgeVariant(status)}
                                                                                className={`text-xs h-6 rounded-full shadow-none pointer-events-none ${getBadgeVariant(status) === 'default' ? 'text-foreground dark:text-background' : ''}`}
                                                                            >
                                                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                            </Badge>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent className="bg-background border text-foreground border-border">
                                                                            <p className="text-xs">
                                                                                <span className="font-bold">Start:</span>{' '}
                                                                                {formatDate(proposal.activatedAt)}
                                                                            </p>
                                                                            <p className="text-xs">
                                                                                <span className="font-bold">End:</span>{' '}
                                                                                {formatDate(proposal.votingEndsAt)}
                                                                            </p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            <EllipsisHorizontalIcon className="h-5 w-5 text-muted-foreground flex-shrink-0 mr-4" />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent className="bg-background text-foreground border border-border">
                                                                            Not voted yet
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </div>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-3 pb-3">
                                                        <div className="space-y-3">
                                                            <div>
                                                                <h4 className="text-sm font-medium mb-1">Title</h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {proposal.title || DEFAULT_PROPOSAL.title}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-medium mb-1">Timeline</h4>
                                                                <div className="text-sm text-muted-foreground space-y-1">
                                                                    <p>Start: {formatDate(proposal.activatedAt)}</p>
                                                                    <p>End: {formatDate(proposal.votingEndsAt)}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-medium mb-2">Options</h4>
                                                                <RadioGroup
                                                                    value={selectedVotes[proposal.key] || ""}
                                                                    onValueChange={(value) => {
                                                                        setSelectedVotes(prev => ({
                                                                            ...prev,
                                                                            [proposal.key]: value
                                                                        }));
                                                                    }}
                                                                    className="space-y-2 mb-4"
                                                                    disabled={status !== 'ongoing'}
                                                                >
                                                                    {proposal.options.map((option, index) => (
                                                                        <div key={index} className="flex items-center justify-between space-x-2">
                                                                            <div className="flex items-center space-x-2">
                                                                                <RadioGroupItem
                                                                                    value={index.toString()}
                                                                                    id={`${proposal.key}-${index}`}
                                                                                    disabled={status !== 'ongoing'}
                                                                                />
                                                                                <label
                                                                                    htmlFor={`${proposal.key}-${index}`}
                                                                                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                                >
                                                                                    {option}
                                                                                </label>
                                                                            </div>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {proposal.optionVotes[index].toLocaleString()}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </RadioGroup>
                                                            </div>
                                                            <div className="flex gap-4">
                                                                <Link href={proposal.link} target="_blank" className="w-full">
                                                                    <Button
                                                                        variant="default"
                                                                        size="sm"
                                                                        className="bg-background hover:bg-muted text-foreground shadow-none w-full"
                                                                    >
                                                                        View Full Details
                                                                    </Button>
                                                                </Link>
                                                                <Button
                                                                    variant="default"
                                                                    size="sm"
                                                                    disabled={!selectedVotes[proposal.key] || status !== 'ongoing'}
                                                                    className="text-foreground dark:text-background shadow-none w-full"
                                                                >
                                                                    Override Vote
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </AccordionContent>
                                                </div>
                                            </AccordionItem>
                                        );
                                    })}
                                </Accordion>
                            )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}