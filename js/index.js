var gap = Number(getComputedStyle(document.documentElement)
   .getPropertyValue('--my-variable-name').replace("vw", ""))
var lastScrollTop = 0;

const header = document.querySelector("header")
const footer = document.querySelector("footer")

document.querySelectorAll(".gallery-item.img").forEach((el) => {
   el.addEventListener("click", function (ev) {
      console.log("BAJS")
      scrolling.killListeners
      var galPress = document.getElementById("gallery-presentation")
      document.querySelectorAll(".gallery-img-pres").forEach(el => {
         el.style.display = "none"
      })
      $(galPress).css("display", "flex").fadeIn()
      $("img[gallery=" + el.getAttribute("gallery") + "]").fadeIn()
   })
})
document.getElementById("gallery-presentation").addEventListener('click', function (e) {
   scrolling.startListeners
   $("#gallery-presentation").fadeOut()
})
window.addEventListener('click',console.log,)
class animation {
   static elementList = []
   constructor(element, options, ms = 500, settings) {
      this.element = element
      this._ms = ms
      this._time
      this._progress = 0
      this._ratio = settings.ratio || 1
      this._timeing = settings.timeingfunction || 0
      this._delay = settings.delay || 0
      this._options = options
      this._elapsed = 0
      this.timestamp
      this._state
      this.isPlaying = false
      this.endAnimation = true
      this.aniState = {}
      this.request = null
      this.pauseTime
      this.resumeTime

   }
   get ms() {
      return this._ms
   }
   set ms(x) {
      this._ms = x
   }
   get time() {
      return this._time
   }
   get progress() {
      return this._progress
   }
   get ratio() {
      return this._ratio
   }
   get timeing() {
      return this._timeing
   }
   get options() {
      return this._options
   }
   get elapsed() {
      return this._elapsed
   }
   get delay() {
      return this._delay
   }
   set delay(x) {
      this._delay = x
      this.ms = this._ms + x
   }
   get state() {
      return this._state
   }
   set state(x) {
      this._state = x
   }
   set elapsed(x) {
      this._elapsed = x
   }
   set time(x) {
      this._time = x
   }
   set progress(x) {
      this._progress = x
   }
   set ratio(x) {
      this._ratio = x
   }
   set timeing(x) {
      this._timeing = x
   }
   set options(x) {
      this._options = x
   }

   timeingFunction() {
      var curve

      switch (this.timeing) {
         case 0:
            curve = (0.5 * Math.cos((Math.PI * this.progress) - Math.PI)) + 0.5
            break;
         case 1:
            curve = Math.sin(0.5 * Math.PI * this.progress)
            break;
         case 2:
            curve = Math.pow(this.progress, 2)
            break;
         default:
            curve = x
            break;
      }
      let out = Math.pow(curve, this.ratio)
      return out
   }

   propSplit(string) {
      return string.toString().split(/(-?(?=\d)+\d+\.?(?=\d)?\d*)/g).filter(e => e.length > 0).map((e) => {
         if (Number(e) || Number(e) == 0) {
            return Number(e)
         } else {
            return e
         }
      })
   }
   pause() {

      window.cancelAnimationFrame(this.request)
   }
   stop() {
      for (let p in this.aniState) {
         this.element.style[p] = this.aniState[p].to.join("")
      }
      window.cancelAnimationFrame()
   }

   getOptions() {
      if (this.options.hasOwnProperty("from")) {
         for (let p in this.options.to) {
            if (!this.aniState.hasOwnProperty(p)) {
               this.aniState[p] = {}
            }
            if (!this.options.from.hasOwnProperty(p)) {
               this.aniState[p].from = this.propSplit(window.getComputedStyle(this.element)[p])
            } else {
               this.aniState[p].from = this.propSplit(this.options.from[p])
            }

            this.aniState[p].to = this.propSplit(this.options.to[p])
         }
      } else {
         for (let p in this.options) {
            if (!this.aniState.hasOwnProperty(p)) {
               this.aniState[p] = {}
            }
            this.aniState[p].from = this.propSplit(window.getComputedStyle(this.element)[p])
            this.aniState[p].to = this.propSplit(this.options[p])
         }
      }

      for (let prop in this.aniState) {
         let len = this.aniState[prop].from.map((e, i) => {
            if (Number(e) || Number(e) == 0) {
               return Number(this.aniState[prop].to[i] - this.aniState[prop].from[i])
            } else return e
         })


         this.aniState[prop].len = len
      }
   }
   play() {
      if (!this.isPlaying) {
         this.endAnimation = false
         this.isPlaying = true
         this.getOptions()
         this.request = window.requestAnimationFrame(this.loop.bind(this))
      }

   }
   loop(timestamp) {
      if (!this.time) {
         this.time = timestamp
      }

      var done = []
      this.timestamp = timestamp
      this.elapsed = this.timestamp - this.time

      if (this.elapsed < this.delay && this.isPlaying && !this.endAnimation) {
         this.request = window.requestAnimationFrame(this.loop.bind(this))
      }
      this.progress = Math.min((this.elapsed - this.delay) / (this.ms - this.delay), 1)

      for (let prop in this.aniState) {
         var p = prop
         let out = [...this.aniState[prop].len]

         out = out.map((e, i) => {
            if (Number(e) || Number(e) == 0) {
               var n
               if (this.aniState[prop].to[i] < this.aniState[prop].from[i]) {
                  n = Math.max(this.aniState[prop].from[i] + e * this.timeingFunction(this.progress), this.aniState[prop].to[i])
               } else {
                  n = Math.min(this.aniState[prop].from[i] + e * this.timeingFunction(this.progress), this.aniState[prop].to[i])
               }

               done.push(n == this.aniState[prop].to[i])
               return n
            } else {
               return e
            }

         })
         this.element.style[prop] = out.join("")
         this.aniState[prop].state = out
      }
      if ((done.every(e => e == true) || done.length == 0) && this.progress == 1 && this.elapsed >= this.ms) {
         window.cancelAnimationFrame(this.request)
         this.endAnimation = true
         this.isPlaying = false
         this.timestamp = 0
         this.time = 0
         this.elapsed = 0;
         this.progress = 0
         this.aniState = {}
      } else {


         this.request = window.requestAnimationFrame(this.loop.bind(this))

      }

   }




}

class b {
   constructor() {
      doc.scrollTo({
         top: 0,
         behavior: "instant"
      })
      this.eventStart = false;
      this.running = false
      this.eventDone = false
      this._count = 0
      this.n = 1
      this.dir
      this.wrapper = document.getElementById("grid-wrapper")
      this.section = document.querySelectorAll("header, section, footer")
      this.touchReady = false
      this.scrollLen
      this.section.forEach(e => {
         Object.defineProperties(e, {
            height: {
               get: function () {
                  let h = this.getBoundingClientRect().height
                  return h
               },
               configurable: true
            },
            top: {
               get: function () {
                  let h = this.getBoundingClientRect().top
                  return h
               },
               configurable: true
            },
            bottom: {
               get: function () {
                  let t = window.innerHeight - (this.top + this.height)
                  return t
               },
               configurable: true
            },
            y: {
               get: function () {
                  let h = this.getBoundingClientRect().y
                  return h
               },
               configurable: true
            },
            view: {
               get: () => {
                  console.log(e)
                  doc.scrollBy({

                     top: e.top - e.offset.top,
                     behavior: "smooth"
                  })
                  this.current = e



               }
            },
            tag: {
               get: function () {
                  return this.tagName.toLowerCase()
               }

            },
            overflow: {
               get: () => {
                  var offset
                  if (this.current.tag == "header" || this.current.tag == "footer") {
                     offset = 0
                  } else {
                     offset = 200
                  }
                  return (e.height + offset > window.innerHeight)
               }
            },
            offsetGap: {
               get: () => {
                  var offset
                  if (this.current.tag == "header" || this.current.tag == "footer") {
                     offset = 0
                     var out = 0
                  } else {
                     offset = this.offset.bottom + this.offset.top
                     var out = window.innerHeight - (this.current.height + this.offset.top + this.offset.bottom)
                  }
                  let offsetGap = {
                     height: this.current.height,
                     win: window.innerHeight,
                     offTop: this.offset.top,

                  }



               }

            },
            offset: {
               get: () => {
                  let spaceLeft = window.innerHeight - this.current.height
                  let offsetTop = (spaceLeft / 2) * 0.9
                  let offsetBottom = (spaceLeft / 2) * 1.1
                  return {
                     top: offsetTop,
                     bottom: offsetBottom,
                     gap: window.innerHeight - (this.current.height)
                  }

               }
            },
            wrapper: {
               get: function () {
                  try {
                     return this.querySelector(".section-wrapper")
                  } catch {

                  }

               }
            }
         })

      })
      this.current = this.section[0]
      doc.onwheel = this.wheelHandler.bind(this)
      doc.ontouchstart = this.touchHandler.bind(this)
      doc.ontouchmove = this.touchHandler.bind(this)
      doc.ontouchend = this.touchHandler.bind(this)
      window.onkeydown = this.keyHandler.bind(this)
   }
   get killListeners() {
      doc.onwheel = null
      doc.ontouchstart = null
      doc.ontouchmove = null
      doc.ontouchend = null
      window.onkeydown = null

   }
   get startListeners() {
      doc.onwheel = this.wheelHandler.bind(this)
      doc.ontouchstart = this.touchHandler.bind(this)
      doc.ontouchmove = this.touchHandler.bind(this)
      doc.ontouchend = this.touchHandler.bind(this)
      window.onkeydown = this.keyHandler.bind(this)

   }
   get offset() {
      var offsetBottom, offsetTop
      var max = Math.min(window.innerHeight / 2, 400)
      if (this.current.overflow) {
         offsetBottom = Math.min(window.innerHeight / 9, 200)
         offsetTop = Math.min(window.innerHeight / 10, 100)
      } else {
         offsetBottom = this.current.offset.bottom - 1
         offsetTop = this.current.offset.top - 1
      }


      return {
         top: offsetTop,
         bottom: offsetBottom,
         max: max
      }
   }
   get count() {
      return this._count
   }
   set count(x) {
      this._count = x
   }
   get nextSection() {
      var next
      if (this.dir > 0) {
         next = $(this.current).next().length > 0 ? $(this.current).next()[0] : this.current
      } else {
         next = $(this.current).prev().length > 0 ? $(this.current).prev()[0] : this.current
      }
      return next
   }
   get prevSection() {
      var prev
      if (this.dir > 0) {
         prev = $(this.current).prev().length > 0 ? $(this.current).prev()[0] : this.current
      } else {
         prev = $(this.current).next().length > 0 ? $(this.current).next()[0] : this.current
      }
      return prev
   }
   scrollById(idSelector) {
      this.section.forEach((e, i) => {
         if (e.getAttribute("id") == idSelector) {
            this.current = e
            this.scrollEvent()
         }
      })
   }
   async wheelHandler(e) {
      e.preventDefault();
      this.dir = -e.wheelDeltaY / Math.abs(e.wheelDeltaY)
      if (this.running || this.count == Infinity) {
         return
      }


      if (this.count < Infinity && this.count > 99) {

         setTimeout(() => {

            this.preCount = this.count

         }, 50)

         if (this.preCount != this.count) {
            return
         } else {
            this.preCount = 0
            this.count = 0
         }
      }


      if (!this.eventStart && !this.running && this.current.overflow && this.count == 0) {
         this.partScroll()


      } else {
         this.eventStart = true
      }
      this.sCounter(e)
      if (this.eventStart && Math.abs(this.count) != 3) {
         this.currentTime = new Date().getTime()
         if (!this.startTime) {
            this.startTime = this.currentTime
         }
         if (this.currentTime - this.startTime > 200 && this.count < 3) {
            this.startTime = null
            this.count = 0
         }

      } else if (this.eventStart && Math.abs(this.count) == 3) {
         this.current = this.nextSection
         this.eventStart = false
         this.startTime = 0

         if (!this.running) {
            this.count = Infinity

            this.scrollEvent()

         }

      }


   }
   async partScroll() {
      let overflow = this.current.bottom < 0
      if ((this.current.tag != "footer" && this.current.tag != "header" && this.current.overflow)) {
         if ((this.current.bottom < this.offset.bottom - 1 && this.dir > 0) || (this.current.top < this.offset.top - 1 && this.dir <
               0)) {
            this.count = Infinity
            var running = await this.pageScroll()


         } else {
            this.eventStart = true
         }
      }

   }
   async keyHandler(e) {
      e.preventDefault()
      if (this.running) {
         return
      }
      /*Up*/
      if (e.keyCode == 38 && !this.running) {
         this.dir = -1

         if ((this.current.overflow && this.current.top < this.offset.top) && !this.eventStart) {
            await this.partScroll()
         } else {
            this.eventStart = true
            this.current = this.nextSection
            await this.scrollEvent()
            this.eventStart = false
         }


      }
      /*Down*/
      if (e.keyCode == 40 && !this.running) {
         this.dir = 1
         if ((this.current.overflow && this.current.bottom < this.offset.bottom) && !this.eventStart) {
            await this.partScroll()
         } else {
            this.current = this.nextSection

            await this.scrollEvent()
         }
      }
   }
   async touchHandler(e) {
      if (this.running) {
         return
      }

      if (e.type == "touchstart") {
         if (!this.isScrolling && !this.eventStart) {
            this.scrollLen = 0;
            this.scrollMax = 0
            this.isScrolling = true;
            this.posYStart = e.touches[0].clientY
         }
      }
      if (e.type == "touchmove") {

         if (this.isScrolling && !this.running) {
            if (!this.posY) {
               this.posY = this.posYStart
            }
            this.dir = ((this.posYStart - e.touches[0].clientY)) / Math.abs((this.posYStart - e.touches[0]
               .clientY))
            this.scrollLen = Math.abs(this.posYStart - e.touches[0].clientY)
            this.scrollMax = Math.max(this.scrollMax, this.scrollLen)

            if (this.dir > 0) {
               if ((this.nextSection.top < window.innerHeight / 2 || this.current.bottom > this.offset.bottom) && this.scrollLen >
                  200 && (this.scrollMax - this.scrollLen < 75)) {
                  this.touchReady = true
                  $(document.querySelector(".touch-block")).removeClass("up").addClass("down").fadeIn()
               } else {
                  this.touchReady = false
                  $(document.querySelector(".touch-block")).fadeOut("fast")
               }
            } else {
               if ((this.current.top > window.innerHeight / 2 || this.nextSection.bottom < window.innerHeight -
                     100) && this.scrollLen > 200 && (this.scrollMax - this.scrollLen < 75)) {
                  this.touchReady = true
                  $(document.querySelector(".touch-block")).removeClass("down").addClass("up").fadeIn()
               } else {
                  this.touchReady = false
                  $(document.querySelector(".touch-block")).fadeOut("fast")
               }
            }
            let defaltscroll = (this.posY - e.touches[0].clientY)
            if (this.touchReady) {
               defaltscroll = defaltscroll / 2
               this.eventStart = true
            } else {
               this.eventStart = false
            }
            this.scr


            doc.scrollBy({
               top: defaltscroll
            })

            this.posY = e.touches[0].clientY
         }
      }

      if (e.type == "touchend") {
         $(document.querySelector(".touch-block")).fadeOut("fast")
         if (!this.running) {
            if (this.eventStart) {
               this.isScrolling = false
               this.current = this.nextSection
               this.eventStart = false
               await this.scrollEvent()
            } else if (!this.current.overflow && this.isScrolling) {
               this.current.view
            } else if (this.current.overflow) {
               if (this.current.bottom >= this.offset.bottom) {
                  doc.scrollBy({
                     top: this.offset.bottom - this.current.bottom,
                     behavior: "smooth"
                  })
               }
               if (this.current.top >= this.offset.top) {
                  doc.scrollBy({
                     top: this.current.top - this.offset.top,
                     behavior: "smooth"
                  })
               }
            }
         }

         this.posYStart = null
         this.posY = null
         this.touchYinit = null
         this.posY = null;
         this.isScrolling = false
      }

   }

   async scrollEvent(looping) {
      if (!this.running) {
         var scrollDone
         var sEvent = new Promise(async (res) => {

            var scrollLoop = () => {
               var done = false
               if (!this.running) {
                  if (this.prevSection.tag != "header" && this.prevSection.tag != "footer") {}
                  this.running = true
                  if (this.current.tag == "header") {
                     doc.scrollTo({
                        top: 0,
                        behavior: "smooth"
                     })
                  } else if (this.current.tag == "footer") {
                     doc.scrollTo({
                        top: this.wrapper.offsetHeight - (window.innerHeight - this.current
                           .offsetHeight),
                        behavior: "smooth"
                     })
                  } else {
                     doc.scrollBy({
                        top: this.current.top - this.offset.top,
                        behavior: "smooth"
                     })
                  }


               }
               done = Math.abs(this.current.top) < this.offset.top + 1 || (this.current.tag ==
                  "footer" && this.wrapper
                  .offsetHeight - (window.innerHeight - this.current.height)) || (this.current.tag ==
                  "header" && this.current.top < 1)


               if (done) {
                  this.ani = window.requestAnimationFrame(res)
               } else {
                  setTimeout(scrollLoop, 25)
               }


            }
            scrollLoop()

         }).then(() => {
            doc.onwheel = this.wheelHandler.bind(this)
            setTimeout(() => {
               this.count = 100
               this.running = false
            }, 200)
         })
      }
   }

   async pageScroll() {
      if (!this.running) {
         var pScroll = new Promise(res => {
            var pageLoop = () => {
               if (!this.running) {
                  this.running = true
                  var max = Math.min(window.innerHeight / 3, 400)
                  var offset = max / 3

                  this.pageScrollStart = this.current.bottom

                  if (this.dir > 0) {
                     this.pageLen = this.current.bottom < (this.offset.bottom - this.offset.max) ? this.offset.max : this.offset.bottom - this.current.bottom
                     if (this.current.bottom >= this.offset.bottom) {
                        res(true)
                     }
                  }
                  if (this.dir < 0) {
                     this.pageLen = this.current.top < (this.offset.top - this.offset.max) ? this.offset.max : this.offset.top - this.current.top
                     if (this.current.top >= this.offset.top) {
                        res(true)
                     }
                  }
                  if (Math.abs(this.pageLen) < 1) {
                     res(true)
                  }

                  doc.scrollBy({
                     top: this.pageLen * this.dir,
                     behavior: "smooth"
                  })
               }

               var pageScrollDone = false
               if (this.dir > 0) {
                  pageScrollDone =
                     Math.abs((this.current.bottom - this.pageScrollStart)) - this.pageLen < 1 || this.current
                     .bottom > 49
               } else {
                  pageScrollDone = Math.abs((this.current.bottom - this.pageScrollStart)) - this.pageLen < 1 ||
                     this.current.top > 100


               }
               if (pageScrollDone) {
                  this.ani = window.requestAnimationFrame(res)
               } else {
                  setTimeout(pageLoop, 25)
               }

            }
            pageLoop()



         }).then(() => {
            doc.onwheel = this.wheelHandler.bind(this)
            setTimeout(() => {
               this.count = 100
               this.running = false
            }, 200)

         })
      }
   }

   async sCounter(e) {
      let sCount = new Promise(res => {
         this.dirChange = (-1 * (e.wheelDeltaY / Math.abs(e.wheelDeltaY)) == this.n * -1)
         this.n = -1 * (e.wheelDeltaY / Math.abs(e.wheelDeltaY))
         this.count += this.n
         res(this.dirChange)

      })

      return sCount
   }

}

class GalleryCarousel {
   constructor(element) {
      this.wrapper = document.querySelector(".gallery-wrapper")

      this.galleryImgCont = document.querySelector(".gallery-container.gallery-img")
      this.galleryTxtCont = document.querySelector(".gallery-container.gallery-text")
      this.galleryItems = {
         img: this.galleryImgCont.querySelectorAll(".gallery-item"),
         txt: this.galleryTxtCont.querySelectorAll(".gallery-item"),
         dot: this.wrapper.querySelectorAll(".gallery-dot"),
         len: this.galleryImgCont.querySelectorAll(".gallery-item").length
      }
      this.currentIndex = 0
      this.res = {
         in: () => {},
         out: () => {},
         next: () => {},
         prev: () => {},
         goto: () => {},
         play: () => {},
      }
      this.speed = 800
      this.galleryItems.dot.forEach((e, i) => {
         e.addEventListener("click", async () => {
            this.cancel
            this.goTo(i)
         })
      })

      this.wrapper.querySelector(".svg-arrow-right").addEventListener('click', async () => {
         clearTimeout(this.timeout)
         this.cancel
         this.next()
         this.timeout = setTimeout(this.play.bind(this))
      })

      this.wrapper.querySelector(".svg-arrow-left").addEventListener('click', async () => {
         clearTimeout(this.timeout)
         this.cancel
         this.prev()
         this.timeout = setTimeout(this.play.bind(this))
      })


      this.play()
      document.querySelector(".gallery-container.gallery-img").addEventListener("click",()=>{
         scrolling.killListeners
         var galPress = document.getElementById("gallery-presentation")
         document.querySelectorAll(".gallery-img-pres").forEach(el => {
            el.style.display = "none"
         })
         $(galPress).css("display", "flex").fadeIn()
         $("img[gallery=item-" + (this.index+1) + "]").fadeIn()
      })

   }
   get index() {
      return this.currentIndex
   }
   set index(x) {
      this.currentIndex = x
   }
   get nextIndex() {
      return (this.index + 2) > this.galleryItems.len ? 0 : this.index + 1
   }
   get prevIndex() {
      return (this.index - 1) < 0 ? (this.galleryItems.len - 1) : this.index - 1
   }
   get cancel() {
      this.res.in()
      this.res.out()
   }
   async fadeOut(index) {
      this.isPlaying = true
      var imgRes
      var txtRes
      return new Promise(async (res) => {
         this.res.out = res
         this.galleryItems.dot[index].classList.remove("active")
         var txtOut = new Promise(res => {
            txtRes = res
            $(this.galleryItems.txt[index]).animate({
               left: "125%",
               opacity: 0.5,
            }, this.speed, () => {
               $(this.galleryItems.txt[index]).css("z-index", "-1").css("opacity", "0").css(
                  "left", "-125%").hide()
               res()
            })
         })
         var imgOut = new Promise(res => {
            imgRes = res
            $(this.galleryItems.img[index]).animate({
               top: "125%",
               opacity: 0.0,
            }, this.speed, () => {
               $(this.galleryItems.img[index]).css("z-index", "-1").css("opacity", "0").css(
                  "top", "-125%").hide()
               res()
            })
         })
         await Promise.all([txtOut, imgOut]).then(() => {
            imgRes()
            txtRes()
            res()
         })
      })
   }
   async fadeIn(index) {
      var imgRes
      var txtRes
      this.isPlaying = true
      return new Promise(async (res) => {
         this.res.in = res
         this.galleryItems.dot[index].classList.add("active")
         this.index = index
         var txtIn = new Promise(res => {
            txtRes = res

            $(this.galleryItems.txt[index]).show().animate({
               left: "0%",
               opacity: 1,
            }, this.speed, () => {
               res()
            })
         })
         var imgIn = new Promise(res => {
            imgRes = res
            $(this.galleryItems.img[index]).show().animate({
               top: "0%",
               opacity: 1,
            }, this.speed, () => {
               res()
            })
         })
         await Promise.all([txtIn, imgIn]).then(() => {
            imgRes()
            txtRes()
            res()
         })
      })
   }
   async next() {
      if (!this.isPlaying) {
         clearTimeout(this.timeout)
         Promise.all([this.fadeOut(this.index), this.fadeIn(this.nextIndex)]).then(() => {
            this.isPlaying = false
         })
         this.timeout = setTimeout(this.play.bind(this), this.speed * 6)
      }
   }
   async prev() {
      if (!this.isPlaying) {
         clearTimeout(this.timeout)
         Promise.all([this.fadeOut(this.index), this.fadeIn(this.prevIndex)]).then(() => {
            this.isPlaying = false
         })
         this.timeout = setTimeout(this.play.bind(this), this.speed * 6)
      }
   }
   async goTo(index) {
      if (!this.isPlaying) {
         clearTimeout(this.timeout)
         Promise.all([this.fadeOut(this.index), this.fadeIn(index)]).then(() => {
            this.isPlaying = false
         })
         this.timeout = setTimeout(this.play.bind(this), this.speed * 6)
      }

   }
   async play() {
      if (!this.isPlaying) {
         clearTimeout(this.timeout)
         this.next()
         this.timeout = setTimeout(this.play.bind(this), this.speed * 6)
      }
   }
}
const gallery = new GalleryCarousel(document.querySelector(".gallery-wrapper"))

var scrolling = new b()
var introPic = document.querySelectorAll(".intro-pic")
document.querySelectorAll(".intro-pic").forEach((e, i) => {
   var n = i
   e.addEventListener("pointerdown", (ev) => {
      introPic.forEach((elem) => {
         elem.classList.remove("show")
      })
      ev.target.classList.add("show")
      $(".intro.content-wrapper").removeClass("show").addClass("hidden")
      $(".intro.content-wrapper").each((i, e) => {
         if (i == n) {
            $(e).removeClass("hidden").addClass("show")
         }
      })
   })

})
const portPres = document.querySelector(".portfolio-presentation")
portPres.addEventListener("click", function (ev) {

   if (ev.target.classList.contains("portfolio-arrow")) {
      return
   }
   $(portPres).fadeOut()
   scrolling.startListeners
})
var currentPortItem = 0
document.querySelector(".prev-portfolio-item").addEventListener('click', function (e) {
   currentPortItem = Number(currentPortItem) < 2 ? 4 : Number(currentPortItem) - 1
   document.querySelectorAll(".portfolio-item").forEach((e, i) => {
      if (e.classList.contains("item" + currentPortItem)) {
         $(e).css("left", "-150%").css("opacity", "0").show().animate({
            left: "0%",
            opacity: "1"
         })
      } else {
         $(e).hide()
      }

   })
})
document.querySelector(".next-portfolio-item").addEventListener('click', function (e) {
   currentPortItem = Number(currentPortItem) > 3 ? 1 : Number(currentPortItem) + 1

   document.querySelectorAll(".portfolio-item").forEach((e, i) => {
      if (e.classList.contains("item" + currentPortItem)) {
         $(e).css("left", "150%").css("opacity", "0").show().animate({
            left: "0%",
            opacity: "1"
         })
      } else {
         $(e).hide()
      }

   })
})
document.querySelectorAll(".thumb.portfolio-thumb").forEach((el, i) => {
   var n = el.getAttribute("portfolio")
   el.addEventListener("click", function (e) {
      $(portPres).css("display", "grid").fadeIn()
      document.querySelectorAll(".portfolio-item").forEach((e, i) => {
         if (e.classList.contains("item" + n)) {

            currentPortItem = Number(n)
            $(e).fadeIn()
         } else {
            $(e).fadeOut()
         }
      })

      scrolling.killListeners
   })
})
document.querySelectorAll(".nav-link:not(.test)").forEach((el) => {
   el.addEventListener("click", async (e) => {
      e.preventDefault()
      let href = $(el).attr("href").replace(/#/g, "")
      scrolling.scrollById(href)
      svgdrag.close()
   })

})




/* const Scrolling = new scrollHandler() */