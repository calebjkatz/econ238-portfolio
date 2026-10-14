/**
 * ECON 238 — Week 7 Snake River ballot, server-side recording.
 * Publish as a Google Apps Script Web App. No Google credentials are committed to GitHub.
 *
 * 1. Run setupPoll() once as the owner (creates a PRIVATE Google Sheet).
 * 2. Deploy > New deployment > Web app.
 *    Execute as: Me / You. Who has access: Anyone (not "Anyone with Google account").
 * 3. Copy the /exec URL into homework-7/ballot/config.js on GitHub.
 *
 * The ballot intentionally does NOT store names, email addresses or IP addresses.
 * A random per-browser token is used to reduce accidental repeat submissions.
 * A user can clear storage or use another browser, so unique people cannot be
 * verified automatically without compromising anonymity.
 */
var POLL_ID = "econ238-snake-river-2026";
var PROP_KEY = "ECON238_SNAKE_RIVER_SHEET_ID";
var BALLOT_URL = "https://calebjkatz.github.io/econ238-portfolio/homework-7/ballot/";

function setupPoll() {
  var props = PropertiesService.getScriptProperties();
  var oldId = props.getProperty(PROP_KEY);
  if (oldId) {
    Logger.log("Existing private spreadsheet: " + SpreadsheetApp.openById(oldId).getUrl());
    return SpreadsheetApp.openById(oldId).getUrl();
  }
  var book = SpreadsheetApp.create("ECON 238 — Week 7 Snake River Anonymous Ballot Results");
  var responses = book.getSheets()[0];
  responses.setName("Responses");
  responses.getRange("A1:D1").setValues([[
    "Submitted (date/time)", "Vote", "Condition (YES, IF…)", "Anonymous browser token"
  ]]);
  responses.getRange("A1:D1").setBackground("#0D4C50").setFontColor("#FFFFFF").setFontWeight("bold");
  responses.setFrozenRows(1);
  responses.setColumnWidth(1, 190);
  responses.setColumnWidth(2, 120);
  responses.setColumnWidth(3, 480);
  responses.setColumnWidth(4, 280);
  responses.getRange("A2:A").setNumberFormat("yyyy-mm-dd hh:mm:ss");

  var summary = book.insertSheet("Summary");
  summary.getRange("A1:C1").setValues([["Response", "Votes", "Share"]]);
  summary.getRange("A2:A5").setValues([["YES"], ["NO"], ["YES, IF…"], ["Total"]]);
  summary.getRange("B2").setFormula('=COUNTIF(Responses!B2:B,"YES")');
  summary.getRange("B3").setFormula('=COUNTIF(Responses!B2:B,"NO")');
  summary.getRange("B4").setFormula('=COUNTIF(Responses!B2:B,"YES, IF…")');
  summary.getRange("B5").setFormula("=SUM(B2:B4)");
  summary.getRange("C2").setFormula('=IFERROR(B2/$B$5,0)');
  summary.getRange("C3").setFormula('=IFERROR(B3/$B$5,0)');
  summary.getRange("C4").setFormula('=IFERROR(B4/$B$5,0)');
  summary.getRange("C2:C4").setNumberFormat("0.0%");
  summary.getRange("A1:C1").setBackground("#0D4C50").setFontColor("#FFFFFF").setFontWeight("bold");
  summary.setColumnWidths(1, 3, 130);
  summary.getRange("A7").setValue("Note: tokens reduce repeat votes per browser; they cannot prove 12 distinct people.");
  summary.getRange("A8").setValue("Do not publish the raw response sheet; summarize counts and de-identified comments only.");
  summary.getRange("A10").setValue("This is an unofficial classroom opinion poll, not a government election.");
  props.setProperty(PROP_KEY, book.getId());
  Logger.log("PRIVATE RESPONSE SPREADSHEET: " + book.getUrl());
  return book.getUrl();
}

// Harmless public health-check; no responses or spreadsheet identifiers disclosed.
function doGet() {
  return page_("Ballot endpoint", "The ballot recording endpoint is available. Please vote using the ECON 238 ballot page.", false);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var acquired = false;
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    if (p.poll_id !== POLL_ID) return page_("Invalid ballot", "This request is not for the Snake River class poll.", false);
    var choice = {"yes": "YES", "no": "NO", "yes_if": "YES, IF…"}[p.vote];
    if (!choice) return page_("No vote recorded", "Please select YES, NO, or YES, IF… and try again.", false);

    var token = String(p.browser_token || "");
    if (!/^[0-9a-f-]{32,36}$/i.test(token)) return page_("No vote recorded", "Your browser could not be verified for a one-vote-per-browser submission.", false);

    var condition = (choice === "YES, IF…") ? String(p.condition || "").trim() : "";
    if (condition.length > 400 || (choice === "YES, IF…" && condition.length < 5)) {
      return page_("No vote recorded", "If you selected YES, IF…, enter a condition of 5–400 characters.", false);
    }
    // Neutralize spreadsheet-formula injection and control characters before appendRow.
    condition = condition.replace(/[\u0000-\u001f\u007f]/g, " ").trim();
    if (/^[=+\-@]/.test(condition)) condition = "'" + condition;

    var id = PropertiesService.getScriptProperties().getProperty(PROP_KEY);
    if (!id) return page_("Ballot not configured", "The ballot has not been connected to its private response sheet. Please try again later.", false);

    lock.waitLock(12000);
    acquired = true;
    var sheet = SpreadsheetApp.openById(id).getSheetByName("Responses");
    if (!sheet) throw new Error("Missing Responses worksheet");
    var last = sheet.getLastRow();
    if (last > 1) {
      var existing = sheet.getRange(2, 4, last - 1, 1).createTextFinder(token).matchEntireCell(true).findNext();
      if (existing) return page_("Already recorded", "A response from this browser has already been counted. Thank you for taking part.", false);
    }
    sheet.appendRow([new Date(), choice, condition, token]);
    SpreadsheetApp.flush();
    return page_("Your vote was recorded", "Thank you. Your anonymous response has been saved in the private class results sheet.", true);
  } catch (err) {
    console.error("Ballot submission problem", err);
    return page_("Unable to record vote", "A server error occurred. Your vote was not confirmed. Please try again later.", false);
  } finally {
    if (acquired) lock.releaseLock();
  }
}

function page_(title, description, success) {
  var accent = success ? "#176c64" : "#7d6041";
  var safeTitle = title.replace(/&/g,"&amp;").replace(/</g,"&lt;");
  var html = '<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="utf-8"><title>'
  + safeTitle + ' — ECON 238 ballot</title><style>body{background:#f7faf6;color:#17383b;font:16px/1.7 system-ui;margin:0;padding:24px}'
  + 'main{max-width:560px;margin:8vh auto;padding:34px;background:white;border:1px solid #d2e4df;border-radius:14px}'
  + 'h1{font:normal 2.4rem/1.12 Georgia,serif;color:' + accent + '}'
  + 'a{color:#14645f;font-weight:700}small{color:#657d79}</style></head><body><main><small>ECON 238 · Snake River class ballot</small><h1>'
  + safeTitle + '</h1><p>' + description + '</p><p><a href="' + BALLOT_URL + '" target="_top">Back to the ballot →</a></p>'
  + '<small>This is an unofficial classroom poll, not a government election.</small></main></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle(safeTitle);
}
