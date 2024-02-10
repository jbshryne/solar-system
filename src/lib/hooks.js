import { FontLoader } from "three-stdlib";
import { useLoader } from "@react-three/fiber";

export const useFont = (src) => {
  return useLoader(FontLoader, src);
};
