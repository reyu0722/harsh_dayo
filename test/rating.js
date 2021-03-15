const Helper = require('hubot-traq-test-helper')
const helper = new Helper('../scripts')

const co = require('co')
const { expect } = require('chai')

describe('rating', function () {
  this.timeout(10000)
  beforeEach(function () {
    this.room = helper.createRoom()
  })
  afterEach(function () {
    this.room.destroy()
  })

  context('get reyu\'s rating', function () {
    beforeEach(function () {
      return co(
        function* () {
          yield this.room.user.say('alice', '@hubot rating reyu')
          yield new Promise(resolve => setTimeout(() => resolve(), 1000))
        }.bind(this)
      )
    })

    it('send rating to user', function () {
      expect(this.room.messages[0]).to.eql(['alice', '@hubot rating reyu'])
      expect(this.room.messages[1]).to.eql(['hubot', ':haakusimasita:'])
      expect(this.room.messages[2][1]).to.match(/\|user\|rating\|\n\|---\|---\|\n\|reyu\|[0-9]+\|\n/)
      expect(this.room.messages[3]).to.eql(['hubot', ':kan:'])
    })
  })
  context('get many user\'s rating', function () {
    beforeEach(function () {
      return co(
        function* () {
          yield this.room.user.say('alice', '@hubot rating tourist Um_nik ksun48')
          yield new Promise(resolve => setTimeout(() => resolve(), 3000))
        }.bind(this)
      )
    })

    it('send ratings to user', function () {
      expect(this.room.messages[0]).to.eql(['alice', '@hubot rating tourist Um_nik ksun48'])
      expect(this.room.messages[1]).to.eql(['hubot', ':haakusimasita:'])
      expect(this.room.messages[2][1]).to.match(/\|user\|rating\|\n\|---\|---\|\n\|tourist\|[0-9]+\|\n\|Um_nik\|[0-9]+\|\n\|ksun48\|[0-9]+\|\n/)
      expect(this.room.messages[3]).to.eql(['hubot', ':kan:'])
    })
  })
  context('get not existing user\'s rating', function () {
    beforeEach(function () {
      return co(
        function* () {
          yield this.room.user.say('alice', '@hubot rating konoyuuzaahatabuninaiyo')
          yield new Promise(resolve => setTimeout(() => resolve(), 1000))
        }.bind(this)
      )
    })

    it('send error', function () {
      expect(this.room.messages[0]).to.eql(['alice', '@hubot rating konoyuuzaahatabuninaiyo'])
      expect(this.room.messages[1]).to.eql(['hubot', ':haakusimasita:'])
      expect(this.room.messages[2][1]).to.match(/konoyuuzaahatabuninaiyoの情報の取得に失敗しました/)
      expect(this.room.messages[3]).to.eql(['hubot', ':failed:'])
    })
  })
})
