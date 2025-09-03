# Poly Waste App — H.M. Clause (v2)
Features:
- Trips-first flow: **Quantity** auto-calculates as **Trips × 2500kg** and is read-only.
- Single-client setup for **H.M. Clause** (fixed company, location, address).
- Letterhead on the PDF.
- **Terms & Conditions** checkbox required.
- **Generate PDF & Send** downloads the PDF and (optionally) emails it to the client and Polypac via EmailJS.
- Installable PWA with offline support.

## Configure Email Sending (EmailJS)
1. Go to https://www.emailjs.com/ and create a free account.
2. Add an email service (e.g., Gmail). Note the **SERVICE ID**.
3. Create an email **template** with variables: `to_client`, `to_polypac`, `subject`, `message`, `attachment_name`, `attachment_data`.
4. In the template, add a file attachment field bound to `attachment_data` (base64). EmailJS docs explain base64 attachments.
5. In `index.html`, replace `YOUR_EMAILJS_PUBLIC_KEY` with your public key.
6. In `app.js`, replace `YOUR_EMAILJS_SERVICE_ID` and `YOUR_EMAILJS_TEMPLATE_ID` with your values.
7. Set `POLYPAC_EMAIL` in `app.js` to the real company email.
8. Deploy. Email sending will work entirely client-side.

If EmailJS isn’t configured, the app will still **download the PDF** and show a message.

## Deploy
Replace your repo files with these and commit. Netlify will auto-redeploy.
