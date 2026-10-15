export {};

type Command = {
  label: string;
  execute: () => void;
};

type Direction = {
  name: string;
  offsetX: number;
  offsetY: number;
};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const pendingList = document.querySelector<HTMLOListElement>("#rover-pending")!;
const queueStatus = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;
const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;
const directions: Direction[] = [
  { name: "North", offsetX: 0, offsetY: -1 },
  { name: "East", offsetX: 1, offsetY: 0 },
  { name: "South", offsetX: 0, offsetY: 1 },
  { name: "West", offsetX: -1, offsetY: 0 },
];
let x = 2;
let y = 2;
let directionIndex = 0;
let pendingCommands: Command[] = [];

function drawRover() {
  const facing = directions[directionIndex];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(directionIndex * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${facing.name}`;
}

function stepWithinGrid(position: number, offset: number) {
  return Math.max(0, Math.min(4, position + offset));
}

const moveForward: Command = {
  label: "Forward",
  execute: () => {
    const facing = directions[directionIndex];
    x = stepWithinGrid(x, facing.offsetX);
    y = stepWithinGrid(y, facing.offsetY);
  },
};

const turnRight: Command = {
  label: "Right",
  execute: () => {
    directionIndex = (directionIndex + 1) % directions.length;
  },
};

function showPendingCommands() {
  pendingList.replaceChildren();
  for (const command of pendingCommands) {
    const item = document.createElement("li");
    item.textContent = command.label;
    pendingList.append(item);
  }
  if (pendingCommands.length === 0) {
    queueStatus.textContent = "Empty";
  } else {
    queueStatus.textContent = `${pendingCommands.length} pending`;
  }
}

function queueCommand(command: Command) {
  pendingCommands.push(command);
  showPendingCommands();
}

function runPendingCommands() {
  for (const command of pendingCommands) {
    command.execute();
  }
  pendingCommands = [];
  drawRover();
  showPendingCommands();
}

function clearPendingCommands() {
  pendingCommands = [];
  showPendingCommands();
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  queueCommand(moveForward);
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  queueCommand(turnRight);
};
runButton.onclick = () => {
  runPendingCommands();
};
clearButton.onclick = () => {
  clearPendingCommands();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  directionIndex = 0;
  drawRover();
  clearPendingCommands();
};
runButton.disabled = false;
clearButton.disabled = false;
drawRover();
showPendingCommands();
