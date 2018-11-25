const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://motorky.bazos.cz/skutry/");

  const offers = await page.evaluate(
    () => Array.from(document.querySelectorAll("table.inzeraty"))
      .map(offer => ({
        title: offer.querySelector('span.nadpis > a').innerText.trim(),
        image: offer.querySelector('img.obrazek').src,
        price: offer.querySelector('span.cena > b').innerText.trim()
      }))
  );

  console.log(offers);

  await browser.close();
})();
