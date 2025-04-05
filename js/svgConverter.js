/**
 * SVG Converter
 * Handles converting processed GIF frames to SVG paths
 */

const SvgConverter = (function() {
    /**
     * Convert a set of frames to SVG
     * @param {Array} frames - Array of processed GIF frames
     * @param {Object} options - Conversion options
     * @param {Function} progressCallback - Callback function for progress updates
     * @returns {Promise<Array>} - Promise resolving to array of SVG documents
     */
    async function convertFrames(frames, options, progressCallback) {
        const method = options.method || 'simple';
        const svgFrames = [];
        
        for (let i = 0; i < frames.length; i++) {
            // Update progress
            const progress = Math.round((i / frames.length) * 100);
            progressCallback(progress, `Converting frame ${i+1} of ${frames.length}`);
            
            // Convert frame to SVG based on selected method
            let svgDocument;
            if (method === 'simple') {
                svgDocument = await convertFrameSimple(frames[i].imageData, options);
            } else {
                svgDocument = await convertFrameAdvanced(frames[i].imageData, options);
            }
            
            svgFrames.push(svgDocument);
        }
        
        progressCallback(100, 'All frames converted successfully!');
        return svgFrames;
    }
    
    /**
     * Convert a frame to SVG using the simple bitmap-outline method
     * @param {ImageData} imageData - Frame image data
     * @param {Object} options - Conversion options
     * @returns {Promise<SVGSVGElement>} - Promise resolving to SVG document
     */
    async function convertFrameSimple(imageData, options) {
        // In a real implementation, we would use bitmap-outline library
        // For this implementation, we'll create a simplified version
        
        // Create SVG document
        const svgDocument = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgDocument.setAttribute('width', imageData.width);
        svgDocument.setAttribute('height', imageData.height);
        svgDocument.setAttribute('viewBox', `0 0 ${imageData.width} ${imageData.height}`);
        
        // Process image data into a simplified bitmap (black and white pixels)
        const bitmap = preprocessBitmap(imageData, options);
        
        // Find contours in the bitmap (simple edge tracing algorithm)
        const contours = findContours(bitmap, imageData.width, imageData.height);
        
        // Convert contours to SVG paths
        contours.forEach(contour => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', contourToSvgPath(contour, options.cornerSmoothing || 0));
            path.setAttribute('fill', 'black');
            path.setAttribute('stroke', 'none');
            svgDocument.appendChild(path);
        });
        
        return svgDocument;
    }
    
    /**
     * Convert a frame to SVG using the advanced Potrace-based method
     * @param {ImageData} imageData - Frame image data
     * @param {Object} options - Conversion options
     * @returns {Promise<SVGSVGElement>} - Promise resolving to SVG document
     */
    async function convertFrameAdvanced(imageData, options) {
        // In a real implementation, we would use a Potrace library
        // For this implementation, we'll create a placeholder that produces a more complex SVG
        
        // Create SVG document
        const svgDocument = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgDocument.setAttribute('width', imageData.width);
        svgDocument.setAttribute('height', imageData.height);
        svgDocument.setAttribute('viewBox', `0 0 ${imageData.width} ${imageData.height}`);
        
        // Process image data with more sophisticated preprocessing
        const bitmap = preprocessBitmapAdvanced(imageData, options);
        
        // Simulate Potrace algorithm results
        const paths = simulatePotraceResults(bitmap, imageData.width, imageData.height, options);
        
        // Add paths to SVG
        paths.forEach(pathData => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathData);
            path.setAttribute('fill', 'black');
            path.setAttribute('stroke', 'none');
            svgDocument.appendChild(path);
        });
        
        return svgDocument;
    }
    
    /**
     * Preprocess ImageData into a bitmap array
     * @param {ImageData} imageData - Frame image data
     * @param {Object} options - Preprocessing options
     * @returns {Uint8Array} - Binary bitmap (0 for background, 1 for foreground)
     */
    function preprocessBitmap(imageData, options) {
        const { width, height, data } = imageData;
        const threshold = options.threshold || 128;
        const bitmap = new Uint8Array(width * height);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                
                // Calculate grayscale value
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];
                
                // Skip fully transparent pixels
                if (a === 0) {
                    bitmap[y * width + x] = 0;
                    continue;
                }
                
                // Convert to grayscale and apply threshold
                const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                bitmap[y * width + x] = gray < threshold ? 1 : 0;
            }
        }
        
        return bitmap;
    }
    
    /**
     * Advanced bitmap preprocessing for Potrace-based conversion
     * @param {ImageData} imageData - Frame image data
     * @param {Object} options - Preprocessing options
     * @returns {Uint8Array} - Binary bitmap with additional processing
     */
    function preprocessBitmapAdvanced(imageData, options) {
        const { width, height, data } = imageData;
        const threshold = options.threshold || 128;
        const detailLevel = options.detailLevel || 5;
        const bitmap = new Uint8Array(width * height);
        
        // Convert to grayscale and apply adaptive thresholding
        // This is a simplified version; a real implementation would use more sophisticated algorithms
        
        // Step 1: Convert to grayscale
        const grayscale = new Uint8Array(width * height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                
                // Skip fully transparent pixels
                if (data[i + 3] === 0) {
                    grayscale[y * width + x] = 255;
                    continue;
                }
                
                // Convert to grayscale
                const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
                grayscale[y * width + x] = gray;
            }
        }
        
        // Step 2: Apply simple adaptive thresholding based on detail level
        const blockSize = 11 - detailLevel; // Higher detail level = smaller blocks
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Calculate local average (simplified)
                let sum = 0;
                let count = 0;
                
                for (let dy = -blockSize; dy <= blockSize; dy++) {
                    for (let dx = -blockSize; dx <= blockSize; dx++) {
                        const nx = x + dx;
                        const ny = y + dy;
                        
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            sum += grayscale[ny * width + nx];
                            count++;
                        }
                    }
                }
                
                const localAvg = sum / count;
                const pixel = grayscale[y * width + x];
                
                // Apply threshold with a constant
                bitmap[y * width + x] = pixel < localAvg - (10 - detailLevel) ? 1 : 0;
            }
        }
        
        return bitmap;
    }
    
    /**
     * Find contours in a bitmap using a simplified algorithm
     * @param {Uint8Array} bitmap - Binary bitmap
     * @param {number} width - Bitmap width
     * @param {number} height - Bitmap height
     * @returns {Array} - Array of contours, each contour is an array of points
     */
    function findContours(bitmap, width, height) {
        // This is a simplified contour finding algorithm
        // In a real implementation, we would use a more sophisticated approach
        
        const contours = [];
        const visited = new Uint8Array(bitmap.length);
        
        // Direction vectors (right, down, left, up)
        const dx = [1, 0, -1, 0];
        const dy = [0, 1, 0, -1];
        
        // Find starting points (pixels with value 1)
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = y * width + x;
                
                if (bitmap[idx] === 1 && visited[idx] === 0) {
                    // Start a new contour
                    const contour = [];
                    let cx = x;
                    let cy = y;
                    
                    // Trace the contour
                    let dir = 0; // Start by going right
                    let count = 0;
                    const maxSteps = width * height; // Limit to prevent infinite loops
                    
                    while (count < maxSteps) {
                        visited[cy * width + cx] = 1;
                        contour.push({ x: cx, y: cy });
                        
                        // Try to find next pixel in contour
                        let found = false;
                        let originalDir = dir;
                        
                        for (let i = 0; i < 4; i++) {
                            const nx = cx + dx[dir];
                            const ny = cy + dy[dir];
                            
                            if (nx >= 0 && nx < width && ny >= 0 && ny < height && 
                                bitmap[ny * width + nx] === 1) {
                                cx = nx;
                                cy = ny;
                                found = true;
                                break;
                            }
                            
                            // Try next direction
                            dir = (dir + 1) % 4;
                        }
                        
                        if (!found || (contour.length > 2 && cx === contour[0].x && cy === contour[0].y)) {
                            break;
                        }
                        
                        // Rotate direction
                        dir = (dir + 3) % 4; // Turn left
                        
                        count++;
                    }
                    
                    if (contour.length > 2) {
                        contours.push(contour);
                    }
                }
            }
        }
        
        return contours;
    }
    
    /**
     * Convert a contour to an SVG path
     * @param {Array} contour - Array of points forming a contour
     * @param {number} smoothing - Level of corner smoothing (0-10)
     * @returns {string} - SVG path data
     */
    function contourToSvgPath(contour, smoothing) {
        if (contour.length === 0) return '';
        
        let pathData = `M${contour[0].x},${contour[0].y}`;
        
        if (smoothing === 0) {
            // No smoothing, use straight lines
            for (let i = 1; i < contour.length; i++) {
                pathData += ` L${contour[i].x},${contour[i].y}`;
            }
        } else {
            // Apply corner smoothing
            const radius = smoothing * 0.5;
            
            for (let i = 1; i < contour.length; i++) {
                const p0 = contour[(i - 1 + contour.length) % contour.length];
                const p1 = contour[i];
                const p2 = contour[(i + 1) % contour.length];
                
                // Calculate vectors
                const v1x = p1.x - p0.x;
                const v1y = p1.y - p0.y;
                const v2x = p2.x - p1.x;
                const v2y = p2.y - p1.y;
                
                // Normalize vectors
                const v1Len = Math.sqrt(v1x * v1x + v1y * v1y);
                const v2Len = Math.sqrt(v2x * v2x + v2y * v2y);
                
                if (v1Len < 1 || v2Len < 1) {
                    pathData += ` L${p1.x},${p1.y}`;
                    continue;
                }
                
                const v1nx = v1x / v1Len;
                const v1ny = v1y / v1Len;
                const v2nx = v2x / v2Len;
                const v2ny = v2y / v2Len;
                
                // Calculate control points
                const cp1x = p1.x - v1nx * radius;
                const cp1y = p1.y - v1ny * radius;
                const cp2x = p1.x + v2nx * radius;
                const cp2y = p1.y + v2ny * radius;
                
                pathData += ` L${cp1x},${cp1y} Q${p1.x},${p1.y} ${cp2x},${cp2y}`;
            }
        }
        
        pathData += ' Z'; // Close path
        return pathData;
    }
    
    /**
     * Simulate Potrace results for advanced conversion
     * @param {Uint8Array} bitmap - Binary bitmap
     * @param {number} width - Bitmap width
     * @param {number} height - Bitmap height
     * @param {Object} options - Processing options
     * @returns {Array} - Array of SVG path data strings
     */
    function simulatePotraceResults(bitmap, width, height, options) {
        // This is a placeholder for actual Potrace algorithm
        // In a real implementation, we would use a Potrace library
        
        // For this simulation, we'll use the basic contour finding and apply more
        // sophisticated path generation
        
        const contours = findContours(bitmap, width, height);
        const paths = [];
        
        const pathOptimization = options.pathOptimization || 5;
        const cornerSmoothing = options.cornerSmoothing || 2;
        
        contours.forEach(contour => {
            // Apply path optimization (simplify contour by removing points)
            let optimizedContour = contour;
            if (pathOptimization > 0) {
                optimizedContour = simplifyContour(contour, pathOptimization * 0.5);
            }
            
            // Generate smoother SVG path with Bézier curves
            const pathData = generateSmoothPath(optimizedContour, cornerSmoothing);
            paths.push(pathData);
        });
        
        return paths;
    }
    
    /**
     * Simplify a contour by removing points
     * @param {Array} contour - Array of points
     * @param {number} tolerance - Simplification tolerance
     * @returns {Array} - Simplified contour
     */
    function simplifyContour(contour, tolerance) {
        // Implementation of Ramer-Douglas-Peucker algorithm (simplified)
        if (contour.length <= 2) return contour;
        
        // Find the point with the maximum distance
        let maxDist = 0;
        let index = 0;
        
        const start = contour[0];
        const end = contour[contour.length - 1];
        
        for (let i = 1; i < contour.length - 1; i++) {
            const dist = pointLineDistance(contour[i], start, end);
            if (dist > maxDist) {
                maxDist = dist;
                index = i;
            }
        }
        
        // If max distance is greater than tolerance, recursively simplify
        if (maxDist > tolerance) {
            // Recursive calls
            const part1 = simplifyContour(contour.slice(0, index + 1), tolerance);
            const part2 = simplifyContour(contour.slice(index), tolerance);
            
            // Concatenate results (remove duplicated point)
            return part1.slice(0, -1).concat(part2);
        } else {
            // Return only the endpoints
            return [start, end];
        }
    }
    
    /**
     * Calculate distance from a point to a line segment
     * @param {Object} point - Point coordinates
     * @param {Object} lineStart - Line start coordinates
     * @param {Object} lineEnd - Line end coordinates
     * @returns {number} - Distance from point to line
     */
    function pointLineDistance(point, lineStart, lineEnd) {
        const dx = lineEnd.x - lineStart.x;
        const dy = lineEnd.y - lineStart.y;
        
        // If it's a point, not a line, return distance to the point
        if (dx === 0 && dy === 0) {
            const distX = point.x - lineStart.x;
            const distY = point.y - lineStart.y;
            return Math.sqrt(distX * distX + distY * distY);
        }
        
        // Calculate projection
        const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / 
                 (dx * dx + dy * dy);
        
        if (t < 0) {
            // Point is beyond lineStart
            const distX = point.x - lineStart.x;
            const distY = point.y - lineStart.y;
            return Math.sqrt(distX * distX + distY * distY);
        }
        
        if (t > 1) {
            // Point is beyond lineEnd
            const distX = point.x - lineEnd.x;
            const distY = point.y - lineEnd.y;
            return Math.sqrt(distX * distX + distY * distY);
        }
        
        // Point is on projection
        const projX = lineStart.x + t * dx;
        const projY = lineStart.y + t * dy;
        const distX = point.x - projX;
        const distY = point.y - projY;
        
        return Math.sqrt(distX * distX + distY * distY);
    }
    
    /**
     * Generate a smooth path using Bézier curves
     * @param {Array} contour - Array of points
     * @param {number} smoothing - Smoothing factor
     * @returns {string} - SVG path data
     */
    function generateSmoothPath(contour, smoothing) {
        if (contour.length <= 2) {
            return `M${contour[0].x},${contour[0].y} L${contour[contour.length-1].x},${contour[contour.length-1].y}`;
        }
        
        // Create a closed loop by repeating first points at the end
        const points = [...contour];
        if (points[0].x !== points[points.length - 1].x || points[0].y !== points[points.length - 1].y) {
            points.push(points[0], points[1], points[2]);
        }
        
        let pathData = `M${points[0].x},${points[0].y}`;
        
        // Calculate control points for each segment
        for (let i = 1; i < points.length - 2; i++) {
            const p0 = points[i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2];
            
            // Calculate control points
            const tensionFactor = 0.2 + smoothing * 0.05; // Adjust tension based on smoothing
            
            const cp1x = p1.x + (p2.x - p0.x) * tensionFactor;
            const cp1y = p1.y + (p2.y - p0.y) * tensionFactor;
            const cp2x = p2.x - (p3.x - p1.x) * tensionFactor;
            const cp2y = p2.y - (p3.y - p1.y) * tensionFactor;
            
            // Add cubic Bézier curve segment
            pathData += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
        }
        
        return pathData;
    }
    
    return {
        convertFrames,
        convertFrameSimple,
        convertFrameAdvanced
    };
})();