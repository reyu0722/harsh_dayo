// Description:
//   hoge
// Commands:
//   @hubot hoge  - Return '@user fuga'

import { isBot } from '../utils'

module.exports = (robot: HubotTraq.Robot) => {
  robot.respond(/hoge/i, async res => {
    try {
      if (isBot(res)) return
      await res.reply('fuga')
    } catch (error) {
      res.send(error.message)
    }
  })
}
