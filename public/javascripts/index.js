const urlForm = document.querySelector('form')
const urlResult = document.getElementById('url-result')
const inputUrl = urlForm.querySelector('[name="url"]')
const resetBtn = document.getElementById('reset')
const qrCodeCanvas = document.getElementById("qrCodeCanvas")

function copyUrl() {
  var copyText = document.getElementById("result");
  copyText.select();
  document.execCommand("copy");
}

function handleAnimationEnd(event) {
  return event.target.classList.remove('animated', 'bounceIn')
}

urlForm.addEventListener('submit', event => {

  event.preventDefault()
  urlForm.classList.add('was-validated')
  if (!inputUrl.checkValidity()) { return }
  inputUrl.classList.remove("is-invalid");
  fetch(`${window.location.href}convert/?url=${encodeURIComponent(inputUrl.value)}`)
    .then(data => data.json())
    .then(shortenedUrl => {
      if (shortenedUrl.ok) {
        console.log("shortenedUrl: " + JSON.stringify(shortenedUrl));
        const finalUrl = `${window.location.href}${shortenedUrl.url}`
        urlResult.classList.remove('d-none')
        urlResult.classList.add('animated', 'bounceIn')
        urlResult.addEventListener('animationend', handleAnimationEnd)
        urlResult.querySelector('[name="result"]').value = finalUrl
        

        // add event listener to copy button
        document.getElementById('copy-btn').addEventListener('click', copyUrl)

        // create qr code
        const settings = { ...QR_CODE_SETTINGS, data: finalUrl }
        console.log("settings: " + JSON.stringify(settings));
        const qrCode = new QRCodeStyling(settings);
        qrCode.append(qrCodeCanvas);
        qrCodeCanvas.onclick = event => {
          qrCode.download({ name: "url-shortener", extension: "png" });
        }
      } else {
        console.log("BAD request!");
        inputUrl.classList.add("is-invalid");
      }
    })
})

resetBtn.addEventListener('click', event => {
  // clear user input column
  inputUrl.value = ''
  // clear url result column
  urlResult.querySelector('[name="result"]').value = ''
  // reset the form
  urlResult.classList.add('d-none')
  urlForm.classList.remove('was-validated')
  // add animation to input 
  inputUrl.classList.add('animated', 'bounceIn')
  inputUrl.addEventListener('animationend', handleAnimationEnd)
})

