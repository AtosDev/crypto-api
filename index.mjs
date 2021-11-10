import express from "express";
import axios from "axios";
import cheerio from "cheerio";

const port = process.env.PORT || 3000;

const app = express();

const DATA = []

app.get('/', (req,res) => {
    res.json('This is API earn Homepage')
})

app.get('/scrap', (req,res) => {
    axios.get("https://www.theguardian.com/environment/climate-crisis")
        .then((response) => {
            //console.log(response.data); will log out the html data(all the code in html ig)
            const html = response.data
            const scrape = cheerio.load(html)

            scrape('a:contains("climate")', html).each(function () {
                const title = scrape(this).text()
                const url = scrape(this).attr("href")
                DATA.push({
                    title,
                    url
                })
            })
            res.json(DATA)
        }) 
        .catch((error)=>{
            console.log(error);
        })
})




app.listen(port, () => {
  console.log(`Your server is running on ${port}`);
});



