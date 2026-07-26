// A single schema.org graph node, inlined as JSON-LD.
//
// The payload is built from Contentful content, never from user input, so
// the only escaping needed is the one that would let a "</script>" inside a
// string close the tag early.
export const JsonLd: React.FC<{ data: Record<string, unknown> }> = ({
  data,
}) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, '\\u003c'),
    }}
  />
)
