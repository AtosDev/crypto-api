//scraping api 
//CRYPTO NEWS SCRAPING API

import express from "express";
import axios from "axios";
import cheerio from "cheerio";

const port = process.env.PORT || 3000;

const app = express()

//getting multiple sources to search from
const newspapers = [
  {
    name: "investopedia",
    address: "https://www.investopedia.com/cryptocurrency-news-5114163",
    base: ''
  },

  {
    name: "coindesk-market",
    address: "https://www.coindesk.com/markets",
    base: 'https://www.coindesk.com' // was not giving us full links, we added base to it to make it full
  },

  {
    name: "coindesk",
    address: "https://www.coindesk.com/",
    base: 'https://www.coindesk.com'  
  },
]

const DATA = [] //an empty array to store response in json format

newspapers.forEach((info) => {
  //info in parameter means eachitem
    axios.get(info.address)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("coin")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                DATA.push({
                    title,
                    url: info.base + url,
                    source: info.name
                })
            })

        })
        .catch((error) => {
            console.log(error);
        })

});

app.get("/", (req, res) => {
  res.json("This is API earn Homepage")
})

app.get('/cryptonews/:newspaperid', async (req,res) => {
    //console.log(req);
    //console.log(req.params); //will log out { newspaperid: 'anything in newspaperid' }, this is our params
    //console.log(req.params.newspaperid); //will give us the what 'anything in newspaperid'.
    const newspaperid = req.params.newspaperid

    const newspaperaddress = newspapers.filter(newspaper => newspaper.name == newspaperid)[0].address //filter method will give us return, if the name of the newspaper from newspapers array is equal to the id we provided in the url,
    //it will return us the whole object but in an array , so we use index of 0 because only 1 item exists after filer and then dot address to get the address from the object in an array
    

    const newspaperidbase = newspapers.filter(newspaper => newspaper.name == newspaperid)[0].base //will get the base so url can be proper

    //console.log(newspaperaddress); will gives us only the address 

    axios.get(newspaperaddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            const seprateDATA = [];

            $("a:contains('coin')", html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                seprateDATA.push({
                    title,
                    url: newspaperidbase + url,
                    source: newspaperid
                })
            })
            res.json(seprateDATA)
        })
        .catch((err) => {console.log(err)})      
})

app.get('/cryptonews', (req, res) => {
    console.log(' This will log out when ever someone Refreshes the page');
  res.json(DATA)
})

app.listen(port, () => {
  console.log(`Your server is running on ${port}`);
});

//  axios.get("https://www.theguardian.com/environment/climate-crisis")
//        .then((response) => {
//           //console.log(response.data); will log out the html data(all the code in html ig)
//            const html = response.data
//            const $ = cheerio.load(html) //using cheerio to scrape
//
//            //if the a tag(anchor tag, which defines link) that contains word " " in html
//            //we will get that and put appy each witha  function which give us title and url
//            //and it will be pushed in data which will send as a response to us
//            $('a:contains("climate")', html).each(function () {
//                const title = $(this).text()
//                const url = $(this).attr("href")
//                DATA.push({
//                   title,
//                    url
//                })
//            })


