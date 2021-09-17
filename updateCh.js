const pup = require('puppeteer');

function checkUpdate(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await pup.launch();
            const page = await browser.newPage();
            await page.goto(url);
            let update = await page.evaluate(() => { //evaluate lets you use your own 'code'
                let newChapter = [];
                let chaps = document.querySelectorAll("ul.detail-main-list > li > a")
                newChapter.push({
                    url:  chaps[0].getAttribute('href'),
                    text: chaps[0].innerText,
                });

                return newChapter;
            })
            browser.close();
            return resolve(update);

        } catch (e) {
            return reject(e)
        }
    })
}

module.exports = {checkUpdate};

checkUpdate(url).then(console.log).catch(console.error);







