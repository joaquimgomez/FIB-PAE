# Requirement: OpenCV4 must be installed on the system

# Preventing the auto build script
export OPENCV4NODEJS_DISABLE_AUTOBUILD=1

# opencv4nodejs library
npm install --save opencv4nodejs@^5.2.0

# electron & electron-rebuild
npm install electron --save-dev
npm install --save-dev electron-rebuild

# At this point the package.json should has the script:
# "electron-rebuild": "electron-rebuild -w opencv4nodejs"
npm run electron-rebuild

# Vision API of Google Cloud Platform
npm install @google-cloud/vision