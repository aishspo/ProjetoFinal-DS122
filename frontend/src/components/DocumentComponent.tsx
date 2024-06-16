import { useState } from 'react';
import { DownloadDocument } from '@/services/documents';

interface IDocument {
  id: number;
  name: string;
  filePath: string;
}

const DocumentComponent: React.FC<{ document: IDocument }> = ({ document }) => {
  const [fileUrl, setFileUrl] = useState<string>('');

  const handleDownload = async () => {
    try {
      const blobData = await DownloadDocument(document.id);
      const url = window.URL.createObjectURL(blobData);
      setFileUrl(url);
    } catch (error) {
      console.error('Erro ao baixar o documento:', error);
    }
  };

  return (
    <div>
      <p>Nome do Documento: {document.name}</p>
      <button onClick={handleDownload}>Baixar Documento</button>
      {fileUrl && (
        <div>
          <p>Visualizar Documento:</p>
          <iframe src={fileUrl} title={document.name} width="100%" height="500px" />
        </div>
      )}
    </div>
  );
};

export default DocumentComponent;