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
          price: offer.querySelector('span.cena > b').innerText.trim()
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

  const url = "https://motorky.bazos.cz/skutry/0/";
  const offers = await getOffers(url)
  console.log(offers);

  await browser.close();
})();
