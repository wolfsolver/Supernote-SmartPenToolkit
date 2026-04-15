# Scribble Plugin

>[!CAUTION]
> This tool is technically designed to **erase the writing underneath your scribbles**. However, being an unstable Alpha, it occasionally suffers from an "**omnipotence complex**" and decides the entire page is a mistake.
> When running it, for now, you should be prepared: there's a non-zero chance the program will take offense and erase the entire page instead of just the stroke. This isn't a bug, it's an aggressive **artistic reboot**.
> **Proceed with caution (and don't get too attached to your current masterpiece).**

## Description

This plugin is used to remove scribbles from the note and in future many other sign like square and circle.

## ToDo
- [ ] refine scrible to delete
  - [x] apply delete to all strokes in the scribble area
- [ ] add scribble to square
- [ ] add scribble to circle
- [ ] add scribble to triangle
- [ ] add scribble to arrow
- [X] add setting page
  - [x] Setup margin for scribble area
  - [ ] improve switch
- [ ] add double underline to create Header
- [ ] add #__________ to create keywords
- [X] rename to SmartPenToolkit

## Preview

| About | Config |
| :---: | :---: | 
| <img src="/screenshot/Supernote-SmartPenToolkit-plugin-image.png" alt="Image" width="300"/> | <img src="/screenshot/Supernote-SmartPenToolkit-plugin-config.png" alt="config" width="300"/> | 

video

https://raw.githubusercontent.com/wolfsolver/Supernote-SmartPenToolkit/refs/heads/main/screenshot/Supernote-SmartPenToolkit.mp4

## Build

From the repo root:

* create local.properties file with the following content:

```text
sdk.dir=C\:\\Users\\<username>\\AppData\\Local\\Android\\Sdk
```

* run the following commands:

```bash
npm install
yarn install	
.\buildPlugin.ps1
```

* The packaged plugin is written to:

```text
build/outputs/*.snplg
```
