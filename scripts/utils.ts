const isBot = (res: HubotTraq.Response) => res.message.message.user.bot

export { isBot }
