Booted - a prank software that overlays a parking enforcement boot on images of parked cars. 

WIP 
currently accessing the webcam 
piping video frames to canvas and calling webgl2 shader files to process edge detection
<img width="674" height="567" alt="Screenshot 2025-11-10 at 2 30 50 PM" src="https://github.com/user-attachments/assets/9646784c-9819-4a7b-950b-78207e54d16c" />


coming soon
detect heuristics of a car within the webcam video frame
1. are there 2 circles or elipses on a flat surface?
2. does each circle/elipse have a circle/elipse inside of it and parallel to it?
3. is there a volumetric shape of roughly 1:3 ratio above the circles?
4. is the subject motionless?

once the heuristics are confirmed the video frames can then be sent to an api to process more expensive convultions to match trained data models of cars.
after a successful response from Yolo we then superimpose the 'boot' on the car. 
