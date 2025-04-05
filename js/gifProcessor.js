/**
 * GIF Processor
 * Handles loading and extracting frames from GIF animations
 */

const GifProcessor = (function() {
    // Uses gifuct-js for GIF processing
    
    /**
     * Load a GIF from URL and extract frame data
     * @param {string} gifUrl - URL or data URL of the GIF to process
     * @returns {Promise<Object>} - Promise resolving to extracted GIF data
     */
    async function loadGif(gifUrl) {
        return new Promise((resolve, reject) => {
            // Create a new image element to load the GIF
            const gifImg = new Image();
            
            gifImg.onload = async function() {
                try {
                    const width = gifImg.width;
                    const height = gifImg.height;
                    
                    // Fetch the GIF for processing with gifuct-js
                    const response = await fetch(gifUrl);
                    const buffer = await response.arrayBuffer();
                    
                    // Parse the GIF using gifuct-js
                    const gif = parseGIF(buffer);
                    const frames = decompressFrames(gif, true);
                    
                    // Process frames to extract image data
                    const processedFrames = await extractFrameData(frames, width, height);
                    
                    resolve({
                        width,
                        height,
                        frames: processedFrames,
                        frameCount: frames.length
                    });
                } catch (error) {
                    reject(error);
                }
            };
            
            gifImg.onerror = function() {
                reject(new Error('Failed to load GIF'));
            };
            
            // Start loading the GIF
            gifImg.src = gifUrl;
        });
    }
    
    /**
     * Extract frame data from gifuct-js frames
     * @param {Array} frames - Array of frames from gifuct-js
     * @param {number} width - GIF width
     * @param {number} height - GIF height
     * @returns {Array} - Array of processed frames with ImageData
     */
    async function extractFrameData(frames, width, height) {
        // Create an offscreen canvas for processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        
        // Create temp canvas for compositing
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = width;
        tempCanvas.height = height;
        
        // For GIF disposal
        let lastImg = null;
        
        const processedFrames = [];
        
        // Process each frame
        for (let i = 0; i < frames.length; i++) {
            const frame = frames[i];
            
            // Handle disposal based on the previous frame's disposal method
            if (i > 0) {
                const prevFrame = frames[i - 1];
                const disposalMethod = prevFrame.disposalMethod || 0;
                
                if (disposalMethod === 2) {
                    // Restore to background color (clear the frame area)
                    ctx.clearRect(
                        prevFrame.dims.left,
                        prevFrame.dims.top,
                        prevFrame.dims.width,
                        prevFrame.dims.height
                    );
                } else if (disposalMethod === 3 && lastImg) {
                    // Restore to previous state
                    ctx.putImageData(lastImg, 0, 0);
                }
            }
            
            // Save current state if needed for disposal method 3
            if (frame.disposalMethod === 3) {
                lastImg = ctx.getImageData(0, 0, width, height);
            }
            
            // Handle transparency
            if (frame.transparentIndex !== null) {
                // Create temp ImageData for the frame
                const imgData = tempCtx.createImageData(frame.dims.width, frame.dims.height);
                
                // Copy the frame's pixels
                for (let j = 0; j < frame.pixels.length; j++) {
                    const pixel = frame.pixels[j];
                    const offset = j * 4;
                    
                    if (pixel !== frame.transparentIndex) {
                        const colorIndex = pixel * 3;
                        imgData.data[offset] = frame.colorTable[colorIndex];
                        imgData.data[offset + 1] = frame.colorTable[colorIndex + 1];
                        imgData.data[offset + 2] = frame.colorTable[colorIndex + 2];
                        imgData.data[offset + 3] = 255; // Opaque
                    } else {
                        imgData.data[offset + 3] = 0; // Transparent
                    }
                }
                
                // Draw the frame on temp canvas
                tempCtx.putImageData(imgData, 0, 0);
                
                // Draw from temp canvas to main canvas
                ctx.drawImage(
                    tempCanvas,
                    0, 0, frame.dims.width, frame.dims.height,
                    frame.dims.left, frame.dims.top, frame.dims.width, frame.dims.height
                );
            } else {
                // Create ImageData for the frame
                const imgData = ctx.createImageData(frame.dims.width, frame.dims.height);
                
                // Copy the frame's pixels
                for (let j = 0; j < frame.pixels.length; j++) {
                    const pixel = frame.pixels[j];
                    const offset = j * 4;
                    const colorIndex = pixel * 3;
                    
                    imgData.data[offset] = frame.colorTable[colorIndex];
                    imgData.data[offset + 1] = frame.colorTable[colorIndex + 1];
                    imgData.data[offset + 2] = frame.colorTable[colorIndex + 2];
                    imgData.data[offset + 3] = 255; // Opaque
                }
                
                // Draw the frame
                ctx.putImageData(imgData, frame.dims.left, frame.dims.top);
            }
            
            // Capture the current frame's ImageData
            const frameImageData = ctx.getImageData(0, 0, width, height);
            
            // Store the processed frame
            processedFrames.push({
                imageData: frameImageData,
                delay: frame.delay || 100 // Default to 100ms if delay not specified
            });
        }
        
        return processedFrames;
    }
    
    return {
        loadGif,
        extractFrameData
    };
})();