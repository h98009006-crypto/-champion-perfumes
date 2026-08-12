import {createClient} from "@supabase/supabase-js";
export async function GET(req){
 const auth=req.headers.get("x-admin-key");
 if(auth!==process.env.ADMIN_PASSWORD) return Response.json({error:"Unauthorized"},{status:401});
 const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
 const {data,error}=await supabase.from("orders").select("*").order("created_at",{ascending:false});
 if(error)return Response.json({error:error.message},{status:400});
 return Response.json({orders:data});
}
