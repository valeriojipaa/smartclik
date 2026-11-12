import { CampaignItem, FlyerFormat } from '@/types';
export const MAX_ITEMS_PER_PAGE = 22;
export function chunkItemsByFormat(items: CampaignItem[], _format: FlyerFormat): CampaignItem[][] {
 const pages: CampaignItem[][]=[];
 for(let i=0;i<items.length;i+=MAX_ITEMS_PER_PAGE) pages.push(items.slice(i,i+MAX_ITEMS_PER_PAGE));
 return pages.length?pages:[[]];
}
export function getGrid(count:number, format:FlyerFormat){
 const cols=count<=1?1:count<=4?2:count<=9?3:count<=16?4:format==='stories'?4:5;
 return {cols,rows:Math.max(1,Math.ceil(count/cols))};
}
