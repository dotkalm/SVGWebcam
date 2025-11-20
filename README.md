SVG Webcam - view at https://s-v-g.xyz
a novel approach to webcam, using webgl2 to process video frames and rendering svg as animation frames

Where the magic happens

`initWebGL.ts` compiles shaders and creates programs, textures, framebuffers.

### The outline layer is made from 4 sequential passes to isolate the subject.

1. Apply blur (gaussian, motion, or lens)
2. Detect direction of edge
3. Thin Edge
4. Apply thresholds 

### The background layer takes a shortcut and only applies the selected blur

the `useWebGLCanvas` runs the shaders and returns the outputs in frame buffers as a ref
the `useSVGGeneration` hook reads the frame buffers and calls `edgeDataToSVG` where the edge data and user options are used to create svg markup.

## swap order of layers using drag handles
<img width="292" height="254" alt="Screenshot 2025-11-20 at 2 17 46 PM" src="https://github.com/user-attachments/assets/25a7f96d-a3fb-496e-8b71-1af52b589bca" />


## adjust angle of motion blur
![motionblur](https://github.com/user-attachments/assets/6cb7d638-bd66-44c3-a48a-aff2b00b6281)

## toggle bezier curves, add randomness to the center of the bezier curve, toggle dash array animation, change dash lengths 
![toggles1](https://github.com/user-attachments/assets/47eaa9c9-3dd1-48b6-94dd-e4288851e99e)

## view on mobile 
![frontfacing](https://github.com/user-attachments/assets/83b9b6dc-cbe9-4eb6-b2d5-92fd32cf6d8f)

## can save settings to local storage
<img width="283" height="353" alt="Screenshot 2025-11-20 at 6 44 25 PM" src="https://github.com/user-attachments/assets/6b047d15-9fbb-4640-8d6d-738e6ab6c67d" />

## Download as .svg
<img width="722" height="346" alt="Screenshot 2025-11-20 at 1 52 18 PM" src="https://github.com/user-attachments/assets/35f774f6-acd0-4b96-8153-245854d2e2c9" />


## more examples 
<img width="735" height="606" alt="Screenshot 2025-11-20 at 2 18 15 PM" src="https://github.com/user-attachments/assets/b2225c8f-0dd9-45d2-8280-1dcf1f8cd786" />
<img width="1215" height="791" alt="Screenshot 2025-11-20 at 12 53 28 PM" src="https://github.com/user-attachments/assets/2be0fc74-c233-420e-9c3c-d7f418a24c63" />
<img width="1595" height="965" alt="Screenshot 2025-11-18 at 11 13 24 PM" src="https://github.com/user-attachments/assets/d790fa38-3f8c-4e76-9ccf-8637b733e80b" />

