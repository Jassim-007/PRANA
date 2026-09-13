const MAX_SOURCE_FILE_BYTES = 15 * 1024 * 1024 // 15MB — reject absurdly large files early
const MAX_DIMENSION = 1280 // longest side, px — keeps the base64 payload small
const JPEG_QUALITY = 0.72

const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])

export type PhotoProcessError =
  | 'unsupported-type'
  | 'too-large'
  | 'read-failed'

export type PhotoProcessResult =
  | { ok: true; dataUrl: string }
  | { ok: false; error: PhotoProcessError }

/**
 * Validates and downsizes a user-selected image file into a compact
 * JPEG data URL. Keeping the result small avoids sessionStorage quota
 * errors (a raw phone-camera photo can be 5-10MB, which throws when
 * persisted as-is) and keeps the eventual API payload lightweight.
 */
export function processPhotoFile(file: File): Promise<PhotoProcessResult> {
  return new Promise((resolve) => {
    if (!ACCEPTED_TYPES.has(file.type)) {
      resolve({ ok: false, error: 'unsupported-type' })
      return
    }
    if (file.size > MAX_SOURCE_FILE_BYTES) {
      resolve({ ok: false, error: 'too-large' })
      return
    }

    const reader = new FileReader()
    reader.onerror = () => resolve({ ok: false, error: 'read-failed' })
    reader.onload = () => {
      const raw = typeof reader.result === 'string' ? reader.result : null
      if (!raw) {
        resolve({ ok: false, error: 'read-failed' })
        return
      }

      const img = new Image()
      img.onerror = () => resolve({ ok: false, error: 'read-failed' })
      img.onload = () => {
        try {
          const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height))
          const width = Math.max(1, Math.round(img.width * scale))
          const height = Math.max(1, Math.round(img.height * scale))

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            // No canvas support — fall back to the original (already size-capped) data URL.
            resolve({ ok: true, dataUrl: raw })
            return
          }
          ctx.drawImage(img, 0, 0, width, height)
          const compressed = canvas.toDataURL('image/jpeg', JPEG_QUALITY)
          resolve({ ok: true, dataUrl: compressed })
        } catch {
          resolve({ ok: true, dataUrl: raw })
        }
      }
      img.src = raw
    }
    reader.readAsDataURL(file)
  })
}

export function photoErrorMessage(error: PhotoProcessError): string {
  switch (error) {
    case 'unsupported-type':
      return 'Please choose a JPG, PNG, or WebP photo.'
    case 'too-large':
      return 'That photo is too large. Please choose a smaller one.'
    case 'read-failed':
    default:
      return 'That photo could not be used. Please try another.'
  }
}
