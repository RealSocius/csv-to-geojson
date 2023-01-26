const GeoJSON = require("geojson");
const csv = require("csv-parser");
const fs = require('fs');
const puppeteer = require('puppeteer');

let data = [];
let dataLatLng = [];
let firstTime = true;

async function getLatLng(data) {
    const browser = await puppeteer.launch();

    for (let row of data) {
        if(!row.URL) {
            return console.error("Error", row);
        }
        console.log("New URL", row.URL);
        await navigateToPage(browser, row);
        fs.writeFile('./result.json', JSON.stringify(dataLatLng), err => {
            if (err) {
                console.error(err);
            }
        });
    }
}

async function navigateToPage(browser, row, i) {
    const page = await browser.newPage();

    await page.goto(row.URL);

    if(firstTime) {
        await page.waitForSelector('[action=\'https://consent.google.com/save\'] button');
        await page.click('[action=\'https://consent.google.com/save\'] button');
        firstTime = false;
    }

    return await new Promise(resolve => {
        let holdProgress = setInterval(() => {
            if (page.url() != row.URL && !page.url().includes("consent.google.com")) {
                let latlngString = page.url().match(/(?<=@)(.*)(?=z)/gm)[0];
                let lat = latlngString.match(/(.*)(?=,)/gm)[0];
                let lng = latlngString.match(/(?<=,)(.*)/gm)[0];
                console.log(latlngString);
                dataLatLng.push({
                    name: row.Title,
                    category: '',
                    lat: parseFloat(lat),
                    lng: parseFloat(lng)
                },)
                resolve('foo');
                page.close();
                clearInterval(holdProgress);
            }
        }, 300);
    });
}

fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (csvdata) => data.push(csvdata))
    .on('end', async () => {
        await getLatLng(data);
        let geoData = GeoJSON.parse(dataLatLng, {Point: ['lat', 'lng']});
        fs.writeFile('./geojson.json', JSON.stringify(geoData), err => {
            if (err) {
                console.error(err);
            }
        });
    });



