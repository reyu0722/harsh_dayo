// Description:
//   hoge
// Commands:
//   @hubot hoge  - Return '@user fuga'

import { calc } from '../utils'

module.exports = (robot: HubotTraq.Robot) => {
  robot.respond(/hoge/i, res =>
    calc(res, async res => {
      await res.reply('fuga')
    })
  )
}
