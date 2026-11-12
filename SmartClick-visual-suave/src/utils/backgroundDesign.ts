import {CSSProperties} from 'react';
import {getBackground} from '@/constants/backgrounds';
export function backgroundDesign(id?:string):{header:CSSProperties;body:CSSProperties;footer:CSSProperties}{const b=getBackground(id);const base=b.primary||'#634c85',accent=b.accent||'#e1d0ed';let header:CSSProperties={background:base};let body:CSSProperties={background:'#fff'};let footer:CSSProperties={borderTop:`3px solid ${accent}`};switch(id){
case 'comercial':header={background:`linear-gradient(150deg,${base} 75%,${accent} 75%)`,borderRadius:'0 0 42px 0'};break;
case 'azul':header={background:`linear-gradient(125deg,transparent 78%,${accent} 78%,${accent} 84%,transparent 84%),${base}`,borderRadius:'0 0 0 32px'};break;
case 'verde':case 'menta':header={background:`radial-gradient(ellipse at 0 100%,${accent} 0 16%,transparent 16%),radial-gradient(ellipse at 100% 0,${accent} 0 12%,transparent 12%),${base}`,borderRadius:'0 0 45% 8%'};break;
case 'premium':header={background:`linear-gradient(135deg,${accent} 0 5%,transparent 5% 7%,${accent} 7% 8%,transparent 8% 90%,${accent} 90% 92%,transparent 92%),${base}`};break;
case 'ondas':header={background:`radial-gradient(ellipse at 90% 130%,${accent} 0 24%,transparent 24%),${base}`,borderRadius:'0 0 50% 0'};break;
case 'oceano':header={background:`repeating-linear-gradient(115deg,transparent 0 45px,#ffffff16 45px 47px),${base}`,borderRadius:'0 0 22px 55px'};break;
case 'diagonal':header={background:`linear-gradient(105deg,${accent} 0 8%,transparent 8% 90%,${accent} 90%),${base}`,borderBottom:`8px solid ${accent}`};break;
case 'vinho':header={background:`radial-gradient(circle at 100% 50%,transparent 0 48px,${accent} 49px 53px,transparent 54px),${base}`,borderRadius:'0 0 0 55px'};break;
case 'violeta':header={background:`linear-gradient(165deg,transparent 70%,${accent} 70% 74%,transparent 74%),linear-gradient(20deg,${base},#9d57ce)`,borderRadius:'0 0 24px 24px'};break;
case 'marinho':header={background:`linear-gradient(60deg,transparent 0 80%,${accent} 80% 85%,transparent 85%),${base}`,borderTop:`6px solid ${accent}`};break;
case 'terra':header={background:`radial-gradient(circle at 0 0,${accent} 0 35px,transparent 36px),radial-gradient(circle at 100% 100%,${accent} 0 45px,transparent 46px),${base}`,borderRadius:'0 0 50px 0'};break;
case 'grafite':header={background:`repeating-linear-gradient(45deg,#ffffff0b 0 12px,transparent 12px 24px),${base}`,clipPath:'polygon(0 0,100% 0,100% 88%,96% 100%,0 100%)'};break;
case 'citrico':header={background:`radial-gradient(circle at 92% 25%,${accent} 0 25px,transparent 26px),${base}`,borderRadius:'0 0 60px 60px'};break;
case 'none':header={background:'#fff'};footer={borderTop:'1px solid #ddd'};break;
}if(id!=='none'&&id!=='original')body={background:`linear-gradient(90deg,${accent} 0 3px,#fff 3px calc(100% - 3px),${accent} calc(100% - 3px))`};return {header,body,footer}}
