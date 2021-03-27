// Description:
//   problem
// Commands:
//   @hubot problem ... - Return problem which meets request

import { getContent, isBot } from '../utils'
import { getProblemsByDiff } from '../utils/atcoderProblems'

module.exports = (robot: HubotTraq.Robot) => {
  robot.respond(/problem/i, async res => {
    try {
      if (isBot(res)) return
      const contents = getContent(res).split(' ')
      let min = -1
      let max = 100000
      contents.forEach(c => {
        const searchRes = c.match(/([0-9]+)\-([0-9]+)/i)
        if (searchRes) {
          min = parseFloat(searchRes[1])
          max = parseFloat(searchRes[2])
        }
      })
      const problems = await getProblemsByDiff(min, max)
      if (problems.length == 0) await res.send('問題が見つかりませんでした')
      else {
        const problem = problems[Math.floor(Math.random() * problems.length)]
        await res.send(`${problem.title}\n${problem.difficulty}`)
      }
    } catch (error) {
      res.send(error.message)
    }
  })
}
