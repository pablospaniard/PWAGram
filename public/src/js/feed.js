var shareImageButton = document.querySelector('#share-image-button')
var createPostArea = document.querySelector('#create-post')
var closeCreatePostModalButton = document.querySelector(
  '#close-create-post-modal-btn'
)
var sharedMomentsArea = document.querySelector('#shared-moments')

function openCreatePostModal() {
  createPostArea.style.display = 'block'
  deferredPrompt.prompt()
  deferredPrompt.userChoice.then(choiceResult => {
    console.log(choiceResult.outcome)
    if (choiceResult.outcome === 'dismissed') {
      console.log('user cancelled instalation')
    } else {
      console.log('app added')
    }
  })
  deferredPrompt = null
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none'
}

shareImageButton.addEventListener('click', openCreatePostModal)

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal)

function createCard() {
  var cardWrapper = document.createElement('div')
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp'
  var cardTitle = document.createElement('div')
  cardTitle.className = 'mdl-card__title'
  cardTitle.style.backgroundImage = 'url("/src/images/sf-boat.jpg")'
  cardTitle.style.backgroundSize = 'cover'
  cardTitle.style.height = '180px'
  cardWrapper.appendChild(cardTitle)
  var cardTitleTextElement = document.createElement('h2')
  cardTitleTextElement.className = 'mdl-card__title-text'
  cardTitleTextElement.textContent = 'San Francisco Trip'
  cardTitle.appendChild(cardTitleTextElement)
  var cardSupportingText = document.createElement('div')
  cardTitleTextElement.style.color = 'white'
  cardSupportingText.className = 'mdl-card__supporting-text'
  cardSupportingText.textContent = 'In San Francisco'
  cardSupportingText.style.textAlign = 'center'
  cardWrapper.appendChild(cardSupportingText)
  componentHandler.upgradeElement(cardWrapper)
  sharedMomentsArea.appendChild(cardWrapper)
}

fetch('https://httpbin.org/get')
  .then(function(res) {
    return res.json()
  })
  .then(function(data) {
    createCard()
  })
