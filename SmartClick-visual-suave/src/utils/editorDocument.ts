import { Campaign, CampaignItem, FlyerFormat, StoreProfile, VisualThemeId } from '@/types';
export type Position={x:number;y:number};
export type FreeText={id:string;text:string;x:number;y:number;size:number;color:string};
export type Artwork=NonNullable<Campaign['artwork']> & { namePosition?:Position; datePosition?:Position; groupPosition?:Position; texts?:FreeText[] };
export interface EditorPage {id:string;title:string;themeId:VisualThemeId;backgroundId:string;badgeUrl:string;startDate:string;endDate:string;format:FlyerFormat;items:CampaignItem[];artwork:Artwork;store:StoreProfile}
export interface EditorDocument {id:string;pages:EditorPage[];activeId:string}
export const newId=()=>globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
export function copyPage(page:EditorPage):EditorPage {const copy=structuredClone(page);copy.id=newId();copy.items=copy.items.map(i=>({...i,id:newId()}));copy.artwork.texts=copy.artwork.texts?.map(t=>({...t,id:newId()}));return copy}
export const MODES=[{id:'semana',name:'Ofertas da semana',description:'Seleção equilibrada para o dia a dia.',theme:'ofertas-da-semana',background:'azul',badge:'02-ofertas-da-semana.png'},{id:'setor',name:'Festival por setor',description:'Agrupa produtos da mesma categoria.',theme:'feirinha',background:'verde',badge:'06-feirinha.png'},{id:'impacto',name:'Campanha de impacto',description:'Visual marcante com os preços da sua lista.',theme:'promocao',background:'comercial',badge:'01-promocao.png'}] as const;
export function makePages(products:CampaignItem[],base:EditorPage){const pages:EditorPage[]=[];for(let i=0;i<products.length;i+=22)pages.push({...structuredClone(base),id:newId(),items:structuredClone(products.slice(i,i+22))});return pages.length?pages:[base]}
