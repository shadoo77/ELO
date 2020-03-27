import React from "react";

const InputText = ({ name, label, onChange, error, ...options }) => {
  return (
    <div className="form-label-group">
      <label htmlFor={name}>{label}</label>
      <input
        type="password"
        id={name}
        name={name}
        className="form-control"
        onChange={onChange}
        {...options}
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default InputText;
