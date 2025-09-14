import * as THREE from "three";
import { Vec3 } from "gl-matrix";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VertexNormalsHelper } from "three/addons/helpers/VertexNormalsHelper.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Papa from "papaparse";
import { SVGRenderer } from "three/addons/renderers/SVGRenderer.js";
let camera, controls, scene, renderer;
const params = {
    checkAllFaces: false,
    model: 0,
    nPoints: 100,
    concavity: 1,
    threshold: 20,
    domain: 100,
    originX: 0,
    originY: 0,
    originZ: 0,
};
const availableDatasets = [
    "chair",
    "mug",
];
const datasets = [[]].concat(await Promise.all(availableDatasets.map((name) => {
    return fetch(`datasets/${name}.csv`)
        .then(res => res.text())
        .then((text) => {
        const obj = Papa.parse(text, { dynamicTyping: true, skipEmptyLines: true });
        return obj.data.map(value => new Vec3(value));
    });
})));
init();
function generatePointCloud() {
    const N_POINTS = params.nPoints;
    const LIMIT = params.domain;
    function p() {
        return -LIMIT + 2 * Math.random() * LIMIT;
    }
    function pointGenerator() {
        return new Vec3(params.originX + p(), params.originY + p(), params.originZ + p());
    }
    const points = Array.from({ length: N_POINTS }, pointGenerator);
    return points;
}
function ConvexMesh() {
    const points = params.model === 0 ? generatePointCloud() : datasets[params.model];
    // const points = generatePointCloud();
    const t0 = performance.now();
    const faces = concaveman3d.concaveman3d(points, params.concavity, params.threshold, params.checkAllFaces);
    const t1 = performance.now();
    console.log(`nPoints=${points.length} timeToCompute = ${t1 - t0}ms`);
    const geometry = new THREE.BufferGeometry();
    // console.log(points);
    const vertices = [];
    for (const face of faces) {
        const a = points[face[0]];
        const b = points[face[1]];
        const c = points[face[2]];
        vertices.push(...a, ...b, ...c);
    }
    // console.log(vertices);
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
    // console.log("normals");
    geometry.computeVertexNormals();
    const polyhedra = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial({
        side: THREE.FrontSide,
        flatShading: true,
    }));
    return polyhedra;
}
function rebuild(group) {
    group.clear();
    // polyhedra
    const polyhedra = ConvexMesh();
    group.add(polyhedra);
    // scene helpers
    const vertHelper = new VertexNormalsHelper(polyhedra, 0.5, 0x00ff00);
    group.add(vertHelper);
}
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
    document.getElementById("TO_SVG")?.addEventListener("click", btnSVGExportClick, false);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    document.body.appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(400, 200, 0);
    // controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window); // optional
    // controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500;
    // controls.maxPolarAngle = Math.PI / 2;
    const group = new THREE.Object3D();
    scene.add(group);
    // initial build
    rebuild(group);
    // lights
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);
    const dirLight2 = new THREE.DirectionalLight(0x002288, 3);
    dirLight2.position.set(-1, -1, -1);
    scene.add(dirLight2);
    const ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);
    // helpers
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    const gui = new GUI();
    gui.add(params, "checkAllFaces").onChange(() => rebuild(group));
    gui.add(params, "model", 0, availableDatasets.length, 1).onChange(() => rebuild(group));
    gui.add(params, "nPoints", 4, 1000, 1).onChange(() => rebuild(group));
    gui.add(params, "concavity", 0, 5).onChange(() => rebuild(group));
    gui.add(params, "threshold", 0, 200).onChange(() => rebuild(group));
    gui.add(params, "domain", 4, 150, 1).onChange(() => rebuild(group));
    gui.add(params, "originX", -100, 100, 1).onChange(() => rebuild(group));
    gui.add(params, "originY", -100, 100, 1).onChange(() => rebuild(group));
    gui.add(params, "originZ", -100, 100, 1).onChange(() => rebuild(group));
    window.addEventListener("resize", onWindowResize);
}
function btnSVGExportClick() {
    // add ambient light to make SVGRenderer happy
    const ambient = new THREE.AmbientLight("white");
    scene.add(ambient);
    // the original code
    const rendererSVG = new SVGRenderer();
    rendererSVG.setSize(window.innerWidth, window.innerHeight);
    rendererSVG.render(scene, camera);
    ExportToSVG(rendererSVG, "test.svg");
    // remove the ambient light
    scene.remove(ambient);
}
function ExportToSVG(rendererSVG, filename) {
    const XMLS = new XMLSerializer();
    const svgfile = XMLS.serializeToString(rendererSVG.domElement);
    const svgData = svgfile;
    const preface = "<?xml version=\"1.0\" standalone=\"no\"?>\r\n";
    const svgBlob = new Blob([preface, svgData], {
        type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();
}
function render() {
    renderer.render(scene, camera);
}
