export default function ImageBlock({ src, alt = "" }: { src?: string; alt?: string }) {
  if (!src) return <div style={{ padding: "1rem", border: "1px dashed #ccc" }}>Aucune image</div>;
  return <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }} />;
}