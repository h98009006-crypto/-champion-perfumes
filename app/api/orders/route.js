import {createClient} from "@supabase/supabase-js";

const phonePattern=/^\+92\s?3\d{2}\s?\d{5}\s?\d{2}$/;
const provinces=new Set(["Punjab","Sindh","Khyber Pakhtunkhwa","Balochistan","Gilgit-Baltistan","Islamabad Capital Territory"]);

export async function POST(req){
 try{
  const body=await req.json();
  const required=["name","email","phone","address","city","province"];
  const missing=required.find(k=>typeof body[k]!=="string"||!body[k].trim());
  if(missing)return Response.json({error:`Please provide ${missing}.`},{status:400});
  if(!phonePattern.test(body.phone.trim()))return Response.json({error:"Invalid Pakistani phone number. Use +92 3XX XXXXXXX."},{status:400});
  if(!provinces.has(body.province))return Response.json({error:"Please select a valid Pakistani province."},{status:400});
  if(!Array.isArray(body.items)||!body.items.length)return Response.json({error:"Your cart is empty."},{status:400});
  if(!Number.isFinite(Number(body.total))||Number(body.total)<=0)return Response.json({error:"Invalid order total."},{status:400});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)return Response.json({error:"Store database is not configured. Please contact the store administrator."},{status:500});
  const supabase=createClient(url,key);
  const {data,error}=await supabase.from("orders").insert([{customer_name:body.name.trim(),email:body.email.trim(),phone:body.phone.trim(),address:body.address.trim(),city:body.city.trim(),province:body.province,postal_code:(body.postal||"").trim(),total:Number(body.total),payment_method:"cod",status:"pending",items:body.items}]).select().single();
  if(error){console.error("Order insert failed:",error);return Response.json({error:`Could not save your order: ${error.message}`},{status:500});}
  return Response.json({order:data},{status:201});
 }catch(e){console.error("Order API failed:",e);return Response.json({error:e?.message||"Unable to process the order request."},{status:500});}
}
