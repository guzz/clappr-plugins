const playerElement = document.getElementById("player-wrapper")

const plugins = Object.values(ClapprPlugins.Plugins)

player = new Clappr.Player({
  source: urlParams.src || '//storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
  poster: urlParams.poster || 'http://clappr.io/poster.png',
  mute: true,
  height: 360,
  width: 640,
  plugins: [
    window.DashShakaPlayback,
    ...plugins,
  ],
  closedCaptionsConfig: {
    title: 'Subtitles', // default is none
    ariaLabel: 'Closed Captions', // Default is 'cc-button'
    labelCallback: function (track) { return track.name }, // track is an object with id, name and track properties (track is TextTrack object)
  },
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
