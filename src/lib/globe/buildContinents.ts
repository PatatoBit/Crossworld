// @ts-ignore – three r184 ships no .d.ts; runtime import works fine
import * as THREE from "three";
// @ts-ignore – examples/jsm has no .d.ts under svelte-check
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export interface ContinentFeature {
  /** ArcGIS `CONTINENT` property. */
  name: string;
  geometry: THREE.BufferGeometry;
}

interface GeoJsonFeature {
  properties: { CONTINENT: string };
  geometry: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  };
}

interface GeoJsonCollection {
  features: GeoJsonFeature[];
}

function latLonToVector3(
  lat: number,
  lon: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/** Drop the closing duplicate GeoJSON ring vertex, then map to lon/lat Vector2s. */
function ringToVec2(ring: number[][]): THREE.Vector2[] {
  if (ring.length < 2) return [];
  const [lon0, lat0] = ring[0];
  const [lonN, latN] = ring[ring.length - 1];
  const open =
    lon0 === lonN && lat0 === latN ? ring.slice(0, -1) : ring.slice();
  return open.map(([lon, lat]) => new THREE.Vector2(lon, lat));
}

function midOnSphere(
  a: THREE.Vector3,
  b: THREE.Vector3,
  radius: number,
): THREE.Vector3 {
  return a.clone().add(b).multiplyScalar(0.5).setLength(radius);
}

/**
 * Flat triangles between sphere-surface verts chord *through* the globe, so a
 * nearby ocean sphere punches holes through large continents. Split until edges
 * are short enough that the chord stays above the ocean.
 */
function appendSubdividedTriangle(
  a: THREE.Vector3,
  b: THREE.Vector3,
  c: THREE.Vector3,
  radius: number,
  maxEdge: number,
  positions: number[],
  depth = 0,
): void {
  const ab = a.distanceTo(b);
  const bc = b.distanceTo(c);
  const ca = c.distanceTo(a);
  const longest = Math.max(ab, bc, ca);

  if (longest <= maxEdge || depth >= 10) {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
    return;
  }

  if (ab >= bc && ab >= ca) {
    const m = midOnSphere(a, b, radius);
    appendSubdividedTriangle(a, m, c, radius, maxEdge, positions, depth + 1);
    appendSubdividedTriangle(m, b, c, radius, maxEdge, positions, depth + 1);
  } else if (bc >= ca) {
    const m = midOnSphere(b, c, radius);
    appendSubdividedTriangle(a, b, m, radius, maxEdge, positions, depth + 1);
    appendSubdividedTriangle(a, m, c, radius, maxEdge, positions, depth + 1);
  } else {
    const m = midOnSphere(c, a, radius);
    appendSubdividedTriangle(a, b, m, radius, maxEdge, positions, depth + 1);
    appendSubdividedTriangle(m, b, c, radius, maxEdge, positions, depth + 1);
  }
}

function polygonToGeometry(
  polygon: number[][][],
  radius: number,
): THREE.BufferGeometry | null {
  const [outer, ...holes] = polygon;
  const contour = ringToVec2(outer);
  if (contour.length < 3) return null;

  const holeVecs = holes
    .map(ringToVec2)
    .filter((h: THREE.Vector2[]) => h.length >= 3);

  const faces: number[][] = THREE.ShapeUtils.triangulateShape(contour, holeVecs);
  if (faces.length === 0) return null;

  const flat: THREE.Vector2[] = [...contour];
  for (const hole of holeVecs) flat.push(...hole);

  const sphereVerts = flat.map((v: THREE.Vector2) =>
    latLonToVector3(v.y, v.x, radius),
  );

  // ~4° of arc on a unit sphere — keeps land faces outside the ocean shell.
  const maxEdge = radius * 0.07;
  const positions: number[] = [];

  for (const face of faces) {
    appendSubdividedTriangle(
      sphereVerts[face[0]],
      sphereVerts[face[1]],
      sphereVerts[face[2]],
      radius,
      maxEdge,
      positions,
    );
  }

  if (positions.length === 0) return null;

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  return geo;
}

/**
 * Build one merged mesh geometry per continent from an ArcGIS World Continents
 * FeatureCollection (EPSG:4326 MultiPolygons).
 */
export function buildContinentsFromGeoJson(
  data: GeoJsonCollection,
  radius = 1,
): ContinentFeature[] {
  const out: ContinentFeature[] = [];

  for (const feature of data.features) {
    const parts: THREE.BufferGeometry[] = [];
    for (const polygon of feature.geometry.coordinates) {
      const geo = polygonToGeometry(polygon, radius);
      if (geo) parts.push(geo);
    }
    if (parts.length === 0) continue;

    const merged =
      parts.length === 1 ? parts[0] : mergeGeometries(parts, false);
    if (!merged) {
      for (const p of parts) p.dispose();
      continue;
    }
    if (parts.length > 1) {
      for (const p of parts) p.dispose();
    }

    merged.computeVertexNormals();
    out.push({ name: feature.properties.CONTINENT, geometry: merged });
  }

  return out;
}

export async function loadContinents(
  url: string,
  radius = 1,
): Promise<ContinentFeature[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load continents: ${res.status}`);
  const data = (await res.json()) as GeoJsonCollection;
  return buildContinentsFromGeoJson(data, radius);
}
