const puppeteer = require('puppeteer');
const fs = require('fs');

const firefoxOptions = {
    product: 'firefox',
    extraPrefsFirefox: {
      // Enable additional Firefox logging from its protocol implementation
      // 'remote.log.level': 'Trace',
    },
    // Make browser logs visible
    dumpio: false,
  };

const video_id = 'F2LOrLh77F0';

(async () =>{
    const browser = await puppeteer.launch(firefoxOptions);
    const page = await browser.newPage();
    page.setViewport({ width:1920, height: 1080});
    await page.goto('https://www.youtube.com/live_chat?v='+video_id);
    await page.screenshot({path:'example.png'});
    const messageNodes = await page.$$('yt-live-chat-text-message-renderer');
    
    const texts = await Promise.all(
        messageNodes.map(
            message => message.$eval("#message", el => el.innerText)
        )
    ); 
        
    console.log(texts);
    console.log({messagesCount:texts.length});
    let ytlinks = [];
    texts.forEach(text =>{
        if(text.indexOf("https://youtu.be/") > -1)
            // console.log("Found --> "+text);
            ytlinks.push(text);
    });
    
    if(ytlinks.length > 0){
        console.log(ytlinks);
        write_array_to_file('ytlinks.txt', ytlinks);
    }

    write_array_to_file('chat_history.txt', texts);

    await browser.close();
})();

function write_array_to_file(filename, array){
    fs.writeFile(
        filename, 
        (array.join('\n'))+'\n',  
        {'flag':'a'},
        function(err) {
            if (err) {
                return console.error(err);
            }
        }
    );
}