import { MDCRipple } from '@material/ripple'
import { MDCTextField } from '@material/textfield'

async function fetchData(url) {
  try {
    const response = await fetch(url)

    if (response.ok) {
      const data = await response.json()
      return data
    } else false
  } catch (e) {
    console.log('Error fetching: ' + url)
  }
}

async function getAllData(artist, song) {
  const lyric_api = 'https://api.lyrics.ovh/v1/'
  const image_api = 'https://imsea.herokuapp.com/api/1?q='

  let lyrics = undefined
  let picture = undefined

  const lyric_url = lyric_api + artist + '/' + song
  const image_url = image_api + artist

  await fetchData(lyric_url).then((data) => {
    if (data) {
      lyrics = data.lyrics
    }
  })

  await fetchData(image_url).then((data) => {
    if (data) {
      picture = data.results[0]
    }
  })

  return { lyric: lyrics, picture: picture }

  // console.log(lyrics, picture)
}

function renderData(artist, song, data) {
  const artist_picture = document.querySelector('.search__image')
  const artist_name_text = document.querySelector('.search__artist')
  const song_name_text = document.querySelector('.search__song')
  const lyrics_text = document.querySelector('.search__lyrics')

  artist_picture.src = data.picture
  artist_name_text.textContent = artist.toUpperCase()
  song_name_text.textContent = song.toUpperCase()
  lyrics_text.textContent = data.lyric
}

function start() {
  const textFields = document.querySelectorAll('.mdc-text-field')
  const button = document.querySelector('.mdc-button')

  const buttonRipple = new MDCRipple(button)
  const artist_text_field = new MDCTextField(textFields[0])
  const song_text_field = new MDCTextField(textFields[1])

  button.addEventListener('click', () => {
    const artist = artist_text_field.value
    const song = song_text_field.value

    if (!artist || !song) return

    getAllData(artist, song).then((data) => {
      console.log(data)
      renderData(artist, song, data)
    })
  })
}

start()
