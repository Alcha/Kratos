const config = require('./config.json')
const { google } = require('googleapis')

let auth = config.youtubeKey

const service = google.youtube('v3')

const fs = require('fs')
const path = require('path')

service.playlistItems.list({
  playlistId: config.ggUploadPlaylistId,
  auth: auth,
  part: 'snippet,contentDetails'
}, (err, res) => {
  if (err) {
    console.error(err)
    return
  }
  let videoIds = []

  for (let x = 0; x < 5; x++) {
    videoIds.push(res.data.items[x].videoId)
  }

  getVideos(config.ggUploadPlaylistId, res.data.nextPageToken).then(res => {
    videoIds.push(res)

    console.log(videoIds.length)

    fs.writeFile(path.join(__dirname, 'output.txt'), videoIds, err => {
      if (err) console.error(err)
      else console.log(`File written to disc.`)
    })
  }).catch(err => console.error(err))
})

const getVideos = async (playlistId, pageToken) => {
  let videoIds = []
  let pageNum = 0

  while (pageToken !== undefined) {
    console.log(`Listing page ${pageNum}`)

    let items = await service.playlistItems.list({
      auth: auth,
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

const getChannelId = async channelName => {
  let response = await service.channels.list({
    auth: auth,
    part: 'id',
    forUsername: channelName
  })

  return response.data.items[0].id
}

// const getPlaylistId = async playlistName => {
//   let response = await service.playlists.list({
//     auth: auth,
//     channelId: await getChannelId('GameGrumps'),
//     part: 'snippet,contentDetails'
//   })

//   for (let x = 0; x < response.data.items.length; x++) {
//     let item = response.data.items[x]
//     console.log(item)
//     if (item.snippet.title === playlistName) return item.id
//   }
// }
