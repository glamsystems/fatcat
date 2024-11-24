'use client'

const PROPOSALS_LIMIT = 10;

const DEFAULT_PROPOSAL = {
    title: 'Untitled Proposal',
};

import { useState, useEffect } from 'react'
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

const fetchProposals = async (): Promise<Proposal[]> => {
    try {
        const response = await fetch(`https://api.glam.systems/v0/vote/proposals/jupiter?limit=${PROPOSALS_LIMIT}`);
        if (!response.ok) {
            throw new Error('Failed to fetch proposals');
        }
        const data = await response.json();
        return data.sort((a: Proposal, b: Proposal) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    } catch (error) {
        console.error('Error fetching proposals:', error);
        return [];
    }
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

    useEffect(() => {
        const loadProposals = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchProposals();
                setProposals(data);
            } catch (err) {
                setError('Failed to load proposals. Please try again later.');
                console.error('Error loading proposals:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadProposals();

        // Set up polling every 5 minutes to keep data fresh
        const pollInterval = setInterval(loadProposals, 5 * 60 * 1000);
        return () => clearInterval(pollInterval);
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
                    <ScrollArea className="h-[240px] w-full rounded">
                        <div className="pb-20">
                            {isLoading ? (
                                <p className="text-center text-muted-foreground">Loading proposals...</p>
                            ) : error ? (
                                <p className="text-center text-destructive">{error}</p>
                            ) : filteredProposals.length === 0 ? (
                                <p className="text-center text-muted-foreground">No proposals available</p>
                            ) : (
                                filteredProposals.map((proposal) => {
                                    const status = getProposalStatus(proposal.activatedAt, proposal.votingEndsAt);
                                    return (
                                        <div key={proposal.key} className="mb-2 p-3 bg-accent rounded-lg">
                                            <div className="flex items-center justify-between gap-x-4">
                                                <div className="flex-1 min-w-0">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger className="w-full">
                                                                <h3 className="font-semibold max-w-48 text-base truncate text-left mt-2">
                                                                    {proposal.title || DEFAULT_PROPOSAL.title}
                                                                </h3>
                                                            </TooltipTrigger>
                                                            <TooltipContent
                                                                side="top"
                                                                className="bg-background border text-foreground border-border"
                                                            >
                                                                <p className="text-sm">{proposal.title || DEFAULT_PROPOSAL.title}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
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
                                                    <Link href={proposal.link} target="_blank">
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="bg-background hover:bg-muted text-foreground text-xs h-8 px-2 shadow-none"
                                                        >
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <EllipsisHorizontalIcon className="h-5 w-5 text-muted-foreground flex-shrink-0"/>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="bg-background text-foreground border border-border">
                                                                Not voted yet
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}