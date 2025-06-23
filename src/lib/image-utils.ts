import { isHeic, heicTo } from 'heic-to'
import imageCompression from 'browser-image-compression'

export interface CompressOptions {
  /** Taille max en Mo */
  maxSizeMB?: number
  /** Largeur/hauteur max en px */
  maxWidthOrHeight?: number
  /** Qualité initiale (0–1) */
  initialQuality?: number
}

/**
 * Convertit un HEIC/HEIF en JPEG, puis compresse/redimensionne tout type d'image.
 */
export async function normalizeAndCompress(
  file: File,
  opts: CompressOptions = {}
): Promise<File> {
  let workingFile = file

  // 1) Si HEIC/HEIF, on convertit vers JPEG
  if (await isHeic(file)) {
    try {
      const blob = await heicTo({
        blob: file,
        type: 'image/jpeg',
        quality: opts.initialQuality ?? 0.8,
      })
      workingFile = new File(
        [blob],
        file.name.replace(/\.\w+$/, '.jpg'),
        { type: 'image/jpeg' }
      )
    } catch (e) {
      console.warn('[ImageUtils] Conversion HEIC échouée, on continue avec l\'original', e)
    }
  }

  // 2) Compression + resize
  const compressionOpts = {
    maxSizeMB: opts.maxSizeMB ?? 1,           // 1 Mo max
    maxWidthOrHeight: opts.maxWidthOrHeight ?? 1200,
    useWebWorker: true,
    initialQuality: opts.initialQuality ?? 0.8,
    fileType: 'image/jpeg',
  }

  try {
    const compressed = await imageCompression(workingFile, compressionOpts)
    console.log(
      `[ImageUtils] ${file.name} : ${file.size} → ${compressed.size} octets`
    )
    return compressed
  } catch (e) {
    console.error('[ImageUtils] Compression échouée, on renvoie l\'original', e)
    return workingFile
  }
} 