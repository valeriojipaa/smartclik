'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Pause, Play, FileSpreadsheet, Image, Download, Sparkles } from 'lucide-react';
const slides = [
 {title:'Sua lista vira um encarte.', text:'Importe seus produtos, confira os preços e deixe a composição com a SmartClick.', action:'Importar lista', tone:'mint'},
 {title:'Uma ideia para cada ocasião.', text:'Encontre temas para sua loja e transforme suas ofertas em uma campanha especial.', action:'Explorar sugestões', href:'/sugestoes', tone:'lavender'},
 {title:'Pronto para compartilhar.', text:'Crie sua campanha para stories, feed e impressão A4, sem montar tudo de novo.', action:'Criar campanha', href:'/campanhas/nova', tone:'blue'},
];
export function HomeCarousel({onImport}:{onImport:()=>void}){
 const [index,setIndex]=useState(0),[paused,setPaused]=useState(false);
 useEffect(()=>{if(paused||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const timer=setInterval(()=>setIndex(i=>(i+1)%slides.length),7000);return()=>clearInterval(timer)},[paused]);
 const s=slides[index];
 return <section className={`sc-hero ${s.tone}`} aria-roledescription="carrossel" aria-label="Conheça a SmartClick" onMouseEnter={()=>setPaused(true)}>
 <div className="sc-hero-copy" key={index}><span className="sc-eyebrow">MAIS SIMPLES. MAIS SMART.</span><h2>{s.title}</h2><p>{s.text}</p><div className="sc-hero-actions">{s.href?<Link className="sc-primary" href={s.href}>{s.action}<ArrowRight size={16}/></Link>:<button className="sc-primary" onClick={onImport}>{s.action}<ArrowRight size={16}/></button>}<Link className="sc-secondary" href="/produtos">Meus produtos</Link></div></div>
 <div className="sc-scene" aria-hidden="true"><div className="sc-orbit"/><div className="sc-object sc-sheet"><FileSpreadsheet/><span>Seus produtos</span></div><div className="sc-object sc-art"><Image/><span>Seu encarte</span></div><div className="sc-object sc-download"><Download/></div><div className="sc-spark"><Sparkles/></div></div>
 <div className="sc-slide-controls"><button aria-label="Slide anterior" onClick={()=>setIndex((index+2)%3)}><ArrowLeft size={14}/></button><div className="sc-dots">{slides.map((_,i)=><button key={i} aria-label={`Ir para slide ${i+1}`} aria-current={i===index?'true':undefined} onClick={()=>setIndex(i)}/>)}</div><button aria-label="Próximo slide" onClick={()=>setIndex((index+1)%3)}><ArrowRight size={14}/></button><button aria-label={paused?'Reproduzir slides':'Pausar slides'} onClick={()=>setPaused(!paused)}>{paused?<Play size={13}/>:<Pause size={13}/>}</button></div>
 </section>
}
