const rp = require('request-promise');
const $ = require('cheerio');
const getPromoPage = require('./getPromoPage');
const fs = require('fs');
const url = 'https://www.bankmega.com/promolainnya.php';

const scrap = function() {
  // var result = {};
  var result = rp(url)
    .then(function(html){
      let category = [];
      let promos = $('#subcatpromo > div > img', html);
      const mapCategory = { // define category dan id disini karna di website itu manual membuat function klik
        'travel': 1,
        'lifestyle': 2,
        'fnb': 3,
        'gadget_entertainment': 4,
        'dailyneeds': 5,
        'others_promo': 6
      }
      for(let i = 0; i < promos.length; i++) {
          category[i] = {
              'id': promos[i].attribs.id,
              'cat_id': mapCategory[promos[i].attribs.id],
              'title': promos[i].attribs.title,
              'src': promos[i].attribs.src,
          }
      }
      return Promise.all(
          category.map(function(cat) {
          return getPromoPage(cat.title, '', cat.cat_id);
        })
      );
    })
    .then(function(promo) {
      var res = {}
      for (var i in promo) {
        let data = {};
        let key = '';
        for (var j in promo[i]) {
          key = j;
          data = promo[i][j];
        }
        res[key] = data;
      }
      let data = JSON.stringify(res, null, 2);
      fs.writeFileSync('result.json', data);
      return res;
    })
    .catch(function(err){
      //handle error
      console.error(err);
    });
    return result;
}

module.exports = scrap;
