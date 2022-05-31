var gap = Number(getComputedStyle(document.documentElement)
    .getPropertyValue('--my-variable-name').replace("vw", ""))
var lastScrollTop = 0;



window.addEventListener("scroll", function (e) { // or window.addEventListener("scroll"....
    e.stopPropagation();
    var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    if (st > lastScrollTop) {

    } else {
        // upscroll code
    }
    lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
}, false);
const sections = document.querySelectorAll("[id*=part-]")
var sec = []
sections.forEach((e, i) => {
    sec[i] = {
        e: e,
        n: i,
        top: window.pageYOffset - e.getBoundingClientRect().top
    }
});

var page = 1

class scrollHandler {
    constructor(elements) {
        this.scrollTop = window.pageYOffset
        this.isScrolling = false;
        this.winheight = window.innerHeight
        this.start = 0
        this.part = 0
        this.elements = document.querySelectorAll("[id*=part-]")
        this.sections = []
        var pre = 0
        this.elements.forEach((e, i) => {
            this.sections[i] = {
                e: e,
                n: i,
                top: e.getBoundingClientRect().top + window.pageYOffset
            }
        });
        this.stop = false
        this.wheel = {
            start: 0,
            count: 0,
        }
        this.scroll = {
            start:0,
            end:0,
            top:0
        }

        document.getElementById("grid-wrapper").onwheel = this.wheelHandler.bind(this)
        window.addEventListener('scroll', this.scrollHandler.bind(this))    

    }
    resize(e) {
        this.winheight = window.innerHeight
    }
    wheelHandler(e) {
        e.preventDefault();
        var dir = (e.wheelDelta / Math.abs(e.wheelDelta))
        if (this.stop) {
            return
        } else {
            if (this.wheel.start == 0) {
                this.wheel.start = e.timeStamp
                this.wheel.count = 0
            }
            if (this.wheel.start) {
                console.log("START") 
                this.wheel.count -= dir

                if (Math.abs(this.wheel.count) > 3 && !this.stop) {
                    var newPart = this.part
                    this.scroll.start = this.sections[this.part].top

                    this.wheel.count > 0 ? newPart++ : newPart--
                    console.log(newPart,this.part)
                    if(newPart < 0 || newPart > this.sections.length - 1){
                        return
                    }
                    else{this.part = newPart}
                    
                    this.stop = true
                    this.wheel.start = 0
                    this.scroll.end = this.sections[this.part].top
                    this.scroll.top = this.scroll.end-this.scroll.start
                    this.elements[this.part].querySelectorAll("div, div div, div * div").forEach((e,i)=>{
                        switch (i%2) {
                            case 0:
                                e.style.transform = "translateY("+-500*dir+"px)"
                                e.style.transition = "0s"
                                break;
            
                            case 1:
                                e.style.transform = "translateY("+-900*dir+"px)"
                                e.style.transition = "0s"
                                break;
                        
                            default:
                                break;
                        }
                    })
                    window.scrollTo({
                        top: this.sections[this.part].top,
                        behavior: "smooth"
                    })
                    setTimeout(() => {
                        this.elements[this.part].querySelectorAll("div, div div, div * div").forEach((e,i)=>{
                            e.style.transform = "translateY("+0+"px)"  
                            e.style.transition = "0.9s"                        
                        })
                    }, 500);
                }
            }
            console.log("wheel", this.wheel.start)

            setTimeout(() => {
                console.log("stop=true")
                this.wheel.start = 0
                this.stop = false;
            }, 500);
        }

    }
    scrollHandler(e) {
        var p = Number(((window.pageYOffset-this.scroll.start)/(this.scroll.end-this.scroll.start)).toFixed(3))
        this.parralax(p)
    }
    pointerHandler() {

    }
    keyHandler() {

    }
    parralax(p){
        
        var t1,t2
        t1 = 200-200*p
        t2 = 300-(300*p*p)
        console.log(t1,t2)
        this.elements[this.part].querySelectorAll("div, div div, div * div").forEach((e,i)=>{
            e.style.transition = "0.5s"
            var t
            switch (i%2) {
                case 0:
                    t = t1
                    break;

                case 1:
                    t=t2
                    break;
            
                default:
                    break;
            }

            e.style.transform = "translateY("+t+"px)"


        })
        
        

    }

}

const Scrolling = new scrollHandler()