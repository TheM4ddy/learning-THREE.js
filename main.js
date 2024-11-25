import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
//-----------------Library/Imports----------------------------------//

//----------------Criando-a-cena------------------------------------
const scene = new THREE.Scene();
//------------------------------------------------------------------

// criando a canva
//------------------------------------------------------------------
const canvas = document.querySelector('#c');
//------------------------------------------------------------------

//criando a camera de perspectiva
//------------------------------------------------------------------
const fov = 45;
const aspect = 2;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 10, 20);
//------------------------------------------------------------------

//criando controle orbito da camera
//------------------------------------------------------------------
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);
controls.update();
//------------------------------------------------------------------

//criando o renderer
//------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer(
    {
        antialias:true,
        canvas
    }
);
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();
//------------------------------------------------------------------


//------------------------------------------------------------------
// criando o chão
//criamos o plano de tamanho 40 em inteiros
const planeSize = 40;
//carregamos a textura
const texture = loader.load('resources/checker.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
texture.colorSpace = THREE.SRGBColorSpace;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
});
planeMat.color.setRGB(1.5, 1.5, 1.5);

const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
scene.add(mesh);
//------------------------------------------------------------------

//criando o cubo
//------------------------------------------------------------------

const geometry = new THREE.BoxGeometry( 1, 1, 1);

function makeInstance(geometry, color, x)
{
    const material = new THREE.MeshStandardMaterial({color,
        roughness: 0.3,
        metalness: 0.9,
    });
    
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    cube.position.x = x;
    cube.position.y = 2;
    return cube;
}



//------------------------------------------------------------------

//const material = new THREE.MeshPhongMaterial({color: 0xffff00});
//------------------------------------------------------------------
const cubes = 
[
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844, 2),
];
//------------------------------------------------------------------

//renderizando o cubo
//------------------------------------------------------------------
function render(time)
{
    time *= 0.001; //converte tempo para segundos
    
    
    if(resizeRendererToDisplaySize(renderer))
        {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        cubes.forEach((cube, ndx) =>
            {
                const speed = 1 + ndx * .1;
                const rot = time * speed;
                cube.rotation.x = rot;
                cube.rotation.y = rot;
            });
            
            renderer.render(scene, camera);
            
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
        
//------------------------------------------------------------------

// checar se a janela ja n esta no tamanho certo
//------------------------------------------------------------------
function resizeRendererToDisplaySize(renderer)
{
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = Math.floor( canvas.clientWidth * pixelRatio );
    const height = Math.floor( canvas.clientHeight * pixelRatio );
    const needResize = canvas.width !== width || canvas.height !== height;

    if(needResize)
    {
        renderer.setSize(width, height, false);
    }
    return needResize;
}
//------------------------------------------------------------------
//------------------------------lil-GUI-----------------------------
class ColorGUIHelper
{
    constructor(object, prop)
    {
        this.object = object;
        this.prop = prop;
    }
    get value() 
    {
        return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString)
    {
        this.object[this.prop].set(hexString);
    }

}

//#region <AmbienceLight>
    /*const gui = new GUI();
        gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
        gui.add(light, 'intensity', 0, 2, 0.01);
    */
    //#endregion

//#region <DirectionalLight>
/*
    function makeXYZGUI( gui, vector3, name, onChangeFn ) {

        const folder = gui.addFolder( name );
        folder.add( vector3, 'x', - 10, 10 ).onChange( onChangeFn );
        folder.add( vector3, 'y', 0, 10 ).onChange( onChangeFn );
        folder.add( vector3, 'z', - 10, 10 ).onChange( onChangeFn );
        folder.open();

    }

    {

        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight( color, intensity );
        light.position.set( 0, 10, 0 );
        light.target.position.set( - 5, 0, 0 );
        scene.add( light );
        scene.add( light.target );

        const helper = new THREE.DirectionalLightHelper( light );
        scene.add( helper );

        function updateLight() {

            light.target.updateMatrixWorld();
            helper.update();

        }

        updateLight();

        const gui = new GUI();
        gui.addColor( new ColorGUIHelper( light, 'color' ), 'value' ).name( 'color' );
        gui.add( light, 'intensity', 0, 5, 0.01 );

        makeXYZGUI( gui, light.position, 'position', updateLight );
        makeXYZGUI( gui, light.target.position, 'target', updateLight );

    }
*/
//#endregion

//#region <PointLight>
/*
function makeXYZGUI( gui, vector3, name, onChangeFn ) {

    const folder = gui.addFolder( name );
    folder.add( vector3, 'x', - 10, 10 ).onChange( onChangeFn );
    folder.add( vector3, 'y', 0, 10 ).onChange( onChangeFn );
    folder.add( vector3, 'z', - 10, 10 ).onChange( onChangeFn );
    folder.open();

}

{

    const color = 0xFFFFFF;
    const intensity = 150;
    const light = new THREE.PointLight( color, intensity );
    light.position.set( 0, 10, 0 );
    scene.add( light );

    const helper = new THREE.PointLightHelper( light );
    scene.add( helper );

    function updateLight() {
        helper.update();
    }

    const gui = new GUI();
    gui.addColor( new ColorGUIHelper( light, 'color' ), 'value' ).name( 'color' );
    gui.add( light, 'intensity', 0, 5, 0.01 );
    gui.add( light, 'distance', 0, 40).onChange(updateLight);
    makeXYZGUI( gui, light.position, 'position', updateLight );

}
*/
//#endregion

//#region <SpotLight>
class DegRadHelper {

    constructor( obj, prop ) {

        this.obj = obj;
        this.prop = prop;

    }
    get value() {

        return THREE.MathUtils.radToDeg( this.obj[ this.prop ] );

    }
    set value( v ) {

        this.obj[ this.prop ] = THREE.MathUtils.degToRad( v );

    }

}

function makeXYZGUI( gui, vector3, name, onChangeFn ) {

    const folder = gui.addFolder( name );
    folder.add( vector3, 'x', - 10, 10 ).onChange( onChangeFn );
    folder.add( vector3, 'y', 0, 10 ).onChange( onChangeFn );
    folder.add( vector3, 'z', - 10, 10 ).onChange( onChangeFn );
    folder.open();

}

{

    const color = 0xFFFFFF;
    const intensity = 150;
    const light = new THREE.SpotLight( color, intensity );
    light.position.set( 0, 10, 0 );
    light.target.position.set( - 5, 0, 0 );
    scene.add( light );
    scene.add( light.target );

    const helper = new THREE.SpotLightHelper( light );
    scene.add( helper );

    function updateLight() {

        light.target.updateMatrixWorld();
        helper.update();

    }

    updateLight();

    const gui = new GUI();
    gui.addColor( new ColorGUIHelper( light, 'color' ), 'value' ).name( 'color' );
    gui.add( light, 'intensity', 0, 250, 1 );
    gui.add( light, 'distance', 0, 40 ).onChange( updateLight );
    gui.add( new DegRadHelper( light, 'angle' ), 'value', 0, 90 ).name( 'angle' ).onChange( updateLight );
    gui.add( light, 'penumbra', 0, 1, 0.01 );

    makeXYZGUI( gui, light.position, 'position', updateLight );
    makeXYZGUI( gui, light.target.position, 'target', updateLight );

}

//#endregion
//------------------------------------------------------------------

//----------------------------global-split--------------------------
Split( [ '#view', '#controls' ], { // eslint-disable-line new-cap
	sizes: [ 75, 25 ],
	minSize: 100,
	elementStyle: ( dimension, size, gutterSize ) => {

		return {
			'flex-basis': `calc(${size}% - ${gutterSize}px)`,
		};

	},
	gutterStyle: ( dimension, gutterSize ) => {

		return {
			'flex-basis': `${gutterSize}px`,
		};

	},
} );
//------------------------------------------------------------------
