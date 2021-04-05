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
