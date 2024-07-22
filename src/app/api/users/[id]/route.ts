// import { db } from '@/lib/db';

// export async function GET(req: Request) {
//   const body = await req.json();
//   const { id } = body;

//   if (!id || typeof id !== 'string') {
//     return new Response("Invalid user ID", { status: 400 });
//   }
//   console.log("id-->", id);
  
//   const { data, error } = await db
//     .from('users')
//     .select('*')
//     .eq('id', id)
//     .single();

//   if (error) {
//     return new Response(error.message, { status: 500 });
//   }  
//   return new Response(data, { status: 200 });
// }