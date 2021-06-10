// Description:
//   contest
// Commands:
//   @hubot contest  - Return contest info

import { exec, makeTable } from '../utils'
import fetch from 'node-fetch'
import { CronJob } from 'cron'
import { parse } from 'node-html-parser'

type Contest = {
  name: string
  url: string
  startTime: number
  duration: number
}

type CodeforcesContest = {
  id: number
  name: string
  phase: 'BEFORE' | 'CODING' | 'PENDING_SYSTEM_TEST' | 'SYSTEM_TEST' | 'FINISHED'
  frozen: boolean
  durationSeconds: number
  startTimeSeconds: number
  relativeTimeSeconds: number
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
    const path = (nameTag.match(/<a href="(.*?)".*/) ?? [])[1]

    const timeStr = (timeTag.match(/\?iso=(.*?)&/) ?? [])[1]
    // const startTime = `${timeStr.substr(4, 2)}/${timeStr.substr(6, 2)} ${timeStr.substr(9, 2)}:${timeStr.substr(11, 2)}`
    const startDate = new Date()
    startDate.setFullYear(parseInt(timeStr.substr(0, 4)))
    startDate.setMonth(parseInt(timeStr.substr(4, 2)) - 1)
    startDate.setDate(parseInt(timeStr.substr(6, 2)))
    startDate.setHours(parseInt(timeStr.substr(9, 2)))
    startDate.setMinutes(parseInt(timeStr.substr(11, 2)))
    startDate.setSeconds(0)

    const startTime = startDate.getTime() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000
    const [_, hour, min] = durationTag.match(/>([^<]*?):([^<]*?)<\//) ?? []
    const duration = parseInt(hour) * 60 + parseInt(min)
    return { name, url: `https://atcoder.jp${path}`, startTime, duration }
  })
}

const getCodeforcesContests = async (): Promise<Contest[]> => {
  const response = await fetch('https://codeforces.com/api/contest.list')
  if (!response.ok) throw new Error('failed to fetch Codeforces contests')

  const body = await response.json()
  const contests: CodeforcesContest[] = body.result
  return contests
    .filter(({ phase }) => phase == 'BEFORE')
    .map(({ id, name, startTimeSeconds, durationSeconds }) => {
      const startTime = startTimeSeconds * 1000 + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000
      const duration = Math.floor(durationSeconds / 60)
      return { name, url: `https://codeforces.com/contests/${id}`, startTime, duration }
    })
}

const formatDate = (dateNum: number): string => {
  const date = new Date(dateNum)
  return `${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`
}

const formatDuration = (duration: number): string => {
  const min = Math.floor(duration / 60)
  const sec = duration % 60
  return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`
}

module.exports = (robot: HubotTraq.Robot) => {
  robot.respond(/contest/i, res =>
    exec(res, async () => {
      const data = (await getCodeforcesContests()).concat(await getAtCoderContests())
      const filteredData = data.filter(({ startTime }) => startTime < Date.now() + 1000 * 3600 * 24)
      filteredData.sort((a, b) => a.startTime - b.startTime)
      const tableData = filteredData.map(({ name, url, startTime, duration }) => {
        return {
          時間: `${formatDate(startTime)}~${formatDate(startTime + duration * 60 * 1000)} (${duration}分)`,
          コンテスト: `[${name}](${url})`
        }
      })
      const table = makeTable(tableData)
      res.send(`# 今日のコンテスト\n\n${table}`)
    })
  )
  new CronJob(
    '0 0 15 * * *',
    async () => {
      const data = (await getCodeforcesContests()).concat(await getAtCoderContests())
      const filteredData = data.filter(({ startTime }) => startTime < Date.now() + 1000 * 3600 * 24)
      filteredData.sort((a, b) => a.startTime - b.startTime)
      const tableData = filteredData.map(({ name, url, startTime, duration }) => {
        return {
          時間: `${formatDate(startTime)}~${formatDate(startTime + duration * 60 * 1000)} (${duration}分)`,
          コンテスト: `[${name}](${url})`
        }
      })
      const table = makeTable(tableData)

      const channelID = process.env.CHANNEL_ID ?? ''
      robot.send({ channelID } as any, `# 今日のコンテスト\n\n${table}`)
    },
    null,
    true,
    'Asia/Tokyo'
  )
}
