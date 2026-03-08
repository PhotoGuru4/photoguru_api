export interface EditParams {
  rotate?: number;
  crop?: { width: number; height: number; left: number; top: number };
  resize?: { width: number; height: number };
  brightness?: number;
  contrast?: number;
  saturation?: number;
  sharpness?: boolean;
  filter?:
    | 'sepia'
    | 'grayscale'
    | 'vintage'
    | 'warm'
    | 'cool'
    | 'vibrant'
    | 'none';
}
