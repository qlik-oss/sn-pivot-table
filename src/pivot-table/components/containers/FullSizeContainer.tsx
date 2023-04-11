interface FullSizeContainerProps {
  width: number;
  height: number;
  children: JSX.Element;
}

const FullSizeContainer = ({ width, height, children }: FullSizeContainerProps): JSX.Element => (
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

export default FullSizeContainer;
