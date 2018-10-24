const { google } = require('googleapis')
const service = google.youtube('v3')

class Playlists {
  constructor (auth) {
    this.auth = auth
  }

  async getAllVideos (playlistId, maxResults = undefined, pageToken = undefined) {
    let res = await service.playlistItems.list({
      playlistId: playlistId,
      auth: this.auth,
      part: 'snippet,contentDetails',
      maxResults: 10,
      pageToken: pageToken
    })

    if (res.data.nextPageToken === undefined) {

    } else {

    }
  }

  async getVideos (playlistId, pageToken) {
    let videoIds = []
    let pageNum = 0

    while (pageToken !== undefined && pageNum < 10) {
      console.log(`Listing page ${pageNum}`)

      let items = await service.playlistItems.list({
        auth: this.auth,
        part: 'snippet,contentDetails',
        playlistId: playlistId,
        pageToken: pageToken
      })

      pageToken = items.data.nextPageToken

      for (let x = 0; x < 5; x++) {
        videoIds.push(items.data.items[x].contentDetails.videoId)
      }

      pageNum++
    }

    return videoIds
  }
}

module.exports = Playlists
