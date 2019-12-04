const rp = require('request-promise');
const $ = require('cheerio');
const BASE_URL = 'https://bankmega.com/';

const getPromoDetail = function(data) {
  return rp(data.url)
    .then(function(html) {
        let title = $('.titleinside > h3', html).text();
        if (title === '') {
            return {
                title: data.title,
                imageurl: data.imageurl,
                url: data.url,
                area: '',
                period: ''
            }
        }
        let href = data.url;
        let area = $('.area > b', html).text();
        let periode = $('.periode > b', html).text();
        let img = $('.keteranganinside > img', html);
        if (typeof img[0] === 'undefined') {
            img = $('.keteranganinside > a > img', html);
            href = $('.keteranganinside > a', html)[0].attribs.href;
        }
        let imageurl = BASE_URL+img[0].attribs.src;
        return {
            title: title,
            area: area,
            period: periode,
            imageurl: imageurl,
            url: href
        }
    })
    .catch(function(err) {
      //handle error
    //   console.error(err);
        return {}
    });
};

module.exports = getPromoDetail;