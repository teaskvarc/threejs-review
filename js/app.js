var scene;
var renderer;
var camera;
var mouseX = 0;
var mouseY = 0;
var particles = [];
var directionalLight;

var PARTICLE_NUM = 100;
var COLORS = [0x4285F4, 0x34a853, 0xFBBC05, 0xEA4335];

function init() {

    //camera setup
    camera = new THREE.PerspectiveCamera(
        75,                                         //field of view - angle - 75 je standard
        $(window).width()/$(window).height(),       //aspect ration - razmerje
        1,                                           //near - kjer se zacne scena
        10000                                       //far - kjer se konca scena
    );

    camera.position.z = 100;                         //privzeta lega kamere

    scene = new THREE.Scene();

    //renderer setup - renderer bo prikazal 3D sceno
    renderer = new THREE.CanvasRenderer();
    renderer.setPixelRatio(window.devicePixelRation);               //browser izpostavi koliksna je gostoto, za renderer lahko nastavimo koliko naj bo gosto razmerja pixel-ov
    renderer.setSize($(window).width(), $(window).height());        // velikost nase scene. izpostaviti mora tako, kot je veliko okno v browser-ju
    renderer.setClearColorHex(0xffffff, 1);                         // OZADJE, kaksne barve bo scena (bela barva, transparency). 1 je vrednost od 0 do 1 za Alfo

    $('body').append(renderer.domElement);                          //CANVAS element, ki ga vstavimo v index.html. TO JE jquery. (renderer.domElement vstavimo noter v body)

    createParticles();

    $(window).on('mousemove', function (evt) {

        mouseX = evt.clientX;                       // te dve vrednosti bosta imel epodatke kje se nasa miska nahaja
        mouseY = evt.clientY;

    });

}
//vektor, ki bo dolocil obliko sprite-a.
function createParticles() {

    for(var i=0;i<PARTICLE_NUM;i++) {                               // TO SE BO ZGODILO 1000x

        var geometry = new THREE.Geometry();

        var color = COLORS[Math.floor(Math.random()*4)];        //Math.random je vrednsot od 0-1, zato damo x4, ker imamo stiri barve. Math.floor - zaokrozi vrednost na dol.

        var material = new THREE.SpriteCanvasMaterial({
            color:color,                                         //barva kroga
            program:function (context) {
                // create a circle path and fill it
                context.beginPath();
                context.arc(0,0,0.5,0,Math.PI*2,true);                //kot da bi risali kroznico v illustrator-ju. S tem smo definirali KROG!
                context.fill();                                      //krog s polnilom, crna barva ki smo jo zgoraj dolocili
            }

        });

        var particle = new THREE.Sprite(material);                  // SPRITE je tip objekta, ki ga damo v 3D prostor in nima globine.
        particle.position.x = Math.random() * 2 - 1;                // to pomeni od -1 do 1
        particle.position.y = Math.random() * 2 - 1;
        particle.position.z = Math.random() * 2 - 1;

        particle.position.normalize();                          // najprej normaliziramo te vrednosti, jih zaokrozimo
        particle.position.multiplyScalar(450);                  // da od -1 do 1 spravimo na neko vecjo vrednost oziroma povrsino. -450 do 450!

        particle.scale.x = particle.scale.y =  50;

        particles.push(particle);

        geometry.vertices.push(particle.position);              // particle.position = ima x,y,z koordinate
        geometry.vertices.push(new THREE.Vector3(0,0,0));

        var lineMaterial = new THREE.LineBasicMaterial({ color:0x000000, opacity:0.5 });
        var line = new THREE.Line(geometry, lineMaterial);
        scene.add(line);

        scene.add(particle);                                    // scena je na koncu tista, ki se bo rendrala. Vse kar damo noter v sceno se bo renderer

    }

    var geometry1 = new THREE.BoxGeometry( 50, 50, 50 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var sphere = new THREE.Mesh( geometry1, new THREE.MeshLambertMaterial({ color: COLORS[Math.floor(Math.random()*4)], overdraw: 0.5 }) );
    scene.add( sphere );

    directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.set( 0, 1, 0 );
    scene.add( directionalLight );
}

function animate() {

    //funkcija, ki bo poklicala, ko bo pripravljen naslednji frame; ko bo browser pripravljen, da mi iterira cez novi frame - takrat bo poklicala funkcijo, ki je noter dana = ANIMATE
    // to se bo zgodilo: 60 frames na sekundo je native frame rate v brskalnikih
    // request-a nov frame, ko ga dobi, poklice animate. to je resitev da se ne sprozi neskoncen loop
    requestAnimationFrame(animate);

    //Animate camera based on mouse position
    camera.position.x += (mouseX - camera.position.x)*0.05;
    camera.position.y += (-mouseY + 200 - camera.position.y)*0.05;

    camera.lookAt(scene.position);

    for(var i = 0;i<particles.length;i++){

        var particle = particles[i];                            //da se rahlo trese
        particle.position.x += Math.random()*2-1;
        particle.position.y += Math.random()*2-1;
        particle.position.z += Math.random()*2-1;

    }

    render();
}

function render() {

    // renderer mora vedeti za sceno in camero. kar koli bomo porinili v sceno nam bo pokazal v brskalniku
    renderer.render(scene, camera);

}

init();
animate();
