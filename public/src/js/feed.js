var shareImageButton = document.querySelector('#share-image-button')
var createPostArea = document.querySelector('#create-post')
var closeCreatePostModalButton = document.querySelector(
  '#close-create-post-modal-btn'
)

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
