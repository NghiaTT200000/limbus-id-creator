import { domToPng } from 'modern-screenshot';

export default async function TurnRefToImg(ref:React.MutableRefObject<any>):Promise<string>{
    const dataUrl = await domToPng(ref.current, {
        filter: (node) => {
            if (node instanceof HTMLImageElement && node.naturalWidth === 0) {
                return false;
            }
            return true;
        }
    })
    return dataUrl
}