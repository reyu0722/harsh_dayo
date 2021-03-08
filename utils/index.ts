const isBot = (res: HubotTraq.Response) => res.message.message.user.bot

const getContent = (res: HubotTraq.Response) => {
  const re = new RegExp('@[a-zA-Z0-9_-]+\\s*(.*)')
  const { plainText } = res.message.message
  const result = plainText.match(re)
  return !result ? '' : result[1]
}

export { isBot, getContent }
