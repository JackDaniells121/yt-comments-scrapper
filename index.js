const puppeteer = require('puppeteer');

const firefoxOptions = {
    product: 'firefox',
    extraPrefsFirefox: {
      // Enable additional Firefox logging from its protocol implementation
      // 'remote.log.level': 'Trace',
    },
    // Make browser logs visible
    dumpio: true,
  };

const video_id = 'F2LOrLh77F0';

(async () =>{
    const browser = await puppeteer.launch(firefoxOptions);
    const page = await browser.newPage();
    page.setViewport({ width:1920, height: 1080});
    await page.goto('https://www.youtube.com/live_chat?v='+video_id);
    await page.screenshot({path:'example2.png'});
    const messageNodes = await page.$$('yt-live-chat-text-message-renderer');
    
    const texts = await Promise.all(
        messageNodes.map(
            message => message.$eval("#message", el => el.innerText)
        )
    ); 
        
    console.log(texts);
    console.log({messagesCount:texts.length});
    texts.forEach(text =>{
        if(text.indexOf("https://youtu.be/") > 0)
            console.log("Found -->"+text);
    });
    await browser.close();
})();