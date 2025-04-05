# Adding Sample GIFs to Your Project

Since the application needs actual animated GIF files to work properly, here's how to add some sample GIFs:

## Option 1: Use Free GIFs from Open Sources

You can download free animated GIFs from various sources:

1. **GIPHY**: Visit [GIPHY](https://giphy.com/) and search for simple animations
   - Look for relatively simple GIFs with distinct frames
   - Make sure to use only GIFs with appropriate licenses
   - Download by right-clicking and selecting "Save image as..."

2. **OpenGameArt**: Visit [OpenGameArt.org](https://opengameart.org/art-search-advanced?keys=&field_art_type_tid%5B%5D=9&sort_by=count&sort_order=DESC)
   - Many game sprites and animations available under open licenses
   - Great for pixel-art style GIFs that work well with the spinner concept

3. **Public Domain Sources**: Sites like [PublicDomainPictures](https://www.publicdomainpictures.net/) may have some animated GIFs

## Option 2: Create Your Own Simple GIFs

You can create your own GIFs for testing:

1. **GIMP or Photoshop**: Create a sequence of frames and export as GIF
2. **Online GIF Makers**: Services like [EZGIF](https://ezgif.com/maker) let you upload images to combine into a GIF
3. **Screen Recording**: Record a simple animation on your screen and convert to GIF using tools like ScreenToGif (Windows) or GIF Brewery (Mac)

## Preparing GIFs for the Project

For best results with the GIF Spinner Generator:

1. **Keep it Simple**: GIFs with 4-12 distinct frames work best
2. **Size Matters**: Aim for GIFs around 100-200 pixels in size
3. **High Contrast**: Clear, high-contrast images will trace better to SVG
4. **Distinct Motion**: Choose GIFs with clear motion between frames
5. **Avoid Complexity**: Very detailed GIFs may not convert well to SVGs

## Adding GIFs to Your Project

1. **Rename Files**: Rename your GIF files to match what's expected in the code:
   - walking.gif
   - jumping.gif
   - dancing.gif
   - hearts.gif
   - star.gif
   - loading.gif

2. **Place Files**: Copy the GIF files to the `assets/samples/` folder in your project

3. **Commit Changes**: If using Git/GitHub:
   ```bash
   git add assets/samples/*.gif
   git commit -m "Add sample GIFs"
   git push
   ```

4. **Test**: Open your project and verify that the sample GIFs appear and can be selected

You can also modify the `main.js` file to use different GIF filenames if needed.