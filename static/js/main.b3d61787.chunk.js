(this["webpackJsonppathfinding-visualizer"]=this["webpackJsonppathfinding-visualizer"]||[]).push([[0],[,,,,,,,,,function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAABVElEQVR4nO3bQUrDUBRA0ae4B3FhgqvQZbcjt1AnOpE0oLTNjZ4DGf3A/+TyR4/MAAAAdLzMzPvMnDwXfQ4z83zuo9+dW5iZ48w8rqzze8eZeVpaWAtyus5Z+LT47e9vfQrWPfzg3bXbdAnfb+Rf32+RGxIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMSaG2zEx3ANBYgSJucZMfetZdXU/M/U9EiRGkBhBYgSJESRGkBhBYgSJESRGkBhBYgSJESRGkBgz9e2Yqe+BIDGCxPhPfbv9FrkhMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBJjpr4dM/U9ECRGkBj/qd9uPzP1PRIkRpAYQWIEiREkRpAYQWIEiREkRpAYQWIEiREkRpAYM/XtmKnvwVqQ481O8f8czi2sBXkdUa7hMDNvWx8CAADgyweCYnBS9zdwgQAAAABJRU5ErkJggg=="},function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABJklEQVRoge3UMU4DMRCF4TEUqSlCgSjhOFRJrsAlECXiDFyBFsFVoICGRBQUNIT6p2CRVlHs3fHabCTe1+eN500SMxEREREREdlRwASYjjD3EJgMCdgHroE1P56BecE3xubOgZdm5idwBezlBF2y3W2NiwDTJnubi5zAVSQM4B1YFHz8osmMec0J/UoEFrlGR+tt65zwhx7BkHkNultvu89Z4JT012hTr2vQv/VfK+DEvUAz7AC4cQz7AM4TeZ7WodQfBnAGvDkG3wFHrc97Wy/6JzHoEYzVemIR7zVcC1d7+MYS3t9Gl7qtJxYZeo2/az2xRO41xmk9xnGN8VuP6XGN3Wo9BpgBT62HPwKzGrNCjVAzMyCY2bGZWQhhWWuOiIiIyH/2DfxRvrfW3thjAAAAAElFTkSuQmCC"},,,,,function(e,t,n){e.exports=n(26)},,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var o=n(0),a=n.n(o),i=n(5),r=n.n(i),s=(n(20),n(21),n(1)),l=n(6),d=n(7),c=n(13),u=n(8),h=n(14),g=n(11),f=n(9),m=n.n(f),v=n(12);n(22);var p=function(e){var t=a.a.useState(!1),n=Object(v.a)(t,2),o=n[0],i=n[1],r=e.col,s=e.isFinish,l=e.isStart,d=e.isWall,c=e.onMouseOut,u=e.onMouseDown,h=e.onMouseEnter,g=e.onMouseUp,f=e.row,m=e.nodeWidth,p=(e.isWallAnimate,e.isShortestPathNode),w=e.isExploredNode,N=e.isNeighborNode,E="",S="white",A=0;s?(E="node-finish",S="lightcoral",A=1):l?(E="node-start",S="lightgreen",A=2):d?(E="node-wall",S="#011a27",A=3):p?(E="node-final-path",S="yellow",A=4):w?(E="node-visited",A=5,S="#89dbff"):N&&(E="node-neighbor",A=6,S="lightsalmon");var y=Math.abs(e.startNodeRow-f)+Math.abs(e.startNodeCol-r),b=Math.abs(e.finishNodeRow-f)+Math.abs(e.finishNodeCol-r),M="--";return(w||p||N)&&(M=e.totalCost),(l||s)&&(M=0),a.a.createElement(a.a.Fragment,null,a.a.createElement("div",{id:"node-".concat(f,"-").concat(r),className:"node ".concat(E," ").concat(o&&"node-inspection"),onMouseOut:function(){c(f,r)},onMouseDown:function(){e.isWallMode&&u(f,r)},onMouseEnter:function(t){if(e.isWallMode){var n=1===t.buttons,o=t.shiftKey;h(f,r,n,o)}else e.gridBeingUsed||i(!0)},onMouseUp:function(e){e.preventDefault(),g(f,r)},onMouseLeave:function(){e.isWallMode||e.gridBeingUsed||i(!1)},style:{width:"".concat(m,"px")}},o&&a.a.createElement("div",{style:{width:"120px",height:"140px",backgroundColor:S,zIndex:1e3,position:"absolute",bottom:"45px",left:"-55px",border:"1px solid ".concat(d?"white":"black"),display:"flex",flexDirection:"column",padding:"6px",textAlign:"left",fontSize:"13px",justifyContent:"space-evenly",color:d?"white":"#011a27"}},a.a.createElement("div",null,"Type: ",["Unvisited","End","Start","Wall","Path","Explored","Neighbor"][A]),a.a.createElement("div",null,"Node Num: ",e.nodeIndex),a.a.createElement("div",null,"Cost: ",M),a.a.createElement("div",null,"Row Number: ",f),a.a.createElement("div",null,"Col Number: ",r),a.a.createElement("div",null,"Start Distance: ",y),a.a.createElement("div",null,"End Distance: ",b))))};function w(e,t,n){var o=e.row,a=e.col;return o>=0&&a>=0&&o<n&&a<t}function N(e,t,n,o){var a=[],i=e.row,r=e.col,s={row:i+-1,col:r+0},l={row:i+0,col:r+1},d={row:i+1,col:r+0},c={row:i+0,col:r+-1};return w(c,n,o)&&a.push(t[c.row][c.col]),w(d,n,o)&&a.push(t[d.row][d.col]),w(l,n,o)&&a.push(t[l.row][l.col]),w(s,n,o)&&a.push(t[s.row][s.col]),console.log(a,i,r),a}function E(e,t){return Math.floor(Math.random()*(t-e+1))+e}function S(){var e=new Map;return e.set("NORTH",{row:-2,col:0}),e.set("SOUTH",{row:2,col:0}),e.set("WEST",{row:0,col:-2}),e.set("EAST",{row:0,col:2}),e}function A(e,t,n){return e.row>=1&&e.row<t&&e.col>=1&&e.col<n}function y(e,t,n){return e.col===t.col&&e.row===t.row||e.col===n.col&&e.row===n.row}function b(e,t,n,o){for(var a=E(1,n-1),i=E(1,o-1);y({row:a,col:i},e,t)||a%2===0;)a=E(1,n-1),i=E(1,o-1);return{row:a,col:a}}function M(e){var t=[],n=!0,o=!1,a=void 0;try{for(var i,r=e.keys()[Symbol.iterator]();!(n=(i=r.next()).done);n=!0){var s=i.value;t.push(s)}}catch(l){o=!0,a=l}finally{try{n||null==r.return||r.return()}finally{if(o)throw a}}return t[E(0,t.length-1)]}var B=[{row:-2,col:0},{row:2,col:0},{row:0,col:2},{row:0,col:-2}];function I(e,t,n,o){var a=[],i=e.row,r=e.col,l=t.length,d=t[0].length,c=n?0:1,u=!0,h=!1,g=void 0;try{for(var f,m=B[Symbol.iterator]();!(u=(f=m.next()).done);u=!0){var v=f.value,p={row:i+v.row,col:r+v.col};A(p,l,d)&&t[p.row][p.col]===c&&(a.push(Object(s.a)({},p,{frontierCell:!0})),n||o.add("".concat(p.row,":").concat(p.col)))}}catch(w){h=!0,g=w}finally{try{u||null==m.return||m.return()}finally{if(h)throw g}}return a}function O(e,t){var n=new Set,o=!0,a=!1,i=void 0;try{for(var r,s=e[Symbol.iterator]();!(o=(r=s.next()).done);o=!0){var l=r.value;n.add(l)}}catch(m){a=!0,i=m}finally{try{o||null==s.return||s.return()}finally{if(a)throw i}}var d=!0,c=!1,u=void 0;try{for(var h,g=t[Symbol.iterator]();!(d=(h=g.next()).done);d=!0){var f=h.value;n.add(f)}}catch(m){c=!0,u=m}finally{try{d||null==g.return||g.return()}finally{if(c)throw u}}return n}var W=n(3);function k(e){var t=e[e.length-1],n=e[e.length-2];return t.row<n.row?"NORTH":t.row>n.row?"SOUTH":t.col<n.col?"WEST":"EAST"}function C(e,t){for(var n=[],o=0;o<e.length-1;o++){var a=e[o],i=T(a,e[o+1]);n.push(i),0===o&&t||n.push(a)}return n.push(e[e.length-1]),n}function x(e,t){return{animations:e,animationType:t}}function T(e,t){return{row:Math.floor((e.row+t.row)/2),col:Math.floor((e.col+t.col)/2)}}function U(e,t,n,o,a){var i=["NORTH","SOUTH","WEST","EAST"],r=new Map;r.set("NORTH","SOUTH"),r.set("SOUTH","NORTH"),r.set("EAST","WEST"),r.set("WEST","EAST");for(var s=i[E(0,i.length-1)];s===r.get(e)||!A({row:t.row+n.get(s).row,col:t.col+n.get(s).col},o,a);)s=i[E(0,i.length-1)];return s}function V(e){var t=Array.from(e),n=t[E(0,t.length-1)].split(":");return{row:parseInt(n[0]),col:parseInt(n[1])}}n(23);var R=function(){return a.a.createElement("div",{className:"container"},a.a.createElement("div",{className:"container-and-label"},a.a.createElement("div",{className:"fake-node fake-node-start-color"}),a.a.createElement("div",null,"Start Node")),a.a.createElement("div",{className:"container-and-label"},a.a.createElement("div",{className:"fake-node fake-node-end-color"}),a.a.createElement("div",null,"End Node")),a.a.createElement("div",{className:"container-and-label"},a.a.createElement("div",{className:"fake-node fake-node-wall-color"}),a.a.createElement("div",null,"Wall Node")),a.a.createElement("div",{className:"container-and-label"},a.a.createElement("div",{className:"fake-node"}),a.a.createElement("div",null,"Unvisted Node")),a.a.createElement("div",{className:"container-and-label"},a.a.createElement("div",{className:"fake-node fake-node-explored-first-color"}),a.a.createElement("div",null,"Explored Node")),a.a.createElement("div",{className:"container-and-label"},a.a.createElement("div",{className:"fake-node fake-node-neighbor"}),a.a.createElement("div",null,"Neighbor Node")),a.a.createElement("div",{className:"container-and-label last-container"},a.a.createElement("div",{className:"fake-node fake-node-shortest-path-color"}),a.a.createElement("div",null,"Path Found Node")))},F=n(2),G=(n(24),n(10)),z=n.n(G),P=function(e){return a.a.createElement("div",{className:"drop-down-container"},a.a.createElement("button",{className:Object(F.a)("drop-down-button",e.gridBeingUsed&&"drop-down-button-disabled",e.isOpen&&"drop-down-button-selected"),id:e.id,onChange:e.onChange,disabled:!!e.gridBeingUsed,onClick:function(){return e.handleDropdownOpenStateChange(e.type)}},e.value,a.a.createElement("img",{style:{width:"16px",marginLeft:"14px"},src:z.a})),e.isOpen&&a.a.createElement("div",{className:"drop-down-elements-container"},e.items.map((function(t){return a.a.createElement("div",{key:t,value:t,className:"drop-down-element"},a.a.createElement("div",{className:"drop-down-element-text",onClick:function(){return e.onChange(t)}},t))}))))},D=(n(25),10),L=10,j=10,Y=45,H=-1,Q=20,J=50,Z=function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(c.a)(this,Object(u.a)(t).call(this,e))).updateDimensions=function(){var e=(window.innerWidth-50)/J;n.setState({nodeWidth:Math.floor(e)})},n.handleMouseEnter=function(e,t,o,a){if(!n.state.gridBeingUsed&&n.state.isWallMode){var i=n.state.grid[e][t];H=-1,i.isWall?H=1:i.isExploredNode?H=2:i.isShortestPathNode?H=3:i.isNeighborNode&&(H=4);var r=!i.isFinish&&!i.isStart,s=n.state.isStartNodeMoving||n.state.isFinishNodeMoving;r&&!s&&o?(i.isWall=!0,i.isVisited=!1,document.getElementById("node-".concat(e,"-").concat(t)).className="node node-wall-animate"):r&&!s&&a?(i.isWall=!1,i.isVisited=!1,document.getElementById("node-".concat(e,"-").concat(t)).className="node"):n.state.isStartNodeMoving&&!i.isFinish?(i.isStart=!0,i.isWall=!1,i.isVisited=!1,document.getElementById("node-".concat(e,"-").concat(t)).className="node node-start",D=e,L=t):n.state.isFinishNodeMoving&&!i.isStart&&(i.isFinish=!0,i.isWall=!1,i.isVisited=!1,document.getElementById("node-".concat(e,"-").concat(t)).className="node node-finish",j=e,Y=t)}},n.handleMouseOut=function(e,t){var o=n.state.grid[e][t];(n.state.isStartNodeMoving&&!o.isFinish||n.state.isFinishNodeMoving&&!o.isStart)&&(o.isStart=!1,o.isFinish=!1,o.isWall=!1,o.isVisited=!1,document.getElementById("node-".concat(e,"-").concat(t)).className="node"),(n.state.isStartNodeMoving||n.state.isFinishNodeMoving)&&(1===H?(o.isWall=!0,o.isVisited=!1,document.getElementById("node-".concat(e,"-").concat(t)).className="node node-wall-animate"):2===H?(o.isWall=!1,o.isVisited=!0,o.isExploredNode=!0,document.getElementById("node-".concat(e,"-").concat(t)).className="node node-visited"):3===H?(o.isWall=!1,o.isVisited=!0,o.isExploredNode=!1,o.isShortestPathNode=!0,document.getElementById("node-".concat(e,"-").concat(t)).className="node node-final-path"):4===H&&(o.isWall=!1,o.isVisited=!0,o.isExploredNode=!1,o.isShortestPathNode=!1,o.isNeighborNode=!0,document.getElementById("node-".concat(e,"-").concat(t)).className="node node-neighbor"))},n.handleMouseDown=function(e,t){if(!n.state.gridBeingUsed&&n.state.isWallMode){var o=n.state.grid[e][t];o.isFinish||o.isStart||o.isWall?o.isFinish||o.isStart||!o.isWall?o.isStart?n.setState({isStartNodeMoving:!0}):o.isFinish&&n.setState({isFinishNodeMoving:!0}):(o.isVisited=!1,o.isWall=!1,document.getElementById("node-".concat(e,"-").concat(t)).className="node"):(o.isVisited=!1,o.isWall=!0,document.getElementById("node-".concat(e,"-").concat(t)).className="node node-wall-animate")}},n.handleMouseUp=function(e,t){var o=n.state.grid[e][t];n.setState({isStartNodeMoving:!1,isFinishNodeMoving:!1}),n.state.isStartNodeMoving?(D=e,L=t):n.state.isFinishNodeMoving&&(j=e,Y=t),L===Y&&D===j&&(o.isFinish=!1,o.isVisited=!1,o.isStart=!1,o.isWall=!1,document.getElementById("node-".concat(e,"-").concat(t)).className="node",D=Math.floor(Q/2),j=Math.floor(Q/2),L=Math.floor(J/4),Y=Math.floor(.8*J),n.state.grid[D][L].isWall=!1,n.state.grid[D][L].isVisited=!1,n.state.grid[D][L].isFinish=!1,n.state.grid[D][L].isStart=!0,document.getElementById("node-".concat(D,"-").concat(L)).className="node node-start",n.state.grid[j][Y].isWall=!1,n.state.grid[j][Y].isVisited=!1,n.state.grid[j][Y].isFinish=!0,n.state.grid[j][Y].isStart=!1,document.getElementById("node-".concat(j,"-").concat(Y)).className="node node-finish")},n.clearPath=function(){H=-1;for(var e=0;e<Q;e++)for(var t=0;t<J;t++)e===D&&t===L?(document.getElementById("node-".concat(e,"-").concat(t)).className="node node-start",n.state.grid[e][t].distance=1/0,n.state.grid[e][t].isVisited=!1,n.state.grid[e][t].isWall=!1,n.state.grid[e][t].previousNode=null):e===j&&t===Y?(document.getElementById("node-".concat(e,"-").concat(t)).className="node node-finish",n.state.grid[e][t].distance=1/0,n.state.grid[e][t].isVisited=!1,n.state.grid[e][t].isWall=!1,n.state.grid[e][t].previousNode=null):n.state.grid[e][t].isVisited&&!n.state.grid[e][t].isFinish&&(document.getElementById("node-".concat(e,"-").concat(t)).className="node",n.state.grid[e][t].distance=1/0,n.state.grid[e][t].isVisited=!1,n.state.grid[e][t].isWall=!1,n.state.grid[e][t].previousNode=null),n.state.grid[e][t].isExploredNode=!1,n.state.grid[e][t].isShortestPathNode=!1,n.state.grid[e][t].isNeighborNode=!1},n.updateCurrentAlgo=function(e){n.handleDropdownOpenStateChange(""),n.setState({currentAlgo:e,startButtonText:"Visualize"})},n.clearGrid=function(){if(!n.state.isStartNodeMoving&&!n.state.isFinishNodeMoving){H=-1;for(var e=0;e<Q;e++)for(var t=0;t<J;t++)e===D&&t===L?(document.getElementById("node-".concat(e,"-").concat(t)).className="node node-start",n.state.grid[e][t].isStart=!0):e===j&&t===Y?(document.getElementById("node-".concat(e,"-").concat(t)).className="node node-finish",n.state.grid[e][t].isFinish=!0):document.getElementById("node-".concat(e,"-").concat(t)).className="node",n.state.grid[e][t].distance=1/0,n.state.grid[e][t].isVisited=!1,n.state.grid[e][t].isWall=!1,n.state.grid[e][t].previousNode=null,n.state.grid[e][t].isExploredNode=!1,n.state.grid[e][t].isShortestPathNode=!1,n.state.grid[e][t].isNeighborNode=!1,n.state.grid[e][t].totalCost=0}},n.startAlgorithm=function(){if(!n.state.gridBeingUsed){if(n.handleDropdownOpenStateChange(""),"Algorithms"===n.state.currentAlgo)return document.getElementById("pathfinding-algorithm-selection").classList.add("drop-down-button-selected"),void setTimeout((function(){document.getElementById("pathfinding-algorithm-selection").classList.remove("drop-down-button-selected")}),450);var e=!("Speed"===n.state.currentSpeed&&"Algorithms"!==n.state.currentAlgo);"Algorithms"!==n.state.currentAlgo&&!n.state.isStartNodeMoving&&!n.state.isFinishNodeMoving&&(e||n.forceUpdateSpeed(),n.setState({gridBeingUsed:!0}));var t=n.state.currentAlgo;if(!n.state.isStartNodeMoving&&!n.state.isFinishNodeMoving){n.state.gridClear||n.clearPath(),n.disableGrid();var o,a=n.state.grid[D][L];if("A* Algorithm"===t){var i=(o=function(e,t,n,o,a,i){var r=[],s=[],l=[],d=e[t.row][t.col];for(d.distance=0,d.gCost=0,d.isVisited=!0,r.push(d);0!==r.length;){r.sort((function(e,t){return e.distance-t.distance}));var c=r.shift();if(c.isFinish){for(var u=c;null!==u;)l.push(u),u=u.previousNode;break}if(!c.isWall){for(var h=N(c,e,n,o),g=0;g<h.length;g++)if(!h[g].isWall&&!h[g].isStart){var f=h[g];if(f.isVisited)continue;var m=10*(Math.abs(a-f.row)+Math.abs(i-f.col));f.previousNode=c,f.gCost=c.gCost+10,f.distance=f.gCost+m,f.totalCost=f.gCost+m,f.isVisited=!0,r.push(f),s.push({node:f,type:"NEIGHBOR"})}s.push({node:c,type:"VISITED"})}}return{visited:s,shortest:l}}(n.state.grid,a,J,Q,j,Y)).shortest.reverse();n.visualizePathfindingAlgorithm(o.visited,i)}else if("Greedy Best-First Search"===t){var r=(o=function(e,t,n,o,a,i){var r=[],s=[],l=[],d=e[t.row][t.col];for(d.isVisited=!0,r.push(d);0!==r.length;){r.sort((function(e,t){return e.distance-t.distance}));var c=r.shift();if(c.isFinish){l.push(c);for(var u=c.previousNode;null!==u;)l.push(u),u=u.previousNode;break}if(!c.isWall){for(var h=N(c,e,n,o),g=0;g<h.length;g++)if(!h[g].isWall&&!h[g].isStart){var f=h[g];if(!f.isVisited){var m=10*Math.abs(a-f.row)+10*Math.abs(i-f.col);f.previousNode=c,f.distance=m,f.totalCost=m,f.isVisited=!0,r.push(f),s.push({node:f,type:"NEIGHBOR"})}}s.push({node:c,type:"VISITED"})}}return{visited:s,shortest:l}}(n.state.grid,a,J,Q,j,Y)).shortest.reverse();n.visualizePathfindingAlgorithm(o.visited,r)}else if("Dijkstra's Algorithm"===t){var s=(o=function(e,t,n,o){var a=[],i=[],r=[],s=e[t.row][t.col];for(s.distance=0,s.isVisited=!0,a.push(s);0!==a.length;){a.sort((function(e,t){return e.distance-t.distance}));var l=a.shift();if(l.isFinish){r.push(l);for(var d=l.previousNode;null!==d;)r.push(d),d=d.previousNode;break}if(!l.isWall){for(var c=N(l,e,n,o),u=0;u<c.length;u++)if(!c[u].isWall&&!c[u].isStart){var h=c[u];h.isVisited||(h.previousNode=l,h.distance=l.distance+10,h.totalCost=l.distance+10,h.isVisited=!0,a.push(h),i.push({node:h,type:"NEIGHBOR"}))}i.push({node:l,type:"VISITED"})}}return{visited:i,shortest:r}}(n.state.grid,a,J,Q)).shortest.reverse();n.visualizePathfindingAlgorithm(o.visited,s)}else"Depth First Search"===t&&(o=function(e,t,n,o){var a=[];a.push(t),t.isVisited=!0;for(var i=[];0!==a.length;){var r=a.pop();if(r.isVisited=!0,r.isFinish){for(var s=[],l=r.previousNode;null!==l;)s.push(l),l=l.previousNode;return{visited:i,shortest:s.reverse()}}r.isStart||i.push({node:r,type:"VISITED"});var d=N(r,e,n,o),c=!0,u=!1,h=void 0;try{for(var g,f=d[Symbol.iterator]();!(c=(g=f.next()).done);c=!0){var m=g.value;m.isVisited||m.isWall||(a.push(m),m.previousNode=r,m.totalCost="N/A",i.push({node:m,type:"NEIGHBOR"}))}}catch(v){u=!0,h=v}finally{try{c||null==f.return||f.return()}finally{if(u)throw h}}}return{visited:i,shortest:null}}(n.state.grid,a,J,Q),n.visualizePathfindingAlgorithm(o.visited,null===o.shortest?[]:o.shortest))}}},n.generateMaze=function(e){if(n.handleDropdownOpenStateChange(""),!n.state.isStartNodeMoving&&!n.state.isFinishNodeMoving)if(n.clearGrid(),n.disableGrid(),n.setState({gridBeingUsed:!0}),"Prim's Algorithm"===e){var t=function(e,t,n){for(var o=e.length,a=e[0].length,i=[],r=0;r<o;r++){for(var l=[],d=0;d<a;d++)l.push(1);i.push(l)}var c=[],u=new Set,h=b(t,n,o,a);i[h.row][h.col]=0;var g=I(h,i,!1,u);for(c.push(Object(s.a)({},h,{frontierCell:!1})),c=c.concat(g);g.length>0;){var f=E(0,g.length-1),m=g[f];if(0!==i[m.row][m.col]){var v=I(m,i,!0,u);if(v.length>0){var p=v[E(0,v.length-1)],w=p.row,N=p.col,S=Math.floor((w+m.row)/2),A=Math.floor((N+m.col)/2);i[S][A]=0,c.push({row:S,col:A,frontierCell:!1})}i[m.row][m.col]=0,g.splice(f,1),c.push(Object(s.a)({},m,{frontierCell:!1}));var y=I(m,i,!1,u);c=c.concat(y);var M=!0,B=!1,O=void 0;try{for(var W,k=y[Symbol.iterator]();!(M=(W=k.next()).done);M=!0){var C=W.value;u.has("".concat(C.row,":").concat(C.col))||c.push(C)}}catch(x){B=!0,O=x}finally{try{M||null==k.return||k.return()}finally{if(B)throw O}}g=g.concat(y)}else g.splice(f,1)}return c}(n.state.grid,{row:D,col:L},{row:j,col:Y});n.createGridOfWalls(t,n.displayPrimsPathAnimation)}else if("Recursive Backtracking"===e){var o=function(e,t,n){for(var o=e.length,a=e[0].length,i=[],r=0;r<o;r++){for(var l=[],d=0;d<a;d++)l.push(1);i.push(l)}var c=[],u=new Set,h=b(t,n,o,a);i[h.row][h.col]=0,u.add("".concat(h.row,":").concat(h.col));var g=[];for(g.push({cell:h,directions:S(),backtrack:!1});g.length>0;){var f=g[g.length-1],m=f.cell;i[m.row][m.col]=0;var v=f.directions;if(0!==v.size){c.push(Object(s.a)({},m,{backtrack:!1}));var p=M(v),w=v.get(p);v.delete(p);var N={row:m.row+w.row,col:m.col+w.col};if(!(!A(N,o,a)||0===i[N.row][N.col]||u.has("".concat(N.row,":").concat(N.col)))){var E=Math.floor((N.row+m.row)/2),y=Math.floor((N.col+m.col)/2);i[E][y]=0,c.push({row:E,col:y,backtrack:!1}),g.push({cell:N,directions:S()}),u.add("".concat(N.row,":").concat(N.col))}}else if(c.push(Object(s.a)({},m,{backtrack:!0})),g.pop(),0!==g.length){var B=g[g.length-1].cell,I=Math.floor((B.row+m.row)/2),O=Math.floor((B.col+m.col)/2);c.push({row:I,col:O,backtrack:!0})}}return c}(n.state.grid,{row:D,col:L},{row:j,col:Y});n.createGridOfWalls(o,n.displayRecursiveBacktrackingAnimation)}else if("Kruskal's Algorithm"===e){var a=function(e){for(var t=e.length,n=e[0].length,o=[],a=0;a<t;a++){for(var i=[],r=0;r<n;r++)i.push(1);o.push(i)}for(var s=[],l=new Map,d=new Map,c=[],u=0;u<t;u++)if(u%2!==0)for(var h=0;h<n;h++)if(h%2!==0){var g="".concat(u,":").concat(h),f=new Set;f.add(g),l.set(g,f),d.set(g,S()),c.push(g)}for(;0!==c.length;){var m=E(0,c.length-1),v=c[m],p=d.get(v),w=M(p),N=p.get(w);p.delete(w),0===p.size&&c.splice(m,1);var y=v.split(":"),b=(parseInt(y[0]),parseInt(y[1]),{row:parseInt(y[0])+N.row,col:parseInt(y[1])+N.col});if(A(b,t,n)){var B=l.get(v),I="".concat(b.row,":").concat(b.col);if(!B.has(I)){var W=l.get(I),k=O(B,W),C=!0,x=!1,T=void 0;try{for(var U,V=B[Symbol.iterator]();!(C=(U=V.next()).done);C=!0){var R=U.value;l.set(R,k)}}catch(H){x=!0,T=H}finally{try{C||null==V.return||V.return()}finally{if(x)throw T}}var F=!0,G=!1,z=void 0;try{for(var P,D=W[Symbol.iterator]();!(F=(P=D.next()).done);F=!0){var L=P.value;l.set(L,k)}}catch(H){G=!0,z=H}finally{try{F||null==D.return||D.return()}finally{if(G)throw z}}var j=Math.floor((b.row+parseInt(y[0]))/2),Y=Math.floor((b.col+parseInt(y[1]))/2);0!==o[j][Y]&&s.push({row:j,col:Y}),0!==o[parseInt(y[0])][parseInt(y[1])]&&s.push({row:parseInt(y[0]),col:parseInt(y[1])}),0!==o[b.row][b.col]&&s.push({row:b.row,col:b.col}),o[j][Y]=0,o[parseInt(y[0])][parseInt(y[1])]=0,o[b.row][b.col]=0}}}return s}(n.state.grid);n.createGridOfWalls(a,n.displayKruskalsAnimation)}else if("Wilson's Algorithm"===e){var i=function(e){for(var t=e.length,n=e[0].length,o=S(),a=[],i=new Set,r=0;r<t;r++){for(var s=[],l=0;l<n;l++)s.push(1),r%2!==0&&l%2!==0&&i.add("".concat(r,":").concat(l));a.push(s)}var d=[],c=new Set;for(c.add("".concat(1,":",1)),c.add("".concat(1,":",2)),c.add("".concat(1,":",3)),i.delete("".concat(1,":",1)),i.delete("".concat(1,":",2)),i.delete("".concat(1,":",3)),d.push(x([{row:1,col:1},{row:1,col:2},{row:1,col:3}],"MAZE_TYPE"));0!==i.size;){var u=V(i);d.push(x([u],"EXPLORE_TYPE"));var h=[],g=new Set;h.push(u),g.add("".concat(u.row,":").concat(u.col));for(var f=null,m=function(){var e=h[h.length-1],a=U(f,e,o,t,n),r=o.get(a),s={row:e.row+r.row,col:e.col+r.col},l="".concat(s.row,":").concat(s.col);if(c.has(l)){var u=!0,m=!1,v=void 0;try{for(var p,w=h[Symbol.iterator]();!(u=(p=w.next()).done);u=!0){var N=p.value,E="".concat(N.row,":").concat(N.col);i.delete(E),c.add(E)}}catch(L){m=!0,v=L}finally{try{u||null==w.return||w.return()}finally{if(m)throw v}}var S=C(h,!1);S.push(T(e,s));var A=x(S,"MAZE_TYPE");return d.push(A),"break"}if(g.has(l)){var y=T(e,s);d.push(x([y],"EXPLORE_TYPE"));var b=h.findIndex((function(e){return e.row===s.row&&e.col===s.col})),M=h.slice(b+1),B=C([h[b]].concat(Object(W.a)(M)),!0),I=x([y].concat(Object(W.a)(B)),"WALL_TYPE");if(d.push(I),0===b)return d.push(x([h[0]],"WALL_TYPE")),"break";h.splice(b+1);var O=!0,V=!1,R=void 0;try{for(var F,G=M[Symbol.iterator]();!(O=(F=G.next()).done);O=!0){var z=F.value,P="".concat(z.row,":").concat(z.col);g.delete(P)}}catch(L){V=!0,R=L}finally{try{O||null==G.return||G.return()}finally{if(V)throw R}}f=1===b?null:k(h)}else{h.push(s),g.add("".concat(s.row,":").concat(s.col));var D=x([T(e,s),s],"EXPLORE_TYPE");d.push(D),f=a}};;){if("break"===m())break}}return d}(n.state.grid);n.createGridOfWalls(i,n.displayWilsonsAlgorithm)}},n.createGridOfWalls=function(e,t){for(var o=0;o<Q;o++)for(var a=0;a<=J;a++)if(o===Q-1&&a===J)setTimeout((function(){t(e)}),500);else{if(a===J)continue;if(n.isStartNodeOrEndNode(o,a))continue;n.state.grid[o][a].isWall=!0,n.state.grid[o][a].isVisited=!1,n.state.grid[o][a].isStart=!1,n.state.grid[o][a].isFinish=!1,document.getElementById("node-".concat(o,"-").concat(a)).className="node node-wall"}},n.displayWilsonsAlgorithm=function(e){for(var t=function(t){t===e.length?setTimeout((function(){n.enableGrid(),n.setState({gridBeingUsed:!1})}),5*t):setTimeout((function(){var o=e[t],a=o.animations,i=o.animationType,r=!0,s=!1,l=void 0;try{for(var d,c=a[Symbol.iterator]();!(r=(d=c.next()).done);r=!0){var u=d.value,h=u.row,g=u.col;n.isStartNodeOrEndNode(h,g)||("WALL_TYPE"===i?(document.getElementById("node-".concat(h,"-").concat(g)).className="node node-wall",n.state.grid[h][g].isWall=!0):"EXPLORE_TYPE"===i?(document.getElementById("node-".concat(h,"-").concat(g)).className="node node-frontier",n.state.grid[h][g].isWall=!1):"MAZE_TYPE"===i?(document.getElementById("node-".concat(h,"-").concat(g)).className="node",n.state.grid[h][g].isWall=!1):console.log("this should not happen"))}}catch(f){s=!0,l=f}finally{try{r||null==c.return||c.return()}finally{if(s)throw l}}}),5*t)},o=0;o<=e.length;o++)t(o)},n.displayKruskalsAnimation=function(e){for(var t=function(t){t===e.length?setTimeout((function(){n.enableGrid(),n.setState({gridBeingUsed:!1})}),15*t):setTimeout((function(){var o=e[t],a=o.row,i=o.col;n.isStartNodeOrEndNode(a,i)||(n.state.grid[a][i].isWall=!1,document.getElementById("node-".concat(a,"-").concat(i)).className="node")}),15*t)},o=0;o<=e.length;o++)t(o)},n.displayRecursiveBacktrackingAnimation=function(e){for(var t=function(t){t===e.length?setTimeout((function(){n.enableGrid(),n.setState({gridBeingUsed:!1})}),15*t):setTimeout((function(){var o=e[t],a=o.row,i=o.col,r=o.backtrack;n.isStartNodeOrEndNode(a,i)||(n.state.grid[a][i].isWall=!1,document.getElementById("node-".concat(a,"-").concat(i)).className="node ".concat(r?"node-backtrack":""))}),15*t)},o=0;o<=e.length;o++)t(o)},n.displayPrimsPathAnimation=function(e){for(var t=function(t){t===e.length?setTimeout((function(){n.enableGrid(),n.setState({gridBeingUsed:!1})}),12*t):setTimeout((function(){var o=e[t],a=o.row,i=o.col,r=o.frontierCell;n.isStartNodeOrEndNode(a,i)||(n.state.grid[a][i].isWall=!1,document.getElementById("node-".concat(a,"-").concat(i)).className="node ".concat(r&&"node-frontier"))}),12*t)},o=0;o<=e.length;o++)t(o)},n.isStartNodeOrEndNode=function(e,t){return e===D&&t===L||e===j&&t===Y},n.displayMaze=function(e){for(var t=function(t){t===e.length?setTimeout((function(){n.enableGrid(),n.setState({gridBeingUsed:!1})}),7*t):setTimeout((function(){var o=e[t];o.row===j&&o.col===Y||o.row===D&&o.col===L||(document.getElementById("node-".concat(o.row,"-").concat(o.col)).className="node node-wall",n.state.grid[o.row][o.col].isVisited=!1,n.state.grid[o.row][o.col].isWall=!0)}),7*t)},o=0;o<=e.length;o++)t(o)},n.updateSpeed=function(e){n.handleDropdownOpenStateChange(""),"Slow"===e?n.setState({speedIndex:0,currentSpeed:"Slow"}):"Normal"===e?n.setState({speedIndex:1,currentSpeed:"Normal"}):"Fast"===e&&n.setState({speedIndex:2,currentSpeed:"Fast"})},n.forceUpdateSpeed=function(){n.setState({speedIndex:1,currentSpeed:"Normal"})},n.resetGrid=function(){if(!n.state.isStartNodeMoving&&!n.state.isFinishNodeMoving){n.handleDropdownOpenStateChange(""),n.clearGrid(),D=Math.floor(Q/2),j=Math.floor(Q/2),L=Math.floor(J/4),Y=Math.floor(.8*J);var e=n.formulateGrid();n.setState({grid:e,speedIndex:1,currentAlgo:"Algorithms",currentSpeed:"Speed",startButtonText:"Choose Algorithm",isWallMode:!0})}},n.handleDropdownOpenStateChange=function(e){"ALGORITHMS"===e?n.setState({isMazeOpen:!1,isSpeedOpen:!1,isAlgorithmOpen:!n.state.isAlgorithmOpen}):"GENERATE_WALLS"===e?n.setState({isAlgorithmOpen:!1,isSpeedOpen:!1,isMazeOpen:!n.state.isMazeOpen}):"SPEED"===e?n.setState({isAlgorithmOpen:!1,isMazeOpen:!1,isSpeedOpen:!n.state.isSpeedOpen}):n.setState({isAlgorithmOpen:!1,isMazeOpen:!1,isSpeedOpen:!1})},n.formulateGrid=function(){for(var e=[],t=0;t<Q;t++){for(var o=[],a=0;a<J;a++)o.push(n.createNode(a,t));e.push(o)}return e},n.createNode=function(e,t){return{col:e,row:t,isStart:t===D&&e===L,isFinish:t===j&&e===Y,distance:1/0,isVisited:!1,isWall:!1,previousNode:null,isShortestPathNode:!1,isExploredNode:!1,totalCost:0,isNeighborNode:!1}},n.state={grid:[],gridClear:!0,isStartNodeMoving:!1,isFinishNodeMoving:!1,algorithms:["A* Algorithm","Greedy Best-First Search","Dijkstra's Algorithm","Depth First Search"],currentAlgo:"Algorithms",speed:["Slow","Normal","Fast"],currentSpeed:"Speed",speedValue:[100,6,4],speedIndex:1,mazeAlgorithms:["Prim's Algorithm","Wilson's Algorithm","Kruskal's Algorithm","Recursive Backtracking"],startButtonText:"Choose Algorithm",gridBeingUsed:!1,nodeWidth:25,isAlgorithmOpen:!1,isMazeOpen:!1,isSpeedOpen:!1,isWallMode:!0},n}return Object(h.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){var e=window.innerWidth,t=window.screen.height;Q=Math.ceil((t-250)/25),J=Math.ceil((e-50)/25),Q%2===0&&Q++,J%2===0&&J--,D=Math.floor(Q/2),j=Math.floor(Q/2),L=Math.floor(J/4),Y=Math.floor(.8*J);var n=this.formulateGrid();this.setState({grid:n,nodeWidth:25}),window.addEventListener("mouseup",this.onMouseUp),window.addEventListener("resize",this.updateDimensions)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("mouseup",this.onMouseUp),window.removeEventListener("resize",this.updateDimensions)}},{key:"visualizePathfindingAlgorithm",value:function(e,t){for(var n=this,o=function(o){o===e.length?setTimeout((function(){n.visualizeShortestPath(t)}),n.state.speedValue[n.state.speedIndex]*o):setTimeout((function(){var t=e[o],a=t.node,i=t.type;a.isStart||a.isFinish||("VISITED"===i?(n.state.grid[a.row][a.col].isExploredNode=!0,n.state.grid[a.row][a.col].isNeighborNode=!1,document.getElementById("node-".concat(a.row,"-").concat(a.col)).className="node node-visited disabledNode"):(n.state.grid[a.row][a.col].isExploredNode=!1,n.state.grid[a.row][a.col].isNeighborNode=!0,document.getElementById("node-".concat(a.row,"-").concat(a.col)).className="node node-neighbor disabledNode"))}),n.state.speedValue[n.state.speedIndex]*o)},a=0;a<=e.length;a++)o(a)}},{key:"displayAlgo",value:function(e,t){for(var n=this,o=0;o<=e.length;o++)o===e.length?setTimeout((function(){n.visualizeShortestPath(t)}),this.state.speedValue[this.state.speedIndex]*o):function(){setTimeout((function(){t.isStart||t.isFinish||(n.state.grid[t.row][t.col].isExploredNode=!0,document.getElementById("node-".concat(t.row,"-").concat(t.col)).className="node node-visited disabledNode")}),n.state.speedValue[n.state.speedIndex]*o);var t=e[o]}()}},{key:"visualizeShortestPath",value:function(e){var t=this;this.setState({gridClear:!1});for(var n=function(n){n===e.length?setTimeout((function(){t.enableGrid(),t.setState({gridBeingUsed:!1})}),(t.state.speedValue[t.state.speedIndex]+4)*n):setTimeout((function(){var o=e[n];o.isStart||o.isFinish||(t.state.grid[o.row][o.col].isExploredNode=!1,t.state.grid[o.row][o.col].isShortestPathNode=!0,document.getElementById("node-".concat(o.row,"-").concat(o.col)).className="node node-final-path disabledNode")}),(t.state.speedValue[t.state.speedIndex]+4)*n)},o=0;o<=e.length;o++)n(o)}},{key:"render",value:function(){var e=this;return a.a.createElement("div",{className:"overall-container"},a.a.createElement("div",{className:"menu-container"},a.a.createElement("div",{className:"button-container"},a.a.createElement("div",{className:Object(F.a)("header",this.state.gridBeingUsed&&"header-disabled"),onClick:this.state.gridBeingUsed?null:this.resetGrid},"Pathfinding Visualized"),a.a.createElement("div",{className:"buttons"},a.a.createElement(P,{gridBeingUsed:this.state.gridBeingUsed,placeholder:"Algorithms",id:"pathfinding-algorithm-selection",onChange:this.updateCurrentAlgo,value:this.state.currentAlgo,items:this.state.algorithms,handleDropdownOpenStateChange:this.handleDropdownOpenStateChange,type:"ALGORITHMS",isOpen:this.state.isAlgorithmOpen}),a.a.createElement(P,{gridBeingUsed:this.state.gridBeingUsed,placeholder:"Generate Maze",id:"maze-algorithm-selection",onChange:this.generateMaze,value:"Generate Maze",items:this.state.mazeAlgorithms,handleDropdownOpenStateChange:this.handleDropdownOpenStateChange,type:"GENERATE_WALLS",isOpen:this.state.isMazeOpen}),a.a.createElement(P,{gridBeingUsed:this.state.gridBeingUsed,placeholder:"Speed",id:"speed-selection",onChange:this.updateSpeed,value:this.state.currentSpeed,items:this.state.speed,handleDropdownOpenStateChange:this.handleDropdownOpenStateChange,type:"SPEED",isOpen:this.state.isSpeedOpen}),a.a.createElement("button",{className:Object(F.a)("button","button-start",this.state.gridBeingUsed&&"button-start-disabled"),id:"start-algorithm",onClick:function(){return e.startAlgorithm()},disabled:!!this.state.gridBeingUsed},this.state.startButtonText),a.a.createElement("button",{id:"clear-grid",className:Object(F.a)("button",this.state.gridBeingUsed&&"button-clear-disabled",!this.state.gridBeingUsed&&"button-clear"),onClick:this.clearGrid,disabled:!!this.state.gridBeingUsed},"Clear Grid"),a.a.createElement("button",{id:"reset-button",className:Object(F.a)("button",this.state.gridBeingUsed&&"button-clear-disabled",!this.state.gridBeingUsed&&"button-clear"),onClick:this.resetGrid,disabled:this.state.gridBeingUsed},"Reset"))),a.a.createElement("button",{className:"inspection-button",disabled:this.state.gridBeingUsed||this.state.isStartNodeMoving||this.state.isFinishNodeMoving,onClick:function(){e.setState((function(e){return Object(s.a)({},e,{isWallMode:!e.isWallMode})}))}},this.state.isWallMode?a.a.createElement("img",{style:{width:"22px",height:"22px"},src:m.a}):a.a.createElement(g.a,{style:{width:"22px",height:"22px"}}))),a.a.createElement("div",{className:"grid-and-legend",style:{pointerEvents:this.state.gridBeingUsed?"none":""}},a.a.createElement("div",{className:"legend-container",onClick:function(){return e.handleDropdownOpenStateChange("")}},a.a.createElement(R,null)),a.a.createElement("div",{id:"gridNodes",className:"grid",onClick:function(){return e.handleDropdownOpenStateChange("")}},a.a.createElement("div",{style:{textAlign:"center",marginLeft:"-10px",marginBottom:"10px"}},this.state.grid.map((function(t,n){return a.a.createElement("div",{key:n},t.map((function(t,o){var i=t.row,r=t.col,s=t.isFinish,l=t.isStart,d=t.isWall,c=t.isShortestPathNode,u=t.isExploredNode,h=t.totalCost,g=t.isNeighborNode;return a.a.createElement(p,{key:o,col:r,isFinish:s,isStart:l,isWall:d,onMouseDown:function(t,n){return e.handleMouseDown(t,n)},onMouseEnter:function(t,n,o,a){return e.handleMouseEnter(t,n,o,a)},onMouseUp:function(t,n){return e.handleMouseUp(t,n)},onMouseOut:function(t,n){return e.handleMouseOut(t,n)},row:i,nodeWidth:e.state.nodeWidth,isWallMode:e.state.isWallMode,nodeIndex:n*J+o,gridBeingUsed:e.state.gridBeingUsed,isShortestPathNode:c,isExploredNode:u,isNeighborNode:g,startNodeRow:D,startNodeCol:L,finishNodeRow:j,finishNodeCol:Y,totalCost:h})})))}))))))}},{key:"disableGrid",value:function(){for(var e=0;e<Q;e++)for(var t=0;t<J;t++)document.getElementById("node-".concat(e,"-").concat(t)).classList.add("disabledNode")}},{key:"enableGrid",value:function(){for(var e=0;e<Q;e++)for(var t=0;t<J;t++)document.getElementById("node-".concat(e,"-").concat(t)).classList.remove("disabledNode")}}]),t}(o.Component);var X=function(){return a.a.createElement("div",{className:"app"},a.a.createElement(Z,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(a.a.createElement(X,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[15,1,2]]]);
//# sourceMappingURL=main.b3d61787.chunk.js.map