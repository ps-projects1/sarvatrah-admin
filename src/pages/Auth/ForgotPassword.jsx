import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/app.min.css";
import "../../assets/css/bootstrap.min.css";
import logo from "../../assets/images/mainLogo.svg";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    rePassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    rePassword: "",
  });

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (step === 1) {
      if (!formData.email) {
        newErrors.email = "Email is required";
        valid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Email is invalid";
        valid = false;
      }
    } else if (step === 2) {
      if (!formData.verificationCode) {
        newErrors.verificationCode = "Verification code is required";
        valid = false;
      }

      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required";
        valid = false;
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters";
        valid = false;
      }

      if (!formData.rePassword) {
        newErrors.rePassword = "Please re-enter your password";
        valid = false;
      } else if (formData.newPassword !== formData.rePassword) {
        newErrors.rePassword = "Passwords do not match";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      if (step === 1) {
        // Send verification code
        const response = await fetch(
         `${process.env.REACT_APP_API_BASE_URL}/api/admin/request-reset`
,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email }),
          }
        );

        if (response.ok) {
          setStep(2);
        } else {
          const errorData = await response.json();
          alert(errorData.message || "Failed to send verification code");
        }
      } else if (step === 2) {
        // Reset password
        const response = await fetch(
         `${process.env.REACT_APP_API_BASE_URL}/api/admin/reset-password`
,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              code: formData.verificationCode,
              newPassword: formData.newPassword,
            }),
          }
        );

        if (response.ok) {
          alert("Password updated successfully");
          navigate("/login");
        } else {
          const errorData = await response.json();
          alert(errorData.message || "Failed to update password");
        }
      }
    } catch (error) {
      console.error("Password reset error:", error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <div className="card-body p-4">
      <div className="text-center mt-2">
        <h5 className="text-primary">Forgot Password</h5>
        <p className="text-muted">Enter your email to reset your password.</p>
      </div>
      <div className="p-2 mt-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              className={`form-control ${errors.email && "is-invalid"}`}
              id="email"
              name="email"
              placeholder="Enter Email Address"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mt-4 d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
            <button
              className="btn btn-secondary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Verification Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderResetStep = () => (
    <div className="card-body p-4">
      <div className="text-center mt-2">
        <h5 className="text-primary">Update Password</h5>
        <p className="text-muted">Renew your password</p>
      </div>
      <div className="p-2 mt-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="verificationCode" className="form-label">
              Verification Code
            </label>
            <input
              type="text"
              className={`form-control ${errors.verificationCode && "is-invalid"}`}
              id="verificationCode"
              name="verificationCode"
              placeholder="Enter verification code"
              value={formData.verificationCode}
              onChange={handleChange}
            />
            {errors.verificationCode && (
              <div className="invalid-feedback">{errors.verificationCode}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="newPassword">
              New Password
            </label>
            <div className="position-relative auth-pass-inputgroup mb-3">
              <input
                type="password"
                className={`form-control pe-5 ${errors.newPassword && "is-invalid"}`}
                placeholder="Enter new password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />
              <button
                className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                type="button"
                onClick={() => {
                  const input = document.getElementById("newPassword");
                  input.type = input.type === "password" ? "text" : "password";
                }}
              >
                <i className="ri-eye-fill align-middle"></i>
              </button>
              {errors.newPassword && (
                <div className="invalid-feedback">{errors.newPassword}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="rePassword">
              Confirm Password
            </label>
            <div className="position-relative auth-pass-inputgroup mb-3">
              <input
                type="password"
                className={`form-control pe-5 ${errors.rePassword && "is-invalid"}`}
                placeholder="Confirm new password"
                id="rePassword"
                name="rePassword"
                value={formData.rePassword}
                onChange={handleChange}
              />
              <button
                className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                type="button"
                onClick={() => {
                  const input = document.getElementById("rePassword");
                  input.type = input.type === "password" ? "text" : "password";
                }}
              >
                <i className="ri-eye-fill align-middle"></i>
              </button>
              {errors.rePassword && (
                <div className="invalid-feedback">{errors.rePassword}</div>
              )}
            </div>
          </div>

          <div className="mt-4 d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button
              className="btn btn-secondary"
              type="submit"
              disabled={isLoading || !passwordsMatch}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
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
                  <a href="/" className="d-inline-block auth-logo">
                    <img src={logo} alt="Logo" height="100px" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <div className="card mt-4">
                {step === 1 ? renderEmailStep() : renderResetStep()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;