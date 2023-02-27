const puppeteer = require('puppeteer');

let _browser = null;
let _page = null;
//Fatihak63456551

// headless: false,
//     args: [
//       `--disable-extensions-except=${paths}`,
//       `--load-extension=${paths}`,
//     ]


async function browserLaunch(){
  //const paths = 'C:\\extensions\\ChroPath';
  const browserFetcher = puppeteer.createBrowserFetcher(); 
  let revisionInfo = await browserFetcher.download('1095492');
  _browser = await puppeteer.launch({
    executablePath: revisionInfo.executablePath,
    ignoreDefaultArgs: ['--disable-extensions'],
    headless: false,
    args: ['--no-sandbox', "--disabled-setupid-sandbox"]
  });
}

async function browserClose(){
  await _browser.close();
}

async function loginAccount(username, email, password) {

  await browserLaunch();
  _page = await _browser.newPage();
  const text = await (await _page.goto('https://twitter.com/')).text();
  console.log(text);
  await delay(2000);

  const loginButton = await _page.waitForXPath(`//a[@href='/login']`)
  await loginButton.click();

  const emailInput = await _page.waitForXPath(`//input[@name='text']`);
  await emailInput.type(email, { delay: 150 });
  await delay(2000);
  await emailInput.press('Enter');
  await delay(3000);
  console.log('email yazilip entera basildi');

  const isExistUsernameVerification = await _page.$x(`//span[contains(text(),'Enter your phone number or username')]`);
  console.log(isExistUsernameVerification);
  if (isExistUsernameVerification.length > 0) {
    console.log('enter username null gelmedi');
    const usernameInput = await _page.waitForXPath(`//input[@name='text']`);
    await usernameInput.type(username, { delay: 150 });
    await delay(2000);
    await usernameInput.press('Enter');
    await delay(3000);
  }
  console.log('Enter your phone number or username bolumu gecti.');

  const passwordInput = await _page.waitForXPath(`//input[@name='password']`);
  await passwordInput.type(password, { delay: 150 });
  await delay(2000);
  await passwordInput.press('Enter');
  await delay(5000);
  console.log('son kisim');
}

async function postTweet(content) {

  await _page.goto('https://twitter.com/');
  const tweetInput = await _page.waitForXPath(`//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div[1]/div/div[3]/div/div[2]/div[1]/div/div/div/div[2]/div[1]`);
  await tweetInput.click();
  await delay(500);
  await tweetInput.type(content, { delay: 150 });
  const tweetButton = await _page.waitForXPath(`//div[@data-testid='tweetButtonInline']`);
  await tweetButton.click();
  await delay(5000);

}   

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  });
}

module.exports={
  loginAccount, 
  postTweet,
  browserClose
}