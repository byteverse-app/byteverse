import fs from 'fs';
const num = process.argv[2]?.padStart(3, '0') ?? '001';
const sql = fs.readFileSync(`batch_${num}.sql`, 'utf8');
process.stdout.write(sql);
