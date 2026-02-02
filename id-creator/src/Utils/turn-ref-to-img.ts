import * as htmlToImage from 'html-to-image';

export default async function turnRefToImg(ref: React.MutableRefObject<any>): Promise<string> {
    try {
        const dataUrl = await htmlToImage.toPng(ref.current)
        return dataUrl
    }
    catch(err) {
        console.log(err)
        return ""
    }
}
