const isBot = (res: HubotTraq.Response) => res.message.message.user.bot

const getOptions = (res: HubotTraq.Response) => {
  const re = new RegExp('@[a-zA-Z0-9_-]+\\s*[^\\s]*\\s*(.*)')
  const { plainText } = res.message.message
  const result = plainText.match(re)
  return result ? result[1].split(' ') : []
}

export const exec = async (res: HubotTraq.Response, func: (content: string[]) => void) => {
  try {
    if (isBot(res)) return
    const options = getOptions(res)
    await func(options)
  } catch (error) {
    res.send(error.message)
  }
}

export const makeTable = (objs: { [key: string]: string }[]) => {
  const keys = Array.from(new Set<string>(new Array().concat(...objs.map(obj => Object.keys(obj)))))
  if (keys.length == 0) return ''

  const header = `| ${keys.join(' | ')} |\n| ${keys.map(() => '---').join(' | ')} |\n`
  const body = objs.map(obj => `| ${keys.map(key => obj[key] ?? '').join(' | ')} |`).join('\n')

  return header + body
}
