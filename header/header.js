class svgDrag2 {
    constructor(header, pos) {
        this.wrapper = header;
        this.blocker = header.querySelector(".nav-blocker");
        this.content = header.querySelector(".nav-content");
        this.svg = header.querySelector("svg.nav-svg");
        this.navbar = this.svg.querySelector("path");

        
        this.timeout;
        this.isDragging = false;
        this.clickEvent = false
        this.type = "drag";
        this.mouse = {
            x: 0,
            y: 0
        };
        this._path = [
            ["M", 0, 0],
            ["l", 100, 0],
            ["l", 0, 10],
            ["q", 0, 0, -100, 0, "z"]
        ];
        this._circle = {
            top: 0,
            left: 0,
            size: 0

        }
        this.cStart = {
            x: 0,
            y: 0
        }
        this.path = {};
        var l = 1;
        this.pos = pos;
        this._path.forEach((e, i) => {
            var start = i;
            var prop = e[0];
            if (prop == "l") {
                prop = prop + l;
                l++;
            }
            Object.defineProperty(this.path, prop, {
                get: () => {
                    return this._path[prop];
                },
                set: (y) => {
                    this._path[i] = [e[0], ...y];
                    this.update();
                }
            });
        });
        this.size = {
            close: 0,
            open: 0.8,
            offset: 75
        };

        this.navBtn = this.wrapper.querySelector(".nav-btn")
        this.navBtn.addEventListener("mousedown", this.mouseDown.bind(this))
        this.navBtn.addEventListener("touchstart", this.mouseDown.bind(this));
        this.content.addEventListener("mousedown", this.mouseDown.bind(this));
        this.navbar.addEventListener("mousedown", this.mouseDown.bind(this));
        window.addEventListener("mousemove", this.mousemove.bind(this));
        window.addEventListener("mouseup", this.mouseUp.bind(this));
        this.content.addEventListener("touchstart", this.mouseDown.bind(this));
        this.navbar.addEventListener("touchstart", this.mouseDown.bind(this));
        window.addEventListener("touchmove", this.mousemove.bind(this));
        window.addEventListener("touchend", this.mouseUp.bind(this));
        window.addEventListener("resize", this.init.bind(this));

        this.containers = [this.wrapper, this.blocker, this.content, this.svg,this.navBtn]

        this.init();
    }

    get win() {
        var win = {
            width: Number(window.innerWidth.toFixed(2)),
            height: Number(window.innerHeight.toFixed(2))
        };

        if (this.pos == "left") {
            win = {
                width: Number(window.innerHeight.toFixed(2)),
                height: Number(window.innerWidth.toFixed(2))
            };
        }

        win.min = win.width < win.height ? win.width : win.height;
        win.max = win.width > win.height ? win.width : win.height;
        return win;
    }
    get bar() {
        var bar = {
            height: this.navbar.getBoundingClientRect().height,
            width: this.navbar.getBoundingClientRect().width
        };
        if (this.pos == "left") {
            bar = {
                width: this.navbar.getBoundingClientRect().height,
                height: this.navbar.getBoundingClientRect().width
            };
        }
        return bar;
    }
    get svgSize() {
        var svgSize = {
            height: this.navbar.getBoundingClientRect().height,
            width: this.svg.getBoundingClientRect().width
        };
        if (this.pos == "left") {
            svgSize = {
                width: this.svg.getBoundingClientRect().height,
                height: this.navbar.getBoundingClientRect().width
            };
        }
        return svgSize;
    }
    get qx() {
        if (this.pos == "left") {
            return this._path[3][2];
        } else {
            return this._path[3][1];
        }
    }
    get qy() {
        if (this.pos == "left" || this.pos == "right") {
            return this._path[3][1];
        } else {
            return this._path[3][2];
        }
    }
    set svgHeight(height) {
        if (this.pos == "left") {
            this.svg.style.width = height;
            this.svg.parentElement.style.width = height;
        } else {
            this.svg.style.height = height;
        }
    }
    set svgWidth(width) {
        if (this.pos == "left") {
            this.svg.style.height = width;
            this.svg.parentElement.style.height = width;
        } else {
            this.svg.style.width = width;
            this.svg.parentElement.style.width = width;
        }
    }
    set circle({
        x,
        y,
        size
    }) {

        let _size = size ? size : this._circle.size
        let _x = x || x == 0 ? x : this._circle.left
        let _y = y || y == 0 ? y : this._circle.top


        if (isNaN(_x) || isNaN(_y)) {
            debugger
        }
        this._circle.left = _x
        this._circle.top = 0
        this._circle.size = _size
        if (this.pos == "left") {
            this._circle.left = 0
            this._circle.top = _x
        }
        this.update()
    }
    get circle() {
        var c = {
            x: this._circle.left,
            y: this._circle.top,
            size: this._circle.size,
            startX: this.cStart.x,
            startY: this.cStart.y
        }
        if (this.pos == "left") {
            var c = {
                y: this._circle.left,
                x: this._circle.top,
                size: this._circle.size,
                startX: this.cStart.y,
                startY: this.cStart.x
            }
        }
        return c
    }

    m(e) {
        var m = {
            x: e.clientX < 0 ? 0 : e.clientX > this.win.width ? this.win.width : e.clientX,
            y: e.clientY < 0 ? 0 : e.clientY > this.win.height ? this.win.height : e.clientY
        };


        if (this.pos == "left") {
            m = {
                y: e.clientX < 0 ? 0 : e.clientX > this.win.width ? this.win.width : e.clientX,
                x: e.clientY < 0 ? 0 : e.clientY > this.win.height ? this.win.height : e.clientY
            };
        }
        return m;
    }
    lxy(x, y) {
        console.log("lxy", this.pos);
        if (this.pos == "top") {
            return [x, y];
        } else if (this.pos == "left") {
            console.log("lxyPos", x, y);
            return [y, x];
        }
    }
    qh({
        hx,
        hy,
        x,
        y
    }) {
        let _hx = hx || hx == 0 ? hx : this._path[3][1];
        let _hy = hy || hy == 0 ? hy : this._path[3][2];

        let _x = x || x == 0 ? x : this._path[3][3];
        let _y = y || y == 0 ? y : this._path[3][4];




        if (this.pos == "left") {
            this._path[3] = [this._path[3][0], _hy, _hx, _x, _y, this._path[3][5]];
        } else {
            this._path[3] = [this._path[3][0], _hx, _hy, _x, _y, this._path[3][5]];
        }

        this.update();

    }

    /*
    DOM Controlers
     */


    init() {
        this.pos = "top";

        var h = this.size.close;
        if (this.isOpen) {
            h = this.win.height * this.size.open;
        }
        this.path.M = [0, 0];
        this.path.l1 = this.lxy(this.win.width, 0);
        this.path.l2 = this.lxy(0, h);
        this.qh({
            hx: -this.win.width / 2,
            hy: this.size.offset,
            x: this.lxy(-this.win.width, -h)[0],
            y: this.lxy(-this.win.width, -h)[1]
        });
        this.svgWidth = "100%";

        if (this.pos == "left") {
            this.wrapper.classList.remove("top")
            this.wrapper.classList.add("left")
        } else {
            this.wrapper.classList.remove("left")
            this.wrapper.classList.add("top")
        }

        this.circle = {
            x: (this.svgSize.width / 2) - (this.circle.size / 2),
            y: 0,
            size: this.bar.height
        }
    }
    update() {
        this.navbar.setAttribute("d", this._path.join(" ").replace(/,/g, " "));
        for (let attr in this._circle) {
            if (isNaN(this._circle[attr])) {
                debugger;
            }
            if (attr == "size") {


            }

        }

    }

    /*
    EVENT HANDLERS
    */

    mouseDown(el) {
        
        if((el.target == this.navBtn || $(this.navBtn).find(el.target))){
            this.clickEvent = true;
            let hy = this.isOpen ? -100 : 100
            this.qh({hy:hy})
            this.navbar.classList.add("revert")
        }else {el.preventDefault()
            this.navbar.classList.remove("revert")
        }
        console.log(el)
        const e = el.touches ? el.touches[0] : el
        this.isDragging = true
        clearTimeout(this.timeout);
        
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.cStart.x = this._circle.left;
        this.cStart.y = this._circle.top;
        console.log(this.cStart)
        if (this.pos == "left") {
            this.mouse.x = e.clientY;
            this.mouse.y = e.clientX;
        }

    }
    mousemove(el) {
        if (this.isDragging) {
            this.navbar.classList.remove("revert")
            el.preventDefault()
            const e = el.touches ? el.touches[0] : el
            var moveX = Number(this.m(e).x.toFixed(2)) - this.win.width;
            var moveY = this.m(e).y - this.mouse.y;
            if(this.clickEvent){
                moveY = this.isOpen ? moveY -(100-this.size.offset) : moveY + (100-this.size.offset)
            }
            if (!this.isOpen) {
                var svgHeight = Number(this.bar.height.toFixed(2));
                svgHeight =
                    svgHeight < 50 || moveY < 0 ? this.win.height * 0.1 + "px" : svgHeight + "px";
                this.svgHeight = svgHeight;
                this.circle = {
                    x: (this.win.width / 2) - (this.circle.size / 2),
                    y: 0
                }
            }

            console.log("MX", moveX, "my:", moveY)
            this.qh({
                hx: moveX,
                hy: moveY + this.size.offset
            });
        }
    }
    mouseUp(el) {
        console.log(el.target, (el.target == this.navBtn || $(this.navBtn).find(el.target).length > 0))
        if ((el.target == this.navBtn || $(this.navBtn).find(el.target).length > 0) && this.clickEvent) {
            this.isDragging = false
            if(this.isOpen){
                this.close()
            } else {
                this.open()
            }
            return
        }
        el.preventDefault()
        const e = el.touches ? el.touches[0] : el
        if (this.type == "drag") {
            this.isDragging = false;
            console.log((this.win.height * 0.1) + this.size.offset)
            if (Math.abs(this.qy) > (this.win.height * 0.1) + this.size.offset) {
                if (!this.isOpen) {
                    this.open();
                } else if (this.isOpen) {
                    this.close();
                }
            } else {
                this.revert();
            }
        } else {
            this.revert();
        }
    }

    /*
    ANIMATIONS
    */
    open() {

        
        this.navbar.classList.add("revert");
        if(this.clickEvent){
            this.qh({
                hy: (this.win.height * 0.2) + this.size.offset
            })
        }

        this.path.l2 = this.lxy(0, this.win.height * 0.75);
        console.log("open");

        this.revert();
        this.svgHeight = this.win.height * this.size.open + this.size.offset + "px";
        document.body.style.overflow = "hidden";
        if (this.pos == "left") {
            this.blocker.style.width = this.win.height + "px";
            this.blocker.style.height = this.win.width + "px";
        } else {
            this.blocker.style.height = this.win.height + "px";
            this.blocker.style.width = this.win.width + "px";
        }
        this.circle = {
            y: this.win.height * 0.75,
            x: ((this.svgSize.width / 2) - (this.size / 2))
        }

        setTimeout(() => {
            this.svgHeight = this.win.height * this.size.open + this.size.offset + "px";
        }, 300);

        this.containers.forEach(
            (e) => {
                e.classList.remove("closed")
                e.classList.add("open");
            }
        );this.isOpen = true;

    }
    close() {
        this.containers.forEach(
            (e) => {
                e.classList.add("closed")
                e.classList.remove("open");
            }
        );
        
        this.navbar.classList.add("revert");


        this.circle = {
            y: 0,
            x: ((this.svgSize.width / 2) - (this.circle.height / 2))
        }
        this.path.l2 = this.lxy(0, this.size.close);
        console.log("close");
        this.revert();
        document.body.style.overflow = "auto";
        setTimeout(() => {
            this.svgHeight = this.size.close + 75 + "px";
        }, 300);
        this.isOpen = false;
    }
    revert() {
        this.navbar.classList.add("revert");
        // this._path[3][2] = (this._path[3][2] / 1.7) * -1;

        this.qh({
            hx: null,
            hy: ((this.qy / 1.4) * -1) + this.size.offset + 10
        });

        if (this.qy > 0 && this.qy < this.size.offset + 5) {
            clearTimeout(this.timeout);
            this.qh({
                hx: -this.bar.width / 2,
                hy: this.size.offset
            });


            setTimeout(() => {


                this.navbar.classList.remove("revert");


            }, 150);
            return;
        } else {
            this.update();
            this.timeout = setTimeout(() => {
                if (this.isOpen) {

                } else {

                }
                this.revert();
            }, 150);
        }
    }
}


var svgdrag = new svgDrag2(document.querySelector(".nav-wrapper"), "left");