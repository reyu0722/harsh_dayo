// Description:
//   hoge
// Commands:
//   @hubot hoge  - Return '@user fuga'

import { isBot } from '../utils'

module.exports = (robot: HubotTraq.Robot) => {
  robot.respond(/hoge/i, res => {
    if (isBot(res)) return
    res.reply('fuga')
  })
}
