import * as htmlToImage from 'html-to-image';

export default async function TurnRefToImg(ref:React.MutableRefObject<any>):Promise<string>{
    const dataUrl = await htmlToImage.toPng(ref.current)
    return dataUrl
}