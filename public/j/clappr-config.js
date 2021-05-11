const playerElement = document.getElementById("player-wrapper")

const plugins = Object.values(ClapprPlugins.Plugins)

player = new Clappr.Player({
  source: urlParams.src || 'http://clappr.io/highline.mp4',
  poster: urlParams.poster || 'http://clappr.io/poster.png',
  mute: true,
  height: 360,
  width: 640,
  plugins: plugins,
  watermark: {
    url: 'https://v-clappr-player.netlify.app/logo.svg',
    link: 'https://v-clappr-player.netlify.app',
    opacity: 0.8,
    behavior: 'discrete',
    nudge: {
      y: 5,
      x: -24
    }
  }
})

player.attachTo(playerElement)
