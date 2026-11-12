import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

async function ready(element:HTMLElement){await document.fonts?.ready;await Promise.all(Array.from(element.querySelectorAll('img')).map(im=>im.decode().catch(()=>{throw Error('Imagem não carregou: '+im.alt)})));await new Promise<void>(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r())));}
export async function exportElementToPng(element: HTMLElement, filename: string): Promise<void> {
  try {
    // Aguardar fontes carregarem
    if (document.fonts) {
      await document.fonts.ready;
    }

    await ready(element);
    const dataUrl = await toPng(element, {
      filter: (node: HTMLElement) => !node.hasAttribute?.('data-editor-control'),
      quality: 0.95,
      pixelRatio: Math.abs(element.offsetHeight/element.offsetWidth-297/210)<.01?2480/540:2,
      cacheBust: true,
    });

    const link = document.createElement('a');
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Erro ao exportar PNG:', error);
    throw error;
  }
}

export async function exportElementsToPdf(
  elements: HTMLElement[],
  filename: string,
  format: 'stories' | 'feed' | 'a4' | 'a5'
): Promise<void> {
  try {
    if (document.fonts) {
      await document.fonts.ready;
    }

    // Configurar dimensões do PDF conforme formato
    // A4: 210 x 297 mm
    let orientation: 'p' | 'portrait' = 'p';
    let pdfWidth = 210;
    let pdfHeight = 297;

    if (format === 'stories') {
      pdfWidth = 108;
      pdfHeight = 192; // 9:16
    } else if (format === 'feed') {
      pdfWidth = 108;
      pdfHeight = 135; // 4:5
    }

    if(format==='a5'){pdfWidth=148;pdfHeight=210;}
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: format === 'a4' ? 'a4' : [pdfWidth, pdfHeight],
    });

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      await ready(el);
      const dataUrl = await toPng(el, {
        filter: (node: HTMLElement) => !node.hasAttribute?.('data-editor-control'),
      quality: 0.95,
        pixelRatio: format==='a4'?2480/540:2,
        cacheBust: true,
      });

      if (i > 0) {
        pdf.addPage(format === 'a4' ? 'a4' : [pdfWidth, pdfHeight], orientation);
      }

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }

    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    throw error;
  }
}
