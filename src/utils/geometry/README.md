# Wheel Well Detection for Vehicle Identification

## Overview

This document describes a heuristic approach for detecting vehicles in edge-detected webcam frames by identifying **wheel wells** - the characteristic horizontal line (rocker panel/body line) with semi-circular cutouts where wheels are positioned.

### Why Wheel Wells vs Circle Detection?

Looking at our edge-detected fixture (`car_bridge_st.json`), wheel detection via circle detection is problematic because:
- Wheel spokes create noise and break up the circular outline
- Hubcaps, rims, and tire treads add visual complexity
- Partial occlusion makes circles incomplete
- Other circular objects (signs, manholes, etc.) create false positives

**Wheel wells are more reliable** because they represent a distinctive geometric pattern:
- A **horizontal line** (vehicle rocker panel/body line)
- With **semi-circular concave curves** cutting into it
- Typically **two per vehicle** (front and rear wheels)
- **Relatively consistent** across different vehicle types (sedans, SUVs, vans)

This heuristic serves as a **fast, front-end filter** before sending candidates to the backend YOLO model.

---

## Key Terminology

### Convolution
A mathematical operation that applies a **kernel** (small matrix) to an image to extract features. The kernel "slides" across the image, computing the weighted sum of neighboring pixels.

**Use case**: Edge detection (already applied in our pipeline via Canny), line detection, pattern matching.

**Example kernels**:
```
Horizontal edge:     Vertical edge:
[-1 -1 -1]           [-1  0  1]
[ 0  0  0]           [-1  0  1]
[ 1  1  1]           [-1  0  1]
```

**Resources**:
- [Convolution Explained](https://setosa.io/ev/image-kernels/)
- [Image Kernels Visualized](https://en.wikipedia.org/wiki/Kernel_(image_processing))

### Gradient
The **rate of change** in pixel intensity. Gradients have both magnitude and direction.

- **Gradient magnitude**: How strong the edge is
- **Gradient direction**: Which way the edge points (horizontal, vertical, diagonal)

**Use case**: Our Canny edge detector already computes gradients. We can use gradient direction to find horizontal lines.

**Resources**:
- [Image Gradients - OpenCV Docs](https://docs.opencv.org/4.x/d2/d2c/tutorial_sobel_derivatives.html)

### Tensor
A multi-dimensional array. In image processing:
- **Rank 0 tensor**: Scalar (single value)
- **Rank 1 tensor**: Vector (1D array)
- **Rank 2 tensor**: Matrix (2D array, like a grayscale image)
- **Rank 3 tensor**: 3D array (like an RGB image: width × height × channels)
- **Rank 4 tensor**: Batch of images (batch × width × height × channels)

**Use case**: If using TensorFlow.js or similar, image data is represented as tensors.

**Resources**:
- [TensorFlow.js Tensors Guide](https://www.tensorflow.org/js/guide/tensors_operations)

### Hough Transform
An algorithm to detect geometric primitives (lines, circles, ellipses) in edge-detected images. It works by:
1. **Parameter space mapping**: Each edge pixel "votes" for possible shapes
2. **Accumulator**: Counts votes in parameter space
3. **Peak detection**: High vote counts indicate detected shapes

**Hough Line Transform** is particularly useful for detecting the horizontal rocker panel line.

**Resources**:
- [Hough Transform Explained](https://homepages.inf.ed.ac.uk/rbf/HIPR2/hough.htm)
- [Interactive Hough Transform Demo](https://www.alanzucconi.com/2016/03/09/hough-transform/)

### Non-Maximum Suppression (NMS)
A technique to eliminate duplicate or overlapping detections by keeping only the strongest candidates.

**Use case**: After detecting multiple horizontal lines or wheel well candidates, NMS keeps only the best ones.

**Resources**:
- [Non-Maximum Suppression](https://learnopencv.com/non-maximum-suppression/)

---

## Detection Strategy

### High-Level Algorithm

1. **Input**: Edge-detected frame (640×480 RGBA from our fixture)
   - White pixels (255) = edges
   - Black pixels (0) = background

2. **Horizontal Line Detection**
   - Use **Hough Line Transform** or **horizontal projection** to find strong horizontal lines
   - Filter for lines in the **lower 2/3 of image** (where vehicle bodies typically appear)
   - Look for lines with **length > threshold** (e.g., 100+ pixels)

3. **Concavity Analysis**
   - For each horizontal line candidate, scan **below** the line
   - Look for **semi-circular concave regions** (areas where edges curve inward)
   - Expected pattern: `___∩___∩___` (line with two arcs cutting upward into it)

4. **Wheel Well Verification**
   - Verify **two concave regions** spaced appropriately (typical wheelbase: 30-60% of vehicle length)
   - Check that concave regions are roughly **circular** (aspect ratio ~1:1)
   - Validate **size constraints** (wheel well width: 40-120 pixels for 640px frame)

5. **Confidence Scoring**
   - Score based on:
     - Line straightness
     - Concavity depth and symmetry
     - Spacing between wheel wells
     - Overall pattern match
   - If score > threshold → send to backend YOLO

### Visual Pattern

```
Side view of vehicle (edge-detected):

    ___________________
   |                   |  ← Vehicle body (top edge)
   |                   |
   |_______     _______|  ← Rocker panel (horizontal line)
          ∩   ∩            ← Wheel wells (semi-circular cutouts)
         (o) (o)           ← Wheels (noisy circles)
```

---

## Implementation Approaches

### Approach 1: Low-Level WebGL/GLSL Shaders

**Pros**:
- ✅ Extremely fast (GPU-accelerated)
- ✅ Already using WebGL for Canny edge detection
- ✅ Minimal library dependencies
- ✅ Full control over algorithm

**Cons**:
- ❌ Requires custom GLSL shader code
- ❌ More complex to implement and debug
- ❌ Limited built-in geometric primitives

**Implementation Steps**:

1. **Horizontal Line Detection Shader**
   ```glsl
   // Fragment shader: Horizontal line accumulator
   // For each pixel, count horizontal neighbors that are edges
   uniform sampler2D u_edgeTexture;
   uniform vec2 u_resolution;

   void main() {
     vec2 uv = gl_FragCoord.xy / u_resolution;
     float accumulator = 0.0;

     // Sample pixels horizontally
     for (float dx = -50.0; dx <= 50.0; dx += 1.0) {
       vec2 offset = vec2(dx / u_resolution.x, 0.0);
       float edge = texture2D(u_edgeTexture, uv + offset).r;
       accumulator += edge;
     }

     gl_FragColor = vec4(accumulator / 100.0);
   }
   ```

2. **Concavity Detection Shader**
   - For each horizontal line, scan vertically below
   - Detect regions where edges curve inward (concave pattern)
   - Output confidence map

3. **Read back to CPU**
   - Use `gl.readPixels()` to get results
   - Analyze on CPU for pattern matching

**Resources**:
- [WebGL Fundamentals - Image Processing](https://webglfundamentals.org/webgl/lessons/webgl-image-processing.html)
- [GLSL Shader Examples](https://thebookofshaders.com/)
- Our existing Canny pipeline: `src/utils/processFrame.ts`

### Approach 2: Three.js + Custom Shaders

**Pros**:
- ✅ Higher-level API than raw WebGL
- ✅ Built-in scene management and utilities
- ✅ Still GPU-accelerated
- ✅ Easier to visualize debug output

**Cons**:
- ❌ Designed for 3D graphics, not image processing
- ❌ Adds dependency (~600KB)
- ❌ Still requires custom shaders for detection

**Implementation**:
Three.js can render to `RenderTarget` (framebuffer) and apply custom shaders, similar to our current approach but with a higher-level API.

```typescript
import * as THREE from 'three';

// Create render target
const renderTarget = new THREE.WebGLRenderTarget(640, 480);

// Custom shader material
const lineMaterial = new THREE.ShaderMaterial({
  uniforms: {
    edgeTexture: { value: edgeTexture },
    resolution: { value: new THREE.Vector2(640, 480) }
  },
  fragmentShader: `
    // Same GLSL as above
  `
});
```

**Verdict**: Overkill for 2D image processing. Stick with raw WebGL or use a specialized library.

**Resources**:
- [Three.js Docs - RenderTarget](https://threejs.org/docs/#api/en/renderers/WebGLRenderTarget)
- [Three.js Image Processing Example](https://threejs.org/examples/#webgl_postprocessing_advanced)

### Approach 3: TensorFlow.js (ML-based)

**Pros**:
- ✅ Pre-built operations for convolutions, pooling, etc.
- ✅ GPU-accelerated via WebGL backend
- ✅ Can use pre-trained models or build custom detection
- ✅ Tensor operations are well-optimized

**Cons**:
- ❌ Large library size (~500KB-1MB)
- ❌ Overkill for geometric heuristics
- ❌ Training a model requires labeled data
- ❌ Slower than custom shaders for simple operations

**Use case**: If you want to train a small CNN to recognize the wheel well pattern, TensorFlow.js could work. But for simple geometric detection, this is overkill.

**Resources**:
- [TensorFlow.js](https://www.tensorflow.org/js)
- [TensorFlow.js Image Classification Tutorial](https://www.tensorflow.org/js/tutorials/training/handwritten_digit_cnn)

### Approach 4: CPU-based (JavaScript/Canvas)

**Pros**:
- ✅ Simplest to implement and debug
- ✅ No shader code required
- ✅ Direct pixel access via `Uint8Array`
- ✅ Works with existing fixture data

**Cons**:
- ❌ Slower than GPU (but may be acceptable for heuristic)
- ❌ Blocks main thread (use Web Worker if needed)

**Implementation**:

```typescript
function detectHorizontalLines(edgeData: Uint8Array, width: number, height: number) {
  const lines: Array<{ y: number; startX: number; endX: number }> = [];

  // Scan each row
  for (let y = height / 3; y < height; y++) {
    let lineStart = -1;
    let lineLength = 0;

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const isEdge = edgeData[idx] > 128; // White edge pixel

      if (isEdge) {
        if (lineStart === -1) lineStart = x;
        lineLength++;
      } else {
        if (lineLength > 100) { // Minimum line length
          lines.push({ y, startX: lineStart, endX: lineStart + lineLength });
        }
        lineStart = -1;
        lineLength = 0;
      }
    }
  }

  return lines;
}

function detectWheelWells(edgeData: Uint8Array, line: { y: number; startX: number; endX: number }) {
  // Scan below the line for concave semi-circles
  // Use edge tracing or template matching
  // Return confidence score
}
```

**Resources**:
- [Canvas Pixel Manipulation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas)
- [Web Workers for Heavy Computation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

### Approach 5: Hybrid - Hough Transform Library

**Recommended**: Use a lightweight Hough Transform library on CPU, then verify wheel wells.

**Libraries**:
- [hough-transform-js](https://github.com/brunocroh/hough-transform-js) - Pure JS implementation
- Or port OpenCV's Hough Line implementation to JS

**Implementation**:
```typescript
import { HoughLines } from 'hough-transform-js'; // hypothetical

const lines = HoughLines(edgeData, width, height, {
  angleResolution: Math.PI / 180,  // 1 degree
  distanceResolution: 1,            // 1 pixel
  threshold: 100                     // Minimum votes
});

// Filter for horizontal lines (angle ~0 or ~180 degrees)
const horizontalLines = lines.filter(line =>
  Math.abs(line.angle) < 10 * Math.PI / 180
);
```

**Resources**:
- [Hough Transform JS Implementation](https://github.com/wellflat/imageprocessing-labs/blob/master/js/hough.js)
- [OpenCV.js (full OpenCV in WebAssembly)](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html)

---

## Recommended Architecture

### Phase 1: CPU-based Prototype (Quick Start)
1. Use our existing fixture: `loadFrameFixture(carBridgeStFixture)`
2. Implement horizontal line detection in pure TypeScript
3. Implement wheel well concavity analysis
4. Tune parameters and thresholds
5. Get initial confidence scores

**Rationale**: Fast to implement, easy to debug, validate the approach before optimizing.

### Phase 2: GPU Optimization (If Needed)
If CPU performance is insufficient (<30fps), migrate to WebGL shaders:
1. Create horizontal line detection shader
2. Create concavity detection shader
3. Read back minimal data to CPU for final scoring

**Rationale**: Only optimize if necessary. The heuristic may be fast enough on CPU.

### Phase 3: Integration
1. Run detection on each webcam frame
2. If confidence > threshold (e.g., 0.7), send frame to backend YOLO API
3. Backend validates with deep learning model
4. Return result to user

---

## Testing Strategy

Use our fixture `__tests__/fixtures/car_bridge_st.json`:

1. **Unit tests**: Test individual components
   - Horizontal line detection
   - Concavity detection
   - Wheel well pattern matching

2. **Fixture tests**: Verify detection on known good/bad cases
   - `car_bridge_st.json` should return **true** (has wheel wells)
   - Create fixtures without vehicles → should return **false**

3. **Performance tests**: Measure execution time
   - Target: <33ms per frame (30fps) for real-time detection

4. **Accuracy tests**: Build a labeled test set
   - Capture ~50 frames with/without vehicles
   - Measure precision/recall of heuristic

---

## Mathematical Foundations

### Hough Line Transform (In-Depth)

The Hough Transform converts edge points from **Cartesian space (x, y)** to **parameter space (ρ, θ)**:

**Line equation** (polar form):
```
ρ = x·cos(θ) + y·sin(θ)
```

Where:
- `ρ` = perpendicular distance from origin to line
- `θ` = angle of perpendicular from origin

**Algorithm**:
1. Create accumulator array: `A[ρ][θ]`
2. For each edge pixel `(x, y)`:
   - For each angle `θ` from 0° to 180°:
     - Calculate `ρ = x·cos(θ) + y·sin(θ)`
     - Increment `A[ρ][θ]`
3. Find peaks in accumulator → detected lines

**Horizontal lines**: θ ≈ 0° or 180°

**Resources**:
- [Hough Transform Math](https://www.cs.cornell.edu/courses/cs664/2008sp/handouts/hough.pdf)
- [Hough Transform Visualization](https://www.cs.princeton.edu/courses/archive/fall00/cs426/papers/hough_transform.pdf)

### Concavity Detection

**Approach 1: Curvature Analysis**
For points along the horizontal line, calculate curvature:
```
κ = |x'·y'' - y'·x''| / (x'² + y'²)^(3/2)
```

Negative curvature → concave (curves inward)

**Approach 2: Template Matching**
Create semi-circle template, slide across line, compute normalized cross-correlation:
```
NCC = Σ(I·T) / √(Σ(I²)·Σ(T²))
```

High NCC → good match

**Resources**:
- [Digital Curvature](https://en.wikipedia.org/wiki/Curvature#Local_expressions)
- [Template Matching](https://docs.opencv.org/4.x/d4/dc6/tutorial_py_template_matching.html)

---

## Optimization Tips

1. **Region of Interest (ROI)**: Only process lower 2/3 of frame
2. **Downsampling**: Scale frame to 320×240 for faster processing
3. **Early exit**: If no horizontal lines found, skip wheel well detection
4. **Caching**: Reuse Hough accumulator across frames if camera is static
5. **Web Worker**: Offload CPU-based detection to background thread

---

## Next Steps

1. ✅ **Fixture captured**: `car_bridge_st.json`
2. ⬜ **Implement horizontal line detection** (CPU-based)
3. ⬜ **Implement wheel well detection**
4. ⬜ **Write unit tests**
5. ⬜ **Tune thresholds and parameters**
6. ⬜ **Measure performance**
7. ⬜ **Integrate with webcam pipeline**
8. ⬜ **Connect to backend YOLO API**

---

## References

### Academic Papers
- [Canny Edge Detector](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.420.3300&rep=rep1&type=pdf) - J. Canny, 1986
- [Hough Transform Survey](https://www.sciencedirect.com/science/article/pii/0734189X88900213) - Illingworth & Kittler, 1988
- [Circle and Ellipse Detection](https://www.cis.rit.edu/~cnspci/references/dip/feature_extraction/aguado1995.pdf) - Aguado et al., 1995

### Libraries & Tools
- [OpenCV.js](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html) - Full computer vision library in WebAssembly
- [TensorFlow.js](https://www.tensorflow.org/js) - Machine learning in the browser
- [tracking.js](https://trackingjs.com/) - Object tracking library (may have Hough transform)
- [jsfeat](https://inspirit.github.io/jsfeat/) - Computer vision library for JS

### Tutorials
- [WebGL Image Processing](https://webglfundamentals.org/webgl/lessons/webgl-image-processing.html)
- [Hough Transform Interactive Demo](https://www.alanzucconi.com/2016/03/09/hough-transform/)
- [Edge Detection in JavaScript](https://www.html5rocks.com/en/tutorials/canvas/imagefilters/)

### Our Codebase
- Edge detection: `src/utils/processFrame.ts`
- Fixture loading: `src/utils/captureFrameFixture.ts`
- WebGL setup: `src/utils/initWebGL.ts`
- Test fixture: `__tests__/fixtures/car_bridge_st.json`

---

## Glossary Quick Reference

| Term | Definition | Use in This Project |
|------|------------|---------------------|
| **Convolution** | Sliding kernel operation | Edge detection (Canny) |
| **Gradient** | Rate of pixel intensity change | Edge direction/magnitude |
| **Tensor** | Multi-dimensional array | Image data structure |
| **Hough Transform** | Geometric primitive detection | Find horizontal lines |
| **NMS** | Eliminate duplicate detections | Keep best wheel well candidates |
| **ROI** | Region of Interest | Crop to lower 2/3 of frame |
| **Concavity** | Inward-curving shape | Wheel well arc pattern |
| **Template Matching** | Find pattern in image | Match semi-circle shape |
| **Accumulator** | Vote-counting array | Hough transform storage |
| **Parameter Space** | Abstract representation | Hough transform (ρ, θ) |
