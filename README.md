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

## adjust angle of motion blur
![motionblur](https://github.com/user-attachments/assets/6cb7d638-bd66-44c3-a48a-aff2b00b6281)

## toggle bezier curves, add randomness to the center of the bezier curve, toggle dash array animation, change dash lengths 
![toggles1](https://github.com/user-attachments/assets/47eaa9c9-3dd1-48b6-94dd-e4288851e99e)

## view on mobile 
![frontfacing](https://github.com/user-attachments/assets/83b9b6dc-cbe9-4eb6-b2d5-92fd32cf6d8f)
