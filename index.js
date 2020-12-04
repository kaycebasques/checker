const readline = require('readline');
const puppeteer = require('puppeteer');
const fs = require('fs');
const events = require('events');

function init() {
  let targets = [];
  let done = [];
  let sentinels = {
    targets: false,
    done: false
  };
  const eventsEmitter = new events.EventEmitter();
  eventsEmitter.addListener('ready', () => {
    if (!sentinels.targets) return;
    migrate(targets, done);
  });
  const targetsFile = readline.createInterface({
    input: fs.createReadStream('targets.txt')
  });
  targetsFile.on('line', line => {
    targets.push(line);
  });
  targetsFile.on('close', () => {
    sentinels.targets = true;
    eventsEmitter.emit('ready');
  });
}

async function migrate(targets, done) {
  const browser = await puppeteer.launch({
    headless: false,
    // devtools: true
  });
  const page = await browser.newPage();
  let data = {
    ok: [],
    redirects: [],
    errors: []
  };
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    console.info(`Checking ${target}`);
    try {
      const response = await page.goto(target, {
        waitUntil: 'networkidle0'
      });
      const url = await page.url();
      if (url !== target) {
        response.status() >= 400 ? data.errors.push(target) : data.redirects.push({from: target, to: url});
      } else {
        response.status() >= 400 ? data.errors.push(target) : data.ok.push(target);
      }
    } catch (error) {
      console.error(`Error visiting ${target}`);
      data.errors.push(target);
      continue;
    }
    let redirects = data.redirects.map(redirect => {
      const from = `- from: ${new URL(redirect.from).pathname}`;  
      const to = redirect.to.includes('https://developer.chrome.com') || redirect.to.includes('http://localhost:8080') ?
          `  to: ${new URL(redirect.to).pathname}` :
          `  to: ${redirect.to}`;
      return `${from}\n${to}\n`;
    });
    let errors = data.errors.map(error => `- from: ${new URL(error).pathname}\n  to: \n`);
    fs.writeFileSync('redirects.txt', redirects.concat(errors).join('\n'));
    fs.writeFileSync('report.txt', JSON.stringify(data, null, '  '));
  }
  console.log(data);
  await browser.close();
}

try {
  init();
} catch (error) {
  console.error({error});
}