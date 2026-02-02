export default function downloadImg(url: string, fileName: string): void {
    const link = document.createElement('a')
    link.download = fileName
    link.href = url
    link.click()
}
