import { MDCRipple } from '@material/ripple'
import { MDCTextField } from '@material/textfield'
// import { MDCLinearProgress } from '@material/linear-progress'

const textFields = document.querySelectorAll('.mdc-text-field')
const buttonElement = document.querySelector('.mdc-button')
// const linearProgressElement = document.querySelector('.mdc-linear-progress')

const card_1 = document
  .querySelector('.search__card--1')
  .querySelector('.search__wrapper')
const card_2 = document
  .querySelector('.search__card--2')
  .querySelector('.search__wrapper')

let flag

// const linearProgressInstance = new MDCLinearProgress(linearProgressElement)
const buttonInstance = new MDCRipple(buttonElement)
const artist_text_field = new MDCTextField(textFields[0])
const song_text_field = new MDCTextField(textFields[1])

function activeSpinner(el) {
  const markup = `<div class="spinner__container">
                    <i class="fas fa-circle-notch spinner-active"></i>
                  </div>`

  el.innerHTML = ''

  el.insertAdjacentHTML('beforeend', markup)
}

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

function resolveImage(user_data, images) {
  let markup_success
  let markup_error = `
      <div class="search__error">

            <i class="fas fa-times"></i>
            <span class="search__error--message">Imagem de artista não encontrada!</span>

      </div>
  `

  if (images) {
    const index = Math.floor(Math.random() * images.length)

    const image = images[index]

    markup_success = `<picture class="search__picture">
                      <img
                        class="search__image"
                        src="${image}"
                        alt="avatar placeholder"
                      />
                    </picture>

                    <span class="search__artist">${user_data.artist.toUpperCase()}</span>
                    <span class="search__song">${user_data.song.toUpperCase()}</span>
                  `
  }

  card_1.innerHTML = ''

  card_1.insertAdjacentHTML('beforeend', images ? markup_success : markup_error)

  toggleSearchButton()
}

function resolveLyrics(lyrics) {
  const markup_success = `
      <span class="search__lyrics">${lyrics}</span>
    `

  const markup_error = `
      <div class="search__error">
          <i class="fas fa-times"></i>
          <span class="search__error--message">Letra de música não encontrada!</span>
      </div>
  `
  card_2.innerHTML = ''

  card_2.insertAdjacentHTML('beforeend', lyrics ? markup_success : markup_error)

  toggleSearchButton()
}

function toggleSearchButton() {
  flag = flag + 1

  if (flag == 2) buttonElement.disabled = false
}

function waitForDataAnimation() {
  activeSpinner(card_1)
  activeSpinner(card_2)
}

function clearInputsAndDisableButton() {
  artist_text_field.value = song_text_field.value = ''
  buttonElement.disabled = true
}

async function fetchImage(user_data) {
  const image_api = 'https://imsea.herokuapp.com/api/1?q='

  const image_url = image_api + user_data.artist

  let images

  await fetchData(image_url).then((data) => {
    if (!data) return

    if (data.results.length < 1) return

    images = data.results
  })

  return images
}

async function fetchLyrics(user_data) {
  const lyric_api = 'https://api.lyrics.ovh/v1/'

  const lyric_url = lyric_api + user_data.artist + '/' + user_data.song

  let lyrics

  await fetchData(lyric_url).then((data) => {
    if (data) {
      lyrics = data.lyrics
    }
  })

  return lyrics
}

function newSearch() {
  const artist = artist_text_field.value
  const song = song_text_field.value

  if (!artist || !song) return

  flag = 0

  clearInputsAndDisableButton()

  waitForDataAnimation()

  const user_data = { artist: artist, song: song }

  fetchImage(user_data).then((data) => {
    resolveImage(user_data, data)
  })

  fetchLyrics(user_data).then((data) => {
    resolveLyrics(data)
  })
}

function start() {
  textFields.forEach((field) => {
    field.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') newSearch()

      textFields.forEach((field) => {
        field.blur()
      })
    })
  })
  buttonElement.addEventListener('click', newSearch)
}

start()
