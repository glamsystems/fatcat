import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Create custom axios instance based on environment
const instance = axios.create({
    httpsAgent: process.env.NODE_ENV === 'development'
        ? new https.Agent({ rejectUnauthorized: false })
        : undefined
});

export async function GET(request: Request) {
    const start = Date.now();
    console.log('[API] Starting proposals request', {
        environment: process.env.NODE_ENV,
        sslVerification: process.env.NODE_ENV !== 'development'
    });

    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit') ?? '10';

        const apiUrl = `https://api.glam.systems/v0/governance/proposals/jupiter?limit=${limit}`;
        console.log('[API] Fetching from:', apiUrl);

        const response = await instance.get(apiUrl, {
            headers: {
                'Cache-Control': 'no-cache',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'User-Agent': 'PostmanRuntime/7.42.0'
            }
        });

        console.log('[API] Request completed successfully', {
            duration: Date.now() - start,
            dataLength: Array.isArray(response.data) ? response.data.length : 'not an array'
        });

        return NextResponse.json(response.data);

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('[API] Axios error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                duration: Date.now() - start,
                code: error.code,
                cause: error.cause,
                env: process.env.NODE_ENV
            });

            return NextResponse.json(
                {
                    message: 'External API error',
                    details: error.message,
                    status: error.response?.status,
                    data: error.response?.data
                },
                { status: error.response?.status || 500 }
            );
        }

        console.error('[API] Unexpected error:', {
            message: error instanceof Error ? error.message : 'Unknown error occurred',
            stack: error instanceof Error ? error.stack : undefined,
            duration: Date.now() - start,
            env: process.env.NODE_ENV
        });

        return NextResponse.json(
            {
                message: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}