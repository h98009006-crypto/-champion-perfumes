"use client";
import {useEffect,useState} from "react";
export default function Checkout(){
 const [cart,setCart]=useState([]),[done,setDone]=useState(false);
 const [form,setForm]=useState({name:"",email:"",phone:"",address:"",city:"",postal:""});
 useEffect(()=>setCart(JSON.parse(localStorage.getItem("champion-cart")||"[]")),[]);
 const total=cart.reduce((s,p)=>s+p.price*p.qty,0);
 async function submit(e){e.preventDefault();const r=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,items:cart,total,payment_method:"cod"})});if(r.ok){localStorage.removeItem("champion-cart");setDone(true)}}
 if(done)return <main className="section"><h1>Order received.</h1><p>Thank you for choosing Champion Perfumes. We'll contact you to confirm your order.</p><a className="btn dark" href="/">Back to store</a></main>;
 return <main className="section"><div className="eyebrow">CHECKOUT</div><h1>Complete your order</h1><p>Cash on delivery is enabled by default. Online payment can be connected after your payment-gateway merchant account is approved.</p><form className="panel" onSubmit={submit}><input required placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input required placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><input required placeholder="Street address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/><input required placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/><input placeholder="Postal code" value={form.postal} onChange={e=>setForm({...form,postal:e.target.value})}/><h3>Total: ${total.toFixed(2)}</h3><button className="btn dark">Place order</button></form></main>}
