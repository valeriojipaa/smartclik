'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  imageUrl?: string;
  originalImageUrl?: string;
  onChange: (imageUrl: string, originalImageUrl: string) => void;
}

export function ProductBackgroundRemoval({ imageUrl, originalImageUrl, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState('');
  const worker = useRef<Worker | null>(null);
  const request = useRef(0);

  useEffect(() => {
    request.current++;
    worker.current?.terminate();
    worker.current = null;
    setBusy(false);
    setPreview('');
    setMessage('');
    return () => { request.current++; worker.current?.terminate(); };
  }, [imageUrl]);

  function cancel() {
    request.current++;
    worker.current?.terminate();
    worker.current = null;
    setBusy(false);
    setMessage('Processamento cancelado.');
  }

  async function remove() {
    if (!imageUrl || busy) return;
    const token = ++request.current;
    setBusy(true);
    setPreview('');
    setMessage('Preparando imagem…');
    try {
      // Limit work and memory on phones. The original is kept for restoring later.
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = imageUrl;
      await image.decode();
      const scale = Math.min(1, 1200 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas.getContext('2d')!.drawImage(image, 0, 0, canvas.width, canvas.height);
      const source = canvas.toDataURL('image/png');
      if (token !== request.current) return;
      const instance = new Worker(new URL('../workers/removeProductBackground.worker.ts', import.meta.url), { type: 'module' });
      worker.current = instance;
      const fail = (text: string) => { if (token !== request.current) return; instance.terminate(); worker.current = null; setBusy(false); setMessage(text); };
      instance.onerror = () => fail('O removedor não iniciou neste navegador. Tente novamente ou use outro navegador.');
      instance.onmessage = async event => {
        if (token !== request.current) return;
        const result = event.data;
        if (result.status === 'progress') setMessage(result.message);
        if (result.status === 'error') fail(result.message);
        if (result.status === 'done') {
          const reader = new FileReader();
          reader.onload = () => {
            if (token !== request.current) return;
            setPreview(String(reader.result));
            setBusy(false);
            setMessage('Confira o recorte antes de aplicar.');
          };
          reader.onerror = () => fail('Não foi possível abrir o resultado. Tente novamente.');
          reader.readAsDataURL(result.blob);
          instance.terminate();
          worker.current = null;
        }
      };
      instance.postMessage({ imageUrl: source });
    } catch {
      if (token !== request.current) return;
      setBusy(false);
      setMessage('Não foi possível abrir esta foto. Envie o arquivo pelo botão ENVIAR FOTO.');
    }
  }

  return <div className="space-y-2">
    <div className="flex gap-2 flex-wrap">
      <button type="button" disabled={!imageUrl || busy} className="sc-upload-button disabled:opacity-50" onClick={remove}>{busy ? 'REMOVENDO FUNDO…' : 'REMOVER FUNDO'}</button>
      {busy && <button type="button" className="sc-upload-button" onClick={cancel}>Cancelar</button>}
      {originalImageUrl && originalImageUrl !== imageUrl && <button type="button" className="sc-upload-button" disabled={busy} onClick={() => onChange(originalImageUrl, originalImageUrl)}>RESTAURAR ORIGINAL</button>}
    </div>
    {message && <p role="status" className="text-xs">{message}</p>}
    {preview && <div className="rounded-xl border p-3 space-y-2">
      <div style={{ background: 'repeating-conic-gradient(#e8e8ed 0% 25%, white 0% 50%) 0 / 16px 16px', borderRadius: 8 }}><img src={preview} alt="Prévia do produto sem fundo" style={{ height: 180, width: '100%', objectFit: 'contain' }}/></div>
      <div className="flex gap-2"><button type="button" className="sc-upload-button" onClick={() => onChange(preview, originalImageUrl || imageUrl!)}>USAR ESTA IMAGEM</button><button type="button" className="sc-upload-button" onClick={() => setPreview('')}>Descartar</button></div>
    </div>}
    <p className="text-[10px] text-slate-500">O primeiro uso baixa o modelo de recorte. O processamento acontece neste dispositivo e pode demorar.</p>
  </div>;
}
