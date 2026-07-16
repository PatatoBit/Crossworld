// @ts-ignore – three r184 ships no .d.ts; runtime import works fine
import * as THREE from "three";

/** EPSG:4326 lat/lon → point on a sphere centered at the origin. */
export function latLonToVector3(
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

/**
 * Orient a globe so `lat`/`lon` lands on `to`, with geographic north kept
 * screen-up (`up`) — continents stay upright the way a map reader expects.
 */
export function continentOrientation(
  lat: number,
  lon: number,
  to: THREE.Vector3,
  up: THREE.Vector3 = new THREE.Vector3(0, 1, 0),
): THREE.Quaternion {
  const from = latLonToVector3(lat, lon, 1).normalize();
  const toN = to.clone().normalize();
  const upN = up.clone().normalize();
  const northPole = new THREE.Vector3(0, 1, 0);

  // Direction of increasing latitude in the tangent plane at the anchor.
  let northTan = northPole.clone().addScaledVector(from, -northPole.dot(from));
  if (northTan.lengthSq() < 1e-8) {
    northTan.set(0, 0, 1);
  } else {
    northTan.normalize();
  }

  // Screen-up projected into the tangent plane at the target.
  let upTan = upN.clone().addScaledVector(toN, -upN.dot(toN));
  if (upTan.lengthSq() < 1e-8) {
    upTan.set(0, 0, 1);
  } else {
    upTan.normalize();
  }

  const q1 = new THREE.Quaternion().setFromUnitVectors(from, toN);
  const northAfter = northTan.applyQuaternion(q1);

  const cross = new THREE.Vector3().crossVectors(northAfter, upTan);
  const angle = Math.atan2(toN.dot(cross), northAfter.dot(upTan));
  const q2 = new THREE.Quaternion().setFromAxisAngle(toN, angle);

  return q2.multiply(q1);
}
