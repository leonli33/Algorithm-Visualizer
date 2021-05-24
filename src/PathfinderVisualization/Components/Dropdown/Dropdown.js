import React from "react";
import clsx from "clsx";
import "./Dropdown.css";
import DropdownArrow from "../../../assets/drop-down-down.png";

const Dropdown = (props) => {
  return (
    <div className={"drop-down-container"}>
      <button
        className={clsx(
          "drop-down-button",
          props.gridBeingUsed && "drop-down-button-disabled",
          props.isOpen && "drop-down-button-selected"
        )}
        id={props.id}
        onChange={props.onChange}
        disabled={props.gridBeingUsed ? true : false}
        onClick={() => props.handleDropdownOpenStateChange(props.type)}
      >
        {props.value}
        <img
          style={{ width: "16px", marginLeft: "14px" }}
          src={DropdownArrow}
        ></img>
      </button>
      {props.isOpen && (
        <div className="drop-down-elements-container">
          {props.items.map((el) => (
            <div key={el} value={el} className="drop-down-element">
              <div
                className="drop-down-element-text"
                onClick={() => props.onChange(el)}
              >
                {el}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
