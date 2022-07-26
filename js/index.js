const header = document.querySelector("header")
const footer = document.querySelector("footer")
class ScrollEffect {
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
      this.reject = {
         in: () => {},
         out: () => {}
      }
      this.isRunning = [false, false]
      this.isPlaying = false
      this.speed = 800
      this.galleryItems.dot.forEach((e, i) => {
         e.addEventListener("click", async () => {
            clearTimeout(this.timeout)
            this.cancel
            this.goToIndex = i
            this.moveDot(i)
            this.goTo(this.goToIndex).then(() => {
               clearTimeout(this.timeout)
               this.timeout = setTimeout(this.play.bind(this), this.speed * 6)
            }).catch(e => {
            }).finally(() => {
               this.isPlaying = false
            })
         })
      })
      this._goToIndex = -1
      this.wrapper.querySelector(".svg-arrow-right").addEventListener('click', async () => {
         clearTimeout(this.timeout)
         this.cancel
         this.goToIndex = this.checkIndex(this.goToIndex + 1)
         this.moveDot(this.goToIndex)
         this.goTo(this.goToIndex).then(() => {
            clearTimeout(this.timeout)
            this.timeout = setTimeout(this.play.bind(this), this.speed * 6)
         }).catch(e => {
         }).finally(() => {
            this.isPlaying = false
         })

      })

      this.wrapper.querySelector(".svg-arrow-left").addEventListener('click', async () => {
         clearTimeout(this.timeout)
         this.cancel
         this.goToIndex = this.checkIndex(this.goToIndex - 1)
         this.moveDot(this.goToIndex)
         this.goTo(this.goToIndex).then(() => {
            clearTimeout(this.timeout)
            this.timeout = setTimeout(this.play.bind(this), this.speed * 6)
         }).catch(e => {
         }).finally(() => {
            this.isPlaying = false
         })

      })
      this.play()
      document.querySelector(".gallery-container.gallery-img").addEventListener("click", () => {
         
         /*      var galPress = document.getElementById("gallery-presentation")
              document.querySelectorAll(".gallery-img-pres").forEach(el => {
                 el.style.display = "none"
              })
              $(galPress).css("display", "flex").fadeIn()
              $("img[gallery=item-" + (this.index + 1) + "]").fadeIn() */
      })

   }
   get goToIndex() {
      if (this._goToIndex < 0) {
         this._goToIndex = this.index
         return this.index
      } else
         return this._goToIndex
   }
   set goToIndex(x) {
      this._goToIndex = x
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
   get cancel2() {
      this.reject.in()
      this.reject.out()
   }
   get cancel() {
      this.res.in()
      this.res.out()
      this.isPlaying = false
      clearTimeout(this.timeout)
   }
   moveDot(i, end) {

      this.galleryItems.dot.forEach(e => {
         if (e.classList.contains("active")) {
            if (end && this.index == i) {
               return
            }
            e.classList.remove("active")
         }
      })
      this.galleryItems.dot[i].classList.add("active")
   }
   async fadeOut(index) {
      var imgRes
      var txtRes
      var imgRej
      var txtRej
      return new Promise(async (res, reject) => {
         this.reject.out = reject
         if (this.isRunning.every(e => e == true)) {} else {
            this.isRunning[0] = true
         }
         this.res.out = res
         var txtOut = new Promise((res, reject) => {
            txtRes = res
            txtRej = reject
            $(this.galleryItems.txt[index]).animate({
               left: "125%",
               opacity: 0.5,
            }, this.speed, () => {
               $(this.galleryItems.txt[index]).css("z-index", "-1").css("opacity", "0").css(
                  "left", "-125%").hide()
               res("text out resolve")
            })
         }).finally(() => {
            $(this.galleryItems.txt[index]).css("z-index", "-1").css("left", "-125%").css("opacity", "0").hide()
         })
         var imgOut = new Promise((res, reject) => {
            imgRes = res
            imgRej = reject
            $(this.galleryItems.img[index]).animate({
               top: "125%",
               opacity: 0.0,
            }, this.speed, () => {
               $(this.galleryItems.img[index]).css("z-index", "-1").css("opacity", "0").css(
                  "top", "-125%").hide()
               res("img out resolve")
            })
         }).finally(() => {

            $(this.galleryItems.img[index]).css("z-index", "-1").css("top", "-125%").css("opacity", "0").hide()
         })
         await Promise.all([txtOut, imgOut]).then(() => {
            imgRes("then img out resolve")
            txtRes("then txt out resolv")
            res("fade out resolve")
         }).catch((e) => {
            reject("catch fade out reject")
         }).finally(() => {
            this.isPlaying = false
         })
      })
   }
   async fadeIn(index) {
      var imgRes
      var txtRes
      var imgRej
      var txtRej
      return new Promise(async (res, reject) => {
         this.reject.in = reject
         this.res.in = res
         var txtIn = new Promise((res, reject) => {
            txtRes = res
            txtRej = reject
            $(this.galleryItems.txt[index]).show().css("z-index", "").animate({
               left: "0%",
               opacity: 1,
            }, this.speed, () => {
               res("text in resolve")
            })
         }).catch((e) => {

            
         }).finally(() => {
            $(this.galleryItems.txt[index]).show().css("z-index", "").css("left", "0%").css("opacity", "1")
         })


         var imgIn = new Promise((res, reject) => {
            imgRes = res
            imgRej = reject
            $(this.galleryItems.img[index]).show().css("z-index", "").animate({
               top: "0%",
               opacity: 1,
            }, this.speed, () => {
               res("img in resolve")
            })
         }).catch((e) => {
            
         }).finally(() => {

            $(this.galleryItems.img[index]).show().css("z-index", "").css("top", "0%").css("opacity", "1")
         })

         await Promise.all([txtIn, imgIn]).then(() => {
            
            imgRes("then img in resolve")
            txtRes("then txt in resolv")
            res("fade in resolve")
         }).catch((e) => {
            
            
            reject("catch fade in reject")
         }).finally(() => {

            this.isRunning[1] = false
         })
      })
   }
   async next() {
      var prevIndex = this.index
      this.index = this.nextIndex
      if (!this.isPlaying) {
         this.isPlaying = true
         clearTimeout(this.timeout)
         return Promise.all([this.fadeOut(prevIndex), this.fadeIn(this.index)])
      }
   }
   async prev() {
      var prevIndex = this.index
      this.index = this.prevIndex
      if (!this.isPlaying) {
         this.isPlaying = true
         clearTimeout(this.timeout)
         return Promise.all([this.fadeOut(prevIndex), this.fadeIn(this.index)])
      }
   }
   checkIndex(x) {
      var out = x > (this.galleryItems.len - 1) ? 0 : x < 0 ? (this.galleryItems.len - 1) : x
      return out
   }
   async goTo(index) {
      if (this.index == index) {
         return
      }
      if (!this.isPlaying) {
         this.isPlaying = true;
         clearTimeout(this.timeout)

         await Promise.all([this.fadeOut(this.index), this.fadeIn(this.goToIndex)]).then(() => {
            this.isPlaying = false
            this._goToIndex = -1
            this.index = index
            this.timeout = setTimeout(this.play.bind(this), this.speed * 6)
         })
      }

   }
   async play() {
      if (!this.isPlaying) {
         clearTimeout(this.timeout)
         this.cancel
         this.goToIndex = this.checkIndex(this.goToIndex + 1)
         this.moveDot(this.goToIndex)
         this.goTo(this.goToIndex).then(() => {
            clearTimeout(this.timeout)
            this.timeout = setTimeout(this.play.bind(this), this.speed * 6)
         }).catch(e => {
            
         }).finally(() => {
            this.isPlaying = false
         })
      }
   }
}
class SwipeHandler {
   constructor(el) {

      this.element = el
      this.swipedir
      this.startX
      this.startY
      this.distX
      this.distY
      this.threshold = 150 //required min distance traveled to be considered swipe
      this.restraint = 100 // maximum distance allowed at the same time in perpendicular direction
      this.allowedTime = 300 // maximum time allowed to travel that distance
      this.elapsedTime
      this.startTime
      this.dist
      this._swipeUp = () => {}
      this._swipeDown = () => {}
      this._swipeLeft = () => {}
      this._swipeRight = () => {}
      this._swipeAll = () => {}

      this.element.addEventListener('touchstart', this.swipeStart.bind(this), false)

      this.element.addEventListener('touchmove', this.swipeMove.bind(this), false)

      this.element.addEventListener('touchend', this.swipeEnd.bind(this), false)
      return this.setSwipe.bind(this)
   }

   get swipeUp() {
      return this._swipeUp
   }
   get swipeDown() {
      return this._swipeDown
   }
   get swipeLeft() {
      return this._swipeLeft
   }
   get swipeRight() {
      return this._swipeRight
   }

   get swipeAll() {
      return this._swipeAll
   }
   set swipeUp(callback) {
      return this._swipeUp = callback.bind(this.element)
   }
   set swipeDown(callback) {
      return this._swipeDown = callback.bind(this.element)
   }
   set swipeLeft(callback) {
      return this._swipeLeft = callback.bind(this.element)
   }
   set swipeRight(callback) {
      return this._swipeRight = callback.bind(this.element)
   }
   set swipeAll(callback) {
      return this._swipeAll = callback.bind(this.element)
   }
   setSwipe(dir, callback) {
      switch (dir) {

         case "up":
            this.swipeUp = callback
            break;
         case "down":
            this.swipeDown = callback
            break;
         case "left":
            this.swipeLeft = callback
            break;
         case "right":
            this.swipeRight = callback
            break;
         case "all":
            this.swipeAll = callback
            break;
      }


   }

   swipeEvent() {
      this.element.ontouchend = this.swipeEnd.bind(this, callback)
   }
   swipeStart(e) {
      var touchobj = e.changedTouches[0]
      this.swipedir = 'none'
      this.dist = 0
      this.startX = touchobj.pageX
      this.startY = touchobj.pageY
      this.startTime = new Date().getTime() // record time when finger first makes contact with surface
   }
   swipeMove(e) {
      console.log("move")
      e.preventDefault() // prevent scrolling when inside DIV
   }
   swipeEnd(e) {
      console.log("end")
      var touchobj = e.changedTouches[0]
      this.distX = touchobj.pageX - this.startX // get horizontal dist traveled by finger while in contact with surface
      this.distY = touchobj.pageY - this.startY // get vertical dist traveled by finger while in contact with surface
      this.elapsedTime = new Date().getTime() - this.startTime // get time elapsed
      if (this.elapsedTime <= this.allowedTime) { // first condition for awipe met
         if (Math.abs(this.distX) >= this.threshold && Math.abs(this.distY) <= this.restraint) { // 2nd condition for horizontal swipe met
            this.swipedir = (this.distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
         } else if (Math.abs(this.distY) >= this.threshold && Math.abs(this.distX) <= this.restraint) { // 2nd condition for vertical swipe met
            this.swipedir = (this.distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
         }
      
      switch (this.swipedir) {
         case "up":
            this.swipeUp(e)
            console.log(this.swipedir)
            break;
         case "down":
            this.swipeDown(e)
            console.log(this.swipedir)
            break;
         case "left":
            this.swipeLeft(e)
            console.log(this.swipedir)
            break;
         case "right":
            this.swipeRight(e)
            console.log(this.swipedir)
            break;
      }this.swipeAll()
      this.dist = 0
   }
      
   }


}
class PopupView {
   static currentViews = []
   constructor(elements, containerParrent, viewId) {
      var id = viewId
      try {
         if (PopupView.currentViews.indexOf(viewId) == -1) {
            PopupView.currentViews.push(viewId)
         } else {
            id = PopupView.currentViews.length < 9 ? "NewId-" + (PopupView.currentViews.length + 1) : "NewId-0" + (PopupView.currentViews.length + 1)
            throw (new Error("NAME CONFLICT!\n" + viewId + "Allready exists, ID set to \"" + newId + "\"."))
         }
      } catch (err) {
         PopupView.currentViews.push(id)
         console.error(err)
      }
      this.id = id
      console.log(elements)
      if (elements.length) {
         if (elements[0].hasOwnProperty("element")) {
            this.el = elements.map(e => {
               return e.element
            })
         } else {
            this.el = elements
         }
      } else {
         this.el = [elements]
      }
      this.container = document.createElement("div")
      this.container.setAttribute("id", this.id)
      this.container.classList.add("popUp")
      this.section = {
         left: document.createElement("div"),
         center: document.createElement("div"),
         right: document.createElement("div"),

      }
      this.btn = {
         left: document.createElementNS('http://www.w3.org/2000/svg', "svg"),
         right: document.createElementNS('http://www.w3.org/2000/svg', "svg")
      }
      for (let dir in this.btn) {
         this.btn[dir].classList.add("svg-arrow-" + dir,"noClose")
         this.btn[dir].setAttribute("viewBox", "0 0 70 50")
         let g = document.createElementNS("http://www.w3.org/2000/svg", "g")
         g.classList.add("svgArrow", dir)
         let arrow = [document.createElementNS('http://www.w3.org/2000/svg', "path"), document.createElementNS('http://www.w3.org/2000/svg', "path")]
         arrow.forEach(e => {
            e.classList.add("arrow-btn")
            g.appendChild(e)
         })
         let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect")
         rect.setAttribute("width", "70")
         rect.setAttribute("height", "50")
         g.appendChild(rect)
         this.btn[dir].appendChild(g)
         if(dir=="left"){
            this.btn[dir].addEventListener('click', (e)=>{this.getPrev}, false)
         }
         if(dir=="right"){
            this.btn[dir].addEventListener('click', (e)=>{this.getNext}, false)
         }
      }





      this.items = []
      for (let el of elements) {
         var element, src, rub, text
         var textCont = document.createElement("div")
         var imgCont = document.createElement("div")
         var content = document.createElement("div")
         content.classList.add("popup-content")
         textCont.classList.add("popup-text")
         imgCont.classList.add("popup-img")
         if (el.hasOwnProperty("src") && el.hasOwnProperty("tag")) {
            element = document.createElement(el.tag)
            src = el.src
            if (el.tag == "iframe") {
               element.setAttribute("frameborder", "0")
            }
            rub = el.element.getAttribute("name")
            text = el.element.getAttribute("descr")
         } else {
            let tag = el.tagName.toLowerCase()
            if (tag == "div") {
               src = window.getComputedStyle(el).backgroundImage
            } else if (tag == "img") {
               src = el.src
            }
            src = src.replace(/url\(\"|\"\)/g,"")
            element = document.createElement("img")
            rub = el.getAttribute("name")
            text = el.getAttribute("descr")

         }
         console.log(element)
         element.setAttribute("src", src)
         element.classList.add("noClose")
         imgCont.appendChild(element)

         if (rub) {
            let r = document.createElement("h2")
            r.innerHTML = rub
            textCont.appendChild(r)
         }
         if (text) {
            let t = document.createElement("p")
            t.innerHTML = text
            textCont.appendChild(t)
         }
         content.appendChild(textCont)
         content.appendChild(imgCont)
         this.items.push(content)
      }
      this.items.forEach((e,i)=>{
         this.section.center.appendChild(e)
         this.items[i].onswipe = new SwipeHandler(this.items[i])
         this.items[i].onswipe("left",()=>{this.getNext})
         this.items[i].onswipe("right",()=>{this.getPrev})
      })

      for (let s in this.section) {
         var sec = this.section[s]
         sec.classList.add("popUpSection", "popup-" + s)
         if (Object.keys(this.btn).indexOf(s) != -1) {
            sec.appendChild(this.btn[s])
         }
         this.container.appendChild(sec)

      }
      this._current=0
      
      this.el.forEach((e,i) => {
         e.addEventListener("click", this.openContainer.bind(this,i))
      })
      this.container.addEventListener("click", this.closeContainer.bind(this))
      this.container.style.display = "none"
      document.body.appendChild(this.container)
   }
   get getNext(){
      if(this.items.length-1 < this.current+1){
         this.setCurrent(0,"right")
         return 0
      } else {
         this.setCurrent(this.current+1,"right")
         return this.current
      }
   }

   get getPrev(){
      if(0 > this.current-1){
         this.setCurrent(this.items.length-1,"left")
         return this.current
      } else {
         this.setCurrent(this.current-1,"left")
         return this.current
      }
   }

   set current(n){
      this._current = n
   }
   get current(){
      return this._current
   }
   setCurrent(n,dir){
      this.items[this.current].classList.remove("rollInFromRight","rollInFromLeft","fadeIn")
      this.items[n].classList.remove("rollOutToLeft","rollOutToRight","fadeOut")
      if(dir=="right"){
      this.items[this.current].classList.add("rollOutToLeft")
      this.items[n].classList.add("rollInFromRight")
      }else if(dir=="left") {
         this.items[this.current].classList.add("rollOutToRight")
         this.items[n].classList.add("rollInFromLeft")
      }else if(dir=="none"){

         this.items[this.current].classList.add("fadeOut")
         this.items[n].classList.add("fadeIn")
      }

      this.current = n
   }
   openContainer(i,e) {
      scrolling.killListeners
      this.setCurrent(i,"none")
      console.log(e,i, this)
      this.container.style.display = "grid"

   }
   closeContainer(e) {
      scrolling.startListeners
      if($(e.target).parents("svg").length < 1){
      this.container.style.display = "none"}
   }

}

const gallery = new GalleryCarousel(document.querySelector(".gallery-wrapper"))
const scrolling = new ScrollEffect()

/** Gallery clickEvents */

/* 
document.querySelectorAll(".gallery-item.img").forEach((el) => {
   el.addEventListener("click", function (ev) {
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
}) */


var galleryContainer = new PopupView(document.querySelectorAll(".gallery-item.img"), document.body, "galleryPopUp")
let portfolioElements = document.querySelectorAll(".portfolio-thumb")
var portfolioItems = new Array(portfolioElements.length).fill("").map((e,i)=>{
   e = {}
   e.element = portfolioElements[i]
   e.src = portfolioElements[i].getAttribute("href")
   if(e.src.indexOf(".html")!=-1){
      e.tag = "iframe"
   } else {
      e.tag = "img"
   }
   return e
})

var portfolioContainer = new PopupView(portfolioItems,document.body,"porfolio-popUp")

/** About Parts Event */
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

/** Close Portfolio PopUp */
/* const portPres = document.querySelector(".portfolio-presentation")

portPres.addEventListener("click", function (ev) {
   if (ev.target.classList.contains("portfolio-arrow")) {
      return
   }
   $(portPres).fadeOut()
   scrolling.startListeners
})
 */
/** Portfolio Item Arrow Event */

/* var currentPortItem = 0
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
 */
/** Portfolio thumb Click event*/
/* document.querySelectorAll(".thumb.portfolio-thumb").forEach((el, i) => {
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
}) */

/** Navlink scroll correction */
document.querySelectorAll(".nav-link:not(.test)").forEach((el) => {
   el.addEventListener("click", async (e) => {
      e.preventDefault()
      let href = $(el).attr("href").replace(/#/g, "")
      scrolling.scrollById(href)
      svgdrag.close()
   })

})