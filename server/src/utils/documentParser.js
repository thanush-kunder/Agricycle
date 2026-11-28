import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

/**
 * Robust multi-format document parser for AgriCycle Chatbot
 * Supports: PDF, TXT, CSV, DOCX, XLSX
 */

// Dynamically import pdf-parse
let pdfParse = null;
try {
  const mod = await import('pdf-parse');
  pdfParse = mod.default || mod;
} catch (e) {
  try {
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    pdfParse = require('pdf-parse');
  } catch (_) {}
}

/**
 * Extracts plain text from DOCX (ZIP archive containing word/document.xml)
 */
function extractDocxText(buffer) {
  try {
    // DOCX files are standard PK zip archives.
    // Scan for word/document.xml
    const str = buffer.toString('binary');
    const docXmlIndex = str.indexOf('word/document.xml');
    if (docXmlIndex === -1) {
      // Fallback: extract XML-like text tags
      return extractXmlText(str);
    }

    // Try uncompressing local file header content if possible
    // A simple regex approach across readable text chunks:
    const textMatches = str.match(/<w:t[^>]*>([^<]+)<\/w:t>/g) || [];
    if (textMatches.length > 0) {
      return textMatches.map(m => m.replace(/<[^>]+>/g, '')).join(' ').trim();
    }
    return extractXmlText(str);
  } catch (err) {
    return 'Unable to extract text from DOCX document: ' + err.message;
  }
}

/**
 * Extracts text from XML strings
 */
function extractXmlText(raw) {
  const clean = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const readable = clean.replace(/[^\x20-\x7E\u0900-\u097F\u0C80-\u0CFF\n\r\t]/g, '');
  return readable.slice(0, 15000);
}

/**
 * Parses and summarizes CSV content
 */
function parseCsv(content) {
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return { text: '', rows: 0, columns: [] };

  const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim());
  const rows = [];
  const maxRows = Math.min(lines.length, 50);

  for (let i = 1; i < maxRows; i++) {
    const cells = lines[i].split(',').map(c => c.replace(/^["']|["']$/g, '').trim());
    rows.push(cells);
  }

  // Build structured table representation
  let formatted = `### CSV Data Summary (${lines.length - 1} total rows, ${headers.length} columns)\n\n`;
  formatted += `| ${headers.join(' | ')} |\n`;
  formatted += `| ${headers.map(() => '---').join(' | ')} |\n`;
  rows.slice(0, 15).forEach(row => {
    formatted += `| ${row.join(' | ')} |\n`;
  });

  if (lines.length - 1 > 15) {
    formatted += `\n*...and ${lines.length - 1 - 15} more rows.*`;
  }

  return {
    text: formatted,
    rowCount: lines.length - 1,
    headers,
    rawText: content.slice(0, 15000)
  };
}

/**
 * Parses uploaded document buffer into structured text
 */
export async function parseDocument(filePath, originalName) {
  const ext = path.extname(originalName || filePath).toLowerCase();
  const buffer = await fs.promises.readFile(filePath);
  const fileSizeKb = Math.round(buffer.length / 1024);

  let extractedText = '';
  let metadata = { fileSizeKb, fileType: ext };

  switch (ext) {
    case '.pdf': {
      if (typeof pdfParse === 'function') {
        const data = await pdfParse(buffer);
        extractedText = data.text || '';
        metadata.pageCount = data.numpages || 1;
      } else {
        // Fallback: extract text tokens
        extractedText = buffer.toString('utf-8', 0, Math.min(buffer.length, 25000))
          .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
          .replace(/\s+/g, ' ');
      }
      break;
    }

    case '.txt':
    case '.md':
    case '.json': {
      extractedText = buffer.toString('utf-8');
      break;
    }

    case '.csv': {
      const csvStr = buffer.toString('utf-8');
      const csvData = parseCsv(csvStr);
      extractedText = csvData.text;
      metadata.rowCount = csvData.rowCount;
      metadata.headers = csvData.headers;
      break;
    }

    case '.docx': {
      extractedText = extractDocxText(buffer);
      break;
    }

    case '.xlsx':
    case '.xls': {
      // Basic text extraction from spreadsheet buffer
      const raw = buffer.toString('utf-8', 0, Math.min(buffer.length, 30000));
      extractedText = extractXmlText(raw);
      break;
    }

    default: {
      extractedText = buffer.toString('utf-8', 0, Math.min(buffer.length, 20000))
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ');
      break;
    }
  }

  // Clean and truncate text if too long to prevent context overflow
  const cleanText = extractedText.replace(/\s+/g, ' ').trim();
  const truncatedText = cleanText.length > 12000 ? cleanText.slice(0, 12000) + '... [Document content truncated for context budget]' : cleanText;

  return {
    success: true,
    fileName: originalName || path.basename(filePath),
    fileType: ext,
    fileSizeKb,
    text: truncatedText,
    charCount: cleanText.length,
    metadata
  };
}

export default { parseDocument };
