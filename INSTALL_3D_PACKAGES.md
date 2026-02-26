# 3D Live Dry Run - Installation Guide

## Required Packages

Run this command to install the 3D visualization libraries:

```bash
npm install three @react-three/fiber @react-three/drei
```

Or with yarn:

```bash
yarn add three @react-three/fiber @react-three/drei
```

## Package Details

- **three**: Core 3D graphics library (WebGL wrapper)
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Helper components for react-three-fiber

## Verification

After installation, verify packages are in package.json:

```json
{
  "dependencies": {
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.92.0"
  }
}
```

## Next Steps

1. Install packages using command above
2. Import LiveTyping3DDryRun component in LeetCodeEditorRedesigned.jsx
3. Add toggle button to enable 3D visualization
4. Start coding and watch algorithms come to life in 3D!

## Troubleshooting

If you get peer dependency warnings, run:
```bash
npm install --legacy-peer-deps
```

Or update to latest React version (18+):
```bash
npm install react@latest react-dom@latest
```
