import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { 
  Navigation, 
  Layers, 
  Globe, 
  Map, 
  Play, 
  Pause, 
  Train, 
  Truck, 
  Ship, 
  Plane,
  Zap, 
  Activity,
  Anchor,
  Radio,
  Check
} from 'lucide-react';
import { MapboxIndiaInfrastructure } from './MapboxIndiaInfrastructure';

interface GlobalGlobe3DProps {
  onSelectNode?: (node: any) => void;
  selectedNodeId?: string;
}

export const GlobalGlobe3D: React.FC<GlobalGlobe3DProps> = ({ onSelectNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'3d-globe' | 'mapbox'>('3d-globe');
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [is3DPlaying, setIs3DPlaying] = useState<boolean>(true);
  const [selectedTransitNode, setSelectedTransitNode] = useState<any | null>(null);

  // Modality Layer Filter Toggles
  const [showRail, setShowRail] = useState(true);
  const [showRoad, setShowRoad] = useState(true);
  const [showMaritime, setShowMaritime] = useState(true);
  const [showAir, setShowAir] = useState(true);

  // GSAP 3D Progress States for Light-Trail Markers across Modalities
  const gsapProgressRef = useRef({
    // 1. Rail Corridors (Western & Eastern DFC)
    railWesternDfc: 0,
    railEasternDfc: 0,
    // 2. Road Corridors (Golden Quadrilateral)
    roadDelhiMumbai: 0,
    roadMumbaiChennai: 0,
    roadChennaiKolkata: 0,
    roadKolkataDelhi: 0,
    // 3. Maritime Corridors (Coastal Peninsular Sea Lane)
    maritimeWestCoast: 0,
    maritimeEastCoast: 0,
    // 4. Air Corridors
    airDelBlr: 0,
    airBomHyd: 0,
    // Pulse animation cycle
    pulseCycle: 0
  });

  // Major Indian Transit Hubs & Nodes
  const transitHubs = [
    {
      id: 'NODE-PUNE',
      name: 'Pune Auto Cluster (Chakan MIDC)',
      type: 'Road & Rail Freight Hub',
      modality: 'Road / DFC Feeder',
      coordinates: '18.52°N, 73.85°E',
      position: { x: 0.5, y: 1.35, z: 1.5 },
      color: '#ef4444',
      cargoVal: '₹145 Cr/day'
    },
    {
      id: 'NODE-SANAND',
      name: 'Sanand GIDC EV & Auto Hub (Gujarat)',
      type: 'Industrial & DFC Terminal',
      modality: 'Western DFC Rail / NH48',
      coordinates: '22.98°N, 72.38°E',
      position: { x: -2.8, y: 1.35, z: 4.5 },
      color: '#f97316',
      cargoVal: '₹112 Cr/day'
    },
    {
      id: 'NODE-JNPT',
      name: 'JNPT Nhava Sheva Container Port',
      type: 'Maritime Gateway & Western DFC Rail-head',
      modality: 'Maritime / DFC Rail',
      coordinates: '18.95°N, 72.95°E',
      position: { x: -1.5, y: 1.35, z: 2.4 },
      color: '#22d3ee',
      cargoVal: '₹820 Cr/day'
    },
    {
      id: 'NODE-MUNDRA',
      name: 'Mundra Port & SEZ (APSEZ)',
      type: 'Deepwater Container & Bulk Port',
      modality: 'Maritime / Rail Freight',
      coordinates: '22.74°N, 69.70°E',
      position: { x: -4.2, y: 1.35, z: 4.8 },
      color: '#10b981',
      cargoVal: '₹610 Cr/day'
    },
    {
      id: 'NODE-BLR',
      name: 'Bengaluru Tech & Hardware Logistics Hub',
      type: 'Air Cargo & Surface Corridor',
      modality: 'Air / Road (NH44/NH48)',
      coordinates: '12.97°N, 77.59°E',
      position: { x: 1.2, y: 1.35, z: -1.8 },
      color: '#a855f7',
      cargoVal: '₹290 Cr/day'
    },
    {
      id: 'NODE-CHENNAI',
      name: 'Chennai Port & Sriperumbudur Hub',
      type: 'Automotive RO-RO & Maritime Gateway',
      modality: 'Maritime / Road (NH16)',
      coordinates: '13.08°N, 80.29°E',
      position: { x: 2.8, y: 1.35, z: -1.0 },
      color: '#06b6d4',
      cargoVal: '₹470 Cr/day'
    },
    {
      id: 'NODE-DELHI',
      name: 'Delhi NCR Dadri Logistics Mega-Hub',
      type: 'Western & Eastern DFC Rail Confluence',
      modality: 'DFC Rail / Air / Road',
      coordinates: '28.55°N, 77.55°E',
      position: { x: 0.0, y: 1.35, z: 7.2 },
      color: '#f59e0b',
      cargoVal: '₹530 Cr/day'
    },
    {
      id: 'NODE-KOLKATA',
      name: 'Kolkata Dankuni DFC & Port Terminal',
      type: 'Eastern DFC Terminus & Riverine Port',
      modality: 'Eastern DFC / Riverine Port',
      coordinates: '22.68°N, 88.29°E',
      position: { x: 3.8, y: 1.35, z: 2.2 },
      color: '#ec4899',
      cargoVal: '₹240 Cr/day'
    }
  ];

  // Setup GSAP Animation Loop across Rail, Road, Maritime and Air Light-Trails
  useEffect(() => {
    if (viewMode !== '3d-globe') return;

    const ctx = gsap.context(() => {
      // 1. RAIL: Western DFC Heavy Double-Stack Train Light-Trail
      gsap.to(gsapProgressRef.current, {
        railWesternDfc: 1,
        duration: 12 / simSpeed,
        ease: 'none',
        repeat: -1,
        paused: !is3DPlaying
      });

      // 1b. RAIL: Eastern DFC Bulk Freight Light-Trail
      gsap.to(gsapProgressRef.current, {
        railEasternDfc: 1,
        duration: 14 / simSpeed,
        ease: 'none',
        repeat: -1,
        paused: !is3DPlaying
      });

      // 2. ROAD: Golden Quadrilateral FASTag Commercial Truck Light-Trails
      gsap.to(gsapProgressRef.current, {
        roadDelhiMumbai: 1,
        duration: 15 / simSpeed,
        ease: 'power1.inOut',
        repeat: -1,
        paused: !is3DPlaying
      });

      gsap.to(gsapProgressRef.current, {
        roadMumbaiChennai: 1,
        duration: 13 / simSpeed,
        ease: 'power1.inOut',
        repeat: -1,
        paused: !is3DPlaying
      });

      gsap.to(gsapProgressRef.current, {
        roadChennaiKolkata: 1,
        duration: 16 / simSpeed,
        ease: 'none',
        repeat: -1,
        paused: !is3DPlaying
      });

      gsap.to(gsapProgressRef.current, {
        roadKolkataDelhi: 1,
        duration: 14 / simSpeed,
        ease: 'none',
        repeat: -1,
        paused: !is3DPlaying
      });

      // 3. MARITIME: Coastal Container Vessel Light-Trails
      gsap.to(gsapProgressRef.current, {
        maritimeWestCoast: 1,
        duration: 22 / simSpeed,
        ease: 'sine.inOut',
        repeat: -1,
        paused: !is3DPlaying
      });

      gsap.to(gsapProgressRef.current, {
        maritimeEastCoast: 1,
        duration: 20 / simSpeed,
        ease: 'sine.inOut',
        repeat: -1,
        paused: !is3DPlaying
      });

      // 4. AIR: High-Altitude Air Cargo Light-Trails
      gsap.to(gsapProgressRef.current, {
        airDelBlr: 1,
        duration: 7 / simSpeed,
        ease: 'none',
        repeat: -1,
        paused: !is3DPlaying
      });

      gsap.to(gsapProgressRef.current, {
        airBomHyd: 1,
        duration: 6 / simSpeed,
        ease: 'none',
        repeat: -1,
        paused: !is3DPlaying
      });

      // 5. Radar Pulse Glow Cycle
      gsap.to(gsapProgressRef.current, {
        pulseCycle: 1,
        duration: 1.6 / simSpeed,
        ease: 'sine.out',
        repeat: -1,
        paused: !is3DPlaying
      });
    });

    return () => ctx.revert();
  }, [viewMode, simSpeed, is3DPlaying]);

  // Three.js 3D WebGL Canvas Scene
  useEffect(() => {
    if (viewMode !== '3d-globe') return;

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060c18);
    scene.fog = new THREE.FogExp2(0x060c18, 0.012);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 19, 23);
    camera.lookAt(0, -1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x22385b, 1.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x7dd3fc, 2.8);
    mainLight.position.set(15, 30, 20);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const blueBackLight = new THREE.DirectionalLight(0x1d4ed8, 2.0);
    blueBackLight.position.set(-20, 10, -20);
    scene.add(blueBackLight);

    // --- Curved Earth Terrain Sphere ---
    const globeRadius = 24;
    const earthGeo = new THREE.SphereGeometry(globeRadius, 64, 48, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x071326,
      roughness: 0.6,
      metalness: 0.3,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.position.set(0, -globeRadius + 1.2, 0);
    earth.receiveShadow = true;
    scene.add(earth);

    // Indian Subcontinent Terrain Polygon
    const createContinentMesh = (coords: [number, number][], color = 0x15803d) => {
      const shape = new THREE.Shape();
      coords.forEach(([x, z], i) => {
        if (i === 0) shape.moveTo(x, -z);
        else shape.lineTo(x, -z);
      });
      const geo = new THREE.ShapeGeometry(shape);
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: 0x064e3b,
        emissiveIntensity: 0.65,
        roughness: 0.7,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = 1.22;
      return mesh;
    };

    const indiaSubcontinent = createContinentMesh([
      [-1, 8], [3, 8], [4, 5], [3, 1], [0, -3], [-3, 1], [-4, 5], [-2, 8]
    ], 0x16a34a);
    scene.add(indiaSubcontinent);

    const gridHelper = new THREE.GridHelper(30, 24, 0x1e3a8a, 0x0f1d38);
    gridHelper.position.y = 1.24;
    scene.add(gridHelper);

    // --- 3D HUBS & NODAL PINS ---
    const hubPointersGroup = new THREE.Group();
    scene.add(hubPointersGroup);
    const hubPulsingRings: { mesh: THREE.Mesh; color: string }[] = [];

    transitHubs.forEach((hub) => {
      const hGroup = new THREE.Group();
      hGroup.position.set(hub.position.x, hub.position.y, hub.position.z);

      // Core Solid Pin Mesh
      const pinCore = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.04, 0.5, 12),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(hub.color), metalness: 0.8 })
      );
      pinCore.position.y = 0.25;
      hGroup.add(pinCore);

      const headSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 12, 12),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(hub.color) })
      );
      headSphere.position.y = 0.55;
      hGroup.add(headSphere);

      // Local Point Light
      const pLight = new THREE.PointLight(new THREE.Color(hub.color), 1.8, 3.5);
      pLight.position.y = 0.6;
      hGroup.add(pLight);

      // Pulsing Base Ring
      const ringGeo = new THREE.RingGeometry(0.2, 0.35, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(hub.color),
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -0.1;
      hGroup.add(ring);
      hubPulsingRings.push({ mesh: ring, color: hub.color });

      hubPointersGroup.add(hGroup);
    });

    // --- CURVED ARC PATH GEOMETRIES ACROSS RAIL, ROAD, MARITIME, AIR ---
    // 1. RAIL ARCS (Dedicated Freight Corridors)
    const arcWesternDfc = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 1.3, 7.2),   // Dadri Terminal (NCR)
      new THREE.Vector3(-1.0, 1.34, 5.8), // Rewari Junction
      new THREE.Vector3(-2.8, 1.34, 4.5), // Sanand / Palanpur
      new THREE.Vector3(-2.2, 1.34, 3.4), // Vadodara
      new THREE.Vector3(-1.5, 1.3, 2.4)   // JNPT Nhava Sheva
    ]);

    const arcEasternDfc = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 1.3, 7.2),   // Khurja / Dadri
      new THREE.Vector3(1.5, 1.34, 5.5),  // Kanpur DFC Yard
      new THREE.Vector3(2.5, 1.34, 4.0),  // Mughalsarai / DDU
      new THREE.Vector3(3.8, 1.3, 2.2)    // Dankuni Terminal (Kolkata)
    ]);

    // 2. ROAD ARCS (Golden Quadrilateral Highway Network)
    const arcRoadDelhiMumbai = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 1.28, 7.2),  // Delhi NCR
      new THREE.Vector3(-1.2, 1.3, 6.0),  // Jaipur
      new THREE.Vector3(-2.8, 1.3, 4.5),  // Ahmedabad / Sanand
      new THREE.Vector3(-2.0, 1.3, 3.2),  // Surat
      new THREE.Vector3(-1.5, 1.28, 2.4), // Mumbai / Bhiwandi
      new THREE.Vector3(0.5, 1.28, 1.5)   // Pune Chakan MIDC
    ]);

    const arcRoadMumbaiChennai = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.5, 1.28, 1.5),  // Pune Chakan
      new THREE.Vector3(0.8, 1.3, 0.0),   // Belagavi / Hubli
      new THREE.Vector3(1.2, 1.28, -1.8), // Bengaluru Electronic City
      new THREE.Vector3(2.8, 1.28, -1.0)  // Chennai Sriperumbudur
    ]);

    const arcRoadChennaiKolkata = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.8, 1.28, -1.0), // Chennai
      new THREE.Vector3(2.4, 1.3, 0.5),   // Vijayawada
      new THREE.Vector3(3.0, 1.3, 1.2),   // Visakhapatnam
      new THREE.Vector3(3.8, 1.28, 2.2)   // Kolkata Hub
    ]);

    const arcRoadKolkataDelhi = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.8, 1.28, 2.2),  // Kolkata
      new THREE.Vector3(2.2, 1.3, 4.2),   // Varanasi
      new THREE.Vector3(1.4, 1.3, 5.6),   // Kanpur
      new THREE.Vector3(0.6, 1.3, 6.6),   // Agra
      new THREE.Vector3(0.0, 1.28, 7.2)   // Delhi NCR
    ]);

    // 3. MARITIME ARCS (Coastal Maritime Routes)
    const arcMaritimeWestCoast = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.2, 1.26, 4.8),  // Mundra Port
      new THREE.Vector3(-4.5, 1.26, 2.2),  // JNPT Offshore
      new THREE.Vector3(-2.8, 1.26, -2.5), // Cochin ICTT Offshore
      new THREE.Vector3(0.0, 1.26, -4.2)   // Cape Comorin
    ]);

    const arcMaritimeEastCoast = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 1.26, -4.2),  // Cape Comorin
      new THREE.Vector3(3.6, 1.26, -2.0),  // Chennai Port
      new THREE.Vector3(4.6, 1.26, 0.8),   // Visakhapatnam Port
      new THREE.Vector3(4.2, 1.26, 2.4)    // Kolkata Haldia
    ]);

    // 4. AIR ARCS (High-Altitude Parabolic Curves)
    const createAirArc = (p1: THREE.Vector3, p2: THREE.Vector3, apex = 5.4) => {
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y += apex;
      return new THREE.QuadraticBezierCurve3(p1, mid, p2);
    };
    const arcAirDelBlr = createAirArc(new THREE.Vector3(0.0, 1.4, 7.2), new THREE.Vector3(1.2, 1.4, -1.8), 5.6);
    const arcAirBomHyd = createAirArc(new THREE.Vector3(-1.5, 1.4, 2.4), new THREE.Vector3(1.0, 1.4, 0.4), 4.8);

    // Draw Static Curved Track Lines with Glowing Dashes
    const drawTrackLine = (curve: THREE.Curve<THREE.Vector3>, color: number, isDashed = true, opacity = 0.75) => {
      const points = curve.getPoints(60);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = isDashed
        ? new THREE.LineDashedMaterial({ color, dashSize: 0.35, gapSize: 0.2, transparent: true, opacity, linewidth: 2 })
        : new THREE.LineBasicMaterial({ color, transparent: true, opacity, linewidth: 2 });
      const line = new THREE.Line(geo, mat);
      if (isDashed) line.computeLineDistances();
      return line;
    };

    // Track Grouping
    const railLineGroup = new THREE.Group();
    railLineGroup.add(drawTrackLine(arcWesternDfc, 0x22d3ee, true, 0.9)); // Electric Cyan Rail
    railLineGroup.add(drawTrackLine(arcEasternDfc, 0x10b981, true, 0.9)); // Emerald Green Rail
    scene.add(railLineGroup);

    const roadLineGroup = new THREE.Group();
    roadLineGroup.add(drawTrackLine(arcRoadDelhiMumbai, 0xf59e0b, false, 0.75));
    roadLineGroup.add(drawTrackLine(arcRoadMumbaiChennai, 0x0284c7, false, 0.75));
    roadLineGroup.add(drawTrackLine(arcRoadChennaiKolkata, 0x06b6d4, false, 0.75));
    roadLineGroup.add(drawTrackLine(arcRoadKolkataDelhi, 0xeab308, false, 0.75));
    scene.add(roadLineGroup);

    const maritimeLineGroup = new THREE.Group();
    maritimeLineGroup.add(drawTrackLine(arcMaritimeWestCoast, 0xf43f5e, true, 0.85));
    maritimeLineGroup.add(drawTrackLine(arcMaritimeEastCoast, 0xf43f5e, true, 0.85));
    scene.add(maritimeLineGroup);

    const airLineGroup = new THREE.Group();
    airLineGroup.add(drawTrackLine(arcAirDelBlr, 0xa855f7, true, 0.85));
    airLineGroup.add(drawTrackLine(arcAirBomHyd, 0x38bdf8, true, 0.85));
    scene.add(airLineGroup);

    // --- LIGHT-TRAIL MARKERS BUILDER ---
    // Creates a glowing photon head + multi-node trailing tail representing freight motion
    const createLightTrailMarker = (colorHex: number, tailColorHex: number, iconType: 'train' | 'truck' | 'ship' | 'plane') => {
      const group = new THREE.Group();

      // Leading Photon Head
      const headMat = new THREE.MeshBasicMaterial({ color: colorHex });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), headMat);
      group.add(head);

      // Trailing Light Nodes (Tail Stream)
      const tailSpheres: THREE.Mesh[] = [];
      for (let i = 1; i <= 6; i++) {
        const radius = 0.15 * (1 - i * 0.12);
        const tMat = new THREE.MeshBasicMaterial({
          color: tailColorHex,
          transparent: true,
          opacity: 0.9 * (1 - i * 0.14)
        });
        const tailNode = new THREE.Mesh(new THREE.SphereGeometry(radius, 8, 8), tMat);
        group.add(tailNode);
        tailSpheres.push(tailNode);
      }

      // Point Light for Local Atmospheric Glow
      const glow = new THREE.PointLight(colorHex, 2.5, 4.5);
      group.add(glow);

      // Optional 3D Geometry Core
      if (iconType === 'train') {
        const trainBox = new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 0.22, 0.22),
          new THREE.MeshStandardMaterial({ color: 0x22d3ee, metalness: 0.9 })
        );
        trainBox.position.set(-0.25, 0.05, 0);
        group.add(trainBox);
      } else if (iconType === 'truck') {
        const truckBox = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.25, 0.25),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 })
        );
        truckBox.position.set(-0.2, 0.05, 0);
        group.add(truckBox);
      } else if (iconType === 'ship') {
        const shipHull = new THREE.Mesh(
          new THREE.BoxGeometry(0.8, 0.2, 0.35),
          new THREE.MeshStandardMaterial({ color: 0xf43f5e, metalness: 0.7 })
        );
        shipHull.position.set(-0.25, 0.05, 0);
        group.add(shipHull);
      } else if (iconType === 'plane') {
        const wing = new THREE.Mesh(
          new THREE.BoxGeometry(0.18, 0.02, 0.9),
          new THREE.MeshStandardMaterial({ color: colorHex })
        );
        group.add(wing);
      }

      return { group, tailSpheres, iconType };
    };

    // Instantiate Modality Light-Trail Markers
    // 1. Rail Light-Trails
    const railTrailWestern = createLightTrailMarker(0x22d3ee, 0x67e8f9, 'train'); // CONCOR DFC West
    const railTrailEastern = createLightTrailMarker(0x10b981, 0x34d399, 'train'); // Coal & Steel DFC East
    scene.add(railTrailWestern.group);
    scene.add(railTrailEastern.group);

    // 2. Road Light-Trails (Golden Quadrilateral)
    const roadTrailDelhiMumbai = createLightTrailMarker(0xf59e0b, 0xfbbf24, 'truck');
    const roadTrailMumbaiChennai = createLightTrailMarker(0x0284c7, 0x38bdf8, 'truck');
    const roadTrailChennaiKolkata = createLightTrailMarker(0x06b6d4, 0x67e8f9, 'truck');
    const roadTrailKolkataDelhi = createLightTrailMarker(0xeab308, 0xfde047, 'truck');
    scene.add(roadTrailDelhiMumbai.group);
    scene.add(roadTrailMumbaiChennai.group);
    scene.add(roadTrailChennaiKolkata.group);
    scene.add(roadTrailKolkataDelhi.group);

    // 3. Maritime Light-Trails
    const maritimeTrailWest = createLightTrailMarker(0xf43f5e, 0xfb7185, 'ship'); // M.V. Samudra
    const maritimeTrailEast = createLightTrailMarker(0xf43f5e, 0xfb7185, 'ship'); // East Coast Container
    scene.add(maritimeTrailWest.group);
    scene.add(maritimeTrailEast.group);

    // 4. Air Light-Trails
    const airTrailDelBlr = createLightTrailMarker(0xa855f7, 0xc084fc, 'plane');
    const airTrailBomHyd = createLightTrailMarker(0x38bdf8, 0x7dd3fc, 'plane');
    scene.add(airTrailDelBlr.group);
    scene.add(airTrailBomHyd.group);

    // --- Orbit & Drag Controls ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      scene.rotation.y += deltaX * 0.004;
      camera.position.y = Math.max(10, Math.min(26, camera.position.y - deltaY * 0.04));
      camera.lookAt(0, -1, 0);

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Helper: Update Light-Trail Marker Position and Trailing Nodes along Curve
    const updateTrailMarker = (
      marker: { group: THREE.Group; tailSpheres: THREE.Mesh[] },
      curve: THREE.Curve<THREE.Vector3>,
      progress: number,
      visible: boolean
    ) => {
      marker.group.visible = visible;
      if (!visible) return;

      const pt = curve.getPointAt(progress);
      const tangent = curve.getTangentAt(progress);
      marker.group.position.copy(pt);
      marker.group.lookAt(pt.clone().add(tangent));

      marker.tailSpheres.forEach((ts, idx) => {
        const backT = Math.max(0, progress - (idx + 1) * 0.022);
        const backPt = curve.getPointAt(backT);
        ts.position.copy(backPt.clone().sub(pt));
      });
    };

    // --- Render Loop ---
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const p = gsapProgressRef.current;

      // Visibility sync
      railLineGroup.visible = showRail;
      roadLineGroup.visible = showRoad;
      maritimeLineGroup.visible = showMaritime;
      airLineGroup.visible = showAir;

      // 1. Update Rail Light-Trails
      updateTrailMarker(railTrailWestern, arcWesternDfc, p.railWesternDfc, showRail);
      updateTrailMarker(railTrailEastern, arcEasternDfc, p.railEasternDfc, showRail);

      // 2. Update Road Light-Trails (Golden Quadrilateral)
      updateTrailMarker(roadTrailDelhiMumbai, arcRoadDelhiMumbai, p.roadDelhiMumbai, showRoad);
      updateTrailMarker(roadTrailMumbaiChennai, arcRoadMumbaiChennai, p.roadMumbaiChennai, showRoad);
      updateTrailMarker(roadTrailChennaiKolkata, arcRoadChennaiKolkata, p.roadChennaiKolkata, showRoad);
      updateTrailMarker(roadTrailKolkataDelhi, arcRoadKolkataDelhi, p.roadKolkataDelhi, showRoad);

      // 3. Update Maritime Light-Trails
      updateTrailMarker(maritimeTrailWest, arcMaritimeWestCoast, p.maritimeWestCoast, showMaritime);
      updateTrailMarker(maritimeTrailEast, arcMaritimeEastCoast, p.maritimeEastCoast, showMaritime);

      // 4. Update Air Light-Trails
      updateTrailMarker(airTrailDelBlr, arcAirDelBlr, p.airDelBlr, showAir);
      updateTrailMarker(airTrailBomHyd, arcAirBomHyd, p.airBomHyd, showAir);

      // 5. Update Pulsing Base Rings at Transit Hubs
      const rScale = 1 + p.pulseCycle * 3.4;
      hubPulsingRings.forEach(({ mesh }) => {
        mesh.scale.set(rScale, rScale, rScale);
        (mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - p.pulseCycle);
      });

      // Slow scene idle rotation
      if (!isDragging) {
        scene.rotation.y += 0.0005;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, [viewMode, showRail, showRoad, showMaritime, showAir]);

  return (
    <div className="relative w-full h-full bg-[#060c18] rounded-xl overflow-hidden border border-[#142032] shadow-inner select-none">
      {/* Top Header Controls with Multi-Modal Modality Filter Toggles */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Title Badge */}
        <div className="pointer-events-auto px-3 py-1 rounded-full bg-[#0d1624]/90 backdrop-blur-md border border-[#1e2d42] text-xs font-semibold text-white flex items-center gap-2 shadow-lg">
          <Zap className="w-3.5 h-3.5 text-[#22d3ee] animate-pulse" />
          <span>Multi-Modal Light-Trail Transit (Rail • Road • Maritime • Air)</span>
        </div>

        {/* Modality Toggles Toolbar */}
        <div className="pointer-events-auto flex items-center gap-1 bg-[#09101c]/90 backdrop-blur-md border border-[#162438] p-1 rounded-xl shadow-lg text-[10px]">
          <button
            onClick={() => setShowRail(!showRail)}
            className={`px-2 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
              showRail ? 'bg-[#22d3ee] text-[#060c18] font-bold' : 'text-[#64748b] hover:text-white'
            }`}
          >
            <Train className="w-3 h-3" />
            <span>DFC Rail</span>
          </button>

          <button
            onClick={() => setShowRoad(!showRoad)}
            className={`px-2 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
              showRoad ? 'bg-[#f59e0b] text-[#060c18] font-bold' : 'text-[#64748b] hover:text-white'
            }`}
          >
            <Truck className="w-3 h-3" />
            <span>Golden Quad</span>
          </button>

          <button
            onClick={() => setShowMaritime(!showMaritime)}
            className={`px-2 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
              showMaritime ? 'bg-[#f43f5e] text-white font-bold' : 'text-[#64748b] hover:text-white'
            }`}
          >
            <Ship className="w-3 h-3" />
            <span>Maritime</span>
          </button>

          <button
            onClick={() => setShowAir(!showAir)}
            className={`px-2 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
              showAir ? 'bg-[#a855f7] text-white font-bold' : 'text-[#64748b] hover:text-white'
            }`}
          >
            <Plane className="w-3 h-3" />
            <span>Air Cargo</span>
          </button>
        </div>

        {/* GSAP Playback & View Mode Toolbar */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          {viewMode === '3d-globe' && (
            <div className="flex items-center gap-1 bg-[#09101c]/90 backdrop-blur-md border border-[#162438] p-1 rounded-xl shadow-lg text-[10px]">
              <button
                onClick={() => setIs3DPlaying(!is3DPlaying)}
                className="p-1.5 rounded-lg bg-[#152338] text-[#38bdf8] hover:text-white cursor-pointer"
                title={is3DPlaying ? 'Pause GSAP Simulation' : 'Play GSAP Simulation'}
              >
                {is3DPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
              </button>

              {[1, 2, 5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSimSpeed(speed)}
                  className={`px-2 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                    simSpeed === speed ? 'bg-[#1e60f2] text-white' : 'text-[#64748b] hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1 bg-[#09101c]/90 backdrop-blur-md border border-[#162438] p-1 rounded-xl shadow-xl">
            <button
              onClick={() => setViewMode('3d-globe')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === '3d-globe'
                  ? 'bg-[#1e60f2] text-white shadow-md'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>3D Light-Trails</span>
            </button>

            <button
              onClick={() => setViewMode('mapbox')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'mapbox'
                  ? 'bg-[#1e60f2] text-white shadow-md'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Mapbox Layer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Active View Layer */}
      {viewMode === '3d-globe' ? (
        <div className="w-full h-full relative">
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Interactive Floating 3D Nodal Badges */}
          {/* Pune MIDC */}
          <div 
            onClick={() => setSelectedTransitNode(transitHubs[0])}
            className="absolute top-[38%] right-[44%] transform -translate-x-1/2 flex flex-col items-center cursor-pointer group z-10"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-[#ef4444] shadow-[0_0_12px_#ef4444] border-2 border-white flex items-center justify-center animate-pulse">
              <div className="w-1 h-1 rounded-full bg-white"></div>
            </div>
            <div className="mt-1 px-2 py-0.5 rounded bg-[#09111e]/95 border border-[#ef4444]/60 text-[10px] font-bold text-white shadow-lg whitespace-nowrap">
              Pune <span className="text-[#94a3b8] font-normal">Chakan MIDC</span>
            </div>
          </div>

          {/* Sanand GIDC */}
          <div 
            onClick={() => setSelectedTransitNode(transitHubs[1])}
            className="absolute top-[24%] left-[32%] transform -translate-x-1/2 flex flex-col items-center cursor-pointer group z-10"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-[#f97316] shadow-[0_0_12px_#f97316] border-2 border-white flex items-center justify-center animate-pulse">
              <div className="w-1 h-1 rounded-full bg-white"></div>
            </div>
            <div className="mt-1 px-2 py-0.5 rounded bg-[#09111e]/95 border border-[#f97316]/60 text-[10px] font-bold text-white shadow-lg whitespace-nowrap">
              Sanand <span className="text-[#94a3b8] font-normal">GIDC DFC</span>
            </div>
          </div>

          {/* Bengaluru */}
          <div 
            onClick={() => setSelectedTransitNode(transitHubs[4])}
            className="absolute bottom-[30%] right-[36%] transform -translate-x-1/2 flex flex-col items-center cursor-pointer group z-10"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-[#a855f7] shadow-[0_0_12px_#a855f7] border-2 border-white flex items-center justify-center animate-pulse">
              <div className="w-1 h-1 rounded-full bg-white"></div>
            </div>
            <div className="mt-1 px-2 py-0.5 rounded bg-[#09111e]/95 border border-[#a855f7]/60 text-[10px] font-bold text-white shadow-lg whitespace-nowrap">
              Bengaluru <span className="text-[#94a3b8] font-normal">Electronic City</span>
            </div>
          </div>

          {/* Bottom Left Multi-Modal Light-Trail Telemetry Feed */}
          <div className="absolute bottom-3 left-3 bg-[#09101c]/90 backdrop-blur-md border border-[#162438] rounded-xl p-2.5 text-[10px] text-[#94a3b8] space-y-1.5 z-10 max-w-sm">
            <div className="flex items-center justify-between border-b border-[#141d2b] pb-1">
              <span className="text-[9px] uppercase font-bold text-[#38bdf8] flex items-center gap-1">
                <Radio className="w-3 h-3 text-[#22d3ee]" />
                Multi-Modal Light-Trails
              </span>
              <span className="text-[9px] text-[#10b981] font-mono">{simSpeed}X GSAP MOTION</span>
            </div>
            <div className="space-y-1 text-[10px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-white">
                  <Train className="w-3 h-3 text-[#22d3ee]" />
                  Western DFC Rail Light-Trail
                </span>
                <span className="font-mono text-[#22d3ee] font-bold">Dadri ↔ JNPT (78 km/h)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-white">
                  <Truck className="w-3 h-3 text-[#f59e0b]" />
                  NH48 FASTag Highway Trail
                </span>
                <span className="font-mono text-[#f59e0b] font-bold">Delhi ↔ Pune (44 km/h)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-white">
                  <Ship className="w-3 h-3 text-[#f43f5e]" />
                  Coastal Sea Lane Trail
                </span>
                <span className="font-mono text-[#f43f5e] font-bold">Mundra ↔ Chennai (18.2 kts)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-white">
                  <Plane className="w-3 h-3 text-[#a855f7]" />
                  High-Altitude Air Express
                </span>
                <span className="font-mono text-[#a855f7] font-bold">DEL ↔ BLR (FL360)</span>
              </div>
            </div>
          </div>

          {/* Selected Transit Node Modal */}
          {selectedTransitNode && (
            <div className="absolute bottom-3 right-3 w-80 bg-[#0b1322]/95 backdrop-blur-md border border-[#1e2d42] rounded-xl p-3.5 shadow-2xl z-20 space-y-2">
              <div className="flex items-center justify-between border-b border-[#162438] pb-2">
                <div>
                  <span className="text-[10px] font-mono text-[#38bdf8] font-bold">{selectedTransitNode.id}</span>
                  <h4 className="text-xs font-bold text-white leading-tight">{selectedTransitNode.name}</h4>
                  <p className="text-[10px] text-[#94a3b8]">{selectedTransitNode.coordinates}</p>
                </div>
                <button 
                  onClick={() => setSelectedTransitNode(null)}
                  className="text-[#64748b] hover:text-white p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 rounded-lg bg-[#0e1726] border border-[#18263a]">
                  <span className="text-[#64748b] block">Freight Modality</span>
                  <span className="font-bold text-white">{selectedTransitNode.modality}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#0e1726] border border-[#18263a]">
                  <span className="text-[#64748b] block">Daily Cargo Value</span>
                  <span className="font-bold text-[#22c55e]">{selectedTransitNode.cargoVal}</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-[#0e1726] border border-[#18263a] text-[10px]">
                <span className="text-[#64748b] block">Hub Telemetry Classification:</span>
                <span className="text-white font-medium">{selectedTransitNode.type}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <MapboxIndiaInfrastructure onSelectNode={onSelectNode} />
      )}
    </div>
  );
};
