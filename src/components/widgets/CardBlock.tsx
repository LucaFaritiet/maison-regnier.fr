export default function CardBlock({ title, body, image }: { title: string; body: string; image?: string }) {
  return (
    <article style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
      {image && <img src={image} alt="" style={{ width: "100%", height: 160, objectFit: "cover" }} />}
      <div style={{ padding: "1rem" }}>
        <h3 style={{ margin: 0, marginBottom: ".5rem", color: "var(--color-primary)" }}>{title}</h3>
        <p style={{ margin: 0, opacity: .9 }}>{body}</p>
      </div>
    </article>
  );
}