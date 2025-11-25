import React from "react";
import "../../assets/css/app.min.css";
import "../../assets/css/bootstrap.min.css";
import { useState } from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

const AddCategory = () => {
  const [categories, setCategories] = useState([
    {
      category: "standard",
      name: "",
    },
  ]);

  const handleInputChange = (index, key, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index][key] = value;
    setCategories(updatedCategories);
  };

  const addCategory = () => {
    setCategories([
      ...categories,
      {
        category: "standard",
        name: "",
      },
    ]);
  };

  const removeCategory = (index) => {
    if (categories.length > 1) {
      const updatedCategories = [...categories];
      updatedCategories.splice(index, 1);
      setCategories(updatedCategories);
    }
  };

  const handleSubmit = async () => {
    try {
      const promises = categories.map(async (category) => {
        const url = `${process.env.REACT_APP_API_BASE_URL}/inventries/categories?categoryType=${category.category}&name=${category.name}`;
        const response = await fetch(url, {
          method: "POST",
        });
        return response;
      });

      const responses = await Promise.all(promises);

      const allResponsesSuccessful = responses.every((response) => response.ok);

      if (allResponsesSuccessful) {
        console.log("All categories added successfully");
        // Optionally, you can reset the form or perform other actions upon successful submission
        setCategories([
          {
            category: "standard",
            name: "",
          },
        ]);
      } else {
        console.error("Failed to add some categories");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="col-lg-12">
      <div className="card" style={{ margin: "15px", padding: "15px" }}>
        <div className="card-header align-items-center d-flex">
          <h1 className="card-title flex-grow-1">Add Category</h1>
        </div>
        <div>
          {categories.map((category, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <div className="card-body">
                <div className="live-preview">
                  <div className="row g-3">
                    <div className="col-sm-4">
                      <label
                        htmlFor={`categoryInput-${index}`}
                        className="form-label"
                      >
                        Category
                      </label>
                      <RadioGroup
                        aria-label="category"
                        name={`categoryInput-${index}`}
                        value={category.category}
                        onChange={(e) =>
                          handleInputChange(index, "category", e.target.value)
                        }
                      >
                        <FormControlLabel
                          value="standard"
                          control={<Radio size="small" />}
                          label="Standard"
                        />
                        <FormControlLabel
                          value="deluxe"
                          control={<Radio size="small" />}
                          label="Deluxe"
                        />
                        <FormControlLabel
                          value="superDeluxe"
                          control={<Radio size="small" />}
                          label="Super Deluxe"
                        />
                      </RadioGroup>
                    </div>
                    <div className="col-sm-4">
                      <label
                        htmlFor={`nameInput-${index}`}
                        className="form-label"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        aria-label="name"
                        value={category.name}
                        onChange={(e) =>
                          handleInputChange(index, "name", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "center",
                  borderBottom: "1px solid #f1f1f1",
                }}
              >
                {categories.length > 1 && (
                  <button
                    onClick={() => removeCategory(index)}
                    className="form-label btn btn-danger btn-border"
                    style={{ marginBottom: "0px" }}
                  >
                    Remove Category
                  </button>
                )}
              </div>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent: "center",
            }}
          >
            <button
              onClick={addCategory}
              className="form-label btn btn-primary btn-border"
              style={{ marginBottom: "0px" }}
            >
              Add Category
            </button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            padding: "15px",
            borderTop: "1px solid #f1f1f1",
          }}
        >
          <button className="btn btn-primary btn-border" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
