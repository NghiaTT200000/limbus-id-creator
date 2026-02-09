import * as htmlToImage from 'html-to-image';

export default async function TurnRefToImg(ref:React.MutableRefObject<any>):Promise<string>{
    const dataUrl = await htmlToImage.toPng(ref.current, {
        filter: (node) => {
            if (node instanceof HTMLImageElement && node.naturalWidth === 0) {
                return false;
            }
            return true;
        }
    })
    return dataUrl
}