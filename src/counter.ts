export {};

type ShieldSnapshot = {
  charge: number;
  capacity: number;
  missingCharge: number;
};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
const shieldCapacity = 10;
let shieldCharge = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

function takeShieldSnapshot(): ShieldSnapshot {
  return {
    charge: shieldCharge,
    capacity: shieldCapacity,
    missingCharge: shieldCapacity - shieldCharge,
  };
}

function drawMeter(snapshot: ShieldSnapshot) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let segment = 0; segment < snapshot.capacity; segment++) {
    ctx.fillStyle = segment < snapshot.charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + segment * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${snapshot.charge} / ${snapshot.capacity} shield`, 12, 100);
  readout.textContent =
    `Shield charge: ${snapshot.charge} / ${snapshot.capacity}`;
}

function updateStats(snapshot: ShieldSnapshot) {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(snapshot);
}

function renderStats(snapshot: ShieldSnapshot) {
  if (!panel) return;
  const chargeText = `Shield charge: ${snapshot.charge}`;
  const missingText = `Missing charge: ${snapshot.missingCharge}`;
  panel.textContent = `${chargeText} · ${missingText}`;
}

function setShieldCharge(next: number) {
  const bounded = Math.max(0, Math.min(shieldCapacity, next));
  if (bounded === shieldCharge) return;
  shieldCharge = bounded;
  const snapshot = takeShieldSnapshot();
  drawMeter(snapshot);
  if (panel) updateStats(snapshot);
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setShieldCharge(shieldCharge - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setShieldCharge(shieldCharge + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setShieldCharge(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(takeShieldSnapshot());
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
};
drawMeter(takeShieldSnapshot());
