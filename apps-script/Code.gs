/**
 * Google Apps Script Backend for Infineo Social Media Planner
 * 
 * Instructions:
 * 1. Create a new Google Sheet.
 * 2. Go to Extensions -> Apps Script.
 * 3. Delete the existing code and paste this entirely.
 * 4. Click Deploy -> New deployment.
 * 5. Select type: Web App.
 * 6. Set "Execute as": Me.
 * 7. Set "Who has access": Anyone.
 * 8. Copy the resulting Web App URL into your .env file as VITE_APPS_SCRIPT_URL.
 */

const SPREADSHEET_ID = "1fP47IhZGqb6_XfO4toIQEXSYbpOfv0F5HtwPsjivSS4";

function getSpreadsheet() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {
    // Ignore and fallback to openById
  }
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function doGet(e) {
  try {
    const sheetName = e.parameter.sheet;
    if (!sheetName) throw new Error("Sheet parameter missing");
    
    const spreadsheet = getSpreadsheet();
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) throw new Error("Sheet not found: " + sheetName);
    
    const data = sheet.getDataRange().getValues();
    // Assuming row 0 is headers, we return rows 1 to end.
    const rows = data.length > 1 ? data.slice(1) : [];
    
    return ContentService.createTextOutput(JSON.stringify({ rows: rows }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheetName = payload.sheet;
    const action = payload.action;
    
    if (!sheetName) throw new Error("Sheet parameter missing");
    
    const spreadsheet = getSpreadsheet();
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) throw new Error("Sheet not found: " + sheetName);
    
    if (action === 'append') {
      sheet.appendRow(payload.row);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    } else if (action === 'update') {
      const idColumn = payload.idColumnIndex || 0; 
      const idToFind = payload.rowId;
      const newRow = payload.row;
      
      const data = sheet.getDataRange().getValues();
      let rowIndex = -1;
      
      for (let i = 1; i < data.length; i++) {
        // 1. Try matching by ID column if ID exists in sheet
        if (idToFind && data[i][idColumn] !== "" && String(data[i][idColumn]) === String(idToFind)) {
          rowIndex = i + 1;
          break;
        }
        // 2. Fallback for Users sheet: match by Email (col C/index 2) or Name (col B/index 1)
        if (sheetName === 'Users') {
          const emailInSheet = String(data[i][2] || '').toLowerCase().trim();
          const targetEmail = String(newRow[2] || '').toLowerCase().trim();
          const nameInSheet = String(data[i][1] || '').toLowerCase().trim();
          const targetName = String(newRow[1] || '').toLowerCase().trim();
          
          if (targetEmail && emailInSheet === targetEmail) {
            rowIndex = i + 1;
            break;
          }
          if (targetName && nameInSheet === targetName) {
            rowIndex = i + 1;
            break;
          }
        }
      }
      
      if (rowIndex > -1) {
        // Overwrite the row (columns A to max)
        sheet.getRange(rowIndex, 1, 1, newRow.length).setValues([newRow]);
        return ContentService.createTextOutput(JSON.stringify({ success: true, updated: true }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        // If row not found, append as new row to avoid failing
        sheet.appendRow(newRow);
        return ContentService.createTextOutput(JSON.stringify({ success: true, appendedInstead: true }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    } else if (action === 'sendEmail') {
      const email = payload.email;
      const emailId = Utilities.getUuid();
      const createdAt = new Date().toISOString();
      let status = 'Pending';
      let sentAt = '';

      try {
        MailApp.sendEmail({
          to: email.recipientEmail,
          subject: email.subject,
          htmlBody: email.bodyHtml,
        });
        status = 'Sent';
        sentAt = new Date().toISOString();
      } catch (err) {
        status = 'Failed';
      }

      // Columns: Email ID, Recipient, Subject, Body, Status, Created At, Sent At
      sheet.appendRow([
        emailId,
        email.recipientEmail,
        email.subject,
        email.bodyText,
        status,
        createdAt,
        sentAt
      ]);

      if (status === 'Failed') {
        throw new Error('MailApp failed to send the email.');
      }

      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    throw new Error("Unknown action: " + action);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
