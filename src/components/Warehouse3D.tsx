import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Info, RotateCw } from 'lucide-react';

export const Warehouse3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedAisle, setSelectedAisle] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a101d);
    scene.fog = new THREE.FogExp2(0x0a101d, 0.025);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(16, 14, 18);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambient = new THREE.AmbientLight(0x1e293b, 1.5);
    scene.add(ambient);

    const spot1 = new THREE.SpotLight(0x38bdf8, 3.5, 30, Math.PI / 3, 0.4);
    spot1.position.set(0, 15, 0);
    spot1.castShadow = true;
    scene.add(spot1);

    const warmLight = new THREE.PointLight(0xf59e0b, 2.0, 25);
    warmLight.position.set(5, 6, 4);
    scene.add(warmLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 2.2, 25);
    cyanLight.position.set(-6, 6, -4);
    scene.add(cyanLight);

    // --- Concrete Warehouse Floor ---
    const floorGeo = new THREE.PlaneGeometry(35, 35);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Yellow safety aisle guide markings
    const createFloorLine = (x: number, z: number, len: number, isVertical = false) => {
      const lineGeo = isVertical 
        ? new THREE.PlaneGeometry(0.12, len)
        : new THREE.PlaneGeometry(len, 0.12);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xeab308 });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(x, 0.02, z);
      scene.add(line);
    };

    createFloorLine(0, 0, 24, true);
    createFloorLine(-5, 0, 24, true);
    createFloorLine(5, 0, 24, true);

    // --- Industrial Warehouse Pallet Racks ---
    const rackGroup = new THREE.Group();
    scene.add(rackGroup);

    const rackOrangeMat = new THREE.MeshStandardMaterial({ color: 0xea580c, metalness: 0.7, roughness: 0.4 });
    const rackBlueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.4 });

    const createPalletRack = (x: number, z: number) => {
      const rack = new THREE.Group();
      rack.position.set(x, 0, z);

      // Vertical Upright Posts
      const postGeo = new THREE.BoxGeometry(0.1, 7, 0.1);
      for (let px = -1.8; px <= 1.8; px += 1.8) {
        for (let pz = -0.6; pz <= 0.6; pz += 1.2) {
          const post = new THREE.Mesh(postGeo, rackBlueMat);
          post.position.set(px, 3.5, pz);
          post.castShadow = true;
          rack.add(post);
        }
      }

      // Horizontal Beam Shelves (3 Tiers)
      for (let tier = 1; tier <= 3; tier++) {
        const y = tier * 2.0;

        const beamFront = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 0.08), rackOrangeMat);
        beamFront.position.set(0, y, 0.6);
        rack.add(beamFront);

        const beamBack = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 0.08), rackOrangeMat);
        beamBack.position.set(0, y, -0.6);
        rack.add(beamBack);

        // Pallets & Color-Coded Inventory Boxes
        for (let bx = -1.2; bx <= 1.2; bx += 1.2) {
          const pallet = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 0.1, 0.9),
            new THREE.MeshStandardMaterial({ color: 0x854d0e })
          );
          pallet.position.set(bx, y + 0.05, 0);
          rack.add(pallet);

          // Stock box color
          let boxColor = 0x22c55e; // Normal (Green)
          if ((x === 6 && tier === 2) || (x === -6 && bx > 0)) boxColor = 0xeab308; // Low Stock (Yellow)
          else if (tier === 3) boxColor = 0xf97316; // High Demand (Orange)
          else if (x === -2 && tier === 1 && bx === 0) boxColor = 0xef4444; // Reorder (Red)

          const boxGeo = new THREE.BoxGeometry(0.8, 0.7, 0.8);
          const boxMat = new THREE.MeshStandardMaterial({
            color: boxColor,
            roughness: 0.5,
            metalness: 0.2
          });
          const box = new THREE.Mesh(boxGeo, boxMat);
          box.position.set(bx, y + 0.45, 0);
          box.castShadow = true;
          rack.add(box);
        }
      }

      return rack;
    };

    rackGroup.add(createPalletRack(-6, -4));
    rackGroup.add(createPalletRack(-6, 4));
    rackGroup.add(createPalletRack(6, -4));
    rackGroup.add(createPalletRack(6, 4));
    rackGroup.add(createPalletRack(-2, -4));
    rackGroup.add(createPalletRack(2, 4));

    // --- 3D Forklifts / AGVs ---
    const createForklift = (color = 0xfacc15) => {
      const fl = new THREE.Group();

      const chassisMat = new THREE.MeshStandardMaterial({ color, metalness: 0.6, roughness: 0.4 });
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 0.9), chassisMat);
      chassis.position.y = 0.4;
      chassis.castShadow = true;
      fl.add(chassis);

      const cage = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1.0, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, wireframe: true })
      );
      cage.position.set(-0.1, 1.1, 0);
      fl.add(cage);

      const mast = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 2.0, 0.6),
        new THREE.MeshStandardMaterial({ color: 0x475569 })
      );
      mast.position.set(0.75, 1.0, 0);
      fl.add(mast);

      const pallet = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.6, 0.8),
        new THREE.MeshStandardMaterial({ color: 0xeab308 })
      );
      pallet.position.set(1.2, 0.5, 0);
      fl.add(pallet);

      const light = new THREE.SpotLight(0xffffff, 2.0, 8, Math.PI / 4);
      light.position.set(0.8, 0.6, 0);
      light.target.position.set(4, 0, 0);
      fl.add(light);
      fl.add(light.target);

      return fl;
    };

    const forklift1 = createForklift(0xfacc15); // Yellow forklift
    forklift1.position.set(0, 0, -1);
    forklift1.rotation.y = -Math.PI / 4;
    scene.add(forklift1);

    const forklift2 = createForklift(0xf97316); // Orange forklift
    forklift2.position.set(2, 0, 3);
    forklift2.rotation.y = Math.PI / 3;
    scene.add(forklift2);

    // --- Interaction & Animation ---
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;

      scene.rotation.y += dx * 0.005;
      camera.position.y = Math.max(6, Math.min(22, camera.position.y - dy * 0.04));
      camera.lookAt(0, 2, 0);

      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animId: number;
    let fTime = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      fTime += 0.02;

      forklift1.position.z = -1 + Math.sin(fTime) * 1.5;

      if (!isDragging) {
        scene.rotation.y += 0.001;
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
  }, []);

  return (
    <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-4 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Header with Legend & Hub tag */}
      <div className="flex items-center justify-between z-10 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#e2e8f0]">3D Warehouse View</span>
          <span className="text-[10px] text-[#a855f7] font-mono bg-[#1c122e] px-2 py-0.5 rounded border border-[#3b1d64]">
            Bhiwandi Central DC
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2.5 text-[9px] text-[#94a3b8]">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#eab308]"></span>
            <span>Low Stock</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span>
            <span>High Demand</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
            <span>Reorder</span>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="relative flex-1 w-full min-h-[160px] rounded-lg overflow-hidden border border-[#131d2b]">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      </div>
    </div>
  );
};
