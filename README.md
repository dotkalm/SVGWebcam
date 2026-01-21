<h1 style="font-size: '42px'">
  SVG Webcam
</h1>

<table width="100%">
<tr>
  <td width="200px">
    <img width="200px" height="200px" alt="IMG_9312" src="https://github.com/user-attachments/assets/e1dd0ea1-c005-41c1-ae84-2d86efe7a646" />
  </td>
    <td width="200px">
    <img width="200px" height="200px" alt="IMG_9312" src="https://github.com/user-attachments/assets/99923f1e-9d16-4763-a763-be3e90618a03" />
  </td>
    <td width="200px">
    <img width="200px" height="200px" alt="IMG_9312" src="https://github.com/user-attachments/assets/ef6037d0-866e-4496-bd2a-559197eba522" />
  </td>

</tr>
  <tr>
  <td width="200px">
    screen recording
  </td>
  <td width="200px">
    PNG Download
  </td>
      <td width="200px">
    SVG Download
  </td>
</tr>

</table>

## What is this?

**A high-performance real-time webcam that generates fresh SVG markup every frame.** Using WebGL-accelerated edge detection and path generation, SVGWebcam transforms your camera feed into unique line drawings, creating a confounding mix of painterly abstraction and mechanical renderings as a real-time animation.

This real-time SVG tool lets you compose a scene using input controls to adjust thresholds, colors, line widths, fill, and path settings and save the current frame as an SVG that can be opened in the graphics program of your choosing.

## Inspiration

I'm a visual artist with a painting background. I often use cnc tools like vinyl cutters and pen plotters that require working with vector files. I've found most methods of converting bitmapped graphics to outlined vector paths to be slow, cumbersome and innefficient. I aim for images that are revealed through a process of discovery and find that tools such as Adobe Illustrator's Image Trace function often result in something that appears too pre-determined and sanitized looking.

I wanted a vector-first image capture tool where I didn't need to open a photo in a graphics program in order to turn it into a vector file.

## Features

<table>
<tr>
<td width="23%" valign="top">

### Swap order of layers using drag handles
<img width="60%" alt="Screenshot 2025-11-20 at 2 17 46 PM" src="https://github.com/user-attachments/assets/25a7f96d-a3fb-496e-8b71-1af52b589bca" />

</td>

</td>
<td width="23%" valign="top">

### Adjust angle of motion blur
<img width="70%" alt="motion blur" src="https://github.com/user-attachments/assets/6cb7d638-bd66-44c3-a48a-aff2b00b6281" />

</td>
<td width="33%" valign="top">

### Toggle bezier curves, add randomness, dash arrays
<img width="70%" alt="beziers" src="https://github.com/user-attachments/assets/47eaa9c9-3dd1-48b6-94dd-e4288851e99e" />

</td>
</tr>
<tr>
<td width="33%" valign="top">

### Save settings to local storage
<img width="50%" alt="Screenshot 2025-11-20 at 6 44 25 PM" src="https://github.com/user-attachments/assets/6b047d15-9fbb-4640-8d6d-738e6ab6c67d" />

</td>
<td width="33%" valign="top">

### Download as .svg
<img width="70%" alt="Screenshot 2025-11-20 at 1 52 18 PM" src="https://github.com/user-attachments/assets/35f774f6-acd0-4b96-8153-245854d2e2c9" />

</td>

<td width="33%" valign="top">
 
  ### download as .png 
  <img src="https://github.com/user-attachments/assets/ca143d5c-ec05-4c25-a205-2968a7393558" width="70%" alt="download png" />

</td>
</tr>
<tr>

<td width="33%" valign="top">
  
### toggle facing mode on mobile devices
<img src="https://github.com/user-attachments/assets/b3276cb3-f6f7-41fc-90e1-972dd0c50489" width="60%" />
  
</td>

<td width="33%" valign="top">
  
### zoom on mobile using both either facing mode camera
<img src="https://github.com/user-attachments/assets/a25dc5b1-9dfc-4ee8-8b79-95441d218428" width="40%" />
<img src="https://github.com/user-attachments/assets/ff2f4e0d-8e59-48a9-8704-cb5ddfd0ba71"  width="40%"/>

</td>
<td width="33%" valign="top">
  
### use fills, adjust fill color and opacity
<img src="https://github.com/user-attachments/assets/6b8556d1-4b85-48bf-8085-d1e60ec8367c" width="60%" />
</td>
</tr>
</table>


## How it works

`initWebGL.ts` compiles shaders and creates programs, textures, framebuffers.

<table>
<tr>
<td width="50%" valign="top">

### The outline layer is made from 4 sequential passes to isolate the subject.

1. Apply blur (gaussian, motion, or lens)
2. Detect direction of edge
3. Thin edge
4. Apply thresholds 

The `useWebGLCanvas` runs the shaders and returns the outputs in frame buffers as a ref.

</td>
<td width="50%" valign="top">

### The background layer takes a shortcut and only applies the selected blur

The `useSVGGeneration` hook reads the frame buffers and calls `edgeDataToSVG` where the edge data and user options are used to create SVG markup.

</td>
</tr>
</table>

# More examples



<table>
<tr>
<td width="23%" valign="top">

<img width="80%"  alt="Screenshot 2025-11-20 at 2 18 15 PM" src="https://github.com/user-attachments/assets/b2225c8f-0dd9-45d2-8280-1dcf1f8cd786" />
</td>

<td width="23%" valign="top">
<img width="80%" alt="Screenshot 2025-11-20 at 12 53 28 PM" src="https://github.com/user-attachments/assets/2be0fc74-c233-420e-9c3c-d7f418a24c63" />
</td>

<td width="23%" valign="top">
<img width="80%" alt="Screenshot 2025-11-18 at 11 13 24 PM" src="https://github.com/user-attachments/assets/d790fa38-3f8c-4e76-9ccf-8637b733e80b" />
</td>

</tr>
</table>



