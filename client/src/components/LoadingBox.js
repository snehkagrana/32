import "../styles/LoadingBox.style.css";

const LoadingBox = ({ spinnerSize, height, title }) => {
  return (
    <div className="LoadingBox" style={{ height }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={spinnerSize}
        height={spinnerSize}
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-dasharray="15"
          stroke-dashoffset="15"
          stroke-linecap="round"
          stroke-width="2"
          d="M12 3C16.9706 3 21 7.02944 21 12"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.2s"
            values="15;0"
          />
          <animateTransform
            attributeName="transform"
            dur="1s"
            repeatCount="indefinite"
            type="rotate"
            values="0 12 12;360 12 12"
          />
        </path>
      </svg>
      {title && <p>{title}</p>}
    </div>
  );
};

LoadingBox.defaultProps = {
  spinnerSize: 50,
  height: 250,
  title: undefined
};

export default LoadingBox;
