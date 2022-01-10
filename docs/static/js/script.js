const toggle = document.getElementById('toggle');
const codeBlock = document.getElementById('codeBlock');
const code = document.getElementById('code');

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
