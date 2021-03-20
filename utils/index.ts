const isBot = (res: HubotTraq.Response) => res.message.message.user.bot

const getContent = (res: HubotTraq.Response) => {
  const re = new RegExp('@[a-zA-Z0-9_-]+\\s*[^\\s]*\\s*(.*)')
  const { text } = res.message.message
  const result = text.match(re)
  return !result ? '' : result[1]
}

export { isBot, getContent }
