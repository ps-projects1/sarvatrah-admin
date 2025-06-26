import React, { useEffect, useState } from "react";
import "../../assets/css/app.min.css";
import "../../assets/css/bootstrap.min.css";
import logo from "../../assets/images/mainLogo.svg";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3232/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);

        navigate("/dashboard", { replace: true });
        // if (data.user && data.user.isAdmin === true) {
        //     alert('Login successful for admin');
        // } else {

        //     alert('Login failed. User is not an admin.');
        // }
      } else {
        // Handle failed login
        alert("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  useEffect(() => {
    if (newPassword && rePassword) {
      const handler = setTimeout(() => {
        setPasswordsMatch(newPassword === rePassword);
      }, 800); // Adjust the delay as needed

      return () => {
        clearTimeout(handler);
      };
    }
  }, [newPassword, rePassword]);

  return (
    <div>
      <div className="auth-page-wrapper pt-5">
        <div className="auth-one-bg-position auth-one-bg" id="auth-particles">
          <div className="bg-overlay"></div>

          <div className="shape">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 1440 120"
            >
              <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
            </svg>
          </div>
        </div>
        <div className="auth-page-content">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <a href="index.html" className="d-inline-block auth-logo">
                      <img src={logo} alt="" height="100px" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6 col-xl-5">
                <div className="card mt-4">
                  {step === 1 ? (
                    <div className="card-body p-4">
                      <div className="text-center mt-2">
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p className="text-muted">
                          Sign in to continue to Sarvatrah.
                        </p>
                      </div>
                      <div className="p-2 mt-4">
                        <form onSubmit={handleLogin} action="">
                          <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                              Email Address
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="username"
                              placeholder="Enter Email Address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>

                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="password-input"
                            >
                              Password
                            </label>
                            <div className="position-relative auth-pass-inputgroup mb-3">
                              <input
                                type="password"
                                className="form-control pe-5 password-input"
                                placeholder="Enter password"
                                id="password-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              <button
                                className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                type="button"
                                id="password-addon"
                              >
                                <i className="ri-eye-fill align-middle"></i>
                              </button>
                            </div>
                          </div>

                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value=""
                              id="auth-remember-check"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="auth-remember-check"
                            >
                              Remember me
                            </label>
                          </div>

                          <div className="mt-4">
                            <button
                              className="btn btn-secondary w-100"
                              type="submit"
                            >
                              Sign In
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  ) : step === 2 ? (
                    <div className="card-body p-4">
                      <div className="text-center mt-2">
                        <h5 className="text-primary">Forgot Password</h5>
                        <p className="text-muted">update you password.</p>
                      </div>
                      <div className="p-2 mt-4">
                        <form onSubmit={handleLogin} action="">
                          <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                              Email Address
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="username"
                              placeholder="Enter Email Address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>

                          <div className="mt-4">
                            <button
                              className="btn btn-secondary w-100"
                              //   type="submit"
                              onClick={() => {
                                setStep(step + 1);
                              }}
                            >
                              Send Verification Code
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  ) : step === 3 ? (
                    <div className="card-body p-4">
                      <div className="text-center mt-2">
                        <h5 className="text-primary">Update Password</h5>
                        <p className="text-muted">Renew Password</p>
                      </div>
                      <div className="p-2 mt-4">
                        <form action="">
                          <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                              Enter Verification Code
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="username"
                              placeholder="Enter Verification Code"
                              value={verificationCode}
                              onChange={(e) =>
                                setVerificationCode(e.target.value)
                              }
                            />
                          </div>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="password-input"
                            >
                              New Password
                            </label>
                            <div className="position-relative auth-pass-inputgroup mb-3">
                              <input
                                type="password"
                                className="form-control pe-5 password-input"
                                placeholder="Enter password"
                                id="password-input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                              <button
                                className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                type="button"
                                id="password-addon"
                              >
                                <i className="ri-eye-fill align-middle"></i>
                              </button>
                            </div>
                          </div>

                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="password-input"
                            >
                              Re-type Password
                            </label>
                            <div className="position-relative auth-pass-inputgroup mb-3">
                              <input
                                type="password"
                                className="form-control pe-5 password-input"
                                placeholder="Re-type password"
                                id="password-input"
                                value={rePassword}
                                onChange={(e) => setRePassword(e.target.value)}
                              />
                              <button
                                className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                type="button"
                                id="password-addon"
                              >
                                <i className="ri-eye-fill align-middle"></i>
                              </button>
                            </div>
                          </div>
                          {!passwordsMatch && (
                            <p className="text-danger">
                              Passwords do not match
                            </p>
                          )}

                          <div className="mt-4">
                            <button
                              className="btn btn-secondary w-100"
                              //   type="submit"
                              disabled={!passwordsMatch}
                              onClick={() => navigate("/dashboard")}
                            >
                              Update Password
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* <div className="mt-4 text-center">
                                    <p className="mb-0">Don't have an account ? <a href="auth-signup-basic.html" className="fw-semibold text-primary text-decoration-underline"> Signup </a> </p>
                                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
