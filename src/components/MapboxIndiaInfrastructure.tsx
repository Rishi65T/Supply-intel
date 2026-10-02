import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { 
  Navigation, 
  Train, 
  Ship, 
  Truck, 
  Plane, 
  Play, 
  Pause, 
  FastForward, 
  Info, 
  Radio, 
  Zap, 
  Layers,
  MapPin,
  Clock
} from 'lucide-react';

interface MapboxIndiaProps {
  onSelectNode?: (node: any) => void;
  selectedNodeId?: string;
}

export const MapboxIndiaInfrastructure: React.FC<MapboxIndiaProps> = ({ onSelectNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Layer toggles
  const [showHighways, setShowHighways] = useState(true);
  const [showDFCRail, setShowDFCRail] = useState(true);
  const [showPorts, setShowPorts] = useState(true);
  const [showTransitNodes, setShowTransitNodes] = useState(true);

  // India geographical coordinate to Canvas mapping
  const toCanvas = (lat: number, lng: number, width: number, height: number) => {
    const minLng = 68.0;
    const maxLng = 92.0;
    const minLat = 7.5;
    const maxLat = 33.5;

    const x = ((lng - minLng) / (maxLng - minLng)) * (width * 0.82) + width * 0.09;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * (height * 0.84) + height * 0.08;
    return { x, y };
  };

  // Ports Database
  const ports = [
    {
      id: 'PORT-MUNDRA',
      name: 'Mundra Port (APSEZ)',
      state: 'Gujarat',
      lat: 22.7441,
      lng: 69.7061,
      type: 'Major Deepwater Port',
      capacity: '7.2M TEU / 155 MMT',
      dwellTime: '14.2 hrs',
      cargoValue: '₹18,400 Cr / mo',
      status: 'Optimal Operations',
      traffic: 'Crude, Automotive & Electronics'
    },
    {
      id: 'PORT-JNPT',
      name: 'JNPT Nhava Sheva Port',
      state: 'Maharashtra',
      lat: 18.9499,
      lng: 72.9511,
      type: 'Major Container Gateway Port',
      capacity: '5.1M TEU (GTI & BMCT)',
      dwellTime: '42.0 hrs',
      cargoValue: '₹24,800 Cr / mo',
      status: 'Moderate Congestion (Berth 4 Overhaul)',
      traffic: 'EV Batteries, Automotive Chassis, Pharma'
    },
    {
      id: 'PORT-CHENNAI',
      name: 'Chennai Port & Kamarajar',
      state: 'Tamil Nadu',
      lat: 13.0827,
      lng: 80.2925,
      type: 'Major Automotive RO-RO Port',
      capacity: '2.8M TEU / 65 MMT',
      dwellTime: '18.5 hrs',
      cargoValue: '₹14,200 Cr / mo',
      status: 'Optimal Operations',
      traffic: 'Automobile Exports & Precision Parts'
    },
    {
      id: 'PORT-COCHIN',
      name: 'Cochin Port (Vallarpadam ICTT)',
      state: 'Kerala',
      lat: 9.9667,
      lng: 76.2667,
      type: 'International Transshipment Terminal',
      capacity: '1.2M TEU',
      dwellTime: '16.0 hrs',
      cargoValue: '₹6,800 Cr / mo',
      status: 'Optimal Operations',
      traffic: 'Transshipment & Industrial Chemicals'
    },
    {
      id: 'PORT-VIZAG',
      name: 'Visakhapatnam Port',
      state: 'Andhra Pradesh',
      lat: 17.6868,
      lng: 83.2185,
      type: 'Deepwater East Coast Port',
      capacity: '1.5M TEU / 80 MMT',
      dwellTime: '22.0 hrs',
      cargoValue: '₹9,400 Cr / mo',
      status: 'Elevated Sea Swell Advisory',
      traffic: 'Steel, Minerals & Heavy Foundry'
    },
    {
      id: 'PORT-KOLKATA',
      name: 'Kolkata & Haldia Dock Complex',
      state: 'West Bengal',
      lat: 22.0258,
      lng: 88.0583,
      type: 'Riverine Major Port',
      capacity: '1.1M TEU',
      dwellTime: '26.4 hrs',
      cargoValue: '₹7,100 Cr / mo',
      status: 'Normal Operations',
      traffic: 'Jute, Metals & Industrial Machinery'
    }
  ];

  // Golden Quadrilateral Highway Nodes
  const gqDelhi = { name: 'Delhi NCR Hub', lat: 28.6139, lng: 77.2090 };
  const gqJaipur = { name: 'Jaipur', lat: 26.9124, lng: 75.7873 };
  const gqAhmedabad = { name: 'Ahmedabad / Sanand GIDC', lat: 23.0225, lng: 72.5714 };
  const gqSurat = { name: 'Surat', lat: 21.1702, lng: 72.8311 };
  const gqMumbai = { name: 'Mumbai / Bhiwandi DC', lat: 19.0760, lng: 72.8777 };
  const gqPune = { name: 'Pune (Chakan MIDC)', lat: 18.5204, lng: 73.8567 };
  const gqBelagavi = { name: 'Belagavi', lat: 15.8497, lng: 74.4977 };
  const gqBengaluru = { name: 'Bengaluru (Electronic City)', lat: 12.9716, lng: 77.5946 };
  const gqChennai = { name: 'Chennai (Sriperumbudur)', lat: 13.0827, lng: 80.2707 };
  const gqVijayawada = { name: 'Vijayawada', lat: 16.5062, lng: 80.6480 };
  const gqVisakhapatnam = { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 };
  const gqBhubaneswar = { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 };
  const gqKolkata = { name: 'Kolkata Hub', lat: 22.5726, lng: 88.3639 };
  const gqVaranasi = { name: 'Varanasi', lat: 25.3176, lng: 82.9739 };
  const gqKanpur = { name: 'Kanpur Hub', lat: 26.4499, lng: 80.3319 };
  const gqAgra = { name: 'Agra Express', lat: 27.1767, lng: 78.0081 };

  // DFC Rail Corridors
  const westernDfcNodes = [
    { name: 'Dadri DFC Terminal (NCR)', lat: 28.5500, lng: 77.5500 },
    { name: 'Rewari DFC Junction', lat: 28.1800, lng: 76.6200 },
    { name: 'Palanpur DFC Yard', lat: 24.1700, lng: 72.4300 },
    { name: 'Sanand / Ahmedabad DFC Siding', lat: 22.9800, lng: 72.3800 },
    { name: 'Vadodara DFC Freight Station', lat: 22.3000, lng: 73.1800 },
    { name: 'JNPT Maritime DFC Terminal', lat: 18.9500, lng: 72.9500 }
  ];

  const easternDfcNodes = [
    { name: 'Ludhiana DFC Depot', lat: 30.9000, lng: 75.8500 },
    { name: 'Khurja DFC Junction', lat: 28.2500, lng: 77.8500 },
    { name: 'Kanpur DFC Yard', lat: 26.4500, lng: 80.3300 },
    { name: 'Pt. Deen Dayal Upadhyaya (MGS)', lat: 25.2800, lng: 83.1100 },
    { name: 'Dankuni DFC Terminal (Kolkata)', lat: 22.6800, lng: 88.2900 }
  ];

  // GSAP Animated Transit Nodes Data Object
  const transitStateRef = useRef({
    // Transit 1: Western DFC Heavy Double-Stack Train
    train1: { progress: 0, speedKmh: 76, currentStation: 'Palanpur DFC Yard' },
    // Transit 2: FASTag NH48 Multi-Axle Truck (Delhi -> Mumbai -> Pune)
    truck1: { progress: 0, speedKmh: 44, currentToll: 'Khalapur Toll Plaza (NH48)' },
    // Transit 3: FASTag Southern Corridor Truck (Bengaluru -> Chennai)
    truck2: { progress: 0, speedKmh: 58, currentToll: 'Attibele Expressway Toll' },
    // Transit 4: Coastal Container Ship (Mundra -> JNPT -> Cochin -> Chennai)
    ship1: { progress: 0, speedKnots: 18.2, currentSea: 'Off Goa Coastal Sector' },
    // Transit 5: Air Cargo Jet (BLR -> DEL)
    plane1: { progress: 0, speedKmh: 780, currentAirway: 'VABB Flight Level 320' },
    // Pulse animation ring values
    pulse: 0
  });

  // Setup GSAP Timelines for continuous real-time movement along corridors
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Train animation along Western DFC (Dadri to JNPT loop)
      gsap.to(transitStateRef.current.train1, {
        progress: 1,
        duration: 16 / simulationSpeed,
        ease: 'none',
        repeat: -1,
        paused: !isPlaying
      });

      // 2. FASTag Truck 1 along Western Highway (Delhi - Mumbai - Pune - BLR)
      gsap.to(transitStateRef.current.truck1, {
        progress: 1,
        duration: 22 / simulationSpeed,
        ease: 'power1.inOut',
        repeat: -1,
        paused: !isPlaying
      });

      // 3. FASTag Truck 2 along South Expressway (BLR - Chennai)
      gsap.to(transitStateRef.current.truck2, {
        progress: 1,
        duration: 10 / simulationSpeed,
        ease: 'none',
        repeat: -1,
        paused: !isPlaying
      });

      // 4. Coastal Container Ship along Indian Peninsular Sea Lanes
      gsap.to(transitStateRef.current.ship1, {
        progress: 1,
        duration: 30 / simulationSpeed,
        ease: 'sine.inOut',
        repeat: -1,
        paused: !isPlaying
      });

      // 5. Air Cargo Jet
      gsap.to(transitStateRef.current.plane1, {
        progress: 1,
        duration: 8 / simulationSpeed,
        ease: 'power1.inOut',
        repeat: -1,
        paused: !isPlaying
      });

      // GSAP Pulse Radar Glow
      gsap.to(transitStateRef.current, {
        pulse: 1,
        duration: 1.5,
        ease: 'sine.out',
        repeat: -1
      });
    });

    return () => ctx.revert();
  }, [simulationSpeed, isPlaying]);

  // Interpolate along multi-point waypoint array
  const interpolatePath = (points: { lat: number; lng: number }[], progress: number, width: number, height: number) => {
    if (points.length < 2) return toCanvas(points[0].lat, points[0].lng, width, height);

    const totalSegments = points.length - 1;
    const scaled = progress * totalSegments;
    const segIndex = Math.min(Math.floor(scaled), totalSegments - 1);
    const segT = scaled - segIndex;

    const pA = toCanvas(points[segIndex].lat, points[segIndex].lng, width, height);
    const pB = toCanvas(points[segIndex + 1].lat, points[segIndex + 1].lng, width, height);

    return {
      x: pA.x + (pB.x - pA.x) * segT,
      y: pA.y + (pB.y - pA.y) * segT,
      angle: Math.atan2(pB.y - pA.y, pB.x - pA.x)
    };
  };

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width = canvas.parentElement?.clientWidth || 800;
      const height = canvas.height = canvas.parentElement?.clientHeight || 420;

      // Map background
      ctx.fillStyle = '#060c18';
      ctx.fillRect(0, 0, width, height);

      // Coordinate Grid
      ctx.strokeStyle = '#0f1c30';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // India Landmass Contour Outline
      const indiaPolygon = [
        [32.5, 75.0], [31.5, 77.0], [29.5, 79.5], [28.5, 81.0], [27.5, 84.0],
        [26.5, 88.0], [26.0, 92.0], [24.5, 91.5], [22.5, 88.5], [20.0, 86.0],
        [17.5, 83.0], [13.0, 80.3], [10.5, 79.8], [8.2, 77.5], [10.0, 75.8],
        [15.0, 73.8], [19.0, 72.8], [21.0, 72.6], [23.0, 69.0], [24.0, 68.8],
        [27.5, 71.0], [30.5, 73.5], [32.5, 75.0]
      ];

      ctx.beginPath();
      indiaPolygon.forEach(([lat, lng], idx) => {
        const pt = toCanvas(lat, lng, width, height);
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();
      ctx.fillStyle = '#0a1628';
      ctx.fill();
      ctx.strokeStyle = '#1e385c';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // --- 1. Golden Quadrilateral Highways ---
      if (showHighways) {
        const gqArms = [
          [gqDelhi, gqJaipur, gqAhmedabad, gqSurat, gqMumbai],
          [gqMumbai, gqPune, gqBelagavi, gqBengaluru, gqChennai],
          [gqChennai, gqVijayawada, gqVisakhapatnam, gqBhubaneswar, gqKolkata],
          [gqKolkata, gqVaranasi, gqKanpur, gqAgra, gqDelhi]
        ];

        gqArms.forEach((arm, armIdx) => {
          ctx.beginPath();
          arm.forEach((node, nIdx) => {
            const pt = toCanvas(node.lat, node.lng, width, height);
            if (nIdx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.strokeStyle = armIdx === 1 ? '#f59e0b' : '#0284c7';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.strokeStyle = armIdx === 1 ? 'rgba(245, 158, 11, 0.35)' : 'rgba(56, 189, 248, 0.35)';
          ctx.lineWidth = 7;
          ctx.stroke();
        });
      }

      // --- 2. DFC Rail Corridors ---
      if (showDFCRail) {
        // Western DFC (Electric double-stack)
        ctx.beginPath();
        westernDfcNodes.forEach((node, nIdx) => {
          const pt = toCanvas(node.lat, node.lng, width, height);
          if (nIdx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 3.5;
        ctx.setLineDash([8, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Eastern DFC
        ctx.beginPath();
        easternDfcNodes.forEach((node, nIdx) => {
          const pt = toCanvas(node.lat, node.lng, width, height);
          if (nIdx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // --- 3. GSAP Animated Transit Nodes ---
      if (showTransitNodes) {
        const state = transitStateRef.current;

        // A. Western DFC Container Train (Dadri -> Sanand -> JNPT)
        const trainPos = interpolatePath(westernDfcNodes, state.train1.progress, width, height);
        
        // Train Glowing Trail
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(trainPos.x, trainPos.y, 8 + state.pulse * 4, 0, Math.PI * 2);
        ctx.stroke();

        // Train Core Icon / Marker
        ctx.fillStyle = '#22d3ee';
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(trainPos.x, trainPos.y, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Train Tag
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px Inter, sans-serif';
        ctx.fillText('CONCOR-DFC (76 km/h)', trainPos.x + 8, trainPos.y - 4);

        // B. FASTag Truck 1 along Western Highway
        const gqWesternWaypoints = [gqDelhi, gqJaipur, gqAhmedabad, gqSurat, gqMumbai, gqPune, gqBelagavi, gqBengaluru];
        const truck1Pos = interpolatePath(gqWesternWaypoints, state.truck1.progress, width, height);

        // FASTag Pulse Ring
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(truck1Pos.x, truck1Pos.y, 7 + state.pulse * 5, 0, Math.PI * 2);
        ctx.stroke();

        // Truck Core
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(truck1Pos.x, truck1Pos.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 9px Inter, sans-serif';
        ctx.fillText('FASTag SHP-78421', truck1Pos.x + 8, truck1Pos.y + 3);

        // C. Coastal Container Vessel along Peninsular Ports
        const coastalWaypoints = [ports[0], ports[1], ports[3], ports[2], ports[4]]; // Mundra -> JNPT -> Cochin -> Chennai -> Vizag
        const shipPos = interpolatePath(coastalWaypoints, state.ship1.progress, width, height);

        // Foaming Ship Wake Pulse
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(shipPos.x, shipPos.y, 9 + state.pulse * 5, 0, Math.PI * 2);
        ctx.stroke();

        // Ship Core
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(shipPos.x, shipPos.y, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 9px Inter, sans-serif';
        ctx.fillText('M.V. Samudra (18.2 kts)', shipPos.x + 8, shipPos.y + 3);

        // D. Express Air Cargo Plane (BLR -> HYD -> DEL)
        const airWaypoints = [
          { lat: 12.9716, lng: 77.5946 }, // BLR
          { lat: 17.3850, lng: 78.4867 }, // HYD
          { lat: 28.6139, lng: 77.2090 }  // DEL
        ];
        const planePos = interpolatePath(airWaypoints, state.plane1.progress, width, height);

        ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(planePos.x, planePos.y, 8 + state.pulse * 4, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#a855f7';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(planePos.x, planePos.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#c084fc';
        ctx.font = 'bold 9px Inter, sans-serif';
        ctx.fillText('Blue Dart Air Express', planePos.x + 7, planePos.y - 3);
      }

      // --- 4. Major Ports ---
      if (showPorts) {
        ports.forEach((port) => {
          const pt = toCanvas(port.lat, port.lng, width, height);
          const isSelected = selectedEntity?.id === port.id;

          // Outer beacon ring
          ctx.strokeStyle = port.id === 'PORT-JNPT' ? '#ef4444' : '#22d3ee';
          ctx.lineWidth = isSelected ? 3 : 1.5;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isSelected ? 12 : 8, 0, Math.PI * 2);
          ctx.stroke();

          // Port core
          ctx.fillStyle = port.id === 'PORT-JNPT' ? '#ef4444' : '#22d3ee';
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Port Label
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.fillText(port.name.split(' ')[0], pt.x + 10, pt.y + 3);
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    // Interactive Port Click Selection
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let foundPort: any = null;
      ports.forEach((p) => {
        const pt = toCanvas(p.lat, p.lng, canvas.width, canvas.height);
        const dist = Math.hypot(clickX - pt.x, clickY - pt.y);
        if (dist < 16) {
          foundPort = p;
        }
      });

      if (foundPort) {
        setSelectedEntity(foundPort);
        if (onSelectNode) onSelectNode(foundPort);
      }
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [showHighways, showDFCRail, showPorts, showTransitNodes, selectedEntity, onSelectNode]);

  return (
    <div className="relative w-full h-full bg-[#060c18] rounded-xl overflow-hidden border border-[#142032] shadow-inner select-none">
      {/* Top Header Controls with GSAP Simulation Playback Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Title Badge with Live Pulse */}
        <div className="pointer-events-auto px-3 py-1 rounded-full bg-[#0d1624]/90 backdrop-blur-md border border-[#1e2d42] text-xs font-semibold text-white flex items-center gap-2 shadow-lg">
          <Radio className="w-3.5 h-3.5 text-[#22d3ee] animate-pulse" />
          <span>GSAP Real-Time Corridor Cargo Simulation</span>
        </div>

        {/* GSAP Playback & Simulation Speed Controls */}
        <div className="pointer-events-auto flex items-center gap-1 bg-[#09101c]/90 backdrop-blur-md border border-[#162438] p-1 rounded-xl shadow-lg text-[10px]">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-[#152338] text-[#38bdf8] hover:text-white cursor-pointer"
            title={isPlaying ? 'Pause GSAP Simulation' : 'Play GSAP Simulation'}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
          </button>

          {[1, 2, 5].map((speed) => (
            <button
              key={speed}
              onClick={() => setSimulationSpeed(speed)}
              className={`px-2 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                simulationSpeed === speed ? 'bg-[#1e60f2] text-white' : 'text-[#64748b] hover:text-white'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Layer Filter Toggles */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#09101c]/90 backdrop-blur-md border border-[#162438] p-1 rounded-xl shadow-lg text-[10px]">
          <button
            onClick={() => setShowHighways(!showHighways)}
            className={`px-2 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
              showHighways ? 'bg-[#0284c7] text-white' : 'text-[#64748b] hover:text-white'
            }`}
          >
            <Truck className="w-3 h-3" />
            <span>Golden Quad</span>
          </button>

          <button
            onClick={() => setShowDFCRail(!showDFCRail)}
            className={`px-2 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
              showDFCRail ? 'bg-[#10b981] text-white' : 'text-[#64748b] hover:text-white'
            }`}
          >
            <Train className="w-3 h-3" />
            <span>DFC Rail</span>
          </button>

          <button
            onClick={() => setShowPorts(!showPorts)}
            className={`px-2 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
              showPorts ? 'bg-[#22d3ee] text-[#060c18] font-bold' : 'text-[#64748b] hover:text-white'
            }`}
          >
            <Ship className="w-3 h-3" />
            <span>Ports</span>
          </button>

          <button
            onClick={() => setShowTransitNodes(!showTransitNodes)}
            className={`px-2 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
              showTransitNodes ? 'bg-[#f43f5e] text-white' : 'text-[#64748b] hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>Live Cargo Nodes</span>
          </button>
        </div>
      </div>

      {/* Vector/Canvas Rendering */}
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />

      {/* Bottom Left Live Telemetry Stream Ticker */}
      <div className="absolute bottom-3 left-3 bg-[#09101c]/90 backdrop-blur-md border border-[#162438] rounded-xl p-2.5 text-[10px] text-[#94a3b8] space-y-1.5 z-10 max-w-sm">
        <div className="flex items-center justify-between border-b border-[#141d2b] pb-1">
          <span className="text-[9px] uppercase font-bold text-[#38bdf8] flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#22d3ee]" />
            Live GSAP Corridor Telemetry
          </span>
          <span className="text-[9px] text-[#10b981] font-mono">SIMULATION {simulationSpeed}X</span>
        </div>
        <div className="space-y-1 text-[10px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-white">
              <Train className="w-3 h-3 text-[#22d3ee]" />
              Western DFC Electric Train
            </span>
            <span className="font-mono text-[#22d3ee] font-bold">76 km/h • On Schedule</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-white">
              <Truck className="w-3 h-3 text-[#f59e0b]" />
              FASTag SHP-78421 (NH48)
            </span>
            <span className="font-mono text-[#f59e0b] font-bold">44 km/h • Khandala Ghat</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-white">
              <Ship className="w-3 h-3 text-[#f43f5e]" />
              M.V. Samudra Coastal Vessel
            </span>
            <span className="font-mono text-[#f43f5e] font-bold">18.2 kts • Off Goa Coast</span>
          </div>
        </div>
      </div>

      {/* Selected Port / Node Detail Overlay */}
      {selectedEntity && (
        <div className="absolute bottom-3 right-3 w-80 bg-[#0b1322]/95 backdrop-blur-md border border-[#1e2d42] rounded-xl p-3.5 shadow-2xl z-20 space-y-2">
          <div className="flex items-center justify-between border-b border-[#162438] pb-2">
            <div>
              <span className="text-[10px] font-mono text-[#38bdf8] font-bold">{selectedEntity.id}</span>
              <h4 className="text-xs font-bold text-white leading-tight">{selectedEntity.name}</h4>
              <p className="text-[10px] text-[#94a3b8]">{selectedEntity.state}</p>
            </div>
            <button 
              onClick={() => setSelectedEntity(null)}
              className="text-[#64748b] hover:text-white p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 rounded-lg bg-[#0e1726] border border-[#18263a]">
              <span className="text-[#64748b] block">Capacity</span>
              <span className="font-bold text-white">{selectedEntity.capacity}</span>
            </div>
            <div className="p-2 rounded-lg bg-[#0e1726] border border-[#18263a]">
              <span className="text-[#64748b] block">Monthly Cargo</span>
              <span className="font-bold text-[#22c55e]">{selectedEntity.cargoValue}</span>
            </div>
            <div className="p-2 rounded-lg bg-[#0e1726] border border-[#18263a]">
              <span className="text-[#64748b] block">Dwell Time</span>
              <span className="font-bold text-[#f59e0b]">{selectedEntity.dwellTime}</span>
            </div>
            <div className="p-2 rounded-lg bg-[#0e1726] border border-[#18263a]">
              <span className="text-[#64748b] block">Status</span>
              <span className="font-bold text-[#38bdf8]">{selectedEntity.status}</span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-[#0e1726] border border-[#18263a] text-[10px]">
            <span className="text-[#64748b] block">Primary Movements:</span>
            <span className="text-white font-medium">{selectedEntity.traffic}</span>
          </div>
        </div>
      )}
    </div>
  );
};
