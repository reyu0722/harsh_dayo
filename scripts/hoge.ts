// Description:
//   hoge
// Commands:
//   @hubot hoge  - Return '@user fuga'

import { exec } from '../utils'

module.exports = (robot: HubotTraq.Robot) => {
  robot.respond(/hoge/i, res =>
    exec(res, async () => {
      await res.reply('fuga')
    })
  )
}
