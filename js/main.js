/**
 * GIF Spinner Generator
 * Main application logic and UI coordination
 */

document.addEventListener('DOMContentLoaded', () => {
    // Application state
    const appState = {
        selectedGif: null,
        gifFrames: [],
        processedFrames: [],
        spinnerSvg: null,
        currentStep: 1,
        processingStatus: {
            inProgress: false,
            progress: 0,
            statusMessage: ''
        }
    };

    // DOM Elements
    const elements = {
        // GIF Selection section
        gifUpload: document.getElementById('gif-upload'),
        sampleGifs: document.getElementById('sample-gifs'),
        gifPreviewContainer: document.getElementById('gif-preview-container'),
        gifPreview: document.getElementById('gif-preview'),
        gifDimensions: document.getElementById('gif-dimensions'),
        gifFrames: document.getElementById('gif-frames'),

        // Conversion options
        conversionOptions: document.getElementById('conversion-options'),
        conversionMethod: document.getElementsByName('conversion-method'),
        threshold: document.getElementById('threshold'),
        thresholdValue: document.getElementById('threshold-value'),
        detailLevel: document.getElementById('detail-level'),
        detailLevelValue: document.getElementById('detail-level-value'),
        advancedOptions: document.querySelector('.advanced-options'),
        cornerSmoothing: document.getElementById('corner-smoothing'),
        cornerSmoothingValue: document.getElementById('corner-smoothing-value'),
        pathOptimization: document.getElementById('path-optimization'),
        pathOptimizationValue: document.getElementById('path-optimization-value'),
        processFramesBtn: document.getElementById('process-frames-btn'),

        // Spinner design
        spinnerDesign: document.getElementById('spinner-design'),
        spinnerDiameter: document.getElementById('spinner-diameter'),
        frameCount: document.getElementById('frame-count'),
        frameSpacing: document.getElementById('frame-spacing'),
        frameSpacingValue: document.getElementById('frame-spacing-value'),
        bearingDiameter: document.getElementById('bearing-diameter'),
        bearingType: document.getElementById('bearing-type'),
        outlineThickness: document.getElementById('outline-thickness'),
        outlineThicknessValue: document.getElementById('outline-thickness-value'),
        outlineStyle: document.getElementById('outline-style'),
        spinnerPreviewContainer: document.getElementById('spinner-preview-container'),
        generateSpinnerBtn: document.getElementById('generate-spinner-btn'),

        // Output options
        outputOptions: document.getElementById('output-options'),
        exportSvg: document.getElementById('export-svg'),
        exportPng: document.getElementById('export-png'),
        exportStl: document.getElementById('export-stl'),
        stlOptions: document.querySelector('.stl-options'),
        modelThickness: document.getElementById('model-thickness'),
        exportPreviewContainer: document.getElementById('export-preview-container'),
        exportBtn: document.getElementById('export-btn'),

        // Processing overlay
        processingOverlay: document.getElementById('processing-overlay'),
        progressBar: document.getElementById('progress-bar'),
        processingStatus: document.getElementById('processing-status')
    };

    // Initialize application
    initApp();

    function initApp() {
        // Load sample GIFs
        loadSampleGifs();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize UI state
        updateUIState();
    }

    function loadSampleGifs() {
        // Define sample GIFs
        const samples = [
            { name: 'Walking', path: 'assets/samples/walking.gif' },
            { name: 'Jumping', path: 'assets/samples/jumping.gif' },
            { name: 'Dancing', path: 'assets/samples/dancing.gif' },
            { name: 'Hearts', path: 'assets/samples/hearts.gif' },
            { name: 'Star', path: 'assets/samples/star.gif' },
            { name: 'Loading', path: 'assets/samples/loading.gif' }
        ];
        
        // Create and append sample GIF elements
        samples.forEach(sample => {
            const img = document.createElement('img');
            img.src = sample.path;
            img.alt = sample.name;
            img.className = 'sample-gif';
            img.title = sample.name;
            img.dataset.path = sample.path;
            
            elements.sampleGifs.appendChild(img);
        });
    }

    function setupEventListeners() {
        // GIF Selection events
        elements.gifUpload.addEventListener('change', handleGifUpload);
        elements.sampleGifs.addEventListener('click', handleSampleGifSelect);
        
        // Conversion option events
        elements.threshold.addEventListener('input', updateThresholdValue);
        elements.detailLevel.addEventListener('input', updateDetailLevelValue);
        elements.cornerSmoothing.addEventListener('input', updateCornerSmoothingValue);
        elements.pathOptimization.addEventListener('input', updatePathOptimizationValue);
        
        // Toggle advanced options when using advanced conversion method
        Array.from(elements.conversionMethod).forEach(radio => {
            radio.addEventListener('change', toggleAdvancedOptions);
        });
        
        elements.processFramesBtn.addEventListener('click', processGifFrames);
        
        // Spinner design events
        elements.frameSpacing.addEventListener('input', updateFrameSpacingValue);
        elements.outlineThickness.addEventListener('input', updateOutlineThicknessValue);
        elements.generateSpinnerBtn.addEventListener('click', generateSpinner);
        
        // Changes to spinner options should update the preview
        const spinnerControls = [
            elements.spinnerDiameter, elements.frameCount, elements.frameSpacing,
            elements.bearingDiameter, elements.bearingType, elements.outlineThickness,
            elements.outlineStyle
        ];
        
        spinnerControls.forEach(control => {
            control.addEventListener('change', updateSpinnerPreview);
            control.addEventListener('input', updateSpinnerPreview);
        });
        
        // Output option events
        elements.exportStl.addEventListener('change', toggleStlOptions);
        elements.exportBtn.addEventListener('click', exportFiles);
    }

    // Event handlers
    function handleGifUpload(e) {
        const file = e.target.files[0];
        if (file && file.type === 'image/gif') {
            const reader = new FileReader();
            reader.onload = function(event) {
                processSelectedGif(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    function handleSampleGifSelect(e) {
        if (e.target.classList.contains('sample-gif')) {
            // Remove selected class from all samples
            document.querySelectorAll('.sample-gif').forEach(img => {
                img.classList.remove('selected');
            });
            
            // Add selected class to clicked sample
            e.target.classList.add('selected');
            
            // Process the selected GIF
            processSelectedGif(e.target.src);
        }
    }

    async function processSelectedGif(gifUrl) {
        showProcessingOverlay('Loading GIF...');
        
        try {
            // Load and parse the GIF
            const gifData = await GifProcessor.loadGif(gifUrl);
            
            // Update application state
            appState.selectedGif = gifUrl;
            appState.gifFrames = gifData.frames;
            
            // Update UI
            elements.gifPreview.src = gifUrl;
            elements.gifDimensions.textContent = `Dimensions: ${gifData.width}×${gifData.height}`;
            elements.gifFrames.textContent = `Frames: ${gifData.frames.length}`;
            elements.gifPreviewContainer.classList.remove('hidden');
            
            // Show conversion options
            elements.conversionOptions.classList.remove('hidden');
            
            // Move to step 2
            appState.currentStep = 2;
            updateUIState();
            
            hideProcessingOverlay();
        } catch (error) {
            console.error('Error processing GIF:', error);
            hideProcessingOverlay();
            alert('Failed to process the GIF. Please try another file.');
        }
    }

    function updateThresholdValue() {
        elements.thresholdValue.textContent = elements.threshold.value;
    }

    function updateDetailLevelValue() {
        elements.detailLevelValue.textContent = elements.detailLevel.value;
    }

    function updateCornerSmoothingValue() {
        elements.cornerSmoothingValue.textContent = elements.cornerSmoothing.value;
    }

    function updatePathOptimizationValue() {
        elements.pathOptimizationValue.textContent = elements.pathOptimization.value;
    }

    function updateFrameSpacingValue() {
        elements.frameSpacingValue.textContent = elements.frameSpacing.value;
    }

    function updateOutlineThicknessValue() {
        elements.outlineThicknessValue.textContent = elements.outlineThickness.value;
    }

    function toggleAdvancedOptions() {
        const method = document.querySelector('input[name="conversion-method"]:checked').value;
        if (method === 'advanced') {
            elements.advancedOptions.classList.remove('hidden');
        } else {
            elements.advancedOptions.classList.add('hidden');
        }
    }

    async function processGifFrames() {
        if (appState.gifFrames.length === 0) return;
        
        showProcessingOverlay('Processing frames...');
        
        try {
            // Get conversion options
            const options = {
                method: document.querySelector('input[name="conversion-method"]:checked').value,
                threshold: parseInt(elements.threshold.value),
                detailLevel: parseInt(elements.detailLevel.value),
                cornerSmoothing: parseInt(elements.cornerSmoothing.value),
                pathOptimization: parseInt(elements.pathOptimization.value)
            };
            
            // Process frames
            appState.processedFrames = await SvgConverter.convertFrames(
                appState.gifFrames, 
                options,
                (progress, message) => {
                    updateProcessingProgress(progress, message);
                }
            );
            
            // Move to step 3
            appState.currentStep = 3;
            elements.spinnerDesign.classList.remove('hidden');
            
            // Generate initial preview
            updateSpinnerPreview();
            
            hideProcessingOverlay();
        } catch (error) {
            console.error('Error processing frames:', error);
            hideProcessingOverlay();
            alert('Failed to process frames. Please try different settings or another GIF.');
        }
    }

    function updateSpinnerPreview() {
        if (appState.processedFrames.length === 0) return;
        
        try {
            // Get spinner options
            const options = getSpinnerOptions();
            
            // Generate preview
            const previewSvg = SpinnerGenerator.generatePreview(
                appState.processedFrames,
                options
            );
            
            // Update preview container
            elements.spinnerPreviewContainer.innerHTML = '';
            elements.spinnerPreviewContainer.appendChild(previewSvg);
        } catch (error) {
            console.error('Error updating preview:', error);
        }
    }

    async function generateSpinner() {
        if (appState.processedFrames.length === 0) return;
        
        showProcessingOverlay('Generating spinner...');
        
        try {
            // Get spinner options
            const options = getSpinnerOptions();
            
            // Generate full spinner SVG
            appState.spinnerSvg = await SpinnerGenerator.generateSpinner(
                appState.processedFrames,
                options,
                (progress, message) => {
                    updateProcessingProgress(progress, message);
                }
            );
            
            // Move to step 4
            appState.currentStep = 4;
            elements.outputOptions.classList.remove('hidden');
            
            // Update export preview
            updateExportPreview();
            
            hideProcessingOverlay();
        } catch (error) {
            console.error('Error generating spinner:', error);
            hideProcessingOverlay();
            alert('Failed to generate spinner. Please try different settings.');
        }
    }

    function getSpinnerOptions() {
        return {
            diameter: parseInt(elements.spinnerDiameter.value),
            frameCount: parseInt(elements.frameCount.value),
            spacing: parseInt(elements.frameSpacing.value),
            bearingDiameter: parseInt(elements.bearingDiameter.value),
            bearingType: elements.bearingType.value,
            outlineThickness: parseInt(elements.outlineThickness.value),
            outlineStyle: elements.outlineStyle.value
        };
    }

    function updateExportPreview() {
        if (!appState.spinnerSvg) return;
        
        // Clone the SVG for preview
        const previewSvg = appState.spinnerSvg.cloneNode(true);
        
        // Adjust size for preview container
        previewSvg.setAttribute('width', '100%');
        previewSvg.setAttribute('height', '100%');
        
        // Update preview container
        elements.exportPreviewContainer.innerHTML = '';
        elements.exportPreviewContainer.appendChild(previewSvg);
    }

    function toggleStlOptions() {
        if (elements.exportStl.checked) {
            elements.stlOptions.classList.remove('hidden');
        } else {
            elements.stlOptions.classList.add('hidden');
        }
    }

    async function exportFiles() {
        if (!appState.spinnerSvg) return;
        
        showProcessingOverlay('Preparing files for export...');
        
        try {
            const options = {
                exportSvg: elements.exportSvg.checked,
                exportPng: elements.exportPng.checked,
                exportStl: elements.exportStl.checked,
                modelThickness: parseInt(elements.modelThickness.value)
            };
            
            await Exporters.exportFiles(
                appState.spinnerSvg,
                options,
                (progress, message) => {
                    updateProcessingProgress(progress, message);
                }
            );
            
            hideProcessingOverlay();
            alert('Files exported successfully!');
        } catch (error) {
            console.error('Error exporting files:', error);
            hideProcessingOverlay();
            alert('Failed to export files. Please try again.');
        }
    }

    // UI State Management
    function updateUIState() {
        // Hide all sections beyond current step
        if (appState.currentStep < 2) {
            elements.conversionOptions.classList.add('hidden');
        }
        if (appState.currentStep < 3) {
            elements.spinnerDesign.classList.add('hidden');
        }
        if (appState.currentStep < 4) {
            elements.outputOptions.classList.add('hidden');
        }
    }

    // Processing Overlay Functions
    function showProcessingOverlay(message) {
        appState.processingStatus.inProgress = true;
        appState.processingStatus.progress = 0;
        appState.processingStatus.statusMessage = message;
        
        elements.processingStatus.textContent = message;
        elements.progressBar.style.width = '0%';
        elements.processingOverlay.classList.remove('hidden');
    }

    function hideProcessingOverlay() {
        appState.processingStatus.inProgress = false;
        elements.processingOverlay.classList.add('hidden');
    }

    function updateProcessingProgress(progress, message) {
        appState.processingStatus.progress = progress;
        if (message) {
            appState.processingStatus.statusMessage = message;
            elements.processingStatus.textContent = message;
        }
        elements.progressBar.style.width = `${progress}%`;
    }
});