// utils/imageCompression.ts
import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1.5, // Aumentamos para 1.5MB
    maxWidthOrHeight: 2048, // Aumentamos para 2048 pixels
    useWebWorker: true,
    quality: 0.8 // Adicionamos um parâmetro de qualidade (0 a 1)
  };
  
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('Error compressing image:', error);
    return file; // Retorna o arquivo original se a compressão falhar
  }
}


// para usar, seguir os passos:

// import { compressImage } from '@/utils/imageCompression'

// if (selectedFile) {
//   const compressedFile = await compressImage(selectedFile)
//   const uploadResult = await startUpload([compressedFile])
//   // ... (o resto permanece igual)
// }