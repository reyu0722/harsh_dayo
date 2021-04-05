// Description:
//   contest
// Commands:
//   @hubot contest  - Return contest info

import { exec, makeTable } from '../utils'
import fetch from 'node-fetch'
import { parse } from 'node-html-parser'

const getContests = async () => {
  const response = await fetch('https://atcoder.jp/contests/')
  if (!response.ok) throw new Error('コンテスト情報の取得に失敗しました')
  const body = await response.text()

  const doc = parse(body)
  const table = doc.querySelector('#contest-table-upcoming')
  const raws = table.querySelectorAll('tr')

  return raws.slice(1).map(raw => {
    const aTag = raw.querySelectorAll('a')[1].toString()
    const timeTag = raw.querySelector('time').toString()

    const name = (aTag.match(/<.*?>(.*?)<\/.*?>/) ?? [])[1]
    const link = (aTag.match(/<a href="(.*?)".*/) ?? [])[1]
    const startTime = (timeTag.match(/<.*?>(.*?)<\/.*?>/) ?? [])[1]

    return { name, link, startTime }
    // 終了時刻をいい感じにする
    // めんどい
  })
}

module.exports = (robot: HubotTraq.Robot) => {
  robot.respond(/contest/i, res =>
    exec(res, async () => {
      const contests = makeTable(await getContests())
      if (contests == '') res.send('コンテストが見つかりませんでした')
      else res.send(contests)
    })
  )
}
