const CustomGoogleSignInButton = ({ onClick }) => {
  return (
    <button
      style={{
        width: "100%",
        backgroundColor: "white",
        boxShadow: "0px 7px #000",
        borderRadius: "7px",
        transition: "0.2s ease",
        padding: "10px", // Adjust padding as needed
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
      onClick={onClick}
      className="googleButton"
    >
      <img
        src="/google-icon.png"
        alt="google logo"
        style={{ marginRight: "10px", color: "#4285F4", height: "30px" }}
      />{" "}
      Continue with Google
    </button>
  );
};

export default CustomGoogleSignInButton;
