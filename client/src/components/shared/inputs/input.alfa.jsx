import React from "react";

const InputText = props => {
  return (
    <React.Fragment>
      <div className="input-group input-group-lg my-3">
        <div className="input-group-prepend">
          <span
            className="input-group-text"
            id="inputGroup-sizing-lg"
          >
            <i
              className={props.icon}
              style={{
                fontSize: "2em",
                width: "1.75em",
                textAlign: "center"
              }}
            />
          </span>
        </div>
        <input
          type="text"
          className="form-control"
          style={{ fontSize: "2em" }}
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          id={props.name}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
          {...props.options}
        />
      </div>
      {props.error && (
        <div className="alert alert-danger">
          {props.error}
        </div>
      )}
    </React.Fragment>
  );
};

export default InputText;
