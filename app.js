// Poly Waste App JS (H.M. Clause version)
const POLYPAC_EMAIL = "polypac@example.com"; // TODO: set real company email
const KG_PER_TRIP = 2500;

const els = {
  date: document.getElementById('date'),
  trips: document.getElementById('trips'),
  quantity: document.getElementById('quantity'),
  tnc: document.getElementById('tnc'),
  generateBtn: document.getElementById('generateBtn'),
  installBtn: document.getElementById('installBtn'),
  preview: document.getElementById('preview'),
  status: document.getElementById('status'),
  clientEmail: document.getElementById('clientEmail'),
};

// Default today's date
(function setToday() {
  const t = new Date();
  const iso = t.toISOString().slice(0,10);
  els.date.value = iso;
})();

// Auto-calc quantity
function recalcQuantity() {
  const trips = parseInt(els.trips.value || "0", 10);
  els.quantity.value = (trips * KG_PER_TRIP).toString();
  updatePreview();
}
els.trips.addEventListener('input', recalcQuantity);

// Build preview
function updatePreview() {
  const data = gather();
  els.preview.innerHTML = `
    <b>Company:</b> ${data.company}<br/>
    <b>Location:</b> ${data.location}<br/>
    <b>Address:</b> ${data.address}<br/>
    <b>Telephone:</b> ${data.telephone}<br/>
    <b>Date:</b> ${data.date}<br/>
    <b>Company Representative:</b> ${data.repName}<br/>
    <b>Rep Signature:</b> ${data.repSign || ""}<br/>
    <b>Category:</b> ${data.category}<br/>
    <b>Waste Type:</b> ${data.wasteType}<br/>
    <b>Packing Type:</b> ${data.packType}<br/>
    <b>Quantity:</b> ${data.quantity} kg<br/>
    <b>Trips Collected:</b> ${data.trips}${data.notes? `<br/><b>Notes:</b> ${data.notes}`: ""}
  `;
}
document.querySelectorAll('input,select,textarea').forEach(el=>el.addEventListener('input', updatePreview));

function gather() {
  return {
    company: document.getElementById('company').value,
    telephone: document.getElementById('telephone').value,
    date: document.getElementById('date').value,
    repName: document.getElementById('repName').value,
    repSign: document.getElementById('repSign').value,
    location: document.getElementById('location').value,
    address: document.getElementById('address').value,
    category: document.getElementById('category').value,
    wasteType: document.getElementById('wasteType').value,
    packType: document.getElementById('packType').value,
    trips: parseInt(document.getElementById('trips').value || "0", 10),
    quantity: parseInt(document.getElementById('quantity').value || "0", 10),
    notes: document.getElementById('notes').value,
    clientEmail: els.clientEmail.value
  };
}

// Install PWA prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});
els.installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  } else {
    alert('If the Install button is disabled, use your browser menu → Add to Home screen.');
  }
});

// Generate PDF & email
els.generateBtn.addEventListener('click', async () => {
  els.status.innerHTML = "";
  if (!els.tnc.checked) {
    return showError("Please agree to the terms and conditions first.");
  }
  if (!els.clientEmail.value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(els.clientEmail.value)) {
    return showError("Please enter a valid client email.");
  }
  try {
    // Create PDF
    const area = document.getElementById('printArea');
    const opt = {
      margin:       10,
      filename:     `polywaste_${Date.now()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    const pdfBlob = await html2pdf().set(opt).from(area).outputPdf('blob');
    saveBlob(pdfBlob, opt.filename); // user download
    await sendEmailWithAttachment(pdfBlob, opt.filename);
    showSuccess("PDF generated and emails sent (if email service is configured).");
  } catch (e) {
    console.error(e);
    showError("PDF generated, but email sending failed. You can still download the PDF.");
  }
});

function saveBlob(blob, filename) {
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 100);
}

async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function sendEmailWithAttachment(pdfBlob, filename) {
  if (!window.emailjs || !emailjs._userID || emailjs._userID === 'YOUR_EMAILJS_PUBLIC_KEY') {
    console.warn('EmailJS not configured; skipping email send.');
    return;
  }
  const base64pdf = await blobToBase64(pdfBlob);
  const data = gather();
  const templateParams = {
    to_client: data.clientEmail,
    to_polypac: POLYPAC_EMAIL,
    subject: `Waste Collection — ${data.company} — ${data.date}`,
    message: `Please find the attached waste collection form for ${data.company}.`,
    attachment_name: filename,
    attachment_data: base64pdf
  };
  return emailjs.send('YOUR_EMAILJS_SERVICE_ID', 'YOUR_EMAILJS_TEMPLATE_ID', templateParams);
}

function showSuccess(msg) {
  els.status.innerHTML = `<div class="success">${msg}</div>`;
}
function showError(msg) {
  els.status.innerHTML = `<div class="error">${msg}</div>`;
}

// Initialize
recalcQuantity();
updatePreview();
