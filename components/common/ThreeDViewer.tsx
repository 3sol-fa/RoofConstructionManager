import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
export default function ThreeDViewer({ url }: { url: string }) {
  // useGLTF는 glb/gltf만 지원. obj 등은 별도 loader 필요
  const { scene } = useGLTF(url);
  return (
    <div style={{ width: '100%', height: 600 }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight />
        <primitive object={scene} />
        <OrbitControls />
      </Canvas>
    </div>
  );
} 