const isBot = (res: HubotTraq.Response) => res.message.message.user.bot

export const getContent = (res: HubotTraq.Response) => {
  const re = new RegExp('@[a-zA-Z0-9_-]+\\s*[^\\s]*\\s*(.*)')
  const { text } = res.message.message
  const result = text.match(re)
  return !result ? '' : result[1]
}

export const calc = async (res: HubotTraq.Response, func: (res: HubotTraq.Response) => void) => {
  try {
    if (isBot(res)) return
    await func(res)
  } catch (error) {
    res.send(error.message)
  }
}

