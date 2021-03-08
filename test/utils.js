const Helper = require('hubot-traq-test-helper')
const helper = new Helper('../scripts')

const co = require('co')
const { expect } = require('chai')

describe('isbot', function () {
  beforeEach(function () {
    this.room = helper.createRoom()
  })
  afterEach(function () {
    this.room.destroy()
  })

  context('user and bot says hoge to hubot', function () {
    beforeEach(function () {
      return co(
        function* () {
          yield this.room.user.say('alice', '@hubot hoge')
          yield this.room.user.say('bot', '@hubot hoge', { user: { bot: true } })
        }.bind(this)
      )
    })
    it('reply only to user', function () {
      expect(this.room.messages).to.eql([
        ['alice', '@hubot hoge'],
        ['hubot', '@alice fuga'],
        ['bot', '@hubot hoge']
      ])
    })
  })
})
