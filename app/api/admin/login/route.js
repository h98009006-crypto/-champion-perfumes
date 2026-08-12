export async function POST(req){
 const {email,password}=await req.json();
 if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD) return Response.json({ok:true});
 return Response.json({ok:false},{status:401});
}
