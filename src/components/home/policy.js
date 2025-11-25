import React, { useState } from 'react';
import { FormControl, FormControlLabel, Radio, RadioGroup} from '@mui/material';

const AddPolicy = () => {
    const [formData, setFormData] = useState({
        cancellationPolicy: '',
        refundReason: '', // New field for textarea input
    });

    const [showRefundReason, setShowRefundReason] = useState(false);

    const handleInputChange = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));

        // If "Refundable" is selected, show the textarea input
        if (key === 'cancellationPolicy' && value === 'refundable') {
            setShowRefundReason(true);
        } else {
            setShowRefundReason(false);
        }
    };

    const handleSubmit = async () => {
        // ... (unchanged code)

        // Include refundReason in the request if it's provided
        // if (showRefundReason) {
        //     queryParams.append('refundReason', formData.refundReason);
        // }

        // ... (unchanged code)
    };

    return (
        <div className="col-lg-12">
            <div className="card" style={{ margin: '15px', padding: '15px' }}>
                <div className="card-header align-items-center d-flex">
                    <h1 className="card-title  flex-grow-1 ">Cancellation Policy</h1>
                </div>

                <div className="card-body">
                    <div className="live-preview">
                        <div className="row g-3">
                            <div className="col-sm-4">
                                <label htmlFor={`cancellationPolicyInput`} className="form-label">Cancellation Policy</label>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        aria-label="cancellationPolicy"
                                        name="cancellationPolicy"
                                        value={formData.cancellationPolicy}
                                        onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                                    >
                                        <FormControlLabel value="refundable" control={<Radio size="small" />} label="Refundable" />
                                        <FormControlLabel value="non-refundable" control={<Radio size="small" />} label="Non-refundable" />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            {showRefundReason && (
                                <div className="col-sm-8">
                                    <label htmlFor={`refundReasonInput`} className="form-label">Refund Reason</label>
                                        {/* <TextField
                                            id="refundReasonInput"
                                            label="Enter refund reason"
                                            variant="outlined"
                                            fullWidth
                                            value={formData.refundReason}
                                            onChange={(e) => handleInputChange('refundReason', e.target.value)}
                                        /> */}
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            onChange={(e) => handleInputChange('refundReason', e.target.value)}
                                        ></textarea>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'end', padding: '15px', borderTop: '1px solid #f1f1f1' }}>
                    <button className="btn btn-primary btn-border" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default AddPolicy;
