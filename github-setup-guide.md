# GitHub Setup Guide

Follow these steps to push your project to GitHub and deploy it using GitHub Pages:

## 1. Initialize a Git Repository

First, initialize a Git repository in your project folder:

```bash
git init
```

## 2. Add and Commit Your Files

Add all your files to the repository and make an initial commit:

```bash
git add .
git commit -m "Initial commit - GIF Spinner Generator"
```

## 3. Create a GitHub Repository

1. Go to [GitHub](https://github.com/) and sign in to your account
2. Click the "+" icon in the top-right corner and select "New repository"
3. Enter "gif-spinner" as the repository name
4. Add a description (optional): "A web application that converts animated GIFs into fidget spinner designs"
5. Choose "Public" visibility
6. Do NOT initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## 4. Connect and Push to GitHub

After creating the repository, GitHub will show instructions. Use the commands for "push an existing repository from the command line":

```bash
git remote add origin https://github.com/amelling/gif-spinner.git
git branch -M main
git push -u origin main
```

## 5. Set Up GitHub Pages

1. Go to your repository on GitHub
2. Navigate to "Settings" > "Pages"
3. Under "Source", select "GitHub Actions"
4. GitHub will automatically detect the workflow file we created (.github/workflows/deploy.yml)
5. Wait for the first workflow run to complete (can take a few minutes)

## 6. Access Your Website

After the workflow runs successfully, your website will be available at:

```
https://amelling.github.io/gif-spinner/
```

## 7. Add Sample GIFs

For full functionality, you'll need to:

1. Add real animated GIFs to the `assets/samples` folder
2. Commit and push these files to GitHub:
   ```bash
   git add assets/samples
   git commit -m "Add sample GIFs"
   git push
   ```

Your GIF Spinner Generator will now be live on GitHub Pages!