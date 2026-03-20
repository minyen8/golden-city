#!/bin/bash
cd "C:/TempClaude/golden-city/project-modified"
npm install --legacy-peer-deps 2>&1
npx vite --host --port 5174
