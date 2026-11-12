import { AutoModel, AutoProcessor, RawImage, env } from '@huggingface/transformers';

env.allowLocalModels = false;
if (env.backends.onnx.wasm) env.backends.onnx.wasm.numThreads = 1;

self.onmessage = async (event: MessageEvent<{ imageUrl: string }>) => {
  try {
    self.postMessage({ status: 'progress', message: 'Preparando o removedor. No primeiro uso, o modelo será baixado.' });
    const modelId = 'onnx-community/BiRefNet_lite-ONNX';
    const model = await AutoModel.from_pretrained(modelId, {
      device: 'wasm', dtype: 'fp32',
      progress_callback: progress => {
        if (progress.status === 'progress') {
          self.postMessage({ status: 'progress', message: `Baixando recursos: ${Math.round(progress.progress)}%` });
        }
      },
    });
    const processor = await AutoProcessor.from_pretrained(modelId);
    self.postMessage({ status: 'progress', message: 'Recortando o produto… Aguarde.' });
    const image = await RawImage.fromURL(event.data.imageUrl);
    const { pixel_values } = await processor(image);
    const { output_image } = await model({ input_image: pixel_values });
    const mask = await RawImage.fromTensor(output_image[0].sigmoid().mul(255).to('uint8')).resize(image.width, image.height);
    const canvas = new OffscreenCanvas(image.width, image.height);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Seu navegador não oferece o recurso de imagem necessário.');
    const bitmap = await createImageBitmap(await image.toBlob());
    context.drawImage(bitmap, 0, 0);
    bitmap.close();
    const pixels = context.getImageData(0, 0, image.width, image.height);
    for (let index = 0; index < image.width * image.height; index++) {
      pixels.data[index * 4 + 3] = Math.round(pixels.data[index * 4 + 3] * mask.data[index * mask.channels] / 255);
    }
    context.putImageData(pixels, 0, 0);
    const blob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.92 });
    await model.dispose();
    self.postMessage({ status: 'done', blob });
  } catch {
    self.postMessage({ status: 'error', message: 'Não foi possível remover o fundo. Confira sua conexão e tente novamente. Sua foto foi preservada.' });
  }
};
