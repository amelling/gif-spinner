/**
 * Spinner Generator
 * Handles creating the fidget spinner design by arranging SVG frames in a circular pattern
 */

const SpinnerGenerator = (function() {
    /**
     * Generate a preview of the spinner
     * @param {Array} svgFrames - Array of SVG frames
     * @param {Object} options - Spinner options
     * @returns {SVGElement} - SVG element for preview
     */
    function generatePreview(svgFrames, options) {
        if (!svgFrames || svgFrames.length === 0) {
            return createEmptySvg(300, 300, "No frames available");
        }
        
        // Create a simplified spinner for preview
        return generateSpinnerSvg(svgFrames, options, true);
    }
    
    /**
     * Generate the full spinner SVG
     * @param {Array} svgFrames - Array of SVG frames
     * @param {Object} options - Spinner options
     * @param {Function} progressCallback - Callback function for progress updates
     * @returns {Promise<SVGElement>} - Promise resolving to SVG element
     */
    async function generateSpinner(svgFrames, options, progressCallback) {
        return new Promise((resolve, reject) => {
            try {
                if (!svgFrames || svgFrames.length === 0) {
                    reject(new Error("No frames available"));
                    return;
                }
                
                // Update progress
                progressCallback(10, "Setting up spinner layout...");
                
                // Create the spinner SVG
                const spinnerSvg = generateSpinnerSvg(svgFrames, options, false);
                
                // Update progress for different phases
                setTimeout(() => progressCallback(40, "Arranging frames..."), 200);
                setTimeout(() => progressCallback(70, "Creating bearing..."), 400);
                setTimeout(() => progressCallback(90, "Finalizing spinner design..."), 600);
                
                // Simulate processing time (would be actual processing in a real implementation)
                setTimeout(() => {
                    progressCallback(100, "Spinner generated successfully!");
                    resolve(spinnerSvg);
                }, 800);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    /**
     * Generate the spinner SVG
     * @param {Array} svgFrames - Array of SVG frames
     * @param {Object} options - Spinner options
     * @param {boolean} isPreview - Whether this is a preview or final version
     * @returns {SVGElement} - SVG element
     */
    function generateSpinnerSvg(svgFrames, options, isPreview) {
        // Extract options with defaults
        const {
            diameter = 100,
            frameCount = 8,
            spacing = 5,
            bearingDiameter = 22,
            bearingType = 'standard',
            outlineThickness = 3,
            outlineStyle = 'simple'
        } = options;
        
        // Create SVG document
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", diameter);
        svg.setAttribute("height", diameter);
        svg.setAttribute("viewBox", `0 0 ${diameter} ${diameter}`);
        
        // Add a background for preview mode
        if (isPreview) {
            const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            background.setAttribute("width", diameter);
            background.setAttribute("height", diameter);
            background.setAttribute("fill", "#f8f9fa");
            svg.appendChild(background);
        }
        
        // Create a group for the spinner (centered in the SVG)
        const spinnerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        spinnerGroup.setAttribute("transform", `translate(${diameter/2}, ${diameter/2})`);
        
        // Calculate frame positions
        const framePositions = calculateFramePositions(frameCount, diameter, bearingDiameter, spacing);
        
        // Create a group for the frames
        const framesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        // Add frames to the spinner
        for (let i = 0; i < frameCount; i++) {
            const frameIndex = i % svgFrames.length;
            const position = framePositions[i];
            
            const frameElement = createFrameElement(svgFrames[frameIndex], position, isPreview);
            framesGroup.appendChild(frameElement);
        }
        
        // Create spinner outline
        const outline = createSpinnerOutline(framePositions, outlineThickness, outlineStyle);
        
        // Create bearing
        const bearing = createBearing(bearingDiameter, bearingType);
        
        // Add all elements to the spinner group
        spinnerGroup.appendChild(outline);
        spinnerGroup.appendChild(framesGroup);
        spinnerGroup.appendChild(bearing);
        
        // Add spinner group to the SVG
        svg.appendChild(spinnerGroup);
        
        return svg;
    }
    
    /**
     * Calculate positions for frames in a circular arrangement
     * @param {number} count - Number of frames
     * @param {number} diameter - Outer diameter of the spinner
     * @param {number} bearingDiameter - Diameter of the bearing
     * @param {number} spacing - Spacing between frames and center/outline
     * @returns {Array} - Array of position objects {x, y, angle, scale}
     */
    function calculateFramePositions(count, diameter, bearingDiameter, spacing) {
        const positions = [];
        
        // Calculate radius for frame placement
        const radius = (diameter - bearingDiameter) / 2 - spacing;
        
        // Calculate frame size based on spacing and count
        // For even distribution around the circle
        const angleStep = (2 * Math.PI) / count;
        
        // Calculate reasonable scale for frames
        // This is a simple approximation, would need adjustment for real implementation
        const approximateFrameSize = 2 * radius * Math.sin(Math.PI / count);
        const scale = approximateFrameSize / 50; // Assuming original frame is about 50px
        
        // Create position for each frame
        for (let i = 0; i < count; i++) {
            const angle = i * angleStep;
            
            positions.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                angle: angle * (180 / Math.PI),
                scale: scale
            });
        }
        
        return positions;
    }
    
    /**
     * Create a frame element from an SVG
     * @param {SVGElement} frameSvg - SVG element of the frame
     * @param {Object} position - Position object {x, y, angle, scale}
     * @param {boolean} isPreview - Whether this is a preview
     * @returns {SVGElement} - Group element containing the frame
     */
    function createFrameElement(frameSvg, position, isPreview) {
        const { x, y, angle, scale } = position;
        
        // Create a group for the frame
        const frameGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        frameGroup.setAttribute("transform", `translate(${x}, ${y}) rotate(${angle}) scale(${scale})`);
        
        // Clone the frame SVG
        const frameClone = frameSvg.cloneNode(true);
        
        // Remove width, height, and viewBox attributes to allow proper scaling
        frameClone.removeAttribute("width");
        frameClone.removeAttribute("height");
        
        // Keep viewBox for proper proportions
        if (!frameClone.hasAttribute("viewBox") && frameSvg.hasAttribute("viewBox")) {
            frameClone.setAttribute("viewBox", frameSvg.getAttribute("viewBox"));
        }
        
        // Center the frame
        const viewBox = frameClone.getAttribute("viewBox");
        if (viewBox) {
            const parts = viewBox.split(" ").map(Number);
            if (parts.length === 4) {
                const centerX = parts[2] / 2;
                const centerY = parts[3] / 2;
                frameClone.setAttribute("transform", `translate(${-centerX}, ${-centerY})`);
            }
        }
        
        // Add a distinguishing color in preview mode
        if (isPreview) {
            const paths = frameClone.querySelectorAll("path");
            paths.forEach(path => {
                // Generate a random color with transparency
                const hue = Math.floor(Math.random() * 360);
                path.setAttribute("fill", `hsla(${hue}, 70%, 50%, 0.8)`);
                path.setAttribute("stroke", `hsla(${hue}, 70%, 40%, 0.9)`);
                path.setAttribute("stroke-width", "0.5");
            });
        }
        
        frameGroup.appendChild(frameClone);
        return frameGroup;
    }
    
    /**
     * Create the spinner outline based on frame positions
     * @param {Array} positions - Array of frame positions
     * @param {number} thickness - Outline thickness
     * @param {string} style - Outline style
     * @returns {SVGElement} - Path element for the outline
     */
    function createSpinnerOutline(positions, thickness, style) {
        // Create path element
        const outlinePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        
        // Calculate outline path based on style
        let pathData = "";
        
        if (style === 'simple' || positions.length < 3) {
            // Simple circular outline
            const maxRadius = Math.max(...positions.map(p => Math.sqrt(p.x * p.x + p.y * p.y)));
            const radius = maxRadius + 10; // Add some padding
            
            pathData = `M${radius},0 A${radius},${radius} 0 1,1 ${-radius},0 A${radius},${radius} 0 1,1 ${radius},0 Z`;
        } else if (style === 'rounded') {
            // Outline that follows frame positions with rounded corners
            pathData = createRoundedOutlinePath(positions);
        } else {
            // Custom outline (convex hull of positions with padding)
            pathData = createCustomOutlinePath(positions);
        }
        
        // Set path attributes
        outlinePath.setAttribute("d", pathData);
        outlinePath.setAttribute("fill", "none");
        outlinePath.setAttribute("stroke", "#343a40");
        outlinePath.setAttribute("stroke-width", thickness);
        
        return outlinePath;
    }
    
    /**
     * Create a rounded outline path based on frame positions
     * @param {Array} positions - Array of frame positions
     * @returns {string} - SVG path data
     */
    function createRoundedOutlinePath(positions) {
        if (positions.length < 3) return "";
        
        // Calculate hull points (simplified - just use positions)
        const hullPoints = [];
        const angleStep = (2 * Math.PI) / positions.length;
        
        for (let i = 0; i < positions.length; i++) {
            const angle = i * angleStep;
            const pos = positions[i];
            
            // Add some padding to the position
            const padding = 15; // Padding amount
            const paddedX = pos.x + Math.cos(angle) * padding;
            const paddedY = pos.y + Math.sin(angle) * padding;
            
            hullPoints.push({ x: paddedX, y: paddedY });
        }
        
        // Create path data with rounded corners
        let pathData = `M${hullPoints[0].x},${hullPoints[0].y}`;
        
        for (let i = 0; i < hullPoints.length; i++) {
            const current = hullPoints[i];
            const next = hullPoints[(i + 1) % hullPoints.length];
            const next2 = hullPoints[(i + 2) % hullPoints.length];
            
            // Calculate control points for quadratic curves
            const midX = (current.x + next.x) / 2;
            const midY = (current.y + next.y) / 2;
            
            const nextMidX = (next.x + next2.x) / 2;
            const nextMidY = (next.y + next2.y) / 2;
            
            // Add line to midpoint, then quadratic curve to next midpoint
            pathData += ` L${midX},${midY} Q${next.x},${next.y} ${nextMidX},${nextMidY}`;
        }
        
        pathData += " Z"; // Close path
        return pathData;
    }
    
    /**
     * Create a custom outline path based on frame positions
     * @param {Array} positions - Array of frame positions
     * @returns {string} - SVG path data
     */
    function createCustomOutlinePath(positions) {
        if (positions.length < 3) return "";
        
        // For a real implementation, we would calculate a convex hull
        // This is a simplified version that just creates a star shape
        
        // Calculate center point (should be 0,0 but calculate anyway)
        const center = {
            x: positions.reduce((sum, p) => sum + p.x, 0) / positions.length,
            y: positions.reduce((sum, p) => sum + p.y, 0) / positions.length
        };
        
        // Calculate max radius and use it for padding
        const maxRadius = Math.max(...positions.map(p => Math.sqrt(
            Math.pow(p.x - center.x, 2) + Math.pow(p.y - center.y, 2)
        )));
        
        const padding = maxRadius * 0.3; // 30% padding
        
        // Create star shape path
        let pathData = "";
        
        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            const angle = Math.atan2(pos.y - center.y, pos.x - center.x);
            
            // Calculate padded position
            const paddedX = pos.x + Math.cos(angle) * padding;
            const paddedY = pos.y + Math.sin(angle) * padding;
            
            // Calculate midpoint to next position
            const nextPos = positions[(i + 1) % positions.length];
            const nextAngle = Math.atan2(nextPos.y - center.y, nextPos.x - center.x);
            
            const midAngle = (angle + nextAngle) / 2;
            const midDistance = maxRadius * 0.6; // Shorter than the points
            
            const midX = center.x + Math.cos(midAngle) * midDistance;
            const midY = center.y + Math.sin(midAngle) * midDistance;
            
            // Add to path
            if (i === 0) {
                pathData = `M${paddedX},${paddedY}`;
            } else {
                pathData += ` L${paddedX},${paddedY}`;
            }
            
            pathData += ` L${midX},${midY}`;
        }
        
        pathData += " Z"; // Close path
        return pathData;
    }
    
    /**
     * Create a bearing in the center of the spinner
     * @param {number} diameter - Bearing diameter
     * @param {string} type - Bearing type
     * @returns {SVGElement} - Group element containing the bearing
     */
    function createBearing(diameter, type) {
        // Create a group for the bearing
        const bearingGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        // Create the main bearing circle
        const bearingCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        bearingCircle.setAttribute("cx", 0);
        bearingCircle.setAttribute("cy", 0);
        bearingCircle.setAttribute("r", diameter / 2);
        bearingCircle.setAttribute("fill", "#e9ecef");
        bearingCircle.setAttribute("stroke", "#6c757d");
        bearingCircle.setAttribute("stroke-width", "1");
        
        // Add bearing to group
        bearingGroup.appendChild(bearingCircle);
        
        // Add bearing details based on type
        if (type === 'standard') {
            // Standard 608 bearing representation
            // Outer ring
            const outerRing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            outerRing.setAttribute("cx", 0);
            outerRing.setAttribute("cy", 0);
            outerRing.setAttribute("r", diameter / 2 - 1);
            outerRing.setAttribute("fill", "none");
            outerRing.setAttribute("stroke", "#adb5bd");
            outerRing.setAttribute("stroke-width", "1");
            bearingGroup.appendChild(outerRing);
            
            // Inner ring
            const innerRing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            innerRing.setAttribute("cx", 0);
            innerRing.setAttribute("cy", 0);
            innerRing.setAttribute("r", diameter / 4);
            innerRing.setAttribute("fill", "#dee2e6");
            innerRing.setAttribute("stroke", "#adb5bd");
            innerRing.setAttribute("stroke-width", "1");
            bearingGroup.appendChild(innerRing);
            
            // Central hole
            const centralHole = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            centralHole.setAttribute("cx", 0);
            centralHole.setAttribute("cy", 0);
            centralHole.setAttribute("r", diameter / 8);
            centralHole.setAttribute("fill", "#6c757d");
            bearingGroup.appendChild(centralHole);
        } else {
            // Print-in-place bearing design
            // Create a more detailed design with multiple rings and ball representation
            
            // Main bearing space
            const bearingSpace = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            bearingSpace.setAttribute("cx", 0);
            bearingSpace.setAttribute("cy", 0);
            bearingSpace.setAttribute("r", diameter / 2 - 2);
            bearingSpace.setAttribute("fill", "#dee2e6");
            bearingSpace.setAttribute("stroke", "#adb5bd");
            bearingSpace.setAttribute("stroke-width", "1");
            bearingGroup.appendChild(bearingSpace);
            
            // Inner part
            const innerPart = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            innerPart.setAttribute("cx", 0);
            innerPart.setAttribute("cy", 0);
            innerPart.setAttribute("r", diameter / 3.5);
            innerPart.setAttribute("fill", "#e9ecef");
            innerPart.setAttribute("stroke", "#adb5bd");
            innerPart.setAttribute("stroke-width", "1");
            bearingGroup.appendChild(innerPart);
            
            // Add ball bearings representation
            const ballRadius = diameter / 12;
            const ballCount = 8;
            const ballDistance = diameter / 2.5;
            
            for (let i = 0; i < ballCount; i++) {
                const angle = (i / ballCount) * 2 * Math.PI;
                const ballX = Math.cos(angle) * ballDistance;
                const ballY = Math.sin(angle) * ballDistance;
                
                const ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                ball.setAttribute("cx", ballX);
                ball.setAttribute("cy", ballY);
                ball.setAttribute("r", ballRadius);
                ball.setAttribute("fill", "#adb5bd");
                bearingGroup.appendChild(ball);
            }
            
            // Central hole
            const centralHole = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            centralHole.setAttribute("cx", 0);
            centralHole.setAttribute("cy", 0);
            centralHole.setAttribute("r", diameter / 6);
            centralHole.setAttribute("fill", "#6c757d");
            bearingGroup.appendChild(centralHole);
        }
        
        return bearingGroup;
    }
    
    /**
     * Create an empty SVG with a message
     * @param {number} width - SVG width
     * @param {number} height - SVG height
     * @param {string} message - Message to display
     * @returns {SVGElement} - SVG element
     */
    function createEmptySvg(width, height, message) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        
        // Background
        const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        background.setAttribute("width", width);
        background.setAttribute("height", height);
        background.setAttribute("fill", "#f8f9fa");
        svg.appendChild(background);
        
        // Message
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", width / 2);
        text.setAttribute("y", height / 2);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("fill", "#6c757d");
        text.setAttribute("font-family", "Arial, sans-serif");
        text.setAttribute("font-size", "16");
        text.textContent = message;
        svg.appendChild(text);
        
        return svg;
    }
    
    return {
        generatePreview,
        generateSpinner
    };
})();