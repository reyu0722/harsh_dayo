import Helper from 'hubot-test-helper'
import { expect } from 'chai'

const helper = new Helper('../scripts/hoge.ts')
let room = helper.createRoom({ httpd: false })

describe('hoge', () => {
  afterEach(() => {
    room.destroy()
    room = helper.createRoom({ httpd: false })
  })

  context('user says hoge to hubot', () => {
    beforeEach(async () => {
      await room.user.say('alice', '@hubot hoge')
      await room.user.say('bob', '@hubot　hoge')
    })

    it('reply fuga to user', () => {
      expect(room.messages).to.eql([
        ['alice', '@hubot hoge'],
        ['hubot', '@alice fuga'],
        ['bob', '@hubot　hoge'],
        ['hubot', '@bob fuga']
      ])
    })
  })
})
