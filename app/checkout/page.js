"use client";
import {useEffect,useState} from "react";

const provinces=["Punjab","Sindh","Khyber Pakhtunkhwa","Balochistan","Gilgit-Baltistan","Islamabad Capital Territory"];
const money=n=>`Rs. ${Number(n||0).toLocaleString("en-PK")}`;
const phonePattern=/^\+92\s?3\d{2}\s?\d{5}\s?\d{2}$/;

export default function Checkout(){
 const [cart,setCart]=useState([]),[done,setDone]=useState(false),[submitting,setSubmitting]=useState(false),[error,setError]=useState("");
 const [form,setForm]=useState({name:"",email:"",phone:"",address:"",city:"",province:"",postal:""});
 useEffect(()=>setCart(JSON.parse(localStorage.getItem("champion-cart")||"[]")),[]);
 const total=cart.reduce((s,p)=>s+Number(p.price||0)*Number(p.qty||0),0);
 const update=(k,v)=>setForm(f=>({...f,[k]:v}));
 async function submit(e){
  e.preventDefault();
  setError("");
  if(!cart.length){setError("Your cart is empty. Add a product before placing an order.");return}
  if(!phonePattern.test(form.phone.trim())){setError("Please enter a Pakistani phone number in this format: +92 3XX XXXXXXX");return}
  setSubmitting(true);
  try{
   const response=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,items:cart,total,payment_method:"cod"})});
   let payload={};
   try{payload=await response.json()}catch{}
   if(!response.ok)throw new Error(payload.error||`Order submission failed (HTTP ${response.status}).`);
   localStorage.removeItem("champion-cart");
   setCart([]);setDone(true);
  }catch(err){setError(err?.message||"We could not place your order. Please try again.")}
  finally{setSubmitting(false)}
 }
 if(done)return <main className="section"><div className="eyebrow">ORDER CONFIRMED</div><h1>Order received.</h1><p>Thank you for choosing Champion Perfumes. We'll contact you to confirm your cash-on-delivery order.</p><a className="btn dark" href="/">Back to store</a></main>;
 return <main className="section"><div className="eyebrow">CHECKOUT</div><h1>Complete your order</h1><p>Cash on delivery is enabled by default.</p><form className="panel" onSubmit={submit} noValidate>
  {error&&<div className="error" role="alert">{error}</div>}
  <input required placeholder="Full name" value={form.name} onChange={e=>update("name",e.target.value)}/>
  <input required type="email" placeholder="Email" value={form.email} onChange={e=>update("email",e.target.value)}/>
  <input required type="tel" inputMode="tel" autoComplete="tel" placeholder="+92 3XX XXXXXXX" value={form.phone} onChange={e=>update("phone",e.target.value)} aria-describedby="phone-help"/>
  <small id="phone-help">Pakistani format: +92 3XX XXXXXXX</small>
  <input required placeholder="Street address" value={form.address} onChange={e=>update("address",e.target.value)}/>
  <input required placeholder="City" value={form.city} onChange={e=>update("city",e.target.value)}/>
  <select required value={form.province} onChange={e=>update("province",e.target.value)}><option value="">Select Province</option>{provinces.map(p=><option key={p}>{p}</option>)}</select>
  <input placeholder="Postal code" value={form.postal} onChange={e=>update("postal",e.target.value)}/>
  <h3>Total: {money(total)}</h3>
  <p><b>Payment:</b> Cash on delivery</p>
  <button className="btn dark" disabled={submitting}>{submitting?"Placing order…":"Place order"}</button>
 </form></main>
}
