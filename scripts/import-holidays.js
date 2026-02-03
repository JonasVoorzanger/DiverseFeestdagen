import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CSV URL
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTvwLO6NO51LURc7ODdJuil6zhKV9J6SkWmU8AJ8IWd0ohXCFyB4XbBtDUrbi0bU2jnBmHAk4qNf6aP/pub?gid=1763869494&single=true&output=csv';

// Icon mapping for each type
const TYPE_ICONS = {
  'Islam': 'mdi-moon-waning-crescent',
  'VN': 'mdi-earth',
  'Boeddhisme': 'mdi-meditation',
  'Joods': 'mdi-star-david',
  'Hindoe': 'mdi-om',
  'Algemeen': 'mdi-calendar-star',
  'Iers': 'mdi-clover',
  'Christendom': 'mdi-cross',
  'Amerikaans': 'mdi-flag-variant',
  'Fun': 'mdi-party-popper',
  'Amsterdam': 'mdi-bicycle',
  'HAL': 'mdi-school',
  'Sport': 'mdi-stadium-variant'
};

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Handle quoted fields with commas
    const values = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());
    
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ? values[index].replace(/^"|"$/g, '') : '';
    });
    
    data.push(row);
  }
  
  return data;
}

function convertToJSON(csvData) {
  return csvData.map(row => {
    // Parse the date (dd-mm-yyyy format)
    const dateParts = row.Start_2026?.split('-');
    let dateString = '';
    if (dateParts && dateParts.length === 3) {
      const [day, month, year] = dateParts;
      dateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    return {
      naam: row.Naam || '',
      type: row.Type || 'Algemeen',
      datum: dateString,
      link: row.Link || '',
      icon: TYPE_ICONS[row.Type] || TYPE_ICONS['Algemeen']
    };
  }).filter(holiday => holiday.naam && holiday.datum);
}

async function importHolidays() {
  try {
    console.log('Fetching CSV from:', CSV_URL);
    const response = await fetch(CSV_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log('CSV fetched successfully');
    
    const csvData = parseCSV(csvText);
    console.log(`Parsed ${csvData.length} rows`);
    
    const holidays = convertToJSON(csvData);
    console.log(`Converted ${holidays.length} holidays`);
    
    // Save to public directory
    const outputPath = path.join(__dirname, '../public/holidays.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(holidays, null, 2));
    
    console.log(`✅ Holidays saved to: ${outputPath}`);
    console.log(`Total holidays: ${holidays.length}`);
    
    // Show sample
    if (holidays.length > 0) {
      console.log('\nSample holiday:');
      console.log(JSON.stringify(holidays[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error importing holidays:', error);
    process.exit(1);
  }
}

importHolidays();
