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
        if (String(data[i][idColumn]) === String(idToFind)) {
          rowIndex = i + 1; // 1-indexed for SpreadsheetApp
          break;
        }
      }
      
      if (rowIndex > -1) {
        // Overwrite the row (columns A to max)
        sheet.getRange(rowIndex, 1, 1, newRow.length).setValues([newRow]);
        return ContentService.createTextOutput(JSON.stringify({ success: true, updated: true }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        throw new Error("Row ID not found for update");
      }
    }
    
    throw new Error("Unknown action: " + action);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
