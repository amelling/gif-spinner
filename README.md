# GIF Spinner Generator

A web application that converts animated GIFs into fidget spinner designs for 3D printing.

## Overview

The GIF Spinner Generator allows you to transform any animated GIF into a physical fidget spinner design. When the spinner is spun at the correct speed and viewed through a smartphone camera, the animated GIF comes to life due to the camera's frame rate creating a strobe-like effect.

## Features

- Upload custom GIFs or select from included samples
- Convert GIF frames to SVG vectors using two different methods:
  - Simple conversion (faster, pixel-art style)
  - Advanced conversion (better quality, smoother curves)
- Customize spinner design:
  - Spinner size and layout
  - Number of frames displayed
  - Bearing type and size
  - Outline style and thickness
- Export in multiple formats:
  - SVG for 2D design and editing
  - PNG for quick sharing
  - STL for 3D printing

## How It Works

1. **Select a GIF**: Upload your own animated GIF or choose from the samples
2. **Configure Conversion**: Adjust settings for the frame-to-SVG conversion
3. **Design Your Spinner**: Customize layout, bearing, and outline options
4. **Export Files**: Download your spinner design in your preferred format(s)

## Technology

This project is built with pure HTML, CSS, and JavaScript and runs entirely in the browser. It uses the following libraries:

- gifuct-js: For GIF parsing and frame extraction
- FileSaver.js: For downloading generated files
- Three.js: For 3D model generation (STL files)

## Usage Instructions

1. Visit the [GIF Spinner Generator](https://yourusername.github.io/gif-spinner/) website
2. Upload a GIF or select a sample GIF
3. Adjust conversion settings and click "Process Frames"
4. Customize your spinner design and click "Generate Spinner"
5. Select your desired output format(s) and click "Export Files"
6. Print your design (STL) or share it (PNG/SVG)

## Physical Creation

After generating and downloading your STL file:

1. 3D print the spinner model
2. Insert a standard 608 bearing (skateboard/fidget spinner bearing) in the center
3. Spin it at approximately 10-15 revolutions per second
4. View through a smartphone camera to see the animation

## Local Development

To run this project locally:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/gif-spinner.git
   ```

2. Open the project folder:
   ```
   cd gif-spinner
   ```

3. Serve the files with a local web server:
   - Using Python:
     ```
     python -m http.server
     ```
   - Or using Node.js:
     ```
     npx serve
     ```

4. Open your browser and navigate to `http://localhost:8000` (or the port shown in your terminal)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [bitmap-outline](https://github.com/rshest/bitmap-outline) for SVG tracing inspiration
- [Potrace](http://potrace.sourceforge.net/) algorithm for advanced vectorization