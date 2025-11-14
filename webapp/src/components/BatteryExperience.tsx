"use client";

import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, PerspectiveCamera, Html } from "@react-three/drei";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const chargeToColor = (charge: number) => {
  const t = clamp(charge, 0, 1);
  const r = Math.floor(lerp(220, 45, t));
  const g = Math.floor(lerp(60, 220, t));
  const b = Math.floor(lerp(45, 60, t));
  return `rgb(${r}, ${g}, ${b})`;
};

type BatteryCellProps = {
  index: number;
  total: number;
  chargeLevel: number;
};

const BatteryCell = ({ index, total, chargeLevel }: BatteryCellProps) => {
  const segmentFraction = (index + 1) / total;
  const isFilled = chargeLevel >= segmentFraction - 1 / total * 0.01;
  const partialFill =
    !isFilled && chargeLevel > index / total
      ? (chargeLevel - index / total) * total
      : 0;

  return (
    <group position={[0, 0, 0.2 - index * 0.15]}>
      <mesh>
        <boxGeometry args={[1.6, 0.7, 0.12]} />
        <meshStandardMaterial
          color={isFilled ? chargeToColor(chargeLevel) : "#1f2933"}
          emissive={isFilled ? chargeToColor(chargeLevel) : "#0b0f14"}
          emissiveIntensity={isFilled ? 0.4 : 0.05}
          roughness={0.25}
          metalness={0.6}
        />
      </mesh>
      {partialFill > 0 && (
        <mesh scale={[partialFill, 1, 1]}>
          <boxGeometry args={[1.6, 0.7, 0.121]} />
          <meshStandardMaterial
            color={chargeToColor(chargeLevel)}
            emissive={chargeToColor(chargeLevel)}
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.5}
            transparent
            opacity={0.95}
          />
        </mesh>
      )}
    </group>
  );
};

const Battery = ({ chargeLevel }: { chargeLevel: number }) => {
  const cells = useMemo(() => Array.from({ length: 5 }), []);

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 0.9, 0.85]} />
        <meshPhysicalMaterial
          metalness={0.7}
          roughness={0.2}
          color="#10161d"
          reflectivity={0.5}
          clearcoat={0.4}
        />
      </mesh>

      <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.08, 16, 64]} />
        <meshStandardMaterial color="#1a8cff" metalness={0.8} roughness={0.3} />
      </mesh>

      <mesh position={[0, -0.52, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.08, 16, 64]} />
        <meshStandardMaterial color="#ff5349" metalness={0.8} roughness={0.3} />
      </mesh>

      <group position={[0, 0, 0.42]}>
        {cells.map((_, index) => (
          <BatteryCell
            key={index}
            index={index}
            total={cells.length}
            chargeLevel={chargeLevel}
          />
        ))}
      </group>

      <mesh position={[0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.4, 32]} />
        <meshStandardMaterial color="#f7f7f7" metalness={0.9} roughness={0.2} />
      </mesh>

      <mesh position={[1.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.18, 32]} />
        <meshStandardMaterial color="#d0d5dd" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
};

const BatteryGlow = ({ chargeLevel }: { chargeLevel: number }) => {
  const intensity = 0.6 + chargeLevel * 1.4;
  const color = chargeToColor(chargeLevel);

  return (
    <mesh position={[0, 0, 0]} scale={[3.2, 1.7, 1]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color={color} transparent opacity={0.18 * intensity} />
    </mesh>
  );
};

export default function BatteryExperience() {
  const [charge, setCharge] = useState(0.67);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="battery-panel">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [2.6, 1.7, 3.2], fov: 45, near: 0.1, far: 100 }}>
          <color attach="background" args={["#05070a"]} />
          <hemisphereLight args={["#8ab4f8", "#0b0d11", 0.4]} />
          <spotLight position={[4, 6, 3]} angle={0.6} penumbra={0.5} intensity={1.2} castShadow />
          <pointLight position={[-3, 2, -3]} intensity={0.7} />
          <Battery chargeLevel={charge} />
          <BatteryGlow chargeLevel={charge} />
          <Environment preset="warehouse" />
          <PerspectiveCamera makeDefault position={[2.6, 1.7, 3.2]} />
          <OrbitControls enablePan={false} />
          <Html position={[-1, 0.85, 0]} transform distanceFactor={3.8}>
            <div className="tag">
              <div>Charge</div>
              <div className="tag-value">{Math.round(charge * 100)}%</div>
            </div>
          </Html>
        </Canvas>
      </div>
      <div className="flex flex-col gap-4 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur dark:bg-zinc-900/80">
        <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">
          <span>Charge Level</span>
          <span>{Math.round(charge * 100)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(charge * 100)}
          onChange={(event) => setCharge(parseInt(event.target.value, 10) / 100)}
          className="range-input"
        />
        <div className="grid grid-cols-2 gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <div>
            <div className="label">Voltage</div>
            <div className="metric">{(charge * 3.7 + 0.4).toFixed(2)} V</div>
          </div>
          <div>
            <div className="label">Temperature</div>
            <div className="metric">{(24 + charge * 12).toFixed(1)}°C</div>
          </div>
          <div>
            <div className="label">Estimated Runtime</div>
            <div className="metric">{Math.round(charge * 12)} h</div>
          </div>
          <div>
            <div className="label">Health</div>
            <div className="metric">{Math.round(86 + charge * 12)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
