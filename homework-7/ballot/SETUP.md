# Activate the anonymous Snake River ballot

The GitHub ballot **interface has been built**, but it cannot record votes until its Apps Script endpoint has been deployed by the spreadsheet owner. Do **not** share the QR code as a live voting link until this step has been completed and independently tested.

## One-time setup (approximately 5–10 minutes)

1. Sign in to the Google account where you want the **private** response spreadsheet to live. A personal Google account is often simpler if a university Workspace policy blocks public Apps Script web apps.
2. Open https://script.google.com/home/projects/create and rename the project \`ECON 238 Snake River Ballot\`.
3. Replace the starter \`Code.gs\` with the complete code from [backend/Code.gs](./backend/Code.gs).
4. Save. From the function dropdown select \`setupPoll\` and click **Run** once. Approve the Google access prompts. This creates a **private Google Sheet** with \`Responses\` and \`Summary\` tabs. Open **Execution log** to get its URL, or find the sheet in your Google Drive by its name.
5. Click **Deploy → New deployment → Web app**. Set **Execute as: Me** and **Who has access: Anyone** (anonymous, without sign-in). Deploy and copy the URL ending in \`/exec\`. If "Anyone" is not offered, you must use another Google account with permission.
6. Paste the \`/exec\` URL into [config.js](./config.js), setting \`window.SNAKE_RIVER_VOTE_ENDPOINT\` to that full URL. Commit the change to GitHub. Alternatively send the \`/exec\` URL to ChatGPT in this conversation, and ask it to update GitHub.
7. Open https://calebjkatz.github.io/econ238-portfolio/homework-7/ballot/ in a signed-out private window. Make **one** actual test vote and verify that it appears in the private response sheet. Delete that test row from **Responses** before inviting real voters. The \`Summary\` sheet should return to zero. The original test browser will still be treated as having voted; use a fresh private browsing session to vote again if necessary.

## Data and integrity
- Response fields: date/time, vote (YES / NO / YES, IF…), conditional comment, random browser token.
- Respondents are **not asked for names, emails, or Google login**, and the script intentionally does not store IP addresses.
- The random browser token prevents repeated submissions from the **same browser profile**, but it is **not identity verification**: private browsing, another browser, or cleared storage may permit another response.
- Keep the Google Sheet private, especially because the conditional comments and tokens are not meant to be public. Publish **only aggregated totals and de-identified excerpts** for the class report.
- The ballot is intentionally separate from the longer analysis page so a voter can evaluate the proposition without an extensive persuasive presentation.
- The server uses a locking mechanism so simultaneous submissions do not accidentally defeat the duplicate check.
- The GitHub ballot submits via an ordinary HTML POST, not a cross-origin JavaScript fetch; the Google server shows a confirmation page only after successfully writing the response.
- If a user sees "Unable to record vote", **do not count that vote** unless it appears in the spreadsheet.

## Required submission reports
The private **Summary** tab automatically calculates vote counts and percentages. From **Responses**, review conditional suggestions for inclusion in Blackboard. Confirm at least twelve **different people** actually participated (the browser-token rule alone cannot guarantee this).

**Important:** Once live, leave voting open while your poster is displayed. The class deadline is Sunday, October 18, 2026, before 6:59 PM. The week-long poster requirement may need clarification from the course team because the remaining time is short.
