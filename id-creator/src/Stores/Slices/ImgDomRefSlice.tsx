let domRef: React.MutableRefObject<any> | null = null;

export function registerDomRef(ref: React.MutableRefObject<any>) {
    domRef = ref;
}

export function getDomRef() {
    return domRef;
}