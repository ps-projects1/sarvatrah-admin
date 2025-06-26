import React, { useState } from "react";

const ManageFooter = () => {

    const [contactData, setContactData] = useState({
        mobile:"",
        altMobile:"",
        address:"",
        email:"",
        altEmail:"",
        instaLink:"",
        whatsappLink:"",
        youtubeLink:"",
        twitterLink:"",
        facebookLink:""
    });

    const [terms, setTerms] = useState("");
    const [privacyPolicy, setPrivacyPolicy] = useState("");
  return (
    <div className="col-lg-12">
      <div className="card" style={{ margin: "15px", padding: "15px" }}>
        <div className="card-header align-items-center d-flex">
          <h1 className="card-title  flex-grow-1 ">Contact Us</h1>
        </div>
        <div>
          <div style={{ marginBottom: "20px" }}>
            <div className="card-body">
              <div className="live-preview">
                <div className="row g-3">
                  <div className="col-sm-4">
                    <label htmlFor={`brandNameInput`} className="form-label">
                      Mobile No
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Mobile No"
                      aria-label="brand-name"
                      value={contactData?.mobile}
                      onChange={(e) => { setContactData({...contactData,mobile:e.target.value})}}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor={`modelNameInput`} className="form-label">
                      Alternate Mobile No.
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Alternate Mobile No"
                      aria-label="model-name"
                      value={contactData?.altMobile}
                      onChange={(e) => { setContactData({...contactData,altMobile:e.target.value})}}
                      
                    />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor={`inventoryInput`} className="form-label">
                      Address
                    </label>
                    <textarea
                      className="form-control"
                      placeholder="Address"
                      aria-label="inventory"
                      value={contactData?.address}
                      onChange={(e) => { setContactData({...contactData,address:e.target.value})}}

                    />
                  </div>

                  <div className="col-sm-4">
                    <label htmlFor={`inventoryInput`} className="form-label">
                      Email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      aria-label="rate"
                      value={contactData?.email}
                      onChange={(e) => { setContactData({...contactData,email:e.target.value})}}

                    />
                  </div>

                  <div className="col-sm-4">
                    <label htmlFor={`seatLimitInput`} className="form-label">
                      Alternate email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Alternate Email"
                      aria-label="passenger-capacity"
                      value={contactData?.altEmail}
                      onChange={(e) => { setContactData({...contactData,altEmail:e.target.value})}}

                    />
                  </div>
                  <div className="col-sm-4">
                    <label
                      htmlFor={`luggageCapacityInput`}
                      className="form-label"
                    >
                      Instagram Link
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Instagram Link"
                      aria-label="luggage-capacity"
                      value={contactData?.instaLink}
                      onChange={(e) => { setContactData({...contactData,instaLink:e.target.value})}}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label
                      htmlFor={`luggageCapacityInput`}
                      className="form-label"
                    >
                      Facebook Link
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Facebook Link"
                      aria-label="luggage-capacity"
                      value={contactData?.facebookLink}
                      onChange={(e) => { setContactData({...contactData,facebookLink:e.target.value})}}

                    />
                  </div>
                  <div className="col-sm-4">
                    <label
                      htmlFor={`luggageCapacityInput`}
                      className="form-label"
                    >
                      Twitter Link
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Twitter Link"
                      aria-label="luggage-capacity"
                      value={contactData?.twitterLink}
                      onChange={(e) => { setContactData({...contactData,twitterLink:e.target.value})}}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label
                      htmlFor={`luggageCapacityInput`}
                      className="form-label"
                    >
                      Youtube Link
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Youtube Link"
                      aria-label="luggage-capacity"
                      value={contactData?.youtubeLink}
                      onChange={(e) => { setContactData({...contactData,youtubeLink:e.target.value})}}

                    />
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-5">
                  <button className="btn btn-primary btn-border" onClick={""}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-header align-items-center d-flex">
          <h1 className="card-title  flex-grow-1 ">Terms and policies</h1>
        </div>
        <div className="col-sm-8 mb-3 mt-4">
          <label htmlFor={`inventoryInput`} className="form-label">
            Terms and conditions
          </label>
          <textarea
            className="form-control"
            // placeholder="Address"
            aria-label="inventory"
            value={terms}
            onChange={(e) => {setTerms(e.target.value)}}
          />
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-primary btn-border" onClick={""}>
              Submit
            </button>
          </div>
        </div>
        <div className="col-sm-8">
          <label htmlFor={`inventoryInput`} className="form-label">
            Privacy Policy
          </label>
          <textarea
            className="form-control"
            // placeholder="Address"0
            aria-label="inventory"
            value={privacyPolicy}
            onChange={(e) => {setPrivacyPolicy(privacyPolicy)}}
          />
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-primary btn-border" onClick={""}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageFooter;
