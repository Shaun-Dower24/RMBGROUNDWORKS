# Implementation plan

Blueprint: user requested implementation of the approved research checklist on 20 October 2026.

1. Verify repository/dependencies and download original assets.
2. Build shared brand system, homepage and service/work/contact templates.
3. Implement accessible filtering, gallery, navigation and restrained motion.
4. Implement bounded server-side SMTP enquiry route with honest failure states.
5. Check type/build, meaningful enquiry tests, routes, mobile/desktop, keyboard, reduced motion and screenshots.
6. Commit to a feature branch and open a reviewable pull request. Production launch is out of this implementation turn's scope.

Subsequent user request: deploy through Netlify. User selected a new project in systemsAI. Adapted the server route to a Netlify Function, published the review site, verified live routes/API/interactions, and retained noindex plus the honest missing-SMTP fallback. Company-domain migration is a separate launch step.
