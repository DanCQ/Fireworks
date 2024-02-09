const canvas = document.getElementById("canvas");
const portfolio = document.querySelector(".portfolio");

let screenHeight = window.innerHeight;
let screenWidth = window.innerWidth;
canvas.height = screenHeight;
canvas.width = screenWidth;
c = canvas.getContext("2d");

let launch = []; //object array
let explode = []; //object array

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

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); //checks if mobile device 

const crackleURL = 'assets/crackle.m4a';
const crackle2URL = 'assets/crackle2.m4a';
const popBassURL = 'assets/pop-bass.m4a';
const popTrebleURL = 'assets/pop.m4a';

let crackleAudio;
let crackle2Audio;
let popBassAudio;
let popTrebleAudio;

//preload audio for mobile optimization 
function preloadAudio(audioURL) {
    let audioElement = new Audio();
    audioElement.src = audioURL;
    audioElement.load();

    //assigns preloaded audio to var
    if(audioURL === crackleURL) {
        crackleAudio = audioElement;
    }
    if (audioURL === crackle2URL) {
        crackle2Audio = audioElement;
    }
    if(audioURL === popBassURL) {
        popBassAudio = audioElement;
    }
    if (audioURL === popTrebleURL) {
        popTrebleAudio = audioElement;
    }
}
preloadAudio(crackleURL);
preloadAudio(crackle2URL);
preloadAudio(popBassURL);
preloadAudio(popTrebleURL);


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
    constructor(x, y, radius, color, velocity, wave, loudCrackle) {
        this.x = x;
        this.y = y;
        this.radius = radius; //size of circles
        this.color = color;
        this.velocity = velocity; 
        this.gravity = 0.003; //pull down force
        this.friction = 0.996; //slows sideways movement
        this.alpha = 1; //visibility value
        this.wave = wave; //boolean
        this.loudCrackle = loudCrackle;
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
            this.y += this.velocity.y - 0.35 -randomRange(0.1, 0.8); //creates wavy effect
        } else {
            this.y += this.velocity.y - 0.35; //velocity and dowards pull
        }
        this.alpha -= 0.0045; //when reduced to zero dissapears

        if(this.alpha <= 0) {
            if(this.loudCrackle) {
                //if(crackle2Audio.paused) {
                    crackle2Audio.play();
                //}
            } else {
                //if(crackleAudio.paused) {
                    crackleAudio.play();
                //}
            }
        }
        
        this.draw();
    }
}


function ignite() {
    let color = brightColors[randomRange(0, brightColors.length - 1)];
    let radius = randomRange(1.7, 1.9);
    let x = randomRange(100, screenWidth - 100);
    let y = randomRange(screenHeight, screenHeight - 100);
    
    let flare = new Trails(x, y, radius, color, {
        x: 3 * (Math.random() - 0.5),
        y: randomRange(-5,-9)
    })

    flare.wavyFire();
    launch.push(flare);
}


function pop(flareX, flareY, flareColor, wavy) {

    let color = flareColor;
    let dice = randomRange(1, 100);
    let fireworks;
    let sparkCount = sparkSize();
    let x = flareX; 
    let y = flareY; 
    
    let two = colorArray[randomRange(0, colorArray.length - 1)];
    let three = colorArray[randomRange(0, colorArray.length - 1)];

    let colorMixer = [color, two, three];
    
    if(!isMobile) { //better sound if not mobile 
        popBassAudio = new Audio('assets/pop-bass.m4a');
        popTrebleAudio = new Audio('assets/pop.m4a');
    }

    function sparkSize() { //mobile optimization
        if(isMobile) {
            return randomRange(75, 150); //less objects
        } else { 
            return randomRange(100, 275);
        }
    }

    for(let i = 0; i < sparkCount; i++) {
        let radius = randomRange(0.5, 1.1);
        let radians = Math.PI * 2 / sparkCount;

        //random color combinations
        if(dice == 1) {
            color = colorArray[randomRange(0, colorArray.length - 1)];
        } else if(dice % 2 == 0) {
            color = colorMixer[randomRange(0, colorMixer.length - 2)];
        } else if (dice % 3 == 0) {
            color = colorMixer[randomRange(0, colorMixer.length - 1)];
        }

        if(sparkCount % 5 == 0) { //creates a larger explosion
            fireworks = new Sparks(x, y, radius, color, {
                x: Math.cos(radians * i) * Math.random() + randomRange(-0.5,0.5), //creates circular patterns 
                y: Math.sin(radians * i) * Math.random() + randomRange(-0.5,0.5) //creates curved patterns 
            }, wavy, true); //wavy is true or false
            
            popBassAudio.play();
        } else {
            fireworks = new Sparks(x, y, radius, color, {
                x: Math.cos(radians * i) * Math.random(), //creates circular patterns
                y: Math.sin(radians * i) * Math.random() //creates curved patterns
            }, wavy, false); //wavy is true or false
           
            popTrebleAudio.play();
        }
        
        explode.push(fireworks);
    }
}


//animates object arrays
function animate() {
    
    requestAnimationFrame(animate);

    c.fillStyle = "rgba(0, 0, 0, 0.06)";
    c.fillRect(0,0,screenWidth,screenHeight);

    launch.forEach(obj => {

        if(obj.alpha > 0) { //update while visible
            obj.update();
        } else {

            pop(obj.x, obj.y, obj.color, obj.wavy); //triggers explosion
            
            launch.splice(obj, 1); // gets rid of object
        }
    })

    explode.forEach(obj => {
        
        if(obj.alpha > 0) { //while visible animate
            obj.update();
        } else { 
            explode.splice(obj, 1); //else get rid of object
        }

        //prevents slowing animation due to too many objects
        if(explode.length > 2200) {
            explode.splice(obj, 1);
        }
        if(isMobile && explode.length > 1700) {
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

    }, randomRange(1500, 3500)); //sets a random interval
    
    setInterval(function() { 
        
        if(pageVisible) {
            ignite(); 
        }

    }, randomRange(2500, 6000)); //sets a random interval
    
    animate();
}


window.onload = function() {
    
    activeSpectator();
};
