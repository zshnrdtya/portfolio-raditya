/**
 * Collision & Trigger System for "Walk to the House" 3D Intro
 * Provides simple AABB & circle bounding checks for character navigation
 */

import * as THREE from "three";

export interface BoundingBox2D {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export class CollisionSystem {
  // Boundaries of the playable yard
  private yardBounds: BoundingBox2D = {
    minX: -5.8,
    maxX: 5.8,
    minZ: -9.5,
    maxZ: 9.2,
  };

  // Static obstacle boxes (House body, side fences, trees, signpost)
  private obstacles: BoundingBox2D[] = [
    // Main house structure (except the door gap in the middle)
    { minX: -4.5, maxX: -0.9, minZ: -9.5, maxZ: -5.2 }, // Left side of house
    { minX: 0.9, maxX: 4.5, minZ: -9.5, maxZ: -5.2 },  // Right side of house
    { minX: -4.5, maxX: 4.5, minZ: -9.5, maxZ: -8.0 },  // Back of house

    // Signpost
    { minX: 1.0, maxX: 2.4, minZ: 0.5, maxZ: 1.6 },

    // Left fence line
    { minX: -6.2, maxX: -5.5, minZ: -9.0, maxZ: 8.5 },
    // Right fence line
    { minX: 5.5, maxX: 6.2, minZ: -9.0, maxZ: 8.5 },

    // Front boundary fence with gateway opening
    { minX: -6.0, maxX: -1.5, minZ: 8.6, maxZ: 9.3 },
    { minX: 1.5, maxX: 6.0, minZ: 8.6, maxZ: 9.3 },
  ];

  // Door Trigger zone: directly in front of the house doorway
  private doorTrigger: BoundingBox2D = {
    minX: -0.85,
    maxX: 0.85,
    minZ: -5.3,
    maxZ: -4.6,
  };

  /**
   * Resolves proposed movement against world boundaries & obstacles
   * @param current Current player position
   * @param desired Desired next position
   * @param radius Player collision radius (~0.35)
   * @returns Allowed position (supports sliding along obstacles)
   */
  public resolveMovement(
    current: THREE.Vector3,
    desired: THREE.Vector3,
    radius: number = 0.35
  ): THREE.Vector3 {
    const result = desired.clone();

    // 1. Constrain to yard bounds
    result.x = Math.max(this.yardBounds.minX + radius, Math.min(this.yardBounds.maxX - radius, result.x));
    result.z = Math.max(this.yardBounds.minZ + radius, Math.min(this.yardBounds.maxZ - radius, result.z));

    // 2. Check and slide along static obstacles
    for (const box of this.obstacles) {
      const isInside =
        result.x + radius > box.minX &&
        result.x - radius < box.maxX &&
        result.z + radius > box.minZ &&
        result.z - radius < box.maxZ;

      if (isInside) {
        // Try resolving X axis only (sliding along Z)
        const tryZOnly = new THREE.Vector3(current.x, result.y, result.z);
        const insideZ =
          tryZOnly.x + radius > box.minX &&
          tryZOnly.x - radius < box.maxX &&
          tryZOnly.z + radius > box.minZ &&
          tryZOnly.z - radius < box.maxZ;

        if (!insideZ) {
          result.x = current.x;
          continue;
        }

        // Try resolving Z axis only (sliding along X)
        const tryXOnly = new THREE.Vector3(result.x, result.y, current.z);
        const insideX =
          tryXOnly.x + radius > box.minX &&
          tryXOnly.x - radius < box.maxX &&
          tryXOnly.z + radius > box.minZ &&
          tryXOnly.z - radius < box.maxZ;

        if (!insideX) {
          result.z = current.z;
          continue;
        }

        // If completely stuck against corner, revert both
        result.x = current.x;
        result.z = current.z;
      }
    }

    return result;
  }

  /**
   * Checks whether player is inside the door trigger zone
   */
  public isAtDoorTrigger(pos: THREE.Vector3): boolean {
    return (
      pos.x >= this.doorTrigger.minX &&
      pos.x <= this.doorTrigger.maxX &&
      pos.z >= this.doorTrigger.minZ &&
      pos.z <= this.doorTrigger.maxZ
    );
  }
}
