var dnt = (navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack);
var doNotTrack = (dnt == "1" || dnt == "yes");
if (!doNotTrack) {
	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date());
	gtag('config', '{{ .Site.GoogleAnalytics }}', { 'anonymize_ip': false });
}

const toggle = document.getElementById('toggle');
const codeBlock = document.getElementById('codeBlock');
const code = document.getElementById('code');
const copyButton = document.getElementById('copy-img');
const getStartedButton = document.getElementById('get-started-button')

function getStarted() {
  codeBlock.classList.remove('copied');
  toggle.classList.remove('hide');
  toggle.classList.add('show');

  code.innerText = "docker run -d -p 8000:80 -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/mshogren/container-minecraft-app:latest";
}

function copyAndHide() {
  const textToCopy = code.textContent.trim();
  navigator.clipboard.writeText(textToCopy);
  code.innerText = "Copied!"

  codeBlock.classList.add('copied');
  toggle.classList.remove('show');
  toggle.classList.add('hide');
}

document.addEventListener('DOMContentLoaded', function () {
  if (copyButton) copyButton.addEventListener('click', copyAndHide);
  if (getStartedButton) getStartedButton.addEventListener('click', getStarted);
});
