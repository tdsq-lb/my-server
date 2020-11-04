var express = require('express');
var router = express.Router();
const http = require('https')
const cheerio = require('cheerio');

/* GET home page. */
router.get('/userinfo', function (req, res, next) {
  const promise = new Promise((resolve, reject) => {
    let gameid = encodeURI(req.query.gameid)
    let initData = http.request(`https://www.lolhelper.cn/rank_lcu.php?gameid=${gameid}&server=${req.query.server}`, res => {
      let userinfo = {
        name: '',
        area: '',
        avatar: '',
        single_AND_double_row: '',
        flexible_SET_of_row: '',
        genting_Game_ranking: '',
        national_Service_Rank: ''
      }
      let chunks = []
      res.on('data', chunk => {
        chunks.push(chunk)
      })
      res.on('end', () => {
        const htlmStr = Buffer.concat(chunks).toString('UTF-8')
        let $ = cheerio.load(htlmStr)
        userinfo.name = $('.head_box p:first-of-type').text()
        userinfo.area = $('.head_box p:last-of-type').text()
        userinfo.avatar = $('.head_box .head_avatar img').attr('src')
        userinfo.single_AND_double_row = $('.main .main_box .main_cont .main_item:nth-of-type(1) .main_txt').text()
        userinfo.flexible_SET_of_row = $('.main .main_box .main_cont .main_item:nth-child(2) .main_txt').text()
        userinfo.genting_Game_ranking = $('.main .main_box .main_cont .main_item:nth-child(3) .main_txt').text()
        userinfo.national_Service_Rank = $('.main .main_box .main_cont .main_item:nth-child(5) .main_txt').text()
        resolve(userinfo)
      })
    })
    initData.end()
  })
  promise.then((resolve) => {
    res.send(resolve);
  })

});

module.exports = router;
