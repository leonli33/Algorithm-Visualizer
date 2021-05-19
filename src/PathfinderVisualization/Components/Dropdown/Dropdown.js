import React from "react";
import "./Dropdown.css";
import clsx from "clsx";

const Dropdown = (props) => {
  return (
    <select
      className={clsx(
        props.gridBeingUsed && "dropdown-disabled",
        !props.gridBeingUsed && "dropdown"
      )}
      id={props.id}
      value={props.value}
      onChange={props.onChange}
      disabled={props.gridBeingUsed ? true : false}
    >
      <option selected disabled hidden>
        {props.placeholder}
      </option>
      {props.items.map((el) => (
        <option key={el} value={el} style={{marginTop: "15px"}}>
          {el}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
