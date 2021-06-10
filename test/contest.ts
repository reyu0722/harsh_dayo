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
      await new Promise<void>(resolve => setTimeout(() => resolve(), 4000))
    })

    it('reply contest information to user', () => {
      expect(room.messages[0]).to.eql(['alice', '@hubot contest'])
      expect(room.messages[1][1]).to.match(/\| 時間 \| コンテスト \|\n\| --- \| --- \|[\n\| \[.*?\]\(.*?\)\|\ |]+/)
    })
  })
})
