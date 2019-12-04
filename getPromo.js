const rp = require('request-promise');
const $ = require('cheerio');
const getPromoDetail = require('./getPromoDetail');
const BASE_URL = 'https://bankmega.com/';
const API_URL = 'https://www.bankmega.com/ajax.promolainnya.php?';

const getPromo = function(product_id, subcat_id, page_no) {
  const product = 'product=' + product_id;
  const subcat = '&subcat='+ subcat_id;
  const page = '&page='+ page_no;
  return rp(API_URL+product+subcat+page)
    .then(function(html) {
      let promos = $('#promolain > li > a', html);
      let res = [];
      for(let i = 0; i < promos.length; i++) {
        let href = promos[i].attribs.href;
        if (!href.includes("http")) {
          href = BASE_URL + href;
        }
        let img = BASE_URL + $('img', promos[i])[0].attribs.src;
        res.push({
          title: $('img', promos[i])[0].attribs.title,
          url: href,
          imageurl: img,
        });
      }
      return Promise.all(
        res.map(function(data) {
          return getPromoDetail(data);
        })
      );
    })
    .then(function(result){
      return result;
    })
    .catch(function(err) {
      //handle error
      console.error(err);
    });
};

module.exports = getPromo;