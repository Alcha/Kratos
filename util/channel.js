const { google } = require('googleapis')
const service = google.youtube('v3')

class Channel {
  constructor (auth) {
    this.auth = auth
  }

  async getChannelInfo () {
    let res = await service.channels.list({
      auth: this.auth,
      forUsername: 'GameGrumps',
      part: 'snippet,contentDetails'
    })

    return res.data.items[0]
  }

  async getChannelId (channelName) {
    let response = await service.channels.list({
      auth: this.auth,
      part: 'id',
      forUsername: channelName
    })

    return response.data.items[0].id
  }
}

module.exports = Channel
