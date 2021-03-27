import Helper from 'hubot-test-helper'
import { expect } from 'chai'

const helper = new Helper('../scripts/problem.ts')
let room = helper.createRoom({ httpd: false })

describe('problem', () => {
  afterEach(() => {
    room.destroy()
    room = helper.createRoom({ httpd: false })
  })

  context('search problem', () => {
    beforeEach(async () => {
      await room.user.say('alice', '@hubot problem')
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000))
    })

    it('reply problem to user', () => {
      expect(room.messages[0]).to.eql(['alice', '@hubot problem'])
      expect(room.messages[1][1]).to.match(/.*?\n[0-9]+/i)
    })
  })
  context('search problem with difficulties', () => {
    beforeEach(async () => {
      await room.user.say('alice', '@hubot problem 1200-1299')
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000))
    })

    it('search not existing problem', () => {
      expect(room.messages[0]).to.eql(['alice', '@hubot problem 1200-1299'])
      expect(room.messages[1][1]).to.match(/.*?\n12[0-9]{2}/i)
    })
  })
  context('search not existing problem', () => {
    beforeEach(async () => {
      await room.user.say('alice', '@hubot problem 1200-1100')
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000))
    })

    it('search not existing problem', () => {
      expect(room.messages[0]).to.eql(['alice', '@hubot problem 1200-1100'])
      expect(room.messages[1]).to.eql(['hubot', '問題が見つかりませんでした'])
    })
  })
})
