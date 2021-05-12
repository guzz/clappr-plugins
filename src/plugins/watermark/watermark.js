// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { Events, UIContainerPlugin, template } from '@guzzj/clappr-core'

import watermarkHTML from './public/watermark.html'
import './public/watermark.scss'

const OPTIONS_DEFAULT = {
  position: 'bottom-right',
  opacity: 1,
  behavior: 'always-fixed', // discrete
  discreteDelay: 3000,
  discreteOpacity: 0.2,
  onControls: {
    x: 0,
    y: 48
  },
  nudge: {
    x: 0,
    y: 0
  }
}

export default class WaterMarkPlugin extends UIContainerPlugin {
  get name() { return 'watermark' }
  get supportedVersion() { return { min: CLAPPR_CORE_VERSION } }
  get template() { return template(watermarkHTML) }

  constructor(container) {
    super(container)
    this.configure()
  }

  bindEvents() {
    this.listenTo(this.container, Events.CONTAINER_PLAY, this.onPlay)
    this.listenTo(this.container, Events.CONTAINER_PAUSE, this.onPause)
    this.listenTo(this.container, Events.CONTAINER_STOP, this.onStop)
    this.listenTo(this.container, Events.CONTAINER_ENDED, this.onStop)
    this.listenTo(this.container, Events.CONTAINER_OPTIONS_CHANGE, this.configure)
    this.listenTo(this.container, Events.CONTAINER_MEDIACONTROL_HIDE, this.resetBehavior)
    this.listenTo(this.container, Events.CONTAINER_MEDIACONTROL_SHOW, this.executeBehavior)
  }

  configure() {
    const watermarkOptions = this.getOptions(this.options)
    if (watermarkOptions) {
      this.position = watermarkOptions.position
      this.imageUrl = watermarkOptions.url
      this.imageLink = watermarkOptions.link
      this.opacity = watermarkOptions.opacity
      this.behavior = watermarkOptions.behavior
      this.nudge = watermarkOptions.nudge
      this.discreteDelay = watermarkOptions.discreteDelay
      this.discreteOpacity = watermarkOptions.discreteOpacity
      this.onControls = watermarkOptions.onControls
      this.render()
    } else { this.$el.remove() }

  }

  getOptions(options) {
    if (typeof options.watermark === 'object' && options.watermark.url) {
      return Object.assign({}, OPTIONS_DEFAULT, options.watermark)
    } else if (typeof options.watermark === 'string') {
      return Object.assign(
        {},
        OPTIONS_DEFAULT,
        {
          url: options.watermark,
          link: options.watermarkLink,
          position: options.position
        }
      )
    } else {
      return null
    }
  }

  nudgeTransform(nudge) {
    const transformedNudge = { ...nudge }
    if (this.position.includes('bottom')) {
      transformedNudge.y = - transformedNudge.y
    }
    if (this.position.includes('right')) {
      transformedNudge.x = - transformedNudge.x
    }
    transformedNudge.x = transformedNudge.x || 0
    transformedNudge.y = transformedNudge.y || 0
    return transformedNudge
  }

  executeBehavior() {
    if (!this.behavior.includes('fixed')) {
      const nudge = {
        x: this.onControls.x + this.nudge.x,
        y: this.onControls.y + this.nudge.y
      }
      const transformedNudge = this.nudgeTransform(nudge)
      this.$el.find('.clappr-watermark')[0].style.transform = `translate(${transformedNudge.x}px, ${transformedNudge.y}px)`
      if (!this.behavior.includes('fixed')) {
        this.$el.find('.clappr-watermark')[0].style.zIndex = 100000
      }
    }
    if (this.behavior.includes('discrete') && this.timeout) {
      this.$el.find('.clappr-watermark')[0].style.opacity = this.opacity
      clearTimeout(this.timeout)
    }
  }
  
  resetBehavior() {
    if (!this.behavior.includes('fixed')) {
      const transformedNudge = this.nudgeTransform(this.nudge)
      this.$el.find('.clappr-watermark')[0].style.transform = `translate(${transformedNudge.x}px, ${transformedNudge.y}px)`
    }
    if (this.behavior.includes('discrete')) {
      this.timeout = setTimeout(() => {
        if (!this.paused) {
          this.$el.find('.clappr-watermark')[0].style.opacity = this.discreteOpacity
        }
      }, this.discreteDelay)
    }
  }

  onPlay() {
    this.paused = false
    if (!this.hidden)
      this.$el.show()
  }

  onPause() {
    this.paused = true
  }

  onStop() {
    console.log('stop')
    this.$el.hide()
  }

  render() {
    this.$el.hide()
    const templateOptions = {
      position: this.position,
      imageUrl: this.imageUrl,
      imageLink: this.imageLink,
      opacity: this.opacity,
      nudge: this.nudgeTransform(this.nudge)
    }
    this.$el.html(this.template(templateOptions))
    this.container.$el.append(this.$el)
    return this
  }
}
