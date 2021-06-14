import React from "react";
import "./Node.css";
const Node = (props) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const types = ["Unvisited", "End", "Start", "Wall", "Path", "Explored"];

  const {
    col,
    isFinish,
    isStart,
    isWall,
    onMouseOut,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    row,
    nodeWidth,
    isWallAnimate,
    isShortestPathNode,
    isExploredNode,
  } = props;
  let extraClassName = "";
  let hoverBackgroundColor = "white";
  let typeIndex = 0;
  if (isFinish) {
    extraClassName = "node-finish";
    hoverBackgroundColor = "lightcoral";
    typeIndex = 1;
  } else if (isStart) {
    extraClassName = "node-start";
    hoverBackgroundColor = "lightgreen";
    typeIndex = 2;
  } else if (isWall) {
    extraClassName = "node-wall";
    hoverBackgroundColor = "#011a27";
    typeIndex = 3;
  } else if (isWallAnimate) {
    extraClassName = "node-wall-animate";
    hoverBackgroundColor = "#011a27";
    typeIndex = 3;
  } else if (isShortestPathNode) {
    extraClassName = "node-final-path";
    hoverBackgroundColor = "yellow";
    typeIndex = 4;
  } else if (isExploredNode) {
    extraClassName = "node-visited";
    typeIndex = 5;
    hoverBackgroundColor = "#89dbff";
  }

  const startNodeDistance =
    Math.abs(props.startNodeRow - row) + Math.abs(props.startNodeCol - col);

  const endNodeDistance =
    Math.abs(props.finishNodeRow - row) + Math.abs(props.finishNodeCol - col);

  return (
    <>
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName} ${isHovered && "node-inspection"}`}
        onMouseOut={() => {
          onMouseOut(row, col);
        }}
        onMouseDown={() => {
          if (!props.isWallMode) return;
          onMouseDown(row, col);
        }}
        onMouseEnter={(e) => {
          if (props.isWallMode) {
            const isLeftMouseDown = e.buttons === 1;
            const isShiftKeyDown = e.shiftKey;
            onMouseEnter(row, col, isLeftMouseDown, isShiftKeyDown);
            return;
          }
          if (props.gridBeingUsed) return;
          setIsHovered(true);
        }}
        onMouseUp={(e) => {
          e.preventDefault();
          onMouseUp(row, col);
        }}
        onMouseLeave={() => {
          if (props.isWallMode || props.gridBeingUsed) return;
          setIsHovered(false);
        }}
        style={{ width: `${nodeWidth}px` }}
      >
        {isHovered && (
          <div
            style={{
              width: "100px",
              height: "100px",
              backgroundColor: hoverBackgroundColor,
              zIndex: 1000,
              position: "absolute",
              bottom: "45px",
              left: "-45px",
              border: `1px solid ${isWall ? "white" : "black"}`,
              display: "flex",
              flexDirection: "column",
              padding: "6px",
              textAlign: "left",
              fontSize: "13px",
              justifyContent: "space-evenly",
              color: isWall ? "white" : "#011a27",
            }}
          >
            <div>Type: {types[typeIndex]}</div>
            <div>Node #: {props.nodeIndex}</div>
            <div>Cost: {}</div>
            <div>Start Distance: {startNodeDistance}</div>
            <div>End Distance: {endNodeDistance}</div>
          </div>
        )}
      </div>
    </>
  );
};

function propsAreEqual(prev, next) {
  const finishStateSame = prev.isFinish === next.isFinish;
  const startStateSame = prev.isStart === next.isStart;
  const wallStateSame = prev.isWall === next.isWall;
  const sameNodeWidth = prev.nodeWidth === next.nodeWidth;
  return finishStateSame && startStateSame && wallStateSame && sameNodeWidth;
}

// export default React.memo(Node, propsAreEqual);
export default Node;
