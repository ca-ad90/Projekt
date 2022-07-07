class svgHeading{


    constructor(element){
        this.fontSize = window.getComputedStyle(element).fontSize
        this.fontFamily = window.getComputedStyle(element).fontFamily
        this.align = window.getComputedStyle(element).textAlign
        this.text = element.innerText;

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.style.height = this.fontSize
        this.svg.style.width = "100%"
        this.svg.style.position = "relative"
        document.insertBefore(element,this.svg)


    this.defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    this.linearGradient
    component.appendChild(defs);

    pathdef = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathdef.id = "conn1";
    pathdef.setAttributeNS(null, "d", "M264 133 L396 132");
    defs.appendChild(pathdef);

    path2 = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    path2.setAttributeNS('http://www.w3.org/1999/xlink', "xlink:href", "#conn1");
    path2.setAttributeNS(null, "stroke", "black");
    path2.setAttributeNS(null, "stroke-width", "9");
    component.appendChild(path2);

    path = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    path.setAttributeNS('http://www.w3.org/1999/xlink', "xlink:href", "#conn1");
    path.setAttributeNS(null, "stroke", "white");
    path.setAttributeNS(null, "stroke-width", "7");
    component.appendChild(path);
    }

    lGradient(){
        let lg = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
        lg.id = "grad1"
        lg.setAttribute("x1","0")
        lg.setAttribute("y1","0" )
        lg.setAttribute("x2","100%" )
        lg.setAttribute("y2","0%")
    
        let s1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
        let s2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    s1.setAttribute("offset","0.1" )
    s1.setAttribute("stop-color","hsl(52, 97%, 50%)")
    s2.setAttribute("offset=","0.9" )
    s2.setAttribute("stop-color","hsl(330, 100%, 58%)")
    
    lg.append(s1,s2)
    return lg
}
    textPath(){
        let cp = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath')
        let txt = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        txt.setAttribute("text-anchor","middle")
        txt.setAttribute("dominant-baseline","hanging")
        txt.setAttribute("x","50%")
        txt.style.fontSize = this.fontSize
        txt.style.fontFamily = this.fontFamily;
        txt.style.textAlign = this.align
        let words = this.text.replace(/-/g," - ").split(/[ ]/g).filter((e)=>e.length>0)
        for(let w of words){
            let ts = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
            

        }



    }
    resize(){
        this.svgW = this.svg.clientWidth

    }
    
}

<svg class="text-svg" preserveAspectRatio="xMidYMid" style="height: 24px;">
    <defs>
        <linearGradient id="grad1" x1="0" y1="0" x2="100%" y2="0%">
                        <stop offset="0.1" stop-color="hsl(52, 97%, 50%)"></stop>
                        <stop offset="0.9" stop-color="hsl(330, 100%, 58%)"></stop>
                        
        </linearGradient>
        <clipPath id="text1" style="
">
            <text class="text1" text-anchor="middle"  x="50%" style="
    font-size: 24px;
">hejsan</text>
        </clipPath>
    </defs>
        <rect class="text-rect" x="0" y="0" width="100%" height="100%" style="
    fill: url(#grad1);
    clip-path: url(#text1);
"></rect>
    </svg>