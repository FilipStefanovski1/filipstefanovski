"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree, type ThreeElement, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useBeforePhysicsStep,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { CARD_Y, DIM, makeCardGeometries, makeSleeveGeometry } from "./geometry";
import { drawBack, drawFront, drawStrap, loadArtworkFonts } from "./artwork";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

/* ---------- Tuning ---------- */
const GRAVITY: [number, number, number] = [0, -24, 0]; // lighter pull: slower, heavier-feeling swings
const SPRING_K = 240; // drag spring stiffness (per unit mass)
const SPRING_C = 26; // drag spring damping
const MAX_ACCEL = 420;
const MAX_LINVEL = 12;
const MAX_ANGVEL = 7;
const YAW_RETURN = 3.2; // how strongly the face turns back to the viewer

export type BadgeSceneProps = {
  active: boolean;
  spin: number;
  onReady: () => void;
  onDragChange?: (dragging: boolean) => void;
};

type Textures = { front: THREE.Texture; back: THREE.Texture; strap: THREE.Texture };

function useArtwork(maxAnisotropy: number) {
  const [tex, setTex] = useState<Textures | null>(null);
  useEffect(() => {
    let cancelled = false;
    loadArtworkFonts().then((fonts) => {
      if (cancelled) return;
      const make = (c: HTMLCanvasElement, wrap = false) => {
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = Math.min(8, maxAnisotropy);
        if (wrap) t.wrapS = t.wrapT = THREE.RepeatWrapping;
        return t;
      };
      setTex({ front: make(drawFront(fonts)), back: make(drawBack(fonts)), strap: make(drawStrap(), true) });
    });
    return () => {
      cancelled = true;
    };
  }, [maxAnisotropy]);
  useEffect(
    () => () => {
      tex?.front.dispose();
      tex?.back.dispose();
      tex?.strap.dispose();
    },
    [tex],
  );
  return tex;
}

/* Scratch objects, reused every frame */
const _v = new THREE.Vector3();
const _p = new THREE.Vector3();
const _r = new THREE.Vector3();
const _w = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _f = new THREE.Vector3();
const _ray = new THREE.Vector3();

type Grab = { local: THREE.Vector3; target: THREE.Vector3; pointerId: number };
type Body = React.RefObject<RapierRigidBody>;

/* Lanyard geometry: two straps from above the frame meet at the clip (a V). */
// Phones: the canvas runs to the top of the screen, so the camera pulls back to keep the card the same size
// and the straps reach the top edge. Read once: this module only loads in the browser.
const COMPACT = typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;
const CAM_Z = COMPACT ? 19.5 : 15;
const HALF_H = CAM_Z * Math.tan(THREE.MathUtils.degToRad(12.5)); // visible half height at z = 0
const SPREAD = 0.55; // half distance between the two anchors
const ANCHOR_Y = HALF_H + 1.0; // anchors sit just above the top edge
const JOINT_REST_Y = HALF_H - (COMPACT ? 3.38 : 2.6); // where the clip hangs at rest
const JOINT_X = 0.035;
const SEG = Math.hypot(SPREAD - JOINT_X, ANCHOR_Y - JOINT_REST_Y) / 3;

function makeCurve() {
  const c = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]);
  c.curveType = "chordal";
  return c;
}

/** One strap: fixed anchor, three rope segments, spherical joint into the card. */
function useStrap(fixed: Body, a: Body, b: Body, c: Body, card: Body, side: -1 | 1) {
  useRopeJoint(fixed, a, [[0, 0, 0], [0, 0, 0], SEG]);
  useRopeJoint(a, b, [[0, 0, 0], [0, 0, 0], SEG]);
  useRopeJoint(b, c, [[0, 0, 0], [0, 0, 0], SEG]);
  useSphericalJoint(c, card, [
    [0, 0, 0],
    [side * JOINT_X, DIM.jointY, 0],
  ]);
}

function Badge({
  textures,
  spin,
  onReady,
  onDragChange,
}: {
  textures: Textures;
  spin: number;
  onReady: () => void;
  onDragChange?: (d: boolean) => void;
}) {
  const fixedL = useRef<RapierRigidBody>(null!);
  const l1 = useRef<RapierRigidBody>(null!);
  const l2 = useRef<RapierRigidBody>(null!);
  const l3 = useRef<RapierRigidBody>(null!);
  const fixedR = useRef<RapierRigidBody>(null!);
  const r1 = useRef<RapierRigidBody>(null!);
  const r2 = useRef<RapierRigidBody>(null!);
  const r3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const bandL = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null!);
  const bandR = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null!);
  const lerped = useRef<(THREE.Vector3 | null)[]>([null, null, null, null]);
  const grab = useRef<Grab | null>(null);
  const freeSpinUntil = useRef(0);
  const readyFrames = useRef(0);

  const { camera, viewport, size, gl } = useThree();
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);

  const { body, face } = useMemo(() => makeCardGeometries(), []);
  const sleeveGeo = useMemo(() => makeSleeveGeometry(), []);
  const [curveL] = useState(makeCurve);
  const [curveR] = useState(makeCurve);

  const vw = viewport.getCurrentViewport(camera, [0, 0, 0]);
  const anchorMid = useMemo(() => new THREE.Vector3(0, ANCHOR_Y, 0), []);

  useStrap(fixedL, l1, l2, l3, card, -1);
  useStrap(fixedR, r1, r2, r3, card, 1);

  // Initial positions: each strap laid along the line from its anchor to the clip.
  const along = (side: -1 | 1, i: number): [number, number, number] => {
    const t = i / 3;
    return [side * (SPREAD + (JOINT_X - SPREAD) * t), ANCHOR_Y + (JOINT_REST_Y - ANCHOR_Y) * t, 0];
  };

  useEffect(() => {
    document.body.style.cursor = dragging ? "grabbing" : hovered ? "grab" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered, dragging]);

  // Release on any global end of interaction (belt and braces for capture loss).
  useEffect(() => {
    const release = () => {
      if (!grab.current) return;
      grab.current = null;
      setDragging(false);
      onDragChange?.(false);
    };
    const el = gl.domElement;
    const blockScroll = (e: TouchEvent) => {
      if (grab.current) e.preventDefault();
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("blur", release);
    el.addEventListener("touchmove", blockScroll, { passive: false });
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", release);
      el.removeEventListener("touchmove", blockScroll);
    };
  }, [gl, onDragChange]);

  // Keyboard / button spin: a real torque impulse.
  useEffect(() => {
    if (!spin || !card.current) return;
    card.current.wakeUp();
    card.current.applyTorqueImpulse({ x: 0, y: 0.3, z: 0 }, true);
    card.current.applyImpulse({ x: 0.08, y: 0, z: 0.04 }, true);
    freeSpinUntil.current = performance.now() + 1400;
  }, [spin]);

  // Spring drag toward the pointer, applied at the grabbed point so the card tilts naturally.
  useBeforePhysicsStep(() => {
    const g = grab.current;
    const b = card.current;
    if (!g || !b) return;
    const t = b.translation();
    const rq = b.rotation();
    _q.set(rq.x, rq.y, rq.z, rq.w);
    _r.copy(g.local).applyQuaternion(_q);
    _p.set(t.x, t.y, t.z).add(_r);
    const lv = b.linvel();
    const av = b.angvel();
    _w.set(av.x, av.y, av.z).cross(_r).add(_v.set(lv.x, lv.y, lv.z));
    _f.copy(g.target).sub(_p).multiplyScalar(SPRING_K).addScaledVector(_w, -SPRING_C);
    if (_f.length() > MAX_ACCEL) _f.setLength(MAX_ACCEL);
    _f.multiplyScalar(b.mass() / 60);
    b.applyImpulseAtPoint({ x: _f.x, y: _f.y, z: _f.z }, { x: _p.x, y: _p.y, z: _p.z }, true);
  });

  const updateBand = (
    band: THREE.Mesh<MeshLineGeometry, MeshLineMaterial>,
    curve: THREE.CatmullRomCurve3,
    fixed: RapierRigidBody,
    a: RapierRigidBody,
    b: RapierRigidBody,
    c: RapierRigidBody,
    li: number,
    dt: number,
  ) => {
    // Smooth the middle rope points to hide solver jitter in the strap
    [a, b].forEach((rb, k) => {
      const tr = rb.translation();
      let l = lerped.current[li + k];
      if (!l) l = lerped.current[li + k] = new THREE.Vector3(tr.x, tr.y, tr.z);
      _v.set(tr.x, tr.y, tr.z);
      const d = Math.max(0.1, Math.min(1, l.distanceTo(_v)));
      l.lerp(_v, Math.min(1, dt * (10 + d * 40)));
    });
    const pc = c.translation();
    curve.points[0].set(pc.x, pc.y, pc.z);
    curve.points[1].copy(lerped.current[li + 1]!);
    curve.points[2].copy(lerped.current[li]!);
    const pf = fixed.translation();
    curve.points[3].set(pf.x, pf.y, pf.z);
    band.geometry.setPoints(curve.getPoints(40));
  };

  useFrame((state, delta) => {
    if (!card.current || !fixedL.current || !fixedR.current) return;
    const dt = Math.min(delta, 1 / 30);
    const g = grab.current;

    if (g) {
      // Pointer ray onto the z = 0 plane
      _ray.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera).sub(state.camera.position).normalize();
      const k = -state.camera.position.z / _ray.z;
      g.target.copy(state.camera.position).addScaledVector(_ray, k);
      // Keep within the straps' reach and the visible frame
      const maxR = SEG * 3 + DIM.jointY + 0.3;
      _v.copy(g.target).sub(anchorMid);
      if (_v.length() > maxR) g.target.copy(anchorMid).add(_v.setLength(maxR));
      g.target.x = THREE.MathUtils.clamp(g.target.x, -vw.width / 2 + 0.4, vw.width / 2 - 0.4);
      g.target.y = THREE.MathUtils.clamp(g.target.y, -vw.height / 2 + 0.3, vw.height / 2 - 0.2);
      [card, l1, l2, l3, r1, r2, r3].forEach((r) => r.current?.wakeUp());
    }

    updateBand(bandL.current, curveL, fixedL.current, l1.current, l2.current, l3.current, 0, dt);
    updateBand(bandR.current, curveR, fixedR.current, r1.current, r2.current, r3.current, 2, dt);

    // Settle: cap runaway velocities, and gently return the printed face to the viewer.
    const b = card.current;
    const lv = b.linvel();
    _v.set(lv.x, lv.y, lv.z);
    if (_v.length() > MAX_LINVEL) {
      _v.setLength(MAX_LINVEL);
      b.setLinvel(_v, true);
    }
    const av = b.angvel();
    _w.set(av.x, av.y, av.z);
    if (_w.length() > MAX_ANGVEL) _w.setLength(MAX_ANGVEL);
    if (!g && performance.now() > freeSpinUntil.current) {
      const rq = b.rotation();
      _q.set(rq.x, rq.y, rq.z, rq.w);
      _f.set(0, 0, 1).applyQuaternion(_q);
      const yaw = Math.atan2(_f.x, _f.z);
      _w.y -= yaw * YAW_RETURN * dt * 10;
    }
    b.setAngvel(_w, false);

    if (readyFrames.current < 3) {
      readyFrames.current++;
      if (readyFrames.current === 3) {
        onReady();
        // A small nudge so the badge arrives with a gentle, physical sway.
        b.applyImpulse({ x: 0.1, y: 0, z: 0.03 }, true);
      }
    }
  });

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.stopPropagation();
    const b = card.current;
    if (!b) return;
    (e.target as unknown as Element).setPointerCapture(e.pointerId);
    const t = b.translation();
    const rq = b.rotation();
    _q.set(rq.x, rq.y, rq.z, rq.w).invert();
    const local = new THREE.Vector3(e.point.x - t.x, e.point.y - t.y, e.point.z - t.z).applyQuaternion(_q);
    grab.current = { local, target: e.point.clone(), pointerId: e.pointerId };
    freeSpinUntil.current = 0;
    setDragging(true);
    onDragChange?.(true);
  };
  const onUp = (e: ThreeEvent<PointerEvent>) => {
    if (!grab.current || grab.current.pointerId !== e.pointerId) return;
    (e.target as unknown as Element).releasePointerCapture?.(e.pointerId);
    grab.current = null;
    setDragging(false);
    onDragChange?.(false);
  };

  const segProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 3,
    linearDamping: 2.2,
  };
  const seg = (ref: Body, side: -1 | 1, i: number) => (
    <RigidBody key={`${side}${i}`} ref={ref} position={along(side, i)} {...segProps}>
      <BallCollider args={[0.06]} mass={0.04} collisionGroups={0} />
    </RigidBody>
  );
  const bandMaterial = (
    <meshLineMaterial
      args={[{ resolution: new THREE.Vector2(size.width, size.height) }]}
      color="white"
      depthTest={false}
      resolution={new THREE.Vector2(size.width, size.height)}
      transparent={false}
      depthWrite={false}
      useMap={1}
      map={textures.strap}
      repeat={new THREE.Vector2(-2.2, 1)}
      lineWidth={0.8}
    />
  );

  return (
    <>
      <RigidBody ref={fixedL} {...segProps} type="fixed" position={along(-1, 0)} />
      <RigidBody ref={fixedR} {...segProps} type="fixed" position={along(1, 0)} />
      {seg(l1, -1, 1)}
      {seg(l2, -1, 2)}
      {seg(l3, -1, 3)}
      {seg(r1, 1, 1)}
      {seg(r2, 1, 2)}
      {seg(r3, 1, 3)}
      <RigidBody
        position={[0, JOINT_REST_Y - DIM.jointY, 0]}
        ref={card}
        {...segProps}
        angularDamping={2.4}
        linearDamping={1.6}
        type="dynamic"
      >
        <CuboidCollider args={[DIM.sleeveW / 2, DIM.sleeveH / 2, DIM.sleeveT / 2]} mass={0.3} collisionGroups={0} />
        <group
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onLostPointerCapture={onUp}
        >
            {/* Printed card */}
            <group position={[0, CARD_Y, 0]}>
              <mesh geometry={body} castShadow>
                <meshStandardMaterial color="#2bd10c" roughness={0.6} />
              </mesh>
              <mesh geometry={face} position={[0, 0, DIM.cardT / 2 + 0.0042]}>
                <meshPhysicalMaterial map={textures.front} roughness={0.42} specularIntensity={0.18} clearcoat={0.5} clearcoatRoughness={0.22} envMapIntensity={0.08} />
              </mesh>
              <mesh geometry={face} position={[0, 0, -DIM.cardT / 2 - 0.0042]} rotation={[0, Math.PI, 0]}>
                <meshPhysicalMaterial map={textures.back} roughness={0.55} specularIntensity={0.12} envMapIntensity={0} />
              </mesh>
            </group>
            {/* Clear sleeve: near-invisible faces, brighter edges */}
            <mesh geometry={sleeveGeo} castShadow renderOrder={2}>
              <meshPhysicalMaterial
                attach="material-0"
                color="#ffffff"
                transparent
                opacity={0.07}
                roughness={0.04}
                clearcoat={1}
                clearcoatRoughness={0.04}
                envMapIntensity={1.4}
                depthWrite={false}
              />
              <meshPhysicalMaterial
                attach="material-1"
                color="#ffffff"
                transparent
                opacity={0.6}
                roughness={0.15}
                envMapIntensity={1.2}
                depthWrite={false}
              />
            </mesh>
            {/* Pocket seam */}
            <mesh position={[0, CARD_Y + DIM.cardH / 2 + 0.035, DIM.sleeveT / 2 + 0.007]} renderOrder={3}>
              <planeGeometry args={[DIM.sleeveW - 0.1, 0.012]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.55} depthWrite={false} />
            </mesh>
            {/* Clip: split ring through the slot, swivel, clamp the straps fold into, and a top loop */}
            <group position={[0, DIM.slotY, 0]}>
              <mesh position={[0, 0.07, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
                <torusGeometry args={[0.1, 0.013, 14, 40]} />
                <meshStandardMaterial color="#cfd2d7" metalness={1} roughness={0.18} />
              </mesh>
              <mesh position={[0, 0.19, 0]} castShadow>
                <cylinderGeometry args={[0.018, 0.024, 0.07, 18]} />
                <meshStandardMaterial color="#b9bcc2" metalness={1} roughness={0.22} />
              </mesh>
              <RoundedBox args={[0.17, 0.12, 0.05]} radius={0.022} smoothness={4} position={[0, 0.285, 0]} castShadow>
                <meshStandardMaterial color="#dfe2e6" metalness={1} roughness={0.2} />
              </RoundedBox>
              <mesh position={[0, 0.285, 0.026]}>
                <boxGeometry args={[0.11, 0.012, 0.004]} />
                <meshStandardMaterial color="#8d9198" metalness={1} roughness={0.35} />
              </mesh>
              <mesh position={[0, 0.36, 0]} rotation={[0, 0, 0]} castShadow>
                <torusGeometry args={[0.035, 0.009, 10, 28]} />
                <meshStandardMaterial color="#cfd2d7" metalness={1} roughness={0.2} />
              </mesh>
            </group>
          </group>
        </RigidBody>
      {/* Straps render first, so the clip and card always sit over their ends */}
      <mesh ref={bandL} renderOrder={-1}>
        <meshLineGeometry />
        {bandMaterial}
      </mesh>
      <mesh ref={bandR} renderOrder={-1}>
        <meshLineGeometry />
        {bandMaterial}
      </mesh>
    </>
  );
}

function ShadowCatcher() {
  return (
    <mesh position={[0, 0, -1.4]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <shadowMaterial transparent opacity={0.13} />
    </mesh>
  );
}

function Scene(props: BadgeSceneProps & { physicsOn: boolean }) {
  const gl = useThree((s) => s.gl);
  const textures = useArtwork(gl.capabilities.getMaxAnisotropy());
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[-3, 5, 9]}
        intensity={0.95}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-radius={8}
        shadow-bias={-0.0004}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <Physics gravity={GRAVITY} timeStep={1 / 60} numSolverIterations={12} paused={!props.physicsOn}>
        {textures && (
          <Badge
            textures={textures}
            spin={props.spin}
            onReady={props.onReady}
            onDragChange={props.onDragChange}
          />
        )}
      </Physics>
      <ShadowCatcher />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#1b1a18"]} />
        <Lightformer intensity={2.2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={8} color="#fff4ea" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </>
  );
}

export default function BadgeScene(props: BadgeSceneProps) {
  // Hold physics for two frames after resuming so the first long frame cannot cause a jump.
  const [physicsOn, setPhysicsOn] = useState(false);
  useEffect(() => {
    if (!props.active) {
      // Pause immediately when the scene leaves the viewport or the tab is hidden.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhysicsOn(false);
      return;
    }
    let a = 0;
    let b = 0;
    a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => setPhysicsOn(true));
    });
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, [props.active]);

  return (
    <Canvas
      frameloop={props.active ? "always" : "never"}
      dpr={[1, 1.75]}
      shadows="percentage"
      flat
      camera={{ position: [0, 0, CAM_Z], fov: 25, near: 0.1, far: 100 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
      aria-hidden
    >
      <Scene {...props} physicsOn={physicsOn} />
    </Canvas>
  );
}
