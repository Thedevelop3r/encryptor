// tailwindcss container column
export function ContainerCol({ children }) {
  return <div className="container flex flex-col flex-nowrap gap-2">{children}</div>;
}

// tailwindcss container row
export function ContainerRow({ children }) {
  return <div className="container flex flex-row flex-wrap">{children}</div>;
}

// tailwindcss container items
export function ContainerItems({ children }) {
  return <div className="container-items">{children}</div>;
}
