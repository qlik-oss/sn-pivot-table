interface FullSizeContainerProps {
  width: number;
  height: number;
  children: JSX.Element;
}

export default function FullSizeContainer({ width, height, children }: FullSizeContainerProps): JSX.Element {
  return (
    <div
      data-testid="full-size-container"
      style={{
        display: "block",
        width,
        height,
      }}
    >
      {children}
    </div>
  );
}
