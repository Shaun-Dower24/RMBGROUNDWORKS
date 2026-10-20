# Enquiry delivery

POST /api/enquiry accepts bounded JSON or form data according to CLAUDE.md. Validate same-origin browser requests, reject oversized/invalid data, honeypot spam and bursts. Send a plain-text notification through configured SMTP using a fixed verified From and fixed recipient; user email only in Reply-To. Return success only on acceptance for the recipient. Never log message/contact content. No database or automatic acknowledgement email. Test against local transport fixtures and document multi-instance rate-limit limitations. Missing configuration returns a clear error and the UI offers phone/email. No production submission without user instruction.

