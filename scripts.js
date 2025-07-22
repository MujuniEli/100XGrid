const GRID_SIZE = 200;
const CELL_SIZE = 100;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 2;

let zoom = 1;
let scroll = { left: 0, top: 0 };
let viewport = { width: window.innerWidth, height: window.innerHeight };
const initialCellCache = {};
const gridContainer = document.getElementById('grid-container');
const zoomIndicator = document.getElementById('zoom-indicator');

function getCellSize() {
  return CELL_SIZE * zoom;
}

function getVisibleCells() {
  const cellSize = getCellSize();
  const left = gridContainer.scrollLeft;
  const top = gridContainer.scrollTop;
  const width = viewport.width;
  const height = viewport.height;
  const startCol = Math.max(0, Math.floor(left / cellSize));
  const endCol = Math.min(GRID_SIZE, Math.ceil((left + width) / cellSize));
  const startRow = Math.max(0, Math.floor(top / cellSize));
  const endRow = Math.min(GRID_SIZE, Math.ceil((top + height) / cellSize));
  return { startCol, endCol, startRow, endRow };
}

function cacheInitialCells() {
  const { startCol, endCol, startRow, endRow } = getVisibleCells();
  for (let row = startRow; row < endRow; row++) {
    for (let col = startCol; col < endCol; col++) {
      initialCellCache[`${row},${col}`] = true;
    }
  }
}

function renderGrid() {
  const cellSize = getCellSize();
  const { startCol, endCol, startRow, endRow } = getVisibleCells();
  let gridInner = document.querySelector('.grid-inner');
  if (!gridInner) {
    gridInner = document.createElement('div');
    gridInner.className = 'grid-inner';
    gridContainer.appendChild(gridInner);
  }
  gridInner.style.width = `${GRID_SIZE * cellSize}px`;
  gridInner.style.height = `${GRID_SIZE * cellSize}px`;
  gridInner.innerHTML = '';
  for (let row = startRow; row < endRow; row++) {
    for (let col = startCol; col < endCol; col++) {
      const cellId = `${row},${col}`;
      const isInitial = initialCellCache[cellId] === true;
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.style.left = `${col * cellSize}px`;
      cell.style.top = `${row * cellSize}px`;
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;
      cell.style.backgroundColor = isInitial ? '#DAF7A6' : '#33c4ff';
      cell.textContent = `${row},${col}`;
      gridInner.appendChild(cell);
    }
  }
}

function updateZoomIndicator() {
  zoomIndicator.textContent = `Zoom: ${zoom.toFixed(2)}x`;
}

function handleScroll() {
  scroll.left = gridContainer.scrollLeft;
  scroll.top = gridContainer.scrollTop;
  renderGrid();
}

function handleWheel(e) {
  if (e.ctrlKey) {
    e.preventDefault();
    let newZoom = zoom - e.deltaY * 0.001;
    newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    if (newZoom !== zoom) {
      zoom = newZoom;
      cacheInitialCells();
      renderGrid();
      updateZoomIndicator();
    }
  }
}

function handleResize() {
  viewport.width = window.innerWidth;
  viewport.height = window.innerHeight;
  cacheInitialCells();
  renderGrid();
}

gridContainer.addEventListener('scroll', handleScroll);
gridContainer.addEventListener('wheel', handleWheel);
window.addEventListener('resize', handleResize);

gridContainer.style.width = '100vw';
gridContainer.style.height = '100vh';
cacheInitialCells();
renderGrid();
updateZoomIndicator();
