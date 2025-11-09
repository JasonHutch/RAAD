#!/usr/bin/env node

const { Command } = require('commander');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .name('raad')
  .description('CLI utility for the RAAD React app')
  .version('1.0.0');

// Store child processes for cleanup
const processes = [];

// Cleanup function
function cleanup() {
  console.log('\n🛑 Shutting down all services...');
  processes.forEach(proc => {
    try {
      proc.kill();
    } catch (e) {
      // Process may already be dead
    }
  });
  process.exit(0);
}

// Check if Ollama is running
function checkOllama() {
  return new Promise((resolve, reject) => {
    exec('pgrep -x ollama', (error, stdout, stderr) => {
      if (error) {
        reject(new Error('Ollama is not running. Please start it with: ollama serve'));
      } else {
        resolve();
      }
    });
  });
}

// Check if nemotron-mini model is available
function checkModel() {
  return new Promise((resolve, reject) => {
    exec('ollama list', (error, stdout, stderr) => {
      if (error) {
        reject(new Error('Could not check Ollama models'));
      } else if (stdout.includes('nemotron-mini')) {
        resolve();
      } else {
        console.log('⚠️  nemotron-mini model not found. Pulling it now...');
        exec('ollama pull nemotron-mini', (error, stdout, stderr) => {
          if (error) {
            reject(new Error('Failed to pull nemotron-mini model'));
          } else {
            resolve();
          }
        });
      }
    });
  });
}

program
  .command('start')
  .description('Start all RAAD services (Test Agent, Red Team Agent, API Wrapper, UI)')
  .action(async () => {
    console.log('🚀 Starting RAAD Demo Services...');
    console.log('==================================\n');

    const projectRoot = '/Users/hutch_ii/Projects/RAAD';
    const uiPath = `${projectRoot}/ui/raad-fed`;
    const agentPath = `${projectRoot}/agent`;
    const logsPath = `${projectRoot}/logs`;

    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logsPath)) {
      fs.mkdirSync(logsPath);
    }

    // Check prerequisites
    try {
      console.log('Checking Ollama...');
      await checkOllama();
      console.log('✓ Ollama is running\n');

      console.log('Checking for nemotron-mini model...');
      await checkModel();
      console.log('✓ nemotron-mini model available\n');
    } catch (error) {
      console.error(`❌ ${error.message}`);
      process.exit(1);
    }

    // Handle cleanup on exit
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    // Start Test Agent Server (port 8888)
    console.log('Starting Test Agent on port 8888...');
    const testAgentLog = fs.createWriteStream(`${logsPath}/test_agent.log`);
    const testAgent = spawn('python', ['test_agent_server.py'], {
      cwd: agentPath,
      shell: true
    });
    testAgent.stdout.pipe(testAgentLog);
    testAgent.stderr.pipe(testAgentLog);
    processes.push(testAgent);
    console.log(`✓ Test Agent started (PID: ${testAgent.pid})\n`);

    // Wait for test agent to start
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Start Red Team Agent Server (port 9999)
    console.log('Starting Red Team Agent on port 9999...');
    const redTeamLog = fs.createWriteStream(`${logsPath}/red_team_agent.log`);
    const redTeamAgent = spawn('python', ['server.py'], {
      cwd: agentPath,
      shell: true
    });
    redTeamAgent.stdout.pipe(redTeamLog);
    redTeamAgent.stderr.pipe(redTeamLog);
    processes.push(redTeamAgent);
    console.log(`✓ Red Team Agent started (PID: ${redTeamAgent.pid})\n`);

    // Wait for red team agent to start
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Start API Wrapper (port 3001)
    console.log('Starting API Wrapper on port 3001...');
    const apiLog = fs.createWriteStream(`${logsPath}/api_wrapper.log`);
    const apiWrapper = spawn('python', ['api_wrapper.py'], {
      cwd: agentPath,
      shell: true
    });
    apiWrapper.stdout.pipe(apiLog);
    apiWrapper.stderr.pipe(apiLog);
    processes.push(apiWrapper);
    console.log(`✓ API Wrapper started (PID: ${apiWrapper.pid})\n`);

    // Wait for API to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Start Next.js Frontend (port 3000)
    console.log('Starting Next.js Frontend on port 3000...');
    const frontendLog = fs.createWriteStream(`${logsPath}/frontend.log`);
    const frontend = spawn('npm', ['run', 'dev'], {
      cwd: uiPath,
      shell: true
    });
    frontend.stdout.pipe(frontendLog);
    frontend.stderr.pipe(frontendLog);
    processes.push(frontend);
    console.log(`✓ Frontend started (PID: ${frontend.pid})\n`);

    console.log('==================================');
    console.log('✅ All services are running!');
    console.log('==================================\n');
    console.log('Service URLs:');
    console.log('  Frontend:       http://localhost:3000');
    console.log('  API Wrapper:    http://localhost:3001');
    console.log('  Red Team Agent: http://localhost:9999');
    console.log('  Test Agent:     http://localhost:8888\n');
    console.log('Logs are being written to the \'logs\' directory\n');
    console.log('Press Ctrl+C to stop all services\n');
  });

program.parse();