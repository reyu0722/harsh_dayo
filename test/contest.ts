import Helper from 'hubot-test-helper'
import { expect } from 'chai'

const helper = new Helper('../scripts/contest.ts')
let room = helper.createRoom({ httpd: false })

describe('contest', () => {
  afterEach(() => {
    room.destroy()
    room = helper.createRoom({ httpd: false })
  })

  context('user says contest to hubot', () => {
    beforeEach(async () => {
      await room.user.say('alice', '@hubot contest')
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000))
    })

    it('reply contest information to user', () => {
      expect(room.messages).to.eql([['alice', '@hubot contest']])
    })
  })
})
