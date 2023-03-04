const canvas = document.getElementById("canvas");
const portfolio = document.querySelector(".portfolio");

let screenHeight = window.innerHeight;
let screenWidth = window.innerWidth;
canvas.height = screenHeight;
canvas.width = screenWidth;
c = canvas.getContext("2d");

let array = []; //object array
let sparkCount; //individual object
let wave = false;

//used for interval
let allow = true; 
let off; 
let time = 0; 


//141 colors. The minimum is 0, the maximum is 140
const colorArray = [
    "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", 
    "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", 
    "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", 
    "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", 
    "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", 
    "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", 
    "goldenrod", "gray", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", 
    "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", 
    "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen",
    "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", 
    "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", 
    "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", 
    "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", 
    "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", 
    "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", 
    "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan",
    "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"
];

//colors better suited for fireworks
const brightColors = [
    'turquoise', 'darkturquoise', 'darksalmon', 'linen', 'lightcoral', 'lightgreen', 'coral', 'springgreen', 
    'khaki', 'dodgerblue', 'magenta', 'blueviolet', 'lightskyblue', 'deepskyblue', 'lemonchiffon', 'lawngreen', 
    'indianred', 'pink', 'mediumvioletred', 'orange', 'navajowhite', 'deeppink', 'gold', 'palegoldenrod', 
    'yellow', 'burlywood', 'plum', 'greenyellow', 'firebrick', 'thistle', 'tomato', 'tan', 'violet', 'antiquewhite', 
    'lightsteelblue', 'darkorange', 'azure', 'fuchsia', 'sandybrown', 'brown', 'seashell', 'crimson', 'red', 'mistyrose',
    'cyan', 'lightseagreen', 'powderblue', 'lightpink', 'goldenrod', 'blue', 'palegreen', 'lightyellow', 'lemonchiffon',
    'steelblue', 'darkcyan', 'cornflowerblue', 'peru', 'mediumturquoise', 'mediumpurple', 'peachpuff', 'firebrick', 
    'lime', 'papayawhip', 'blanchedalmond', 'mediumblue', 'royalblue', 'darkseagreen', 'rebeccapurple', 'cadetblue', 
    'hotpink', 'slateblue', 'lavender', 'bisque', 'cornsilk', 'moccasin', 'aquamarine', 'mintcream', 'limegreen', 
    'green', 'lightblue', 'chartreuse', 'skyblue', 'lavenderblush'
];


//Returns a random number within a chosen range
function randomRange(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
//Math.floor() rounds down to the nearest whole number  e.i. 10 = 0 - 9  
//Math.random() returns a random decimal between 0 - 0.99
}

function wavyFire() {
  let dice = randomRange(1,12);

    if(dice == 1) {
        wave = true;
    } else {
        wave = false;
    }
}


//object blueprint
class Sparks {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius; //size of circles
        this.color = color;
        this.velocity = velocity; 
        this.gravity = 0.005; //pull down force
        this.friction =  0.996; //slows sideways movement
        this.alpha = 1; //visibility value
    }

    //circle
    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = `${this.color}`;
        c.fill();
        c.closePath();
        c.restore();
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x * randomRange(1, 1.1); //sideways expansion force 
        if(wave) {
            this.y += this.velocity.y - 0.35 -randomRange(0.1, 0.8); //creates wavy fireworks
        } else {
            this.y += this.velocity.y - 0.35; //velocity and dowards pull
        }
        this.alpha -= 0.0045; //when reduced to zero sparks dissapear
        
        this.draw();
    }
}


function creator() {

    let color = brightColors[randomRange(0, brightColors.length - 1)];
    let dice = randomRange(1,25);
    let fireworks;
    let x = randomRange(50, screenWidth - 50) 
    let y = randomRange(40, screenHeight - 200);
    sparkCount = randomRange(75,300);

    for(let i = 0; i < sparkCount; i++) {

        let radius = randomRange(0.5, 1.3);
        let radians = Math.PI * 2 / sparkCount;
        if(dice == 25) {
            color = colorArray[randomRange(0, colorArray.length - 1)];
        }

        fireworks = new Sparks(x, y, radius, color, { 
            x: Math.cos(radians * i) * Math.random(), //creates circular particle positions
            y: Math.sin(radians * i) * Math.random()  //creates curved particle positions
        });
        
        array.push(fireworks);
    }
}


function animate() {

    requestAnimationFrame(animate);

    c.fillStyle = "rgba(0, 0, 0, 0.06)";
    c.fillRect(0,0,screenWidth,screenHeight);

    array.forEach(obj => {
        //while visible animate
        if(obj.alpha > 0) {
            obj.update();
        } else { //else get rid of object
            array.splice(obj, 1);
        }
        //prevents slowing the animation due to too many objects
        if(array.length > 3000) {
            array.splice(obj, 1);
        }
    });
}


canvas.addEventListener("click", function() {

    creator(); //fireworks on demand

    portfolio.style.visibility = "visible";

    time = 3000; //3 seconds, resets on click
    
    if(allow) {

        allow = false; //prevents multiple intervals

        off = setInterval(() => {
            time -= 1000;
        
            if(time <= 0) {
                portfolio.style.visibility = "hidden";
                clearInterval(off);
                allow = true;
            }
        }, 1000);
    }
});


//prevents infite loop when loading page on mobile
setTimeout(function() {
    window.addEventListener("resize", function() {
        
        //Only way found to avoid a canvas resize bug on mobile
        setTimeout(function() {
            screenHeight = window.innerHeight;
            screenWidth = window.innerWidth;
            canvas.height = screenHeight;
            canvas.width = screenWidth;
        },50);
    });
}, 25); 


window.onload = function() {

    setTimeout(function() {
        creator();
    }, 1000); //waits a second
    
    setInterval(function() { 
        
        creator(); 

        setTimeout(function() {
            creator();
        }, 1750); //waits a 1.75 seconds

        wavyFire(); 

    }, 3500); //repeats every 3.5 seconds
    
    animate();

};
