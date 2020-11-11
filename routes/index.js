var express = require('express');
var router = express.Router();
const http = require('https')
const cheerio = require('cheerio');
const db = require('../config/db');
const loldetails = require('../util/lolconfig.json')

/* 登陆用户信息 */
router.get('/api/userinfo', function (req, res, next) {
  const promise = new Promise((resolve, reject) => {
    let gameid = encodeURI(req.query.gameid)
    let userinfo = {
      id: '',
      name: '',
      area: '',
      avatar: '',
      single_AND_double_row: '',
      flexible_SET_of_row: '',
      genting_Game_ranking: '',
      national_Service_Rank: ''
    }
    let initData = http.request(`https://www.lolhelper.cn/rank_lcu.php?gameid=${gameid}&server=${req.query.server}`, res => {
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
        if (userinfo.avatar) {
          let avatarurl = userinfo.avatar
          const index = avatarurl.lastIndexOf("\/")
          avatarurl = avatarurl.substring(index + 1, avatarurl.length)
          db.query(`CALL p_user_Add('${userinfo.name}','${userinfo.area}','${avatarurl}')`, [], (res, fie) => {
            userinfo.id = res[0].id
            resolve(userinfo)
          })
        } else {
          const data = { id: 0 }
          resolve(data)
        }
      })
    })
    initData.end()
  })

  promise.then((resolve) => {
    res.send(resolve);
  })


});
/* 获取题目  */
router.get('/api/topic', function (req, res, next) {
  const data = loldetails.list[Math.floor(Math.random() * loldetails.list.length)]
  res.send(data)
})

/* 回答题目 */
router.get('/api/answer', function (req, res, next) {
  const userid = req.query.userid
  if (userid) {
    const promise = new Promise((resolve, reject) => {
      db.query(`CALL p_answer_Add('${userid}')`, [], (res, fie) => {
        resolve(res)
      })
    })
    promise.then((resolve) => {
      res.send(resolve)
    })
  }
})

/* 获取排行榜 */
router.get('/api/ranking', function (req, res, next) {
  const promise = new Promise((resolve, reject) => {
    db.query(`CALL p_ranking_list`, [], (res, fie) => {
      resolve(res)
    })
  })
  promise.then((resolve) => {
    res.send(resolve)
  })
})

module.exports = router;
