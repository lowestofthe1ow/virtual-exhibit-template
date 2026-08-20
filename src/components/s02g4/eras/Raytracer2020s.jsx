import React, { useState, useEffect, useRef } from 'react';

// Distance utility
const distance = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

// ── WebGL Path Tracing Shader Source Code (Shared globally across preview & sandbox) ──
const VERTEX_SHADER_SRC = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision mediump float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform int u_shape;         // 0 = TORUS, 1 = SPHERE, 2 = OCTAHEDRON
  uniform int u_material;      // 0 = MIRROR, 1 = GLASS, 2 = MATTE
  uniform float u_roughness;   // 0.0 to 1.0
  uniform int u_bounces;       // max bounces (1 to 4)

  // Hardcoded constant physical values to simplify control panel
  const float u_ior = 1.55;         // Real glass refractive index
  const float u_clearcoat = 1.0;   // Glossy lacquer layer

  // Camera vectors compiled in JS
  uniform vec3 u_cameraPos;
  uniform vec3 u_cameraForward;
  uniform vec3 u_cameraRight;
  uniform vec3 u_cameraUp;

  // Scene elements
  uniform vec3 u_lightPos;
  uniform vec3 u_spherePos; // Shape center coordinate

  // Pseudo-random hashing noise generator
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // Point shadow plane math intersection
  float intersectPlane(vec3 ro, vec3 rd, float planeY) {
    if (abs(rd.y) < 0.0001) return -1.0;
    float t = (planeY - ro.y) / rd.y;
    return t > 0.001 ? t : -1.0;
  }

  // 3D SDF Geometries
  float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
  }

  float sdSphere(vec3 p, float r) {
    return length(p) - r;
  }

  float sdOctahedron(vec3 p, float s) {
    vec3 ap = abs(p);
    return (ap.x + ap.y + ap.z - s) * 0.57735027;
  }

  // Scene mapping
  float getMap(vec3 p) {
    vec3 q = p - u_spherePos;

    // Gentle automatic rotation over time
    float angle = u_time * 0.45;
    float c = cos(angle), s = sin(angle);
    
    // Rotate Y-Z
    float qy = q.y * c - q.z * s;
    float qz = q.y * s + q.z * c;
    q.y = qy; q.z = qz;
    
    // Rotate X-Z
    float qx = q.x * c - q.z * s;
    qz = q.x * s + q.z * c;
    q.x = qx; q.z = qz;

    if (u_shape == 0) {
      return sdTorus(q, vec2(0.55, 0.17));
    } else if (u_shape == 1) {
      return sdSphere(q, 0.65);
    } else {
      return sdOctahedron(q, 0.75);
    }
  }

  // Calculate normals at surface coordinates
  vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.002, 0.0);
    return normalize(vec3(
      getMap(p + e.xyy) - getMap(p - e.xyy),
      getMap(p + e.yxy) - getMap(p - e.yxy),
      getMap(p + e.yyx) - getMap(p - e.yyx)
    ));
  }

  // Raymarching parser
  float raymarch(vec3 ro, vec3 rd, float maxDist) {
    float t = 0.0;
    for (int i = 0; i < 64; i++) {
      vec3 p = ro + t * rd;
      float d = getMap(p);
      if (d < 0.001) return t; // Hit!
      t += d;
      if (t > maxDist) break;
    }
    return -1.0;
  }

  // Raymarching exit parser for internal glass transmission refraction
  float raymarchInside(vec3 ro, vec3 rd, float maxDist) {
    float t = 0.0;
    for (int i = 0; i < 40; i++) {
      vec3 p = ro + t * rd;
      float d = abs(getMap(p)); // Converges perfectly to exiting edge boundary
      if (d < 0.001) return t;
      t += d;
      if (t > maxDist) break;
    }
    return -1.0;
  }

  void main() {
    // Normalised Device Coordinates (NDC)
    vec2 uv = (gl_FragCoord.xy / u_resolution) * 2.0 - 1.0;
    float aspect = u_resolution.x / u_resolution.y;

    // Compile primary ray from camera matrix inputs
    vec3 ro = u_cameraPos;
    vec3 rd = normalize(u_cameraForward * 1.5 + u_cameraRight * uv.x * aspect + u_cameraUp * uv.y);

    vec3 accumulatedColor = vec3(0.0);
    vec3 rayMask = vec3(1.0);

    // Unrolled light path tracing loop (max 4 bounces)
    for (int bounce = 0; bounce < 4; bounce++) {
      if (bounce >= u_bounces) break;

      float tShape = raymarch(ro, rd, 6.5);
      float tPlane = intersectPlane(ro, rd, -0.95);

      float t = -1.0;
      int hitType = 0; // 0 = sky, 1 = shape, 2 = plane

      if (tShape > 0.0 && (tPlane < 0.0 || tShape < tPlane)) {
        t = tShape;
        hitType = 1;
      } else if (tPlane > 0.0) {
        t = tPlane;
        hitType = 2;
      }

      if (t < 0.0) {
        // Hit Sky (ambient background space gradient)
        float skyGrad = clamp(0.5 + 0.5 * rd.y, 0.0, 1.0);
        vec3 skyColor = mix(vec3(0.03, 0.02, 0.06), vec3(0.12, 0.06, 0.2), skyGrad);
        
        // Spotlight glow halo reflection
        float sunDot = max(0.0, dot(rd, normalize(u_lightPos - ro)));
        skyColor += vec3(0.75, 0.45, 0.95) * pow(sunDot, 16.0) * 0.35;

        accumulatedColor += rayMask * skyColor;
        break;
      }

      vec3 hitPos = ro + t * rd;
      vec3 N;

      if (hitType == 1) {
        N = getNormal(hitPos);
        vec3 L = normalize(u_lightPos - hitPos);

        if (u_material == 2) {
          // Matte Shading
          float tShadow = raymarch(hitPos + N * 0.01, L, 5.0);
          float shadow = tShadow > 0.0 ? 0.0 : 1.0;

          float diffuse = max(0.0, dot(N, L));
          vec3 col = vec3(0.08, 0.04, 0.14) + vec3(0.68, 0.35, 0.95) * diffuse * shadow;
          accumulatedColor += rayMask * col;
          break; // matte absorbs light, terminate ray
        }
        else if (u_material == 0) {
          // Mirror Specular Reflection
          vec3 R = reflect(rd, N);

          float spec = pow(max(0.0, dot(R, L)), 32.0);
          accumulatedColor += rayMask * vec3(0.95, 0.85, 1.0) * spec * 0.8;

          rayMask *= vec3(0.9, 0.86, 0.95) * (1.0 - u_roughness * 0.55);

          // Add roughness micro-facet perturbation using hashing noise
          vec3 noise = vec3(
            hash(hitPos.xy + u_time),
            hash(hitPos.yz + u_time + 1.0),
            hash(hitPos.zx + u_time + 2.0)
          ) - 0.5;

          rd = normalize(R + noise * u_roughness * 0.32);
          ro = hitPos + rd * 0.01;
        }
        else if (u_material == 1) {
          // Glass (Fresnel reflection/refraction)
          float eta = 1.0 / u_ior;
          float cosTheta = -dot(rd, N);
          
          float R0 = (1.0 - u_ior) / (1.0 + u_ior);
          R0 = R0 * R0;
          float fresnel = R0 + (1.0 - R0) * pow(1.0 - cosTheta, 5.0);

          vec3 R = reflect(rd, N);
          float k = 1.0 - eta * eta * (1.0 - cosTheta * cosTheta);

          if (k >= 0.0) {
            vec3 T_dir = normalize(eta * rd + (eta * cosTheta - sqrt(k)) * N);
            
            // Raymarch inside to find exit point
            vec3 insideStart = hitPos + T_dir * 0.01;
            float tExit = raymarchInside(insideStart, T_dir, 4.0);

            if (tExit > 0.0) {
              vec3 exitPt = insideStart + tExit * T_dir;
              vec3 N_exit = -getNormal(exitPt); // reverse normal facing inside
              
              float cosThetaExit = -dot(T_dir, N_exit);
              float etaExit = u_ior;
              float kExit = 1.0 - etaExit * etaExit * (1.0 - cosThetaExit * cosThetaExit);

              if (kExit >= 0.0) {
                vec3 T_exit_dir = normalize(etaExit * T_dir + (etaExit * cosThetaExit - sqrt(kExit)) * N_exit);
                rd = T_exit_dir;
                ro = exitPt + rd * 0.01;
              } else {
                vec3 R_exit_dir = reflect(T_dir, N_exit);
                rd = R_exit_dir;
                ro = exitPt + rd * 0.01;
              }
            } else {
              rd = R;
              ro = hitPos + rd * 0.01;
            }
          } else {
            rd = R;
            ro = hitPos + rd * 0.01;
          }

          rayMask *= vec3(0.95, 0.9, 0.98);
          accumulatedColor += rayMask * vec3(1.0) * fresnel * u_clearcoat * 0.45;
        }
      }
      else if (hitType == 2) {
        // Hit Plane ( checkerboard ground grid )
        N = vec3(0.0, 1.0, 0.0);
        vec3 L = normalize(u_lightPos - hitPos);

        float checker = 0.0;
        // Checkered pattern math
        if (fract(hitPos.x * 0.4) > 0.5 == fract(hitPos.z * 0.4) > 0.5) {
          checker = 1.0;
        }
        vec3 planeCol = mix(vec3(0.06, 0.04, 0.11), vec3(0.12, 0.08, 0.22), checker);

        float tShadow = raymarch(hitPos + N * 0.01, L, 5.0);
        float shadow = 1.0;

        if (tShadow > 0.0) {
          if (u_material == 1) {
            // Glass transparency - caustics focused light refraction
            shadow = 0.5;
            float align = dot(normalize(hitPos - u_spherePos), L);
            if (align > 0.88) {
              shadow += 2.0 * pow(align, 8.0); // caustics shine
            }
          } else {
            shadow = 0.0; // hard shadow for mirror / opaque matte
          }
        }

        float diffuse = max(0.0, dot(N, L));
        vec3 col = planeCol * (0.22 + diffuse * shadow * 0.95);
        accumulatedColor += rayMask * col;
        break; // ground plane absorbs, terminate ray
      }
    }

    gl_FragColor = vec4(accumulatedColor, 1.0);
  }
`;

function RaytracerPreview() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    // Compile Helper
    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vs = compileShader(VERTEX_SHADER_SRC, gl.VERTEX_SHADER);
    const fs = compileShader(FRAGMENT_SHADER_SRC, gl.FRAGMENT_SHADER);

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    // Quad buffers
    const vertices = new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    // Locate uniforms
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uShape = gl.getUniformLocation(program, 'u_shape');
    const uMaterial = gl.getUniformLocation(program, 'u_material');
    const uRoughness = gl.getUniformLocation(program, 'u_roughness');
    const uBounces = gl.getUniformLocation(program, 'u_bounces');

    const uCameraPos = gl.getUniformLocation(program, 'u_cameraPos');
    const uCameraForward = gl.getUniformLocation(program, 'u_cameraForward');
    const uCameraRight = gl.getUniformLocation(program, 'u_cameraRight');
    const uCameraUp = gl.getUniformLocation(program, 'u_cameraUp');

    const uLightPos = gl.getUniformLocation(program, 'u_lightPos');
    const uSpherePos = gl.getUniformLocation(program, 'u_spherePos');
    const uSphereRadius = gl.getUniformLocation(program, 'u_sphereRadius');

    let startTime = Date.now();
    let frameId;

    const render = () => {
      const time = (Date.now() - startTime) / 1000;

      // Auto orbit camera rotation over time
      const theta = time * 0.4;
      const phi = Math.PI / 7.5; // Sweet spot angle

      const radius = 4.8;
      const camPos = [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(phi),
        radius * Math.cos(theta) * Math.cos(phi)
      ];
      
      const target = [0, 0.15, 0];

      // Forward vector
      const fwd = [target[0] - camPos[0], target[1] - camPos[1], target[2] - camPos[2]];
      const fwdLen = Math.sqrt(fwd[0]**2 + fwd[1]**2 + fwd[2]**2);
      const forward = [fwd[0]/fwdLen, fwd[1]/fwdLen, fwd[2]/fwdLen];

      // Right vector = cross(forward, [0, 1, 0])
      const rgt = [-forward[2], 0, forward[0]];
      const rgtLen = Math.sqrt(rgt[0]**2 + rgt[1]**2 + rgt[2]**2);
      const right = [rgt[0]/rgtLen, rgt[1]/rgtLen, rgt[2]/rgtLen];

      // Up vector = cross(right, forward)
      const up = [
        right[1] * forward[2] - right[2] * forward[1],
        right[2] * forward[0] - right[0] * forward[2],
        right[0] * forward[1] - right[1] * forward[0]
      ];

      gl.viewport(0, 0, canvas.width, canvas.height);

      // Pass uniforms for a gorgeous glass torus
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform1i(uShape, 0);       // TORUS
      gl.uniform1i(uMaterial, 1);    // GLASS
      gl.uniform1f(uRoughness, 0.05); // Shiny
      gl.uniform1i(uBounces, 2);      // Refractive exit depth

      // Pass camera orientation vectors
      gl.uniform3fv(uCameraPos, new Float32Array(camPos));
      gl.uniform3fv(uCameraForward, new Float32Array(forward));
      gl.uniform3fv(uCameraRight, new Float32Array(right));
      gl.uniform3fv(uCameraUp, new Float32Array(up));

      // Pass stationary scene coords
      gl.uniform3f(uLightPos, 3.2, 4.0, 3.2);
      gl.uniform3f(uSpherePos, 0.0, 0.15, 0.0);
      gl.uniform1f(uSphereRadius, 0.7);

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-2 select-none">
      <div className="relative w-16 h-16 bg-black/60 border border-[#a855f7]/30 rounded overflow-hidden flex items-center justify-center shadow-lg">
        <canvas
          ref={canvasRef}
          width={128}
          height={128}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

function RaytracerConsole() {
  const canvasRef = useRef(null);
  
  // Dashboard UI state
  const [shape, setShape] = useState('TORUS'); 
  const [materialType, setMaterialType] = useState('GLASS'); 
  const [roughness, setRoughness] = useState(15); 
  const [bounces, setBounces] = useState(2); 

  // Drag handles
  const orbitRef = useRef({ theta: 0.0, phi: Math.PI / 8, isDragging: false, startX: 0, startY: 0 });

  // WebGL shader initialization & program cycle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.error('WebGL is not supported in this browser.');
      return;
    }

    // Compile Helper
    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compiler error:', gl.getShaderInfoLog(shader));
      }
      return shader;
    };

    const vs = compileShader(VERTEX_SHADER_SRC, gl.VERTEX_SHADER);
    const fs = compileShader(FRAGMENT_SHADER_SRC, gl.FRAGMENT_SHADER);

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('WebGL program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad buffers
    const vertices = new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    // Locate uniforms
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uShape = gl.getUniformLocation(program, 'u_shape');
    const uMaterial = gl.getUniformLocation(program, 'u_material');
    const uRoughness = gl.getUniformLocation(program, 'u_roughness');
    const uBounces = gl.getUniformLocation(program, 'u_bounces');

    const uCameraPos = gl.getUniformLocation(program, 'u_cameraPos');
    const uCameraForward = gl.getUniformLocation(program, 'u_cameraForward');
    const uCameraRight = gl.getUniformLocation(program, 'u_cameraRight');
    const uCameraUp = gl.getUniformLocation(program, 'u_cameraUp');

    const uLightPos = gl.getUniformLocation(program, 'u_lightPos');
    const uSpherePos = gl.getUniformLocation(program, 'u_spherePos');
    const uSphereRadius = gl.getUniformLocation(program, 'u_sphereRadius');

    let startTime = Date.now();
    let frameId;

    const render = () => {
      const time = (Date.now() - startTime) / 1000;

      // Calculate camera coordinates from orbital angles
      const radius = 4.8;
      const camPos = [
        radius * Math.sin(orbitRef.current.theta) * Math.cos(orbitRef.current.phi),
        radius * Math.sin(orbitRef.current.phi),
        radius * Math.cos(orbitRef.current.theta) * Math.cos(orbitRef.current.phi)
      ];
      
      const target = [0, 0.15, 0];

      // Forward vector
      const fwd = [target[0] - camPos[0], target[1] - camPos[1], target[2] - camPos[2]];
      const fwdLen = Math.sqrt(fwd[0]**2 + fwd[1]**2 + fwd[2]**2);
      const forward = [fwd[0]/fwdLen, fwd[1]/fwdLen, fwd[2]/fwdLen];

      // Right vector = cross(forward, [0, 1, 0])
      const rgt = [-forward[2], 0, forward[0]];
      const rgtLen = Math.sqrt(rgt[0]**2 + rgt[1]**2 + rgt[2]**2);
      const right = [rgt[0]/rgtLen, rgt[1]/rgtLen, rgt[2]/rgtLen];

      // Up vector = cross(right, forward)
      const up = [
        right[1] * forward[2] - right[2] * forward[1],
        right[2] * forward[0] - right[0] * forward[2],
        right[0] * forward[1] - right[1] * forward[0]
      ];

      // Set WebGL states
      gl.viewport(0, 0, canvas.width, canvas.height);

      // Pass parameter uniforms
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform1i(uShape, shape === 'TORUS' ? 0 : shape === 'SPHERE' ? 1 : 2);
      gl.uniform1i(uMaterial, materialType === 'MIRROR' ? 0 : materialType === 'GLASS' ? 1 : 2);
      gl.uniform1f(uRoughness, roughness / 100);
      gl.uniform1i(uBounces, bounces);

      // Pass camera orientation vectors
      gl.uniform3fv(uCameraPos, new Float32Array(camPos));
      gl.uniform3fv(uCameraForward, new Float32Array(forward));
      gl.uniform3fv(uCameraRight, new Float32Array(right));
      gl.uniform3fv(uCameraUp, new Float32Array(up));

      // Pass stationary scene coords
      gl.uniform3f(uLightPos, 3.2, 4.0, 3.2);
      gl.uniform3f(uSpherePos, 0.0, 0.15, 0.0);
      gl.uniform1f(uSphereRadius, 0.7);

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [shape, materialType, roughness, bounces]);

  // Orbit rotation drag listeners
  const handlePointerDown = (e) => {
    orbitRef.current.isDragging = true;
    orbitRef.current.startX = e.clientX;
    orbitRef.current.startY = e.clientY;
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!orbitRef.current.isDragging) return;
      const dx = e.clientX - orbitRef.current.startX;
      const dy = e.clientY - orbitRef.current.startY;

      orbitRef.current.startX = e.clientX;
      orbitRef.current.startY = e.clientY;

      orbitRef.current.theta -= dx * 0.01;
      orbitRef.current.phi = Math.max(
        -Math.PI / 4,
        Math.min(Math.PI / 2.2, orbitRef.current.phi + dy * 0.01)
      );
    };

    const handlePointerUp = () => {
      orbitRef.current.isDragging = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 p-1">

      {/* ── Crisp, Borderless Glass Viewport ── */}
      <div className="relative">
        <div className="relative bg-zinc-950/70 backdrop-blur-md rounded-2xl p-1.5 border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col items-center">
          
          <div
            className="relative rounded-xl overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            style={{ width: '180px', height: '180px' }}
            onPointerDown={handlePointerDown}
          >
            <canvas
              ref={canvasRef}
              width={360}
              height={360}
              className="w-full h-full object-cover rounded-lg"
            />

            {/* Modern HUD overlays - clean text */}
            <div className="absolute bottom-2 left-2.5 font-mono text-[5.5px] text-fuchsia-400/80 flex flex-col leading-tight pointer-events-none z-20 uppercase tracking-widest font-bold">
              <span>HD RAYTRACER</span>
              <span className="text-zinc-500 font-medium">MESH: {shape}</span>
            </div>

            <div className="absolute top-2 right-2.5 font-mono text-[5px] text-fuchsia-400 flex items-center gap-1.5 pointer-events-none z-20 uppercase tracking-wider font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-ping" />
              <span>4K PATH_TRACING</span>
            </div>

          </div>

          {/* Sleek modern bottom status line */}
          <div className="w-full flex items-center justify-between mt-2 px-1 font-mono text-[7px] text-zinc-400 pointer-events-none">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_6px_#c084fc]" />
              <span className="text-fuchsia-400 font-bold uppercase tracking-wider">ULTRA HD ENG ON</span>
            </div>
            <span className="text-[6.5px] uppercase tracking-wider text-zinc-500">DRAG TO ORBIT</span>
          </div>

        </div>
      </div>

      {/* ── Dashboard Parameters Panel (Aligned to screen width) ── */}
      <div className="w-[192px] bg-black/40 border border-white/5 rounded-lg p-2 flex flex-col gap-2 font-mono text-[8px] text-zinc-300">
        
        {/* Shape Selector */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[7px] text-zinc-500 uppercase tracking-wider font-bold">3D Geometry</span>
          <div className="flex gap-0.5 bg-black/50 p-0.5 rounded border border-white/10">
            {['TORUS', 'SPHERE', 'OCTAHEDRON'].map((opt) => (
              <button
                key={opt}
                onClick={() => setShape(opt)}
                className={`flex-1 py-0.5 rounded text-[5px] font-bold cursor-pointer transition-colors ${shape === opt
                  ? 'bg-[#a855f7] text-white font-black'
                  : 'hover:text-white text-zinc-400'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Surface Material Selection */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[7px] text-zinc-500 uppercase tracking-wider font-bold">Surface Material</span>
          <div className="flex gap-0.5 bg-black/50 p-0.5 rounded border border-white/10">
            {['MIRROR', 'GLASS', 'MATTE'].map((opt) => (
              <button
                key={opt}
                onClick={() => setMaterialType(opt)}
                className={`flex-1 py-0.5 rounded text-[6px] font-bold cursor-pointer transition-colors ${materialType === opt
                  ? 'bg-[#a855f7] text-white font-black'
                  : 'hover:text-white text-zinc-400'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Sliders */}
        <div className="flex flex-col gap-1.5 border-t border-white/5 pt-1.5">
          {/* Ray Bounces */}
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between text-[7px]">
              <span className="text-zinc-500 uppercase font-bold">Trace Depth (Bounces)</span>
              <span className="text-[#a855f7] font-bold">{bounces}</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              value={bounces}
              onChange={(e) => setBounces(parseInt(e.target.value, 10))}
              className="w-full h-1 bg-black/50 rounded-lg appearance-none cursor-pointer accent-[#a855f7] border border-white/10"
            />
          </div>

          {/* Surface Roughness */}
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between text-[7px]">
              <span className="text-zinc-500 uppercase font-bold">Roughness</span>
              <span className="text-[#a855f7] font-bold">{roughness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={roughness}
              onChange={(e) => setRoughness(parseInt(e.target.value, 10))}
              className="w-full h-1 bg-black/50 rounded-lg appearance-none cursor-pointer accent-[#a855f7] border border-white/10"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default function Raytracer2020s() {
  const ref = useRef(null);
  const [view, setView] = useState('preview');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const container = el.closest('[data-era-view]');
    if (container) {
      setView(container.getAttribute('data-era-view'));
    }
  }, []);

  return (
    <div ref={ref}>
      {view === 'expanded' ? <RaytracerConsole /> : <RaytracerPreview />}
    </div>
  );
}
