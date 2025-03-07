export default function PDFViewer({ url }: { url: string }) {
  return (
    <div className="w-full h-full">
      <iframe
        src={url}
        className="w-full h-full border-none"
        title="PDF Viewer"
      />
    </div>
  );
}
