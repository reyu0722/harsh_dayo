const Helper = require('hubot-traq-test-helper')
const helper = new Helper('../scripts')

const co = require('co')
const { expect } = require('chai')

describe('hoge', function () {
  beforeEach(function () {
    this.room = helper.createRoom()
  })
  afterEach(function () {
    this.room.destroy()
  })

  context('user says hoge to hubot', function () {
    beforeEach(function () {
      return co(
        function* () {
          yield this.room.user.say('alice', '@hubot hoge')
          yield this.room.user.say('bob', '@hubot　hoge')
        }.bind(this)
      )
    })

    it('reply fuga to user', function () {
      expect(this.room.messages).to.eql([
        ['alice', '@hubot hoge'],
        ['hubot', '@alice fuga'],
        ['bob', '@hubot　hoge'],
        ['hubot', '@bob fuga']
      ])
    })
  })
})
