import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  console.log("id-->", id);
  
  const { data, error } = await db
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  console.log("users/[id]");
  
  console.log(data);
  
  return res.status(200).json(data);
}
