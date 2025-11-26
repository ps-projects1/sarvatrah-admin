import React, { useState, useEffect } from "react";

const ManageFooter = () => {
  const [contactData, setContactData] = useState({
    mobile: "",
    altMobile: "",
    address: "",
    email: "",
    altEmail: "",
    instaLink: "",
    whatsappLink: "",
    youtubeLink: "",
    twitterLink: "",
    facebookLink: ""
  });

  const [terms, setTerms] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");

  // Fetch existing footer data on load
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/footer`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setContactData(data.data.contactData || contactData);
          setTerms(data.data.terms || "");
          setPrivacyPolicy(data.data.privacyPolicy || "");
        }
      });
  }, []);

  // Submit Contact Data
  const handleContactSubmit = async () => {
    try {
      if (!contactData.mobile || !contactData.email)
        return alert("Mobile & Email are required");

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/footer`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contactData,
            terms,
            privacyPolicy
          })
        }
      );

      const result = await response.json();
      if (result.success) alert("Updated Successfully!");
      else alert("Update failed!");
    } catch (err) {
      console.error(err);
      alert("Error updating footer");
    }
  };

  // Submit Terms
  const handleTermsSubmit = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/footer`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ terms })
        }
      );

      const result = await response.json();
      if (result.success) alert("Terms updated!");
    } catch (error) {
      alert("Failed updating terms");
    }
  };

  // Submit Privacy Policy
  const handlePrivacyPolicySubmit = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/footer`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ privacyPolicy })
        }
      );

      const result = await response.json();
      if (result.success) alert("Privacy Policy updated!");
    } catch (error) {
      alert("Failed updating privacy policy");
    }
  };

  return (
    <div className="col-lg-12">
      <div className="card" style={{ margin: "15px", padding: "15px" }}>
        {/* CONTACT SECTION */}
        <div className="card-header align-items-center d-flex">
          <h1 className="card-title flex-grow-1">Contact Us</h1>
        </div>

        <div>
          <div style={{ marginBottom: "20px" }}>
            <div className="card-body">
              <div className="live-preview">
                <div className="row g-3">
                  {/* MOBILE */}
                  <div className="col-sm-4">
                    <label className="form-label">Mobile No</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Mobile No"
                      value={contactData.mobile}
                      onChange={(e) =>
                        setContactData({
                          ...contactData,
                          mobile: e.target.value
                        })
                      }
                    />
                  </div>

                  {/* ALT MOBILE */}
                  <div className="col-sm-4">
                    <label className="form-label">Alternate Mobile No.</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Alternate Mobile No"
                      value={contactData.altMobile}
                      onChange={(e) =>
                        setContactData({
                          ...contactData,
                          altMobile: e.target.value
                        })
                      }
                    />
                  </div>

                  {/* ADDRESS */}
                  <div className="col-sm-4">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      placeholder="Address"
                      value={contactData.address}
                      onChange={(e) =>
                        setContactData({
                          ...contactData,
                          address: e.target.value
                        })
                      }
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="col-sm-4">
                    <label className="form-label">Email</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      value={contactData.email}
                      onChange={(e) =>
                        setContactData({
                          ...contactData,
                          email: e.target.value
                        })
                      }
                    />
                  </div>

                  {/* ALT EMAIL */}
                  <div className="col-sm-4">
                    <label className="form-label">Alternate Email</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Alternate Email"
                      value={contactData.altEmail}
                      onChange={(e) =>
                        setContactData({
                          ...contactData,
                          altEmail: e.target.value
                        })
                      }
                    />
                  </div>

                  {/* SOCIAL LINKS */}
                  <div className="col-sm-4">
                    <label className="form-label">Instagram Link</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Instagram Link"
                      value={contactData.instaLink}
                      onChange={(e) =>
                        setContactData({
                          ...contactData,
                          instaLink: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="col-sm-4">
                    <label className="form-label">Facebook Link</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Facebook Link"
                      value={contactData.facebookLink}
                      onChange={(e) =>
                        setContactData({
                          ...contactData,
                          facebookLink: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="col-sm-4">
                    <label className="form-label">Twitter Link</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Twitter Link"
                      value={contactData.twitterLink}
                      onChange={(e) =>
                        setContactData({
                          ...contactData,
                          twitterLink: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="col-sm-4">
                    <label className="form-label">Youtube Link</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Youtube Link"
                      value={contactData.youtubeLink}
                      onChange={(e) =>
                        setContactData({
                          ...contactData,
                          youtubeLink: e.target.value
                        })
                      }
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-5">
                  <button
                    className="btn btn-primary btn-border"
                    onClick={handleContactSubmit}
                  >
                    Submit Contact Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TERMS SECTION */}
        <div className="card-header align-items-center d-flex">
          <h1 className="card-title flex-grow-1">Terms and Policies</h1>
        </div>

        <div className="col-sm-8 mb-3 mt-4">
          <label className="form-label">Terms and Conditions</label>
          <textarea
            className="form-control"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
          />
          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn btn-primary btn-border"
              onClick={handleTermsSubmit}
            >
              Submit
            </button>
          </div>
        </div>

        {/* PRIVACY POLICY */}
        <div className="col-sm-8">
          <label className="form-label">Privacy Policy</label>
          <textarea
            className="form-control"
            value={privacyPolicy}
            onChange={(e) => setPrivacyPolicy(e.target.value)}
          />
          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn btn-primary btn-border"
              onClick={handlePrivacyPolicySubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageFooter;
