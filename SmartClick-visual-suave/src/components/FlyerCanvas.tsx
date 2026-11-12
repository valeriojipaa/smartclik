import React from 'react';
import { CampaignItem, FlyerFormat, StoreProfile, VisualTheme } from '@/types';
import { getGrid } from '@/utils/layoutEngine';
interface Props {id?:string;theme:VisualTheme;store:StoreProfile;campaignTitle:string;startDate:string;endDate:string;format:FlyerFormat;items:CampaignItem[];pageIndex:number;totalPages:number;hasStockLimit?:boolean;hasIllustrativeImagesNotice?:boolean;scale?:number}
export function FlyerCanvas({id,theme,store,campaignTitle,startDate,endDate,format,items,pageIndex,totalPages,hasStockLimit=false,hasIllustrativeImagesNotice=false,scale=1}:Props){
 const height=format==='stories'?960:format==='feed'?675:764;
 const {cols,rows}=getGrid(items.length,format);const dense=items.length>12;
 const legal=[hasStockLimit?'Ofertas válidas enquanto durarem os estoques.':'',hasIllustrativeImagesNotice?'Imagens ilustrativas.':'',store.footerLegalText||''].filter(Boolean).join(' ');
 const footerHeight=Math.max(66,Math.ceil((legal.length+store.address.length+store.name.length+70)/105)*10+26);
 const headerHeight=dense?100:135;const cellHeight=(height-headerHeight-footerHeight-20-(rows-1)*5)/rows;
 const date=(s:string)=>s?s.split('-').reverse().join('/'):'';
 return <div id={id} className="sc-flyer" style={{width:540,height,display:'flex',flexDirection:'column',flexShrink:0,background:theme.bodyBackground,color:'#202020',fontFamily:'Arial, sans-serif',transform:scale!==1?`scale(${scale})`:undefined,transformOrigin:'top left'}}>
 <header style={{height:headerHeight,flexShrink:0,background:theme.headerBackground,color:'white',padding:'10px 15px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
 <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12,fontWeight:700}}>{store.logoUrl&&<img src={store.logoUrl} alt="" style={{width:60,height:27,objectFit:'contain'}}/>}<span>{store.name}</span><span style={{marginLeft:'auto',fontSize:9}}>{pageIndex+1}/{totalPages}</span></div>
 <h1 style={{fontSize:dense?22:30,fontWeight:900,lineHeight:1.05,margin:0,overflowWrap:'anywhere'}}>{campaignTitle||theme.name}</h1>
 <div style={{fontSize:10}}>Válido de {date(startDate)} até {date(endDate)}</div></header>
 <div style={{flex:1,minHeight:0,padding:10,display:'grid',gridTemplateColumns:`repeat(${cols},minmax(0,1fr))`,gridTemplateRows:`repeat(${rows},minmax(0,1fr))`,gap:5}}>
 {items.map(item=>{const p=item.product;const extra=!!item.limitPerCustomer||!!item.conditions;const nameSize=Math.max(7,Math.min(12,cellHeight*.12,Math.floor(240/(p.name.length/cols+12))));const priceSize=Math.max(12,Math.min(32,cellHeight*.22,80/cols));return <article key={item.id} style={{minWidth:0,minHeight:0,padding:5,background:theme.cardBg,border:`1px solid ${theme.cardBorder}`,borderRadius:6,display:'flex',flexDirection:'column',textAlign:'center',gap:2}}>
 <div style={{flex:1,minHeight:12,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>{p.imageUrl?<img src={p.imageUrl} alt={p.name} crossOrigin="anonymous" style={{width:'100%',height:'100%',objectFit:'contain',minHeight:0}} onError={e=>{e.currentTarget.style.display='none'}}/>:<span style={{fontSize:9,color:'#7d7d7d'}}>Sem foto</span>}</div>
 <div style={{fontSize:nameSize,lineHeight:1.12,fontWeight:700,overflowWrap:'anywhere'}}>{p.name}</div>
 <div style={{fontSize:8,lineHeight:1.1}}>{[p.brand,p.packageContent].filter(Boolean).join(' • ')}</div>
 {item.regularPrice&&item.regularPrice>item.promoPrice?<div style={{fontSize:8,textDecoration:'line-through'}}>De {item.regularPrice.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</div>:null}
 <div style={{background:theme.priceTagBg,color:theme.priceTagText,borderRadius:4,padding:'2px 1px',fontWeight:900,fontSize:priceSize,lineHeight:1.1,whiteSpace:'nowrap'}}>{item.promoPrice.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</div>
 <div style={{fontSize:8}}>por {p.saleUnit}</div>{extra&&<div style={{fontSize:7,lineHeight:1.1}}>{item.limitPerCustomer?`Limite: ${item.limitPerCustomer} por cliente. `:''}{item.conditions}</div>}
 {item.highlightBadge&&<div style={{fontSize:7,fontWeight:700}}>{item.highlightBadge}</div>}
 </article>})}</div>
 <footer style={{minHeight:footerHeight,flexShrink:0,padding:'7px 12px',background:'white',borderTop:'1px solid #ddd',fontSize:8,lineHeight:1.3,overflowWrap:'anywhere'}}><strong>{store.name}</strong> · {store.phone} {store.whatsapp&&`· WhatsApp: ${store.whatsapp}`}<div>{store.address}</div><div>{legal}</div>{items.some(i=>i.product.notes?.includes('Open Food Facts'))&&<div>Fotos: Open Food Facts • CC BY-SA 3.0 • versões recortadas podem ser adaptações.</div>}</footer>
 </div>
}
