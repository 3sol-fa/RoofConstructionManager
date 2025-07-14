import dynamic from 'next/dynamic';
import React from 'react';

export interface FileMeta {
  url: string;
  type: string; // 'pdf', 'csv', 'glb', 'gltf', 'obj' 등
  name?: string;
}

const PDFViewer = dynamic<{ url: string }>(() => import('./PDFViewer'), { ssr: false, loading: () => <div>Loading PDF...</div> });
const CSVViewer = dynamic<{ url: string }>(() => import('./CSVViewer'), { ssr: false, loading: () => <div>Loading CSV...</div> });
const ThreeDViewer = dynamic<{ url: string }>(() => import('./ThreeDViewer'), { ssr: false, loading: () => <div>Loading 3D...</div> });

export default function FileViewer({ file }: { file: FileMeta }) {
  if (file.type === 'pdf') return <PDFViewer url={file.url} />;
  if (file.type === 'csv') return <CSVViewer url={file.url} />;
  if (['glb', 'gltf', 'obj'].includes(file.type)) return <ThreeDViewer url={file.url} />;
  return <div>미리보기를 지원하지 않는 파일입니다.</div>;
} 