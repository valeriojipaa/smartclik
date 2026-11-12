export const BACKGROUNDS = [
 {id:'none',name:'Sem fundo',primary:'#ffffff',accent:'#ffffff',shape:'straight'},
 {id:'original',name:'Cores do modelo',primary:'',accent:'',shape:'straight'},
 {id:'comercial',name:'Comercial',primary:'#e53935',accent:'#ffc107',shape:'curve'},
 {id:'azul',name:'Azul moderno',primary:'#103aa9',accent:'#00cee3',shape:'ribbon'},
 {id:'verde',name:'Hortifruti verde',primary:'#087637',accent:'#a2cd1d',shape:'leaf'},
 {id:'premium',name:'Preto e dourado',primary:'#202020',accent:'#dbb13b',shape:'diagonal'},
] as const;
export function getBackground(id?:string){return BACKGROUNDS.find(b=>b.id===id)||BACKGROUNDS[0]}
