import Papa from 'papaparse';
import { useEffect, useState } from 'react';
export default function CSVViewer({ url }: { url: string }) {
  const [data, setData] = useState<any[][]>([]);
  useEffect(() => {
    fetch(url)
      .then(res => res.text())
      .then(text => setData(Papa.parse(text).data as any[][]));
  }, [url]);
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>{row.map((cell, j) => <td key={j} style={{ border: '1px solid #ccc', padding: 4 }}>{cell}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
} 