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
    const id = searchParams.get('id');
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

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
      const searchFilter = search ? { questName: { $regex: search, $options: "i" } } : {};
      const totalQuests = await Quest.countDocuments(searchFilter);

      const quests = await Quest.find(searchFilter)
        .skip((page - 1) * limit) // Skip results for pagination
        .limit(limit) // Limit results for pagination
        .sort({ createdAt: -1 }); // Optional: sort by creation date, most recent first

      // Return paginated results with metadata
      return NextResponse.json(
        {
          success: true,
          quests,
          totalQuests,
          totalPages: Math.ceil(totalQuests / limit),
          currentPage: page,
        },
        { status: 200 }
      );
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