import {createClient} from "@supabase/supabase-js";
export async function GET(){try{const s=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);const {data}=await s.from("products").select("*").order("created_at",{ascending:false});return Response.json({products:data||[]});}catch(e){return Response.json({products:[]});}}
