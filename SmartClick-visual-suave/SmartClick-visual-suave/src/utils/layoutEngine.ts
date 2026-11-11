import { CampaignItem } from '@/types';

export function chunkItemsByFormat(items: CampaignItem[], format: 'stories' | 'feed' | 'a4'): CampaignItem[][] {
  let perPage = 6;
  if (format === 'stories') {
    // Stories: 4 a 6 por página, max 8
    perPage = items.length <= 8 ? (items.length <= 4 ? items.length : items.length <= 6 ? 6 : 8) : 6;
  } else if (format === 'feed') {
    // Feed: 4 a 6, até 9
    perPage = items.length <= 9 ? (items.length <= 4 ? items.length : items.length <= 6 ? 6 : 9) : 6;
  } else if (format === 'a4') {
    // A4: 6 a 12 por página
    perPage = items.length <= 12 ? items.length : 12;
  }

  const pages: CampaignItem[][] = [];
  for (let i = 0; i < items.length; i += perPage) {
    pages.push(items.slice(i, i + perPage));
  }

  return pages.length > 0 ? pages : [[]];
}
