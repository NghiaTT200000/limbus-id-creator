declare module 'react-map-interaction' {
  import { ReactNode } from 'react';

  interface MapInteractionProps {
    children?: ReactNode;
    [key: string]: any;
  }

  export const MapInteractionCSS: React.FC<MapInteractionProps>;
  export default MapInteractionCSS;
}