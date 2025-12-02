import { useState, useEffect } from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import "../../assets/css/app.min.css";
import "../../assets/css/bootstrap.min.css";

const AddCategory = () => {
  const [categories, setCategories] = useState([
    {
      category: "standard",
      name: "",
    },
  ]);

  const [savedCategories, setSavedCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/inventries/categories`
      );

      if (response.ok) {
        const data = await response.json();
        setSavedCategories(data.data || []);
      }
    } catch (error) {
      showErrorToast("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

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
      const validCategories = categories.filter(cat => cat.name.trim() !== "");

      if (validCategories.length === 0) {
        showErrorToast("Please enter at least one category name");
        return;
      }

      const promises = validCategories.map(async (category) => {
        const url = `${process.env.REACT_APP_API_BASE_URL}/inventries/categories?categoryType=${category.category}&name=${category.name}`;
        return fetch(url, {
          method: "POST",
        });
      });

      const responses = await Promise.all(promises);
      const allSuccessful = responses.every((response) => response.ok);

      if (allSuccessful) {
        showSuccessToast("Categories added successfully!");

        setCategories([
          {
            category: "standard",
            name: "",
          },
        ]);

        fetchCategories();
      } else {
        showErrorToast("Failed to add some categories");
      }
    } catch (error) {
      showErrorToast("An error occurred while adding categories");
    }
  };

  const getCategoryTypeLabel = (type) => {
    const labels = {
      standard: "Standard",
      deluxe: "Deluxe",
      superDeluxe: "Super Deluxe"
    };
    return labels[type] || type;
  };

  return (
    <div className="col-lg-12">
      <div className="card" style={{ margin: "15px", padding: "15px", marginBottom: "20px" }}>
        <div className="card-header align-items-center d-flex">
          <h1 className="card-title flex-grow-1">Existing Categories</h1>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading categories...</p>
          ) : savedCategories.length === 0 ? (
            <p className="text-muted">No categories found. Add some below!</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Category Type</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {savedCategories.map((cat, idx) => (
                    <tr key={cat._id || idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <span className="badge bg-primary">
                          {getCategoryTypeLabel(cat.categoryType)}
                        </span>
                      </td>
                      <td>{cat.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ margin: "15px", padding: "15px" }}>
        <div className="card-header align-items-center d-flex">
          <h1 className="card-title flex-grow-1">Add New Category</h1>
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
              alignItems: "center",
              justifyContent: "center",
              padding: "20px 0",
            }}
          >
            <button
              type="button"
              onClick={addCategory}
              className="btn btn-primary btn-border"
              style={{
                marginBottom: "0px",
                padding: "10px 30px",
                fontSize: "16px"
              }}
            >
              + Add Category
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
