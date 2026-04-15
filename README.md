# Scribble Plugin

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

video 1
https://github.com/wolfsolver/Supernote-SmartPenToolkit/raw/refs/heads/main/screenshot/Supernote-SmartPenToolkit.mp4

video 1
<video width="320" controls>
  <source src="https://github.com/wolfsolver/Supernote-SmartPenToolkit/raw/refs/heads/main/screenshot/Supernote-SmartPenToolkit.mp4" type="video/mp4">
</video>

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
