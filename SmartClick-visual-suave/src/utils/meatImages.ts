const MEAT_IMAGES = [
  { name: 'Patinho moído', pattern: /\bpatinho\b.*\bmoid[ao]\b|\bmoid[ao]\b.*\bpatinho\b/, file: 'patinho-moido.webp' },
  { name: 'Acém', pattern: /\bacem\b/, file: 'acem.webp' },
  { name: 'Patinho', pattern: /\bpatinho\b/, file: 'patinho.webp' },
  { name: 'Contrafilé', pattern: /\bcontra\s*file\b/, file: 'contrafile.webp' },
  { name: 'Alcatra', pattern: /\balcatra\b/, file: 'alcatra.webp' },
  { name: 'Picanha', pattern: /\bpicanha\b/, file: 'picanha.webp' },
  { name: 'Coxão mole', pattern: /\bcoxao\s+mole\b/, file: 'coxao-mole.webp' },
  { name: 'Músculo', pattern: /\bmusculo\b/, file: 'musculo.webp' },
  { name: 'Costela bovina', pattern: /\bcostela\b/, file: 'costela-bovina.webp' },
];

export function getMeatImage(productName: string): string | undefined {
  const name = productName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  // These pictures represent raw beef cuts. Other species and preparations need their own images.
  if (/\b(suin[ao]|porc[ao]|cordeiro|ovin[ao]|frango|caprin[ao]|hamburguer|assad[ao]|cozid[ao]|grelhad[ao]|defumad[ao]|congelad[ao])\b/.test(name)) return;
  const ground = /\bmoid[ao]\b/.test(name);
  if (ground && !/\bpatinho\b/.test(name)) return;
  const match = MEAT_IMAGES.find(image => image.pattern.test(name));
  return match ? `https://sihrhmizpigscavtrtyl.supabase.co/storage/v1/object/public/selos/${match.file}` : undefined;
}
