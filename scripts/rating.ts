// Description:
//   rating
// Commands:
//   @hubot rating user1 user2 ... - Return rating of users

import { isBot, getContent } from '../utils'
import fetch from 'node-fetch'
import { parse } from 'node-html-parser'
import { timeStamp } from 'node:console'

const getRating = async (user: string) => {
  const response = await fetch(`https://atcoder.jp/users/${user}`)
  if (!response.ok) throw new Error(`${user}の情報の取得に失敗しました`)
  const body = await response.text()
  const doc = parse(body)
  const table = doc.querySelectorAll('.dl-table')[1]
  const ratingHtml = table.querySelectorAll('tr')[1].querySelector('span')
  const rating = ratingHtml.toString().match(/<.*?>(.*?)<.*?>/i)
  if (!rating) throw new Error('failed to get rating')
  await new Promise(resolve => setTimeout(() => resolve(null), 500))
  return rating[1]
}

module.exports = (robot: HubotTraq.Robot) => {
  robot.respond(/rating/i, async res => {
    try {
      if (isBot(res)) return
      res.send({ type: 'stamp', name: 'haakusimasita' })
      const contents = getContent(res).split(' ')
      const users: string[] = []
      let type = 'list'
      contents.forEach(content => {
        const _type = content.match(/type:(.*)/i)
        _type ? (type = _type[1]) : users.push(content)
      })
      const ratings: string[] = []
      await users.reduce((acc, cur) => acc.then(async () => ratings.push(await getRating(cur))), Promise.resolve(0))
      const header = '|user|rating|\n|---|---|\n'
      const result = header + users.reduce((acc, cur, index) => `${acc}|${cur}|${ratings[index]}|\n`, '')
      res.send(result)
      res.send({ type: 'stamp', name: 'kan' })
    } catch (error) {
      res.send(error.message)
      res.send({ type: 'stamp', name: 'failed' })
    }
  })
}
