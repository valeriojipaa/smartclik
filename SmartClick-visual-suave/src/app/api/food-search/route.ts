import { NextRequest, NextResponse } from 'next/server';
export async function GET(req:NextRequest){
 const q=req.nextUrl.searchParams.get('q')?.trim()||'';
 if(q.length<3||q.length>100)return NextResponse.json({error:'Digite de 3 a 100 caracteres.'},{status:400});
 try{
 const u=new URL('https://world.openfoodfacts.org/cgi/search.pl');
 Object.entries({search_terms:q,search_simple:'1',action:'process',json:'1',page_size:'20',fields:'code,product_name,product_name_pt,brands,quantity,image_front_url,url'}).forEach(([k,v])=>u.searchParams.set(k,v));
 const res=await fetch(u,{headers:{'User-Agent':'SmartClick/1.0 (product catalog lookup)'},signal:AbortSignal.timeout(15000),next:{revalidate:3600}});
 if(!res.ok)return NextResponse.json({error:'A fonte de imagens está temporariamente indisponível. Tente depois.'},{status:503});
 const data=await res.json();
 const products=(data.products||[]).filter((p:Record<string,string>)=>p.image_front_url&&(p.product_name_pt||p.product_name)).slice(0,3).map((p:Record<string,string>)=>({id:p.code,name:p.product_name_pt||p.product_name,brand:p.brands||'',quantity:p.quantity||'',image:p.image_front_url,source:`https://world.openfoodfacts.org/product/${encodeURIComponent(p.code)}`}));
 return NextResponse.json({products});
 }catch{return NextResponse.json({error:'Não foi possível consultar as fotos. Seu catálogo foi preservado.'},{status:503})}
}
