import imageCompression from 'browser-image-compression'
import getImageDimensions from 'Utils/getImageDimensions'

export async function compressAndReadImage(file: File): Promise<string> {
    const { width } = await getImageDimensions(file)
    const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        useWebWorker: true,
        maxWidthOrHeight: Math.max(1650, Math.floor(width * (2 / 3)))
    })

    return new Promise<string>((resolve, reject) => {
        const fr = new FileReader()
        fr.readAsDataURL(compressedFile)
        fr.addEventListener("load", () => {
            resolve(fr.result as string)
        })
        fr.addEventListener("error", () => {
            reject(new Error("Failed to read file"))
        })
    })
}
