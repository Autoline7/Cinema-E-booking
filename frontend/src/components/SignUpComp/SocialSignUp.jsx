import googleLogo from "../../assets/logos/google.svg"
import appleLogo from "../../assets/logos/apple.svg"

const SocialSignUp = () => {
  return (
    <div>
      <div className="social-login">
            <button className="social-button">
              <img src={googleLogo} alt="Google" className="social-icon" />
              Google
            </button>
            <button className="social-button">
              <img src={appleLogo} alt="Apple" className="social-icon" />
              Apple
            </button>
          </div>
    </div>
  )
}

export default SocialSignUp
