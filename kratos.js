const config = require('./config.json')
const { google } = require('googleapis')

let auth = config.youtubeKey

const channel = new (require('./util/channel'))(auth)
const playlists = new (require('./util/playlists'))(auth)

const service = google.youtube('v3')

const fs = require('fs')
const path = require('path')

const getAllVideos = async (playlistId, maxResults = undefined, pageToken = undefined) => {
  let res = await service.playlistItems.list({
    playlistId: playlistId,
    auth: auth,
    part: 'snippet,contentDetails',
    maxResults: maxResults,
    pageToken: pageToken
  })
}

service.playlistItems.list({
  playlistId: config.ggUploadPlaylistId,
  auth: auth,
  part: 'snippet,contentDetails'
}, (err, res) => {
  if (err) console.error(err)
  else {
    let videoIds = []

    for (let x = 0; x < 5; x++) { videoIds.push(res.data.items[x].videoId) }

    playlists.getVideos(config.ggUploadPlaylistId, res.data.nextPageToken).then(res => {
      console.log(videoIds.length)
      console.log(res.length)

    // fs.writeFile(path.join(__dirname, 'output.txt'), videoIds, err => {
    //   if (err) console.error(err)
    //   else console.log(`File written to disc.`)
    // })
    }).catch(err => console.error(err))
  }
})

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
