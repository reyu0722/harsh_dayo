import Helper from 'hubot-test-helper'
import { expect } from 'chai'

const helper = new Helper('../scripts/rating.ts')
let room = helper.createRoom({ httpd: false })

describe('rating', () => {
  afterEach(() => {
    room.destroy()
    room = helper.createRoom({ httpd: false })
  })

  context("get reyu's rating", () => {
    beforeEach(async () => {
      await room.user.say('alice', '@hubot rating reyu')
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000))
    })

    it('send rating to user', () => {
      expect(room.messages[0]).to.eql(['alice', '@hubot rating reyu'])
      expect(room.messages[1]).to.eql(['hubot', ':haakusimasita:'])
      expect(room.messages[2][1]).to.match(/\|user\|rating\|\n\|---\|---\|\n\|reyu\|[0-9]+\|\n/)
      expect(room.messages[3]).to.eql(['hubot', ':kan:'])
    })
  })
  context("get many user's rating", () => {
    beforeEach(async () => {
      await room.user.say('alice', '@hubot rating tourist Um_nik')
      await new Promise<void>(resolve => setTimeout(() => resolve(), 2000))
    })

    it('send ratings to user', () => {
      expect(room.messages[0]).to.eql(['alice', '@hubot rating tourist Um_nik'])
      expect(room.messages[1]).to.eql(['hubot', ':haakusimasita:'])
      expect(room.messages[2][1]).to.match(/\|user\|rating\|\n\|---\|---\|\n\|tourist\|[0-9]+\|\n\|Um_nik\|[0-9]+\|\n/)
      expect(room.messages[3]).to.eql(['hubot', ':kan:'])
    })
  })
  context("get not existing user's rating", () => {
    beforeEach(async () => {
      await room.user.say('alice', '@hubot rating konoyuuzaahatabuninaiyo')
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000))
    })

    it('send error', () => {
      expect(room.messages[0]).to.eql(['alice', '@hubot rating konoyuuzaahatabuninaiyo'])
      expect(room.messages[1]).to.eql(['hubot', ':haakusimasita:'])
      expect(room.messages[2][1]).to.match(/konoyuuzaahatabuninaiyoの情報の取得に失敗しました/)
    })
  })
})
