import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
  import connectToDatabase from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    const collection = db.connection.collection('quests');
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // Get the 'id' query param

    if (id) {
      // Fetch a specific quest by ID
      const quest = await collection.findOne({ _id: new ObjectId(id) });
      if (!quest) {
        return NextResponse.json({ message: "Quest not found" }, { status: 404 });
      }
      return NextResponse.json(quest, { status: 200 });
    } else {
      // Fetch all quests
      const quests = await collection.find({}).toArray();
      return NextResponse.json(quests, { status: 200 });
    }
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
        return NextResponse.json({_id: newItem.insertedId}, {status: 201})
    } catch (error: any) {
        console.error(error)
        return NextResponse.json({message: error.message}, {status: 500})
    }
}