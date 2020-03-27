import React from "react";

const InputText = ({
  name,
  value,
  label,
  placeholder,
  onChange,
  error,
  ...options
}) => {
  return (
    <div className="form-label-group">
      <label htmlFor={name}>{label}</label>
      <input
        type="text"
        className="form-control"
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...options}
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default InputText;
