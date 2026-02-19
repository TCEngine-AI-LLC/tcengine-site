import * as React from "react";

export default function Section({
  title,
  children,
  id,
  subtle,
}: {
  title?: string;
  id?: string;
  subtle?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ margin: "26px 0" }}>
      {title ? (
        <div style={{ marginBottom: 12 }}>
          <h2
            style={{
              fontSize: 22,
              lineHeight: 1.2,
              color: subtle ? "rgba(11, 15, 23, 0.88)" : "rgba(11, 15, 23, 0.96)",
            }}
          >
            {title}
          </h2>
        </div>
      ) : null}
      {children}
    </section>
  );
}
