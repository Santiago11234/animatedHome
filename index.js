
import * as THREE from 'three';
import {OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';



//code for changing sizes within website
const gui = new dat.GUI();
const world = {
    plane: {
        width: 400,
        height: 400,
        widthSegments: 50,
        heightSegments: 50
    }
}
gui.add(world.plane, 'width', 1, 500).onChange(guiStuff);
gui.add(world.plane, 'height', 1, 500).onChange(guiStuff);
gui.add(world.plane, 'widthSegments', 1, 100).onChange(guiStuff);
gui.add(world.plane, 'heightSegments', 1, 100).onChange(guiStuff);


//init all three.js create compononets
const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
const renderer = new THREE.WebGL1Renderer();

//made the plane
const planeGeometry = new THREE.PlaneGeometry( 400,400,50,50);
const pMaterial = new THREE.
    MeshPhongMaterial( {
        side: THREE.DoubleSide, 
        flatShading: true,
        vertexColors: true
    });
const planeMesh = new THREE.Mesh( planeGeometry, pMaterial );
scene.add(planeMesh);
guiStuff();




//add light for the front and back
const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(0,1,1);
scene.add(light);
const backLight = new THREE.DirectionalLight(0xFFFFFF, 1);
backLight.position.set(0,-1,-1);
scene.add(backLight);


//mouse listener
const mouse = {
    x: undefined,
    y: undefined
}
addEventListener('mousemove', (event) =>{
   
    mouse.x = (event.clientX/innerWidth) * 2 -1
    mouse.y = -(event.clientY/innerHeight) * 2 +1
    
})

const colors = [];
for(let i = 0;i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0,.19, .4);
}
planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));


renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

//what actually displays the images
new OrbitControls(camera, renderer.domElement);
camera.position.z = 50;

let frame =0;
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    frame += 0.01;
    const {array, originalPosition, randomValues} = planeMesh.geometry.attributes.position;

    for(let i=0; i < array.length;i+=3) {
        //x pos random
        array[i] = originalPosition[i] + Math.cos(frame +randomValues[i]) * 0.007;
        //y pos
        array[i+1] = originalPosition[i+1] + Math.sin(frame +randomValues[i]) * 0.007;
        
    }
    planeMesh.geometry.attributes.position.needsUpdate = true;
    
   
    raycaster.setFromCamera(mouse, camera);
    const intersects= raycaster.intersectObject(planeMesh);
    if(intersects.length > 0) {
        const {color} = intersects[0].object.geometry.attributes;
        //vertice 1
        color.setX(intersects[0].face.a,0.1);
        color.setY(intersects[0].face.a,0.5);
        color.setZ(intersects[0].face.a,1);
        //vertice 2
        color.setX(intersects[0].face.b,0.1);
        color.setY(intersects[0].face.b,0.5);
        color.setZ(intersects[0].face.b,1);
        //vertice 3
        color.setX(intersects[0].face.c,0.1);
        color.setY(intersects[0].face.c,0.5);
        color.setZ(intersects[0].face.c,1);

        intersects[0].object.geometry.attributes.color.needsUpdate = true;

        const initColor = {
            r: 0,
            g: .19, 
            b: 0.4
        }
        const hoverColor = {
            r: 0.1,
            g: .5, 
            b: 1
        }

        gsap.to(hoverColor,{
            r:initColor.r,
            g:initColor.g,
            b:initColor.b,
            onUpdate: () => {
                color.setX(intersects[0].face.a,hoverColor.r);
                color.setY(intersects[0].face.a,hoverColor.g);
                color.setZ(intersects[0].face.a,hoverColor.b);
                //vertice 
                color.setX(intersects[0].face.b,hoverColor.r);
                color.setY(intersects[0].face.b,hoverColor.g);
                color.setZ(intersects[0].face.b,hoverColor.b);
                //vertice 
                color.setX(intersects[0].face.c,hoverColor.r);
                color.setY(intersects[0].face.c,hoverColor.g);
                color.setZ(intersects[0].face.c,hoverColor.b);
                colors.needsUpdate = true;
            }
        });
    
    }
}
animate();


//function to change positin of plane with dat.gui
function guiStuff() {
    planeMesh.geometry.dispose()
    planeMesh.geometry = new THREE.
        PlaneGeometry( 
            world.plane.width,
            world.plane.height,
            world.plane.widthSegments,
            world.plane.heightSegments
        );
        //color attribute addition
        const colors = [];
        for(let i = 0;i < planeMesh.geometry.attributes.position.count; i++) {
            colors.push(0,.19, .4);
        }
        planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

                //vertice position randomization
                const {array} = planeMesh.geometry.attributes.position;
                const randomValues = [];
                for(let i = 0; i < array.length;i+=3){
                    const x= array[i];
                    const y= array[i+1];
                    const z= array[i+2];
                
                    array[i+2] = z + (Math.random()-0.5) * 3;
                    array[i] = x + (Math.random()-0.5) * 3;
                    array[i+1] = y + (Math.random()-0.5) * 3;
        
                    randomValues.push(Math.random()-.5);
                    randomValues.push(Math.random()-.5);
                    randomValues.push(Math.random()-.5);
                }
        
                planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array;
                planeMesh.geometry.attributes.position.randomValues = randomValues;
}

//hi