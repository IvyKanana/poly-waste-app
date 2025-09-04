// ====== SETTINGS ======
const KG_PER_TRIP = 2500;
const POLYPAC_EMAIL = "polypacrecords@gmail.com";
const BACKEND_URL = "https://polywaste-backend.vercel.app/send-email"; // Example endpoint

// ====== ELEMENTS ======
const tripsInput = document.getElementById("trips");
const quantityInput = document.getElementById("quantity");
const wasteForm = document.getElementById("wasteForm");
const generateBtn = document.getElementById("generateBtn");

// ====== AUTO CALCULATE QUANTITY ======
tripsInput.addEventListener("input", () => {
    const trips = parseInt(tripsInput.value) || 0;
    quantityInput.value = trips * KG_PER_TRIP;
});

// ====== FORM SUBMISSION ======
wasteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!document.getElementById("terms").checked) {
        alert("Please accept the terms & conditions first!");
        return;
    }

    // Collect form data
    const data = {
        company: document.getElementById("company").value,
        location: document.getElementById("location").value,
        address: document.getElementById("address").value,
        wasteCategory: document.getElementById("wasteCategory").value,
        trips: tripsInput.value,
        quantity: quantityInput.value,
        clientEmail: document.getElementById("clientEmail").value,
        date: new Date().toLocaleString()
    };

    // Generate PDF content
    const clientPDF = generatePDFContent(data, false);
    const polypacPDF = generatePDFContent(data, true);

    // Send emails
    try {
        await sendEmail(data.clientEmail, clientPDF, false);
        await sendEmail(POLYPAC_EMAIL, polypacPDF, true);

        alert("Form sent successfully to Polypac Records and client email (if provided).");
        wasteForm.reset();
        quantityInput.value = "";
    } catch (error) {
        console.error(error);
        alert("Error sending emails. Please try again.");
    }
});

// ====== PDF GENERATION FUNCTION ======
function generatePDFContent(data, isPolypac) {
    let content = `
        POLYPAC TRADERS LTD - Waste Collection Form\n
        Date: ${data.date}\n
        Company: ${data.company}\n
        Location: ${data.location}\n
        Waste Category: ${data.wasteCategory}\n
        Trips: ${data.trips}\n
        Total Quantity: ${data.quantity} kg\n
    `;

    if (isPolypac) {
        content += `
        -------- POLYPAC INTERNAL USE --------\n
        Vehicle: KBJ 030H\n
        Driver: Stephen\n
        Staff: Stephen (Nanyuki, Polypac BSF & Waste Facility)\n
        Signature: STEPHEN\n
        `;
    }

    return content;
}

// ====== EMAIL SENDING FUNCTION ======
async function sendEmail(to, pdfContent, isPolypac) {
    if (!to) return; // Skip if no email provided

    const body = {
        to: to,
        subject: isPolypac
            ? "Polypac Waste Collection - Internal Copy"
            : "Polypac Waste Collection - Client Copy",
        message: pdfContent
    };

    const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error("Email sending failed");
}

