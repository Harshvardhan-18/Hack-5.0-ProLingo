import { isAdmin } from "@/lib/admin"
import { NextResponse } from "next/server"
import db from "@/db/drizzle"
import { eq } from "drizzle-orm"
import { challengeOptions } from "@/db/schema"

export const GET = async (
    req: Request,
    {params}:{ params:Promise <{ challengeOptionId: string }> },
) => {
    if (!isAdmin()) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const challengeOptionId = Number((await params).challengeOptionId);
    const data = await db.query.challengeOptions.findFirst({
        where: eq(challengeOptions.id, challengeOptionId),
    })

    return NextResponse.json(data);

}

export const PUT = async (
    req: Request,
    { params }: { params: Promise<{ challengeOptionId: string }> },
) => {
    if (!isAdmin()) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const challengeOptionId = Number((await params).challengeOptionId);
    const body = await req.json();
    const data = await db.update(challengeOptions).set({
        ...body
    }).where(eq(challengeOptions.id, challengeOptionId)).returning();

    return NextResponse.json(data[0]);

}

export const DELETE = async (
    req: Request,
    { params }: { params: Promise<{ challengeOptionId: string }> },
) => {
    if (!isAdmin()) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const challengeOptionId = Number((await params).challengeOptionId);
    const data = await db.delete(challengeOptions).where(eq(challengeOptions.id, challengeOptionId)).returning();

    return NextResponse.json(data[0]);
}
