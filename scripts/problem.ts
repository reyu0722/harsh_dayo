// Description:
//   problem
// Commands:
//   @hubot problem ... - Return problem which meets request

import { exec } from '../utils'
import { getProblemsByDiff } from '../utils/atcoderProblems'

module.exports = (robot: HubotTraq.Robot) => {
  robot.respond(/problem/i, res =>
    exec(res, async options => {
      let min = -1
      let max = Infinity

      options.forEach(opt => {
        const searchRes = opt.match(/([0-9]+)\-([0-9]+)/i)
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
    })
  )
}
