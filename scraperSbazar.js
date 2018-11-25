
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
      () => Array.from(document.querySelectorAll("div.c-item__box--has-link"))
        .map(offer => ({
          title: offer.querySelector('div.c-item__name > span').innerText.trim(),
          price: offer.querySelector('div.c-item__group > div.c-item__attrs > span.c-price > b').innerText.trim(),
          location: offer.querySelector('div.c-item__group > div.c-item__attrs > span.c-item__locality').innerText.trim(),
          link: offer.querySelector('div.c-item__group > a.c-item__link').href
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
      const nextPageNumber = parseInt(/[^/]*$/.exec(url)[0], 10) + 1
      const nextUrl = `https://www.sbazar.cz/87-skutry/cena-neomezena/nejnovejsi/nejnovejsi/${nextPageNumber}`
      return offersOnPage.concat(await getOffers(nextUrl))
    }

  }
  const browser = await puppeteer.launch();

  const url = "https://www.sbazar.cz/87-skutry/cena-neomezena/nejnovejsi/nejnovejsi/18";
  const offers = await getOffers(url)
  console.log(offers);

  //Create json file with all the extracted data
  fs.writeFile("./Sbazar.json", JSON.stringify(offers, null, 4), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
  });

  await browser.close();
})();
