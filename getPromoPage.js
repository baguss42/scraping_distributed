const rp = require('request-promise');
const $ = require('cheerio');
const getPromo = require('./getPromo');
const API_URL = 'https://www.bankmega.com/ajax.promolainnya.php?product=0&subcat=';

const getPromoPage = function(category, product_id, subcat_id) {
  return rp(API_URL+subcat_id)
    .then(function(html) {
      let pages = $('.page_promo_lain', html);
      let page_no = [];
      for(let k = 0; k < pages.length; k++) {
        page_no[k] = {
            'prod': pages[k].attribs.product,
            'subcat': pages[k].attribs.subcat,
            'no': pages[k].attribs.page,
        }
      }
      page_no.pop();
      page_no.shift();

      return Promise.all(
        page_no.map(function(pag) {
          return getPromo(pag.prod, pag.subcat, pag.no);
        })
      );
    })
    .then(function(res) {
      let promo = [];
      for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[i].length; j++) {
          promo.push(res[i][j]);
        }
      }
      var key = category;
      var result = { };
      result[key] = promo;
      // console.log(JSON.stringify(result));
      return result;
    })
    .catch(function(err) {
      //handle error
      console.error(err);
    });
};

module.exports = getPromoPage;