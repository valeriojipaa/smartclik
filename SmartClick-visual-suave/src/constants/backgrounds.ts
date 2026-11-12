export const BACKGROUNDS = [
 {id:'none',name:'Sem fundo',primary:'#ffffff',accent:'#ffffff',shape:'straight'},
 {id:'original',name:'Cores do modelo',primary:'',accent:'',shape:'straight'},
 {id:'comercial',name:'Comercial',primary:'#e53935',accent:'#ffc107',shape:'curve'},
 {id:'azul',name:'Azul moderno',primary:'#103aa9',accent:'#00cee3',shape:'ribbon'},
 {id:'verde',name:'Hortifruti verde',primary:'#087637',accent:'#a2cd1d',shape:'leaf'},
 {id:'premium',name:'Preto e dourado',primary:'#202020',accent:'#dbb13b',shape:'diagonal'},
 {id:'ondas',name:'Ondas coral',primary:'#d94755',accent:'#ffd98c',shape:'curve'},
 {id:'oceano',name:'Oceano',primary:'#006d86',accent:'#b6f3ee',shape:'ribbon'},
 {id:'diagonal',name:'Faixas laranja',primary:'#c64c12',accent:'#ffe3a4',shape:'diagonal'},
 {id:'vinho',name:'Vinho elegante',primary:'#70243e',accent:'#f0c8a0',shape:'curve'},
 {id:'menta',name:'Menta fresca',primary:'#276e5c',accent:'#d6f6d2',shape:'leaf'},
 {id:'violeta',name:'Violeta moderno',primary:'#573b8b',accent:'#e6d6ff',shape:'ribbon'},
 {id:'marinho',name:'Marinho dourado',primary:'#173553',accent:'#f6d46b',shape:'diagonal'},
 {id:'terra',name:'Terracota',primary:'#a44630',accent:'#f7d7b8',shape:'curve'},
 {id:'grafite',name:'Grafite geométrico',primary:'#34383f',accent:'#e7e8eb',shape:'diagonal'},
 {id:'citrico',name:'Cítrico',primary:'#47731a',accent:'#e7f6a2',shape:'leaf'},
] as const;
export function getBackground(id?:string){return BACKGROUNDS.find(b=>b.id===id)||BACKGROUNDS[0]}
