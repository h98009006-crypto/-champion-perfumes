import {createClient} from "@supabase/supabase-js";
export async function POST(req){
 try{
  const body=await req.json();
  const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const {data,error}=await supabase.from("orders").insert([{customer_name:body.name,email:body.email,phone:body.phone,address:body.address,city:body.city,postal_code:body.postal,total:body.total,payment_method:body.payment_method,status:"pending",items:body.items}]).select().single();
  if(error) return Response.json({error:error.message},{status:400});
  return Response.json({order:data});
 }catch(e){return Response.json({error:"Invalid request"},{status:400})}
}
