import React from "react";
import "./Node.css";
const Node = (props) => {
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
    isWallAnimate
  } = props;

  let extraClassName = "";
  if (isFinish) {
    extraClassName = "node-finish";
  } else if (isStart) {
    extraClassName = "node-start";
  } else if (isWall) {
    extraClassName = "node-wall";
  } else if (isWallAnimate) {
    extraClassName = "node-wall-animate";
  }

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseOut={() => onMouseOut(row, col)}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={(e) => {
        const isLeftMouseDown = e.buttons === 1;
        const isShiftKeyDown = e.shiftKey;
        onMouseEnter(row, col, isLeftMouseDown, isShiftKeyDown);
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        onMouseUp(row, col);
      }}
      style={{ width: `${nodeWidth}px` }}
    />
  );
};

function propsAreEqual(prev, next) {
  const finishStateSame = prev.isFinish === next.isFinish;
  const startStateSame = prev.isStart === next.isStart;
  const wallStateSame = prev.isWall === next.isWall;
  const sameNodeWidth = prev.nodeWidth === next.nodeWidth;
  return finishStateSame && startStateSame && wallStateSame && sameNodeWidth;
}

export default React.memo(Node, propsAreEqual);
