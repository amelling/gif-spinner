# Local Setup Guide

You can run and test the GIF Spinner Generator locally without deploying to GitHub Pages. Here's how:

## Option 1: Using Python's Built-in HTTP Server

If you have Python installed (most macOS and Linux systems do), you can use the built-in HTTP server:

### For Python 3.x:
```bash
cd /path/to/gif-spinner
python -m http.server
```

### For Python 2.x:
```bash
cd /path/to/gif-spinner
python -m SimpleHTTPServer
```

Once started, open your browser and go to:
```
http://localhost:8000
```

## Option 2: Using Node.js

If you have Node.js installed, you can use the `serve` package:

```bash
# Install serve globally (only needed once)
npm install -g serve

# Navigate to your project directory
cd /path/to/gif-spinner

# Start the server
serve
```

Once started, open your browser and go to the URL shown in your terminal (typically http://localhost:3000).

## Option 3: Using VS Code Live Server

If you're using Visual Studio Code:

1. Install the "Live Server" extension
2. Right-click on `index.html` in the file explorer
3. Select "Open with Live Server"

Your browser will automatically open with the project running.

## Testing Your Application Locally

1. Add some sample GIFs to the `assets/samples` directory as mentioned in the sample-gifs-guide.md
2. Use your local server to view and test the application
3. The UI should load and allow you to:
   - View sample GIFs (if you've added them)
   - Upload your own GIFs
   - Configure conversion settings
   - Design and export spinners

## Troubleshooting Local Setup

If you encounter issues running locally:

1. **Check Console for Errors**: Open your browser's developer tools (F12 or right-click → Inspect) and check the Console tab for any JavaScript errors
2. **CORS Issues**: Some browsers restrict loading local files - this is why using a server is recommended
3. **File Paths**: Make sure all file paths in the HTML and JS files are correct
4. **Missing Libraries**: Ensure all the external libraries referenced in index.html are loading correctly