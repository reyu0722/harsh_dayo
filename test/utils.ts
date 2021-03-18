import Helper from 'hubot-test-helper'
import { expect } from 'chai'

const helper = new Helper('../scripts')
let room = helper.createRoom({ httpd: false })

describe('hoge', () => {
  afterEach(() => {
    room.destroy()
    room = helper.createRoom({ httpd: false })
  })

  context('user and bot says hoge to hubot', () => {
    beforeEach(async () => {
      await room.user.say('alice', '@hubot hoge')
      await room.user.say('bot', '@hubot hoge', { user: { bot: true } })
    })
    it('reply only to user', () => {
      expect(room.messages).to.eql([
        ['alice', '@hubot hoge'],
        ['hubot', '@alice fuga'],
        ['bot', '@hubot hoge']
      ])
    })
  })
})
