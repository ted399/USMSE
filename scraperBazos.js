
const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {

  //Get the offers on the first page, then recursievely check the next page in the URL pattern
  const getOffers = async(url) => {
    const page = await browser.newPage();
    await page.goto(url);

    console.log(`scraping: ${url}`)

    //Scrape data
    const offersOnPage = await page.evaluate(
      () => Array.from(document.querySelectorAll("table.inzeraty"))
        .map(offer => ({
          title: offer.querySelector('span.nadpis > a').innerText.trim(),
          price: offer.querySelector('span.cena > b').innerText.trim(),
          desc: offer.querySelector('div.popis').innerText.trim(),
          location: offer.querySelector('tbody:nth-child(1) td:nth-child(3)').innerText.trim(),
          link: offer.querySelector('span.nadpis > a').href
        }))
    );

    await page.close();

    //End recursion?
    if(offersOnPage.length < 1) {
      console.log(`terminate recursion on: ${url}`);
      return offersOnPage
    }
    else {
      //Go to the next page and scrape it
      //Get next page
      const prettyUrl = url.substring(0, url.length-1);
      const nextPageNumber = parseInt(/[^/]*$/.exec(prettyUrl)[0], 10) + 20
      const nextUrl = `https://motorky.bazos.cz/skutry/${nextPageNumber}/`
      return offersOnPage.concat(await getOffers(nextUrl))
    }

  }
  const browser = await puppeteer.launch();

  const url = "https://motorky.bazos.cz/skutry/2460/";
  const offers = await getOffers(url)
  console.log(offers);

  //Create json file with all the extracted data
  fs.writeFile("./object.json", JSON.stringify(offers, null, 4), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
  });

  await browser.close();
})();
