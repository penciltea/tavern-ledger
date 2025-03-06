import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse){
    if(req.method === 'POST'){
        const data = req.body;

        const client = await MongoClient.connect('mongodb+srv://brooke:.T67-zBVmSLhG5@cluster0.y9ncd.mongodb.net/quests?retryWrites=true&w=majority&appName=Cluster0');
        const db = client.db();

        const questsCollection = db.collection('quests');

        const result = await questsCollection.insertOne(data);
        
        console.log(result);

        client.close();

        res.status(201).json({message: 'Quest created'});
    }
}

export default handler;