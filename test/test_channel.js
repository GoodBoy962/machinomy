'use strict'

const assert = require('assert')
const mocha = require('mocha')

const channel = require('../lib/channel')

const describe = mocha.describe
const it = mocha.it

const HEX_ADDRESS = 'eb61859a9d74f95bda8a6f9d3efcfe6478e49151'

/**
 * @return {number}
 */
const randomInteger = () => {
  return Math.floor(Math.random() * 10000)
}

describe('channel', () => {
  describe('.id', () => {
    const buffer = Buffer.from(HEX_ADDRESS, 'hex')
    const expected = new channel.ChannelId(buffer)
    it('build ChannelId from non-prefixed hex', () => {
      let channelId = channel.id(HEX_ADDRESS)
      assert.deepEqual(channelId, expected)
    })
    it('build ChannelId from prefixed hex', () => {
      let channelId = channel.id('0x' + HEX_ADDRESS)
      assert.deepEqual(channelId, expected)
    })
    it('build ChannelId from Buffer', () => {
      let channelId = channel.id(buffer)
      assert.deepEqual(channelId, expected)
    })
    it('build ChannelId from ChannelId', () => {
      let channelId = channel.id(expected)
      assert.deepEqual(channelId, expected)
    })
  })

  describe('ChannelId', () => {
    describe('#toString', () => {
      it('return prefixed hex', () => {
        let channelId = channel.id(HEX_ADDRESS)
        let actual = channelId.toString()
        assert.equal(actual, '0x' + HEX_ADDRESS)
      })
    })
  })

  describe('Payment', () => {
    describe('.fromPaymentChannel', () => {
      it('build Payment object', () => {
        let channelId = channel.id(Buffer.from(randomInteger().toString()))
        let payment = new channel.Payment({
          channelId: channelId.toString(),
          sender: 'sender',
          receiver: 'receiver',
          price: randomInteger(),
          value: randomInteger(),
          channelValue: randomInteger(),
          v: 1,
          r: 2,
          s: 3
        })
        let paymentChannel = channel.PaymentChannel.fromPayment(payment)
        assert.equal(paymentChannel.channelId, payment.channelId)
        assert.equal(paymentChannel.sender, payment.sender)
        assert.equal(paymentChannel.receiver, payment.receiver)
        assert.equal(paymentChannel.value, payment.channelValue)
      })
    })
  })
})
