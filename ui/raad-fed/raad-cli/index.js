#!/usr/bin/env node

const { Command } = require('commander');
const { exec } = require('child_process');

const program = new Command();

program
  .name('raad')
  .description('CLI utility for the RAAD React app')
  .version('1.0.0');

program
  .command('start')
  .description('Start the raad-fed React app')
  .action(() => {
    const appPath = '/Users/hani_m/Desktop/HackUTD_Proj/RAAD/ui/raad-fed';
    const child = exec('npm run dev', { cwd: appPath });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    child.on('exit', (code) => {
      console.log(`React app process exited with code ${code}`);
    });
  });

program.parse();