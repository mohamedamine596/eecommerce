import { useGoogleAuthLogin } from "../../services/googleLogin.js";

function GoogleAuthButton({ onSuccess, onError }) {
  const loginWithGoogle = useGoogleAuthLogin(onSuccess, onError);

  return (
    <button
      type="button"
      className="google-btn"
      onClick={loginWithGoogle}
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        style={{ width: "20px" }}
      />
      Continue with Google
    </button>
  );
}

export default GoogleAuthButton;
