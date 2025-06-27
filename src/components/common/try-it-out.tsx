import { useState } from 'react';
import { Copy, Code, ExternalLink, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TryItOutProps {
  title?: string;
  requestUrl: string;
  responseData: any;
  isLoading?: boolean;
  className?: string;
}

export function TryItOut({
  title = 'Try it out',
  requestUrl,
  responseData,
  isLoading = false,
  className
}: TryItOutProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(requestUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error('Error copying URL:', err);
    }
  };

  const handleCopyResponse = async () => {
    try {
      const jsonString = JSON.stringify(responseData, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    } catch (err) {
      console.error('Error copying response:', err);
    }
  };

  const handleOpenUrl = () => {
    window.open(requestUrl, '_blank');
  };

  return (
    <div className={cn('border border-gray-200 rounded-lg overflow-hidden', className)}>
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
      </div>

      {/* Request URL Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">Request URL</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenUrl}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Abrir
            </button>
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-700 transition-colors"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3 h-3" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copiar
                </>
              )}
            </button>
          </div>
        </div>
        <div className="bg-gray-100 rounded-md p-3 font-mono text-sm text-gray-800 break-all">
          {requestUrl}
        </div>
      </div>

      {/* Response Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">Response</h4>
          <button
            onClick={handleCopyResponse}
            disabled={isLoading || !responseData}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-700 transition-colors disabled:opacity-50"
          >
            {copiedResponse ? (
              <>
                <Check className="w-3 h-3" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copiar JSON
              </>
            )}
          </button>
        </div>
        
        <div className="bg-gray-900 rounded-md p-4 max-h-96 overflow-auto">
          {isLoading ? (
            <div className="text-gray-400 text-sm">Cargando...</div>
          ) : (
            <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

// Versión compacta para mostrar solo el JSON
export function JsonViewer({
  data,
  title = 'JSON Response',
  maxHeight = 'max-h-64',
  className
}: {
  data: any;
  title?: string;
  maxHeight?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying JSON:', err);
    }
  };

  return (
    <div className={cn('border border-gray-200 rounded-lg overflow-hidden', className)}>
      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-700 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copiado
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copiar
            </>
          )}
        </button>
      </div>
      <div className={cn('bg-gray-900 p-3 overflow-auto', maxHeight)}>
        <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
} 