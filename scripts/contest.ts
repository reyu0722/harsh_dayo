// Description:
//   contest
// Commands:
//   @hubot contest  - Return contest info

import { exec, makeTable } from '../utils'
import fetch from 'node-fetch'
import { parse } from 'node-html-parser'

type Contest = {
  name: string
  url: string
  startTime: string
  duration: string
}


const getAtCoderContests = async (): Promise<Contest[]> => {
  const response = await fetch('https://atcoder.jp/contests/')
  if (!response.ok) throw new Error('failed to fetch AtCoder contests')
  const body = await response.text()

  const doc = parse(body)
  const table = doc.querySelector('#contest-table-upcoming')
  const raws = table.querySelectorAll('tr')

  return raws.slice(1).map(raw => {
    const td = raw.querySelectorAll('td')
    const timeTag = td[0].toString()
    const nameTag = td[1].querySelector('a').toString()
    const durationTag = td[2].toString()

    const name = (nameTag.match(/<.*?>([^<]*?)<\/.*?>/) ?? [])[1]
    const url = (nameTag.match(/<a href="(.*?)".*/) ?? [])[1]

    const timeStr = (timeTag.match(/\?iso=(.*?)&/) ?? [])[1]
    const startTime = `${timeStr.substr(4, 2)}/${timeStr.substr(6, 2)} ${timeStr.substr(9, 2)}:${timeStr.substr(11, 2)}`

    const [_, min, sec] = durationTag.match(/>([^<]*?):([^<]*?)<\//) ?? []
    // const duration = (parseInt(min) * 60 + parseInt(sec)) * 1000
    const duration = `${min}:${sec}`
    return { name, url, startTime, duration }
  })
}

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
      const contests = makeTable(await getAtCoderContests())
      if (contests == '') res.send('コンテストが見つかりませんでした')
      else res.send(contests)
    })
  )
}
