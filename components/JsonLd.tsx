/** JSON-LD for crawlers - render in the document body (not `<head>`). */
export default function JsonLd({
  data,
  id = "json-ld",
}: {
  data: object | object[];
  id?: string;
}) {
  return (
    <script
      id={id}
      type='application/ld+json'
      // AdSense / extensions mutate <head> scripts; keep this out of head + ignore mismatch noise.
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
