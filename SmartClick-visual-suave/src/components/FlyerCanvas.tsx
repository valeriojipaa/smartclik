import React from 'react';
import { getBackground } from '@/constants/backgrounds';
import { CampaignItem, FlyerFormat, StoreProfile, VisualTheme } from '@/types';
import { getGrid } from '@/utils/layoutEngine';
interface Props {backgroundId?:string;badgeUrl?:string;id?:string;theme:VisualTheme;store:StoreProfile;campaignTitle:string;startDate:string;endDate:string;format:FlyerFormat;items:CampaignItem[];pageIndex:number;totalPages:number;hasStockLimit?:boolean;hasIllustrativeImagesNotice?:boolean;scale?:number}
export function FlyerCanvas({backgroundId,badgeUrl,id,theme,store,campaignTitle,startDate,endDate,format,items,pageIndex,totalPages,hasStockLimit=false,hasIllustrativeImagesNotice=false,scale=1}:Props){
 const bg=getBackground(backgroundId);const custom=bg.id!=='original';const plain=bg.id==='none';
 const tagBg=plain?'#ffffff':custom?(bg.id==='comercial'?'#d42020':bg.id==='azul'?'#103aa9':bg.id==='verde'?'#087637':'#ffc107'):theme.priceTagBg;
 const lightTag=['#ffffff','#fff','#ffc107','#ffeb3b','#ffca28','#ffd54f'].includes(tagBg.toLowerCase());const tagText=lightTag?'#151515':'#fff8db';
 const height=format==='stories'?960:format==='feed'?675:764;
 const {cols,rows}=getGrid(items.length,format);const dense=items.length>12;
 const legal=[hasStockLimit?'Ofertas válidas enquanto durarem os estoques.':'',hasIllustrativeImagesNotice?'Imagens ilustrativas.':'',store.footerLegalText||''].filter(Boolean).join(' ');
 const footerHeight=Math.max(66,Math.ceil((legal.length+store.address.length+store.name.length+70)/105)*10+26);
 const headerHeight=badgeUrl?(dense?135:175):(dense?100:135);const cellHeight=(height-headerHeight-footerHeight-20-(rows-1)*5)/rows;
 const date=(s:string)=>s?s.split('-').reverse().join('/'):'';
 return <div id={id} className="sc-flyer" style={{width:540,height,display:'flex',flexDirection:'column',flexShrink:0,background:custom?'#ffffff':theme.bodyBackground,color:'#202020',fontFamily:'Arial, sans-serif',transform:scale!==1?`scale(${scale})`:undefined,transformOrigin:'top left'}}>
 <header style={{position:'relative',isolation:'isolate',height:headerHeight,flexShrink:0,background:custom?bg.primary:theme.headerBackground,color:plain?'#202020':'white',padding:'10px 15px',display:'flex',flexDirection:'column',justifyContent:'space-between',borderBottom:custom?`3px solid ${bg.accent}`:undefined,borderBottomRightRadius:bg.shape==='curve'?55:bg.shape==='leaf'?35:0}}>
 {custom&&!plain&&<div aria-hidden="true" style={{position:'absolute',right:0,top:0,width:55,height:headerHeight*.55,background:bg.accent,clipPath:bg.shape==='leaf'?'ellipse(28% 45% at 85% 10%)':'polygon(100% 0,100% 100%,0 0)',zIndex:-1}}/>}
 <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12,fontWeight:700}}>{store.logoUrl&&<img src={store.logoUrl} alt="" style={{width:60,height:27,objectFit:'contain'}}/>}<span>{store.name}</span><span style={{marginLeft:'auto',fontSize:9}}>{pageIndex+1}/{totalPages}</span></div>
 <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:0,flex:1}}>{badgeUrl?<img src={badgeUrl} alt="Selo promocional" crossOrigin="anonymous" style={{width:'75%',height:dense?82:118,objectFit:'contain'}}/>:<h1 style={{fontSize:dense?24:34,fontWeight:900,lineHeight:1.05,margin:0,textAlign:'center',overflowWrap:'anywhere'}}>{campaignTitle||theme.name}</h1>}</div>
 <div style={{fontSize:10}}>Válido de {date(startDate)} até {date(endDate)}</div></header>
 <div style={{flex:1,minHeight:0,padding:10,display:'grid',gridTemplateColumns:`repeat(${cols},minmax(0,1fr))`,gridTemplateRows:`repeat(${rows},minmax(0,1fr))`,gap:5}}>
 {items.map(item=>{const p=item.product;const extra=!!item.limitPerCustomer||!!item.conditions;const nameSize=Math.max(7,Math.min(12,cellHeight*.12,Math.floor(240/(p.name.length/cols+12))));const amount=item.promoPrice.toFixed(2).split('.');const priceSize=Math.max(16,Math.min(46,cellHeight*.27,(500/cols-18)/(amount[0].length*.6+1.6)));return <article key={item.id} style={{minWidth:0,minHeight:0,padding:5,background:custom?'#ffffff':theme.cardBg,border:`1px solid ${theme.cardBorder}`,borderRadius:6,display:'flex',flexDirection:'column',textAlign:'center',gap:2}}>
 <div style={{flex:1,minHeight:12,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>{p.imageUrl?<img src={p.imageUrl} alt={p.name} crossOrigin="anonymous" style={{width:'100%',height:'100%',objectFit:'contain',minHeight:0}} onError={e=>{e.currentTarget.style.display='none'}}/>:<span style={{fontSize:9,color:'#7d7d7d'}}>Sem foto</span>}</div>
 <div style={{fontSize:nameSize,lineHeight:1.12,fontWeight:700,overflowWrap:'anywhere'}}>{p.name}</div>
 <div style={{fontSize:8,lineHeight:1.1}}>{[p.brand,p.packageContent].filter(Boolean).join(' • ')}</div>
 {item.regularPrice&&item.regularPrice>item.promoPrice?<div style={{fontSize:8,textDecoration:'line-through'}}>De {item.regularPrice.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</div>:null}
 <div aria-label={item.promoPrice.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} style={{background:tagBg,color:tagText,borderRadius:5,padding:'3px 4px',fontWeight:900,fontStyle:'italic',display:'flex',alignItems:'flex-start',justifyContent:'center',lineHeight:1,whiteSpace:'nowrap',flexShrink:0}}><span style={{fontSize:Math.max(7,priceSize*.25),paddingTop:2,marginRight:2}}>R$</span><span style={{fontSize:priceSize,letterSpacing:'-.06em'}}>{Number(amount[0]).toLocaleString('pt-BR')}</span><span style={{fontSize:priceSize*.46,paddingTop:priceSize*.07}}>,{amount[1]}</span></div>
 <div style={{fontSize:8}}>por {p.saleUnit}</div>{extra&&<div style={{fontSize:7,lineHeight:1.1}}>{item.limitPerCustomer?`Limite: ${item.limitPerCustomer} por cliente. `:''}{item.conditions}</div>}
 {item.highlightBadge&&<div style={{fontSize:7,fontWeight:700}}>{item.highlightBadge}</div>}
 </article>})}</div>
 <footer style={{minHeight:footerHeight,flexShrink:0,padding:'7px 12px',background:'white',borderTop:custom?`2px solid ${bg.accent}`:'1px solid #ddd',fontSize:8,lineHeight:1.3,overflowWrap:'anywhere'}}><strong>{store.name}</strong> · {store.phone} {store.whatsapp&&`· WhatsApp: ${store.whatsapp}`}<div>{store.address}</div><div>{legal}</div>{items.some(i=>i.product.notes?.includes('Open Food Facts'))&&<div>Fotos: Open Food Facts • CC BY-SA 3.0 • versões recortadas podem ser adaptações.</div>}</footer>
 </div>
}
