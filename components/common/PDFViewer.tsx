import { Document, Page } from 'react-pdf';
export default function PDFViewer({ url }: { url: string }) {
  return (
    <div style={{ width: '100%', height: 600 }}>
      <Document file={url} loading={<div>Loading PDF...</div>}>
        <Page pageNumber={1} width={800} />
      </Document>
    </div>
  );
} 