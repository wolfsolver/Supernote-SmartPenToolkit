import { AppRegistry, Image } from 'react-native';
import { PluginManager, PluginFileAPI, PluginCommAPI } from 'sn-plugin-lib';
import App from './App';
import { name as appName } from './app.json';
import { loadSettings } from './components/Storage.ts';
import { log } from './components/ConsoleLog.ts';

AppRegistry.registerComponent(appName, () => App);
PluginManager.init();

PluginManager.registerButton(1, ['NOTE'], {
  id: 100,
  name: 'SmartPenToolkit',
  icon: Image.resolveAssetSource(require('./assets/smartpentoolkit.jpg')).uri,
  showType: 1,
});

//PluginManager.registerButton(1, ['NOTE'], {
//  id: 101,
//  name: 'SmartPenToolkit Test',
//  icon: Image.resolveAssetSource(require('./assets/smartpentoolkit.jpg')).uri,
//  showType: 1,
//});

PluginManager.registerConfigButton();

const MARGIN = 100;

import { DEFAULT_SETTINGS } from './config/defaultSettings.ts';

let lastProcessedUuid = null;
let timestamp = null;

PluginManager.registerEventListener('event_pen_up', 1, {
  async onMsg(msg) {
    timestamp = performance.now();
    log("index-" + timestamp, "Pen is up");
    const elements = msg;
    if (!elements || elements.length === 0) {
      //      log("index-" + timestamp, "no data");
      return;
    }
    const new_uuid = elements[0].uuid;
    if (new_uuid === lastProcessedUuid) {
      //      log("index-" + timestamp, "Double event on " + new_uuid);
      return;
    }
    log("index-" + timestamp, "Process event on " + new_uuid);
    lastProcessedUuid = new_uuid;

    //   log("index-" + timestamp, "pen up event received");
    // Load settings to check which features are enabled
    const savedSettings = await loadSettings();
    const settings = savedSettings ? { ...DEFAULT_SETTINGS, ...savedSettings } : DEFAULT_SETTINGS;
    if (!settings.scribbleWhenPenUp) {
      // log("index-" + timestamp, "scribbleWhenPenUp is false");
      return;
    }
    log("index-" + timestamp, "scribbleWhenPenUp is true");

    const itemToDelete = [];

    for (const el of elements) {
      log("index-" + timestamp, "el.numInPage: " + el.numInPage);
      if (el.type === 0 && el.stroke) {
        log("index-" + timestamp, "  is stroke");
        if (settings.scribbleToDelete) {
          log("index-" + timestamp, '  Feature enabled. Analyzing to see if is a scribble...');

          const isScribble = await analyzeScribble(el.stroke);

          if (isScribble) {
            log("index-" + timestamp, "  Scribble confirmed numInPage: " + el.numInPage);

            const pathRes = await PluginCommAPI.getCurrentFilePath();
            // Fix for pathRes possible null/undefined
            if (pathRes && pathRes.success && pathRes.result) {
              const pageRes = await PluginFileAPI.getElements(el.pageNum, pathRes.result);
              if (pageRes && pageRes.success && pageRes.result) {
                log("index-" + timestamp, `Found ${pageRes.result.length} elements on page ${el.pageNum}`);
                const scribbleArea = await getElementBounds(el);
                //                log("index/delete", `Scribble area: ${JSON.stringify(scribbleArea)}`);
                let removedCount = 0;
                for (let indexToAnalize = 0; indexToAnalize < pageRes.result.length; indexToAnalize++) {
                  const target = pageRes.result[indexToAnalize];
                  log("index-" + timestamp, `  Analysing item ${indexToAnalize} with numInPage ${target.numInPage}`)
                  if (target.uuid === el.uuid || target.numInPage === el.numInPage) {
                    // tis is the scribble itself, we will delete 
                    log("index-" + timestamp, `  Item is the scribble itself`);
                    log("index-" + timestamp, `    target.uuid ${target.uuid}`);
                    log("index-" + timestamp, `    el.uuid     ${el.uuid}`);
                    log("index-" + timestamp, `    target.numInPage ${target.numInPage}`);
                    log("index-" + timestamp, `    el.numInPage     ${el.numInPage}`);
                    itemToDelete.push(target.numInPage);
                  } else {
                    const targetArea = await getElementBounds(target);
                    log("index-" + timestamp, `  Item ${indexToAnalize} area: ${JSON.stringify(targetArea)}`);
                    if (checkOverlap(scribbleArea, targetArea)) {
                      log("index-" + timestamp, `  Item ${indexToAnalize} overlaps with the scribble`);
                      itemToDelete.push(target.numInPage);
                      removedCount++;
                    }
                  }
                }
                // Remove all elements that overlap with the scribble including the scribble itself
                log("index-" + timestamp, `Removing ${JSON.stringify(itemToDelete)} elements.`);
                const res = await PluginFileAPI.deleteElements(pathRes.result, el.pageNum, itemToDelete);
                log("index-" + timestamp, `res: ${JSON.stringify(res)}`);
                if (res?.success) {
                  log("index-" + timestamp, `Removed ${itemToDelete.length} elements.`);
                } else {
                  log("index-" + timestamp, `Failed to remove elements`);
                }
              }
            } else {
              log("index-" + timestamp, `Failed to get current file path or path is empty`);
            }
          }
        }
        if (settings.scribbleToSquare) {
          log("index/square", 'Feature enabled. (NOT YET IMPLEMENTED)');
        }
        if (settings.scribbleToCircle) {
          log("index/circle", 'Feature enabled. (NOT YET IMPLEMENTED)');
        }
        if (settings.scribbleToTriangle) {
          log("index/triangle", 'Feature enabled. (NOT YET IMPLEMENTED)');
        }
        if (settings.scribbleToEllipse) {
          log("index/ellipse", 'Feature enabled. (NOT YET IMPLEMENTED)');
        }
        if (settings.scribbleToArrow) {
          log("index/arrow", 'Feature enabled. (NOT YET IMPLEMENTED)');
        }
      }
    }
    log("index-" + timestamp, `Pen up. End of analysis ${new_uuid}`);
  },
});

async function analyzeScribble(stroke) {
  const pointsAccessor = stroke.points;
  const size = await pointsAccessor.size();

  if (size < 30) return false;

  const points = await pointsAccessor.getRange(0, size);

  let xInversions = 0;
  let yInversions = 0;
  let totalDistance = 0;

  let minX = points[0].x, maxX = points[0].x;
  let minY = points[0].y, maxY = points[0].y;

  for (let i = 1; i < points.length; i++) {
    const curr = points[i];

    if (curr.x < minX) minX = curr.x;
    if (curr.x > maxX) maxX = curr.x;
    if (curr.y < minY) minY = curr.y;
    if (curr.y > maxY) maxY = curr.y;

    const prev = points[i - 1];
    totalDistance += Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));

    if (i >= 2) {
      const prev = points[i - 1];
      const pPrev = points[i - 2];
      if (Math.sign(curr.x - prev.x) !== Math.sign(prev.x - pPrev.x) && Math.abs(curr.x - prev.x) > 2) {
        xInversions++;
      }
      if (Math.sign(curr.y - prev.y) !== Math.sign(prev.y - pPrev.y) && Math.abs(curr.y - prev.y) > 2) {
        yInversions++;
      }
    }
  }

  const width = maxX - minX;
  const height = maxY - minY;
  const areaDiagonal = Math.sqrt(width * width + height * height);

  const isDense = totalDistance > areaDiagonal * 3;
  const hasEnoughJiggles = (xInversions + yInversions) > 10;

  const isScribble = isDense && hasEnoughJiggles
  log("index-" + timestamp, `    isScribble=${isScribble}`);
  log("index-" + timestamp, `    isScribble: isDense=${isDense}`);
  log("index-" + timestamp, `      isScribble: totalDistance=${totalDistance}`);
  log("index-" + timestamp, `      isScribble: areaDiagonal=${areaDiagonal}`);
  log("index-" + timestamp, `    isScribble: hasEnoughJiggles=${hasEnoughJiggles}`);
  log("index-" + timestamp, `      isScribble: xInversions=${xInversions}`);
  log("index-" + timestamp, `      isScribble: yInversions=${yInversions}`);
  return isScribble;
}

async function getElementBounds(el) {
  const size = await el.stroke.points.size();
  const points = await el.stroke.points.getRange(0, size);

  let minX = points[0].x, minY = points[0].y;
  let maxX = points[0].x, maxY = points[0].y;
  points.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  });

  return { minX, minY, maxX, maxY };
}

function checkOverlap(scribble, target) {
  return (
    target.minX >= (scribble.minX - MARGIN) &&
    target.maxX <= (scribble.maxX + MARGIN) &&
    target.minY >= (scribble.minY - MARGIN) &&
    target.maxY <= (scribble.maxY + MARGIN)
  );
}

async function insertGeometryFromArea(area) {
  const geometry = {
    penColor: 0x9D,
    penType: 10,
    penWidth: 500,
    type: 'GEO_polygon',
    points: [
      { x: area.minX, y: area.minY },
      { x: area.maxX, y: area.minY },
      { x: area.maxX, y: area.maxY },
      { x: area.minX, y: area.maxY },
      { x: area.minX, y: area.minY }
    ],
    ellipseCenterPoint: null,
    ellipseMajorAxisRadius: 0,
    ellipseMinorAxisRadius: 0,
    ellipseAngle: 0,
  };

  const res = await PluginCommAPI.insertGeometry(geometry);
  if (!res.success) {
    throw new Error(res.error?.message ?? 'insertGeometry call failed');
  }
  return res.result;
}

