const CLIENTS = {
  "H.M. CLAUSE": {
    location: "Nanyuki, Turaco Farms",
    address: "854-1040",
    fixedVehicle: "KBJ 030H",
    fixedDriver: "Stephen",
    wasteCategories: [
      { label: "Extraction", types: ["Tomato pulp"] },
      { label: "Greenhouse removal", types: ["Green-organic waste"] },
      { label: "Waste shed cleaning", types: ["Paper towels & latex gloves"] },
      { label: "Pruning rounds", types: ["Green-organic waste"] },
      { label: "Assorted waste", types: ["Greenhouse polythene", "Plastics", "Scrap metal"] },
    ],
  },
  "Well Hang Butchers": {
    location: "Nanyuki",
    address: "—",
    wasteCategories: [
      { label: "General", types: ["Polythene packaging materials", "Carton boxes", "Plastics", "Organic slaughter waste"] },
    ],
  },
  "Olepangi Farm": {
    location: "Laikipia",
    address: "—",
    wasteCategories: [
      { label: "General", types: ["General waste", "Organic waste"] },
    ],
  },
  "North-China Power Engineering": {
    location: "—",
    address: "—",
    wasteCategories: [
      { label: "Construction", types: ["Waste cement bags"] },
    ],
  },
  "Ol-Jogi Conservancy": {
    location: "Laikipia",
    address: "—",
    wasteCategories: [
      { label: "Assorted", types: ["Scrap metal", "Wine bottles", "General waste"] },
    ],
  },
};

const POLYPAC_DEFAULTS = {
  vehicleReg: "KBJ 030H",
  driverName: "Stephen",
  staffName: "Stephen",
  designation: "Nanyuki, Polypac BSF & Waste Facility",
  staffSignature: "STEPHEN",
};

let deferredPrompt = null;
const installBtn = document.getElementById("installBtn");
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.disabled = false;
});
installBtn.addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.disabled = true;
  } else {
    alert("To install: open in Chrome and use 'Add to Home screen'.");
  }
});

const clientEl = document.getElementById("client");
Object.keys(CLIENTS).forEach((c) => {
  const opt = document.createElement("option");
  opt.value = c; opt.textContent = c;
  clientEl.appendChild(opt);
});
clientEl.value = "H.M. CLAUSE";

const locationEl = document.getElementById("location");
const addressEl = document.getElementById("address");
const dateEl = document.getElementById("date");
const telephoneEl = document.getElementById("telephone");
const repNameEl = document.getElementById("repName");
const repSignEl = document.getElementById("repSign");
const categoryEl = document.getElementById("category");
const wasteTypeEl = document.getElementById("wasteType");
const packingTypeEl = document.getElementById("packingType");
const quantityEl = document.getElementById("quantity");
const tripsEl = document.getElementById("trips");
const notesEl = document.getElementById("notes");
const previewEl = document.getElementById("preview");
const printBtn = document.getElementById("printBtn");

dateEl.valueAsNumber = Date.now();

function refreshClientMeta() {
  const meta = CLIENTS[clientEl.value];
  locationEl.value = meta.location || "";
  addressEl.value = meta.address || "";
  categoryEl.innerHTML = "";
  meta.wasteCategories.forEach((c, i) => {
    const opt = document.createElement("option");
    opt.value = c.label; opt.textContent = c.label;
    categoryEl.appendChild(opt);
  });
  categoryEl.value = meta.wasteCategories[0]?.label || "";
  refreshWasteTypes();
  updatePreview();
}

function refreshWasteTypes() {
  const meta = CLIENTS[clientEl.value];
  const found = meta.wasteCategories.find(c => c.label === categoryEl.value);
  const items = found ? found.types : [];
  wasteTypeEl.innerHTML = "";
  items.forEach((w) => {
    const opt = document.createElement("option");
    opt.value = w; opt.textContent = w;
    wasteTypeEl.appendChild(opt);
  });
  if (items.length) wasteTypeEl.value = items[0];
}

function updatePreview() {
  const client = clientEl.value;
  const meta = CLIENTS[client];
  const telephone = telephoneEl.value || "—";
  const date = dateEl.value || "";
  const repName = repNameEl.value || "—";
  const repSign = repSignEl.value || "—";
  const category = categoryEl.value || "—";
  const wasteType = wasteTypeEl.value || "—";
  const packingType = packingTypeEl.value || "—";
  const quantity = quantityEl.value || "—";
  const trips = tripsEl.value || "—";
  const notes = notesEl.value ? `<div><b>Notes:</b> ${notesEl.value}</div>` : "";
  previewEl.innerHTML = `
    <div class="space-y-1">
      <div><b>Company:</b> ${client}</div>
      <div><b>Location:</b> ${meta.location || "—"}</div>
      <div><b>Address:</b> ${meta.address || "—"}</div>
      <div><b>Telephone:</b> ${telephone}</div>
      <div><b>Date:</b> ${date}</div>
      <div><b>Company Representative:</b> ${repName}</div>
      <div><b>Rep Signature:</b> ${repSign}</div>
      <div class="mt-2"><b>Category:</b> ${category}</div>
      <div><b>Waste Type:</b> ${wasteType}</div>
      <div><b>Packing Type:</b> ${packingType}</div>
      <div><b>Quantity:</b> ${quantity}</div>
      <div><b>Trips Collected:</b> ${trips}</div>
      ${notes}
      <hr class="my-3"/>
      <div class="font-semibold">FOR POLYPAC TRADERS LTD (Auto-generated)</div>
      <div><b>Vehicle Reg No.:</b> ${meta.fixedVehicle || POLYPAC_DEFAULTS.vehicleReg}</div>
      <div><b>Driver:</b> ${meta.fixedDriver || POLYPAC_DEFAULTS.driverName}</div>
      <div><b>Polypac Staff:</b> ${POLYPAC_DEFAULTS.staffName}</div>
      <div><b>Designation:</b> ${POLYPAC_DEFAULTS.designation}</div>
      <div><b>Signature:</b> ${POLYPAC_DEFAULTS.staffSignature}</div>
      <div class="text-xs mt-2">Terms & Conditions apply. Certificate of disposal on request.</div>
    </div>
  `;
}

[clientEl, telephoneEl, dateEl, repNameEl, repSignEl, categoryEl, wasteTypeEl, packingTypeEl, quantityEl, tripsEl, notesEl]
  .forEach(el => el.addEventListener("input", updatePreview));
clientEl.addEventListener("change", refreshClientMeta);
categoryEl.addEventListener("change", () => { refreshWasteTypes(); updatePreview(); });

printBtn.addEventListener("click", () => window.print());

function saveDraft() {
  const data = {
    client: clientEl.value,
    telephone: telephoneEl.value,
    date: dateEl.value,
    repName: repNameEl.value,
    repSign: repSignEl.value,
    category: categoryEl.value,
    wasteType: wasteTypeEl.value,
    packingType: packingTypeEl.value,
    quantity: quantityEl.value,
    trips: tripsEl.value,
    notes: notesEl.value
  };
  localStorage.setItem("polyWasteDraft", JSON.stringify(data));
}
function loadDraft() {
  try {
    const raw = localStorage.getItem("polyWasteDraft");
    if (!raw) return;
    const d = JSON.parse(raw);
    clientEl.value = d.client || clientEl.value;
    telephoneEl.value = d.telephone || "";
    dateEl.value = d.date || dateEl.value;
    repNameEl.value = d.repName || "";
    repSignEl.value = d.repSign || "";
    refreshClientMeta();
    categoryEl.value = d.category || categoryEl.value;
    refreshWasteTypes();
    wasteTypeEl.value = d.wasteType || wasteTypeEl.value;
    packingTypeEl.value = d.packingType || packingTypeEl.value;
    quantityEl.value = d.quantity || "";
    tripsEl.value = d.trips || "";
    notesEl.value = d.notes || "";
  } catch {}
  updatePreview();
}
window.addEventListener("input", saveDraft);

refreshClientMeta();
loadDraft();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}
