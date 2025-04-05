/**
 * Exporters
 * Handles exporting the spinner design in different formats
 */

const Exporters = (function() {
    /**
     * Export files in selected formats
     * @param {SVGElement} spinnerSvg - SVG element containing the spinner design
     * @param {Object} options - Export options
     * @param {Function} progressCallback - Callback function for progress updates
     * @returns {Promise<void>} - Promise resolving when export is complete
     */
    async function exportFiles(spinnerSvg, options, progressCallback) {
        return new Promise(async (resolve, reject) => {
            try {
                // Extract options
                const {
                    exportSvg = true,
                    exportPng = false,
                    exportStl = false,
                    modelThickness = 3
                } = options;
                
                // Track progress
                let totalExports = 0;
                let completedExports = 0;
                
                if (exportSvg) totalExports++;
                if (exportPng) totalExports++;
                if (exportStl) totalExports++;
                
                // Export SVG if selected
                if (exportSvg) {
                    progressCallback(10, "Preparing SVG file...");
                    await exportSvgFile(spinnerSvg);
                    completedExports++;
                    progressCallback((completedExports / totalExports) * 100, "SVG exported successfully!");
                }
                
                // Export PNG if selected
                if (exportPng) {
                    progressCallback((completedExports / totalExports) * 50 + 10, "Generating PNG file...");
                    await exportPngFile(spinnerSvg);
                    completedExports++;
                    progressCallback((completedExports / totalExports) * 100, "PNG exported successfully!");
                }
                
                // Export STL if selected
                if (exportStl) {
                    progressCallback((completedExports / totalExports) * 50 + 10, "Preparing 3D model...");
                    await exportStlFile(spinnerSvg, modelThickness);
                    completedExports++;
                    progressCallback(100, "STL exported successfully!");
                }
                
                // All exports completed
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    
    /**
     * Export the spinner design as an SVG file
     * @param {SVGElement} spinnerSvg - SVG element containing the spinner design
     * @returns {Promise<void>} - Promise resolving when export is complete
     */
    async function exportSvgFile(spinnerSvg) {
        return new Promise((resolve, reject) => {
            try {
                // Clone the SVG to avoid modifying the original
                const svgClone = spinnerSvg.cloneNode(true);
                
                // Set SVG attributes for standalone viewing
                svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                svgClone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
                
                // Create SVG string
                const svgString = new XMLSerializer().serializeToString(svgClone);
                
                // Create Blob and save
                const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
                saveAs(blob, "fidget-spinner.svg");
                
                // Simulate processing time
                setTimeout(resolve, 200);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    /**
     * Export the spinner design as a PNG file
     * @param {SVGElement} spinnerSvg - SVG element containing the spinner design
     * @returns {Promise<void>} - Promise resolving when export is complete
     */
    async function exportPngFile(spinnerSvg) {
        return new Promise((resolve, reject) => {
            try {
                // Clone the SVG to avoid modifying the original
                const svgClone = spinnerSvg.cloneNode(true);
                
                // Get dimensions
                const width = parseInt(svgClone.getAttribute("width")) || 300;
                const height = parseInt(svgClone.getAttribute("height")) || 300;
                
                // Set a white background for PNG export
                const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                background.setAttribute("width", "100%");
                background.setAttribute("height", "100%");
                background.setAttribute("fill", "white");
                svgClone.insertBefore(background, svgClone.firstChild);
                
                // Create SVG string
                const svgString = new XMLSerializer().serializeToString(svgClone);
                const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
                const svgUrl = URL.createObjectURL(svgBlob);
                
                // Create Image from SVG
                const img = new Image();
                img.onload = function() {
                    // Create canvas
                    const canvas = document.createElement("canvas");
                    canvas.width = width * 2; // Double size for better quality
                    canvas.height = height * 2;
                    
                    // Draw SVG on canvas
                    const ctx = canvas.getContext("2d");
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    // Convert canvas to PNG
                    canvas.toBlob(function(blob) {
                        saveAs(blob, "fidget-spinner.png");
                        URL.revokeObjectURL(svgUrl);
                        resolve();
                    }, "image/png");
                };
                
                img.onerror = function() {
                    URL.revokeObjectURL(svgUrl);
                    reject(new Error("Failed to load SVG for PNG conversion"));
                };
                
                img.src = svgUrl;
            } catch (error) {
                reject(error);
            }
        });
    }
    
    /**
     * Export the spinner design as an STL file
     * @param {SVGElement} spinnerSvg - SVG element containing the spinner design
     * @param {number} thickness - Thickness of the 3D model in mm
     * @returns {Promise<void>} - Promise resolving when export is complete
     */
    async function exportStlFile(spinnerSvg, thickness) {
        return new Promise((resolve, reject) => {
            try {
                // This is a simplified implementation of SVG to STL conversion
                // In a real implementation, we would use Three.js to extrude the SVG paths
                // and create a 3D model, which would then be exported as an STL file
                
                // For this implementation, we'll create a placeholder STL file
                // representing a simple 3D version of the spinner
                
                // Create a simple STL file content (ASCII format)
                let stlContent = "solid fidget-spinner\n";
                
                // Add some placeholder triangles - this would actually be 
                // generated from the SVG paths in a real implementation
                const diameterValue = parseInt(spinnerSvg.getAttribute("width")) || 100;
                const radius = diameterValue / 2;
                const height = thickness;
                
                // Generate basic triangles for a circular disc
                const segments = 36;
                const segmentAngle = (2 * Math.PI) / segments;
                
                // Top face
                for (let i = 0; i < segments; i++) {
                    const angle1 = i * segmentAngle;
                    const angle2 = (i + 1) * segmentAngle;
                    
                    const x1 = radius * Math.cos(angle1);
                    const y1 = radius * Math.sin(angle1);
                    const z1 = height;
                    
                    const x2 = radius * Math.cos(angle2);
                    const y2 = radius * Math.sin(angle2);
                    const z2 = height;
                    
                    stlContent += `  facet normal 0 0 1\n`;
                    stlContent += `    outer loop\n`;
                    stlContent += `      vertex 0 0 ${z1}\n`;
                    stlContent += `      vertex ${x1} ${y1} ${z1}\n`;
                    stlContent += `      vertex ${x2} ${y2} ${z2}\n`;
                    stlContent += `    endloop\n`;
                    stlContent += `  endfacet\n`;
                }
                
                // Bottom face
                for (let i = 0; i < segments; i++) {
                    const angle1 = i * segmentAngle;
                    const angle2 = (i + 1) * segmentAngle;
                    
                    const x1 = radius * Math.cos(angle1);
                    const y1 = radius * Math.sin(angle1);
                    const z1 = 0;
                    
                    const x2 = radius * Math.cos(angle2);
                    const y2 = radius * Math.sin(angle2);
                    const z2 = 0;
                    
                    stlContent += `  facet normal 0 0 -1\n`;
                    stlContent += `    outer loop\n`;
                    stlContent += `      vertex 0 0 ${z1}\n`;
                    stlContent += `      vertex ${x2} ${y2} ${z2}\n`;
                    stlContent += `      vertex ${x1} ${y1} ${z1}\n`;
                    stlContent += `    endloop\n`;
                    stlContent += `  endfacet\n`;
                }
                
                // Side faces
                for (let i = 0; i < segments; i++) {
                    const angle1 = i * segmentAngle;
                    const angle2 = (i + 1) * segmentAngle;
                    
                    const x1 = radius * Math.cos(angle1);
                    const y1 = radius * Math.sin(angle1);
                    
                    const x2 = radius * Math.cos(angle2);
                    const y2 = radius * Math.sin(angle2);
                    
                    // Calculate normal vector
                    const nx = (Math.cos(angle1) + Math.cos(angle2)) / 2;
                    const ny = (Math.sin(angle1) + Math.sin(angle2)) / 2;
                    const normalMagnitude = Math.sqrt(nx * nx + ny * ny);
                    
                    stlContent += `  facet normal ${nx / normalMagnitude} ${ny / normalMagnitude} 0\n`;
                    stlContent += `    outer loop\n`;
                    stlContent += `      vertex ${x1} ${y1} 0\n`;
                    stlContent += `      vertex ${x2} ${y2} 0\n`;
                    stlContent += `      vertex ${x2} ${y2} ${height}\n`;
                    stlContent += `    endloop\n`;
                    stlContent += `  endfacet\n`;
                    
                    stlContent += `  facet normal ${nx / normalMagnitude} ${ny / normalMagnitude} 0\n`;
                    stlContent += `    outer loop\n`;
                    stlContent += `      vertex ${x1} ${y1} 0\n`;
                    stlContent += `      vertex ${x2} ${y2} ${height}\n`;
                    stlContent += `      vertex ${x1} ${y1} ${height}\n`;
                    stlContent += `    endloop\n`;
                    stlContent += `  endfacet\n`;
                }
                
                // Add hole in the middle for bearing
                const holeRadius = 11; // Half of standard bearing diameter
                
                // Hole side faces
                for (let i = 0; i < segments; i++) {
                    const angle1 = i * segmentAngle;
                    const angle2 = (i + 1) * segmentAngle;
                    
                    const x1 = holeRadius * Math.cos(angle1);
                    const y1 = holeRadius * Math.sin(angle1);
                    
                    const x2 = holeRadius * Math.cos(angle2);
                    const y2 = holeRadius * Math.sin(angle2);
                    
                    // Calculate normal vector (pointing inward)
                    const nx = -(Math.cos(angle1) + Math.cos(angle2)) / 2;
                    const ny = -(Math.sin(angle1) + Math.sin(angle2)) / 2;
                    const normalMagnitude = Math.sqrt(nx * nx + ny * ny);
                    
                    stlContent += `  facet normal ${nx / normalMagnitude} ${ny / normalMagnitude} 0\n`;
                    stlContent += `    outer loop\n`;
                    stlContent += `      vertex ${x1} ${y1} 0\n`;
                    stlContent += `      vertex ${x1} ${y1} ${height}\n`;
                    stlContent += `      vertex ${x2} ${y2} ${height}\n`;
                    stlContent += `    endloop\n`;
                    stlContent += `  endfacet\n`;
                    
                    stlContent += `  facet normal ${nx / normalMagnitude} ${ny / normalMagnitude} 0\n`;
                    stlContent += `    outer loop\n`;
                    stlContent += `      vertex ${x1} ${y1} 0\n`;
                    stlContent += `      vertex ${x2} ${y2} ${height}\n`;
                    stlContent += `      vertex ${x2} ${y2} 0\n`;
                    stlContent += `    endloop\n`;
                    stlContent += `  endfacet\n`;
                }
                
                stlContent += "endsolid fidget-spinner\n";
                
                // Create Blob and save
                const blob = new Blob([stlContent], { type: "application/octet-stream" });
                saveAs(blob, "fidget-spinner.stl");
                
                // Simulate processing time
                setTimeout(resolve, 500);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    return {
        exportFiles
    };
})();