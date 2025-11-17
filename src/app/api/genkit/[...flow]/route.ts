// src/app/api/genkit/[...flow]/route.ts
import { genkit } from 'genkit';
import { run } from '@genkit-ai/flow';
import { flows } from '../flows'; // Adjust path as needed
import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
    const { flowId, input } = await req.json();

    if (!genkit.getFlow(flowId)) {
        return NextResponse.json({ error: 'Flow not found' }, { status: 404 });
    }

    try {
        const result = await run(flowId, input);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
