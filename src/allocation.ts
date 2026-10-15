export {};

type ShiftResult = {
  crewSize: number;
  supplyProducers: number;
  production: number;
  consumption: number;
  balance: number;
};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

const crewSize = 6;
const suppliesPerProducer = 3;
const suppliesPerCrewMember = 1;
const startingProducers = 2;
let supplyProducers = startingProducers;

function suppliesMadeBy(producers: number) {
  return producers * suppliesPerProducer;
}

function suppliesNeededBy(crewMembers: number) {
  return crewMembers * suppliesPerCrewMember;
}

function calculateShift(producers: number): ShiftResult {
  const production = suppliesMadeBy(producers);
  const consumption = suppliesNeededBy(crewSize);
  return {
    crewSize: crewSize,
    supplyProducers: producers,
    production: production,
    consumption: consumption,
    balance: production - consumption,
  };
}

function formatBalance(balance: number) {
  if (balance > 0) {
    return `+${balance}`;
  }
  return String(balance);
}

function drawCrew(shift: ShiftResult) {
  for (let member = 0; member < shift.crewSize; member++) {
    const makesSupplies = member < shift.supplyProducers;
    ctx.fillStyle = makesSupplies ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + member * 45, 16, 36, 36);
    ctx.fillStyle = makesSupplies ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(member + 1), 31 + member * 45, 40);
  }
}

function drawSupplyBars(shift: ShiftResult) {
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(
    `Producers: ${shift.supplyProducers} / ${shift.crewSize}`,
    18,
    76,
  );
  ctx.fillText(`Production: ${shift.production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, shift.production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${shift.consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, shift.consumption * 14, 20);
}

function drawChart(shift: ShiftResult) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCrew(shift);
  drawSupplyBars(shift);
}

function showReadout(shift: ShiftResult) {
  const parts = [
    `Assigned: ${shift.supplyProducers}/${shift.crewSize}`,
    `Production: ${shift.production}`,
    `Consumption: ${shift.consumption}`,
    `Balance: ${formatBalance(shift.balance)}`,
  ];
  readout.textContent = parts.join(" · ");
}

function updateAllocation() {
  const shift = calculateShift(supplyProducers);
  drawChart(shift);
  showReadout(shift);
}

function setSupplyProducers(count: number) {
  supplyProducers = Math.max(0, Math.min(crewSize, count));
  updateAllocation();
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  setSupplyProducers(supplyProducers - 1);
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  setSupplyProducers(supplyProducers + 1);
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    setSupplyProducers(startingProducers);
  };
updateAllocation();
