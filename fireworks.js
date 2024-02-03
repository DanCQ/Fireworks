const canvas = document.getElementById("canvas");
const portfolio = document.querySelector(".portfolio");

let screenHeight = window.innerHeight;
let screenWidth = window.innerWidth;
canvas.height = screenHeight;
canvas.width = screenWidth;
c = canvas.getContext("2d");

let launch = [];
let explode = []; //object array

let wave = false;

//used for interval
let allow = true; 
let off; 
let time = 0; 
let pageVisible = true;


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
//Math.floor() rounds down to the nearest whole number  
//Math.random() returns a random decimal between 0 - 0.99
}


//creates rising flares
class Trails {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = velocity; //launch force
        this.color = color;
        this.alpha = 1; //visibility value
        this.gravity = -0.08; //pull down force
        this.wavy = false;
        this.wavyFire();
    }
    
    wavyFire() {
        let dice = randomRange(1,15);
        
        if(dice == 1) {
            this.wavy = true;
        }
    } 

    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        c.restore();
    }
    
    update() {
        this.velocity.y -= this.gravity; 
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01; //dissapear when reduced to zero

        this.draw();
    }

}


//object blueprint
class Sparks {
    constructor(x, y, radius, color, velocity, wave) {
        this.x = x;
        this.y = y;
        this.radius = radius; //size of circles
        this.color = color;
        this.velocity = velocity; 
        this.gravity = 0.005; //pull down force
        this.friction =  0.996; //slows sideways movement
        this.alpha = 1; //visibility value
        this.wave = wave;
    }

    //circle
    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        c.restore();
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x * randomRange(1, 1.1); //sideways expansion force 
        if(this.wave) {
            this.y += this.velocity.y - 0.35 -randomRange(0.1, 0.8); //creates wavy fireworks
        } else {
            this.y += this.velocity.y - 0.35; //velocity and dowards pull
        }
        this.alpha -= 0.0045; //when reduced to zero sparks dissapear
        
        this.draw();
    }
}


function ignite() {

    let color = brightColors[randomRange(0, brightColors.length - 1)];
    let flare;
    let radius = randomRange(2, 2.4);
    let x = randomRange(100, screenWidth - 100);
    let y = randomRange(screenHeight, screenHeight - 100);
    
    flare = new Trails(x, y, radius, color, {
        x: 3 * (Math.random() - 0.5),
        y: randomRange(-5,-9)
    })

    launch.push(flare);
}


function pop(flareX, flareY, flareColor, wavy) {
    let color = flareColor;
    let dice = randomRange(1,25);
    let fireworks;
    let sparkCount = randomRange(75,275);
    let x = flareX; 
    let y = flareY; 
    
    for(let i = 0; i < sparkCount; i++) {

        let radius = randomRange(0.5, 1.4);
        let radians = Math.PI * 2 / sparkCount;
        if(dice == 25) {
            color = colorArray[randomRange(0, colorArray.length - 1)];
        }

        fireworks = new Sparks(x, y, radius, color, { 
            x: Math.cos(radians * i) * Math.random(), //creates circular particle positions
            y: Math.sin(radians * i) * Math.random()  //creates curved particle positions
        }, wavy); //wavy is true or false
        
        explode.push(fireworks);
    }
}


function animate() {

    requestAnimationFrame(animate);

    c.fillStyle = "rgba(0, 0, 0, 0.06)";
    c.fillRect(0,0,screenWidth,screenHeight);

    launch.forEach(obj => {

        if(obj.alpha > 0) { //update while visible

            obj.update();

        } else { 

            obj.wavyFire(); //true or false

            pop(obj.x, obj.y, obj.color, obj.wavy); //triggers explosion
            
            launch.splice(obj, 1); // gets rid of object
        }
    })

    explode.forEach(obj => {
        //while visible animate
        if(obj.alpha > 0) {
            obj.update();
        } else { //else get rid of object
            explode.splice(obj, 1);
        }
        //prevents slowing animation due to too many objects
        if(explode.length > 2200) {
            explode.splice(obj, 1);
        }
    });
}


canvas.addEventListener("click", function() {

    ignite(); //fireworks on demand

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


// Prevents the right-click menu
document.addEventListener('contextmenu', function (event) {
    event.preventDefault(); 
});


//Event listener for page visibility change
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
        //If Page is not visible, pause function
        pageVisible = false;
    } else {
        //If Page is visible, resume function
        pageVisible = true;
    }
});

//Pauses functions, if window, or tab is not active
function activeSpectator() {

    setTimeout(function() {

        if(pageVisible) {
            ignite();
        }

    }, 1000); //waits a second
    
    setInterval(function() { 
        
        if(pageVisible) {
            ignite(); 

            setTimeout(function() {
                if(pageVisible) {
                    ignite();
                }
            }, 1750); //waits a 1.75 seconds
        }

    }, 3500); //repeats every 3.5 seconds
    
    animate();
}


window.onload = function() {

    activeSpectator();
};
