import mongoose from 'mongoose';
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Quest from '@/models/quest.model';
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // Get the 'id' query param

    if (id) {
      // Validate ID format
      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid quest ID" }, { status: 400 });
      }

      // Fetch a specific quest by ID
      const quest = await Quest.findById(id);
      if (!quest) {
        return NextResponse.json({ message: "Quest not found" }, { status: 404 });
      }

      return NextResponse.json(quest, { status: 200 });
    } else {
      // Fetch all quests
      const quests = await Quest.find({});
      return NextResponse.json(quests, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newQuest = new Quest(body);
    await newQuest.save();

    return NextResponse.json(newQuest, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid quest ID" }, { status: 400 });
    }

    const updatedData = await req.json();
    
    // Convert id to ObjectId
    const objectId = new ObjectId(id);
    console.log("Converted ObjectId:", objectId);
    const updatedQuest = await Quest.findByIdAndUpdate(objectId, updatedData, { new: true });

    if (!updatedQuest) {
      return NextResponse.json({ message: "Quest not found" }, { status: 404 });
    }

    return NextResponse.json(updatedQuest, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid quest ID" }, { status: 400 });
    }

    const deletedQuest = await Quest.findByIdAndDelete(id);
    if (!deletedQuest) {
      return NextResponse.json({ message: "Quest not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Quest deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}