import React from "react";
import Dropdown from "../Dropdown/Dropdown";

const DropDownContainer = (props) => {
  const [dropDownOpenState, setDropdownOpenState] = React.useState({
    isAlgorithmOpen: false,
    isMazeOpen: false,
    isSpeedOpen: false,
  });

  const handleDropdownOpenStateChange = (type) => {
    if (type === "ALGORITHMS") {
      setDropdownOpenState((prevState) => {
        return {
          isMazeOpen: false,
          isSpeedOpen: false,
          isAlgorithmOpen: !prevState.isAlgorithmOpen,
        };
      });
    } else if (type === "GENERATE_WALLS") {
      setDropdownOpenState((prevState) => {
        return {
          isAlgorithmOpen: false,
          isSpeedOpen: false,
          isMazeOpen: !prevState.isMazeOpen,
        };
      });
    } else {
      setDropdownOpenState((prevState) => {
        return {
          isAlgorithmOpen: false,
          isMazeOpen: false,
          isSpeedOpen: !prevState.isSpeedOpen,
        };
      });
    }
  };

  return (
    <div>
      <Dropdown
        gridBeingUsed={props.gridBeingUsed}
        placeholder="Algorithms"
        id="pathfinding-algorithm-selection"
        onChange={props.updateCurrentAlgo}
        value={props.currentAlgo}
        items={props.algorithms}
        isOpen={dropDownOpenState.isAlgorithmOpen}
        handleDropdownOpenStateChange={handleDropdownOpenStateChange}
        type="ALGORITHMS"
      />
      <Dropdown
        gridBeingUsed={props.gridBeingUsed}
        placeholder="Generate Walls"
        id="maze-algorithm-selection"
        onChange={props.generateMaze}
        value={"Generate Walls"}
        items={props.mazeAlgorithms}
        isOpen={dropDownOpenState.isMazeOpen}
        handleDropdownOpenStateChange={handleDropdownOpenStateChange}
        type="GENERATE_WALLS"
      />
      <Dropdown
        gridBeingUsed={props.gridBeingUsed}
        placeholder="Speed"
        id="speed-selection"
        onChange={props.updateSpeed}
        value={props.state.currentSpeed}
        items={props.state.speed}
        isOpen={dropDownOpenState.isSpeedOpen}
        handleDropdownOpenStateChange={handleDropdownOpenStateChange}
        type="SPEED"
      />
    </div>
  );
};

export default DropDownContainer;
