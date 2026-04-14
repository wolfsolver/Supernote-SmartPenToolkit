# Scribble Plugin

## Description

This plugin is used to remove scribbles from the note and in future many other sign like square and circle.

## ToDo
- [ ] refine scrible to delete
  - [ ] apply delete to all strokes in the scribble area
- [ ] add scribble to square
- [ ] add scribble to circle
- [ ] add scribble to triangle
- [ ] add scribble to arrow
- [X] add setting page
  - [ ] Setup margin for scribble area
  - [ ] improve switch
- [ ] add double underline to create Header
- [ ] add #__________ to create keywords
- [X] rename to SmartPenToolkit



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
