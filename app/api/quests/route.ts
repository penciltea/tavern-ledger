import { NextRequest, NextResponse } from 'next/server';
    import connectToDatabase from '@/lib/db';

    export async function GET() {
      try {
        const db = await connectToDatabase();
        const collection = db.connection.collection('quests');
        const quests = await collection.find({}).toArray();

        return NextResponse.json(quests, { status: 200 });
      } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
    }

    export async function POST(req: NextRequest) {
        try {
            const db = await connectToDatabase();
            const collection = db.connection.collection('quests');
            const body = await req.json()
            const newItem = await collection.insertOne(body)
            return NextResponse.json({newItem}, {status: 201})
        } catch (error: any) {
            console.error(error)
            return NextResponse.json({message: error.message}, {status: 500})
        }
    }