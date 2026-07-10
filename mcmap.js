/* Interactive Minecraft world map, rendered natively in the browser from a
   cubiomes WASM build (see cubiomes.js / CUBIOMES-LICENSE.txt). Original glue. */
"use strict";
(function(){
const BIOMES = {"0":["ocean",0,0,112],"1":["plains",141,179,96],"2":["desert",250,148,24],"3":["windswept_hills",96,96,96],"4":["forest",5,102,33],"5":["taiga",11,106,95],"6":["swamp",7,249,178],"7":["river",0,0,255],"8":["nether_wastes",87,37,38],"9":["the_end",128,128,255],"10":["frozen_ocean",112,112,214],"11":["frozen_river",160,160,255],"12":["snowy_plains",255,255,255],"13":["snowy_mountains",160,160,160],"14":["mushroom_fields",255,0,255],"15":["mushroom_field_shore",160,0,255],"16":["beach",250,222,85],"17":["desert_hills",210,95,18],"18":["wooded_hills",34,85,28],"19":["taiga_hills",22,57,51],"20":["mountain_edge",114,120,154],"21":["jungle",80,123,10],"22":["jungle_hills",44,66,5],"23":["sparse_jungle",96,147,15],"24":["deep_ocean",0,0,48],"25":["stony_shore",162,162,132],"26":["snowy_beach",250,240,192],"27":["birch_forest",48,116,68],"28":["birch_forest_hills",31,95,50],"29":["dark_forest",64,81,26],"30":["snowy_taiga",49,85,74],"31":["snowy_taiga_hills",36,63,54],"32":["old_growth_pine_taiga",89,102,81],"33":["giant_tree_taiga_hills",69,79,62],"34":["windswept_forest",91,115,82],"35":["savanna",189,178,95],"36":["savanna_plateau",167,157,100],"37":["badlands",217,69,21],"38":["wooded_badlands",176,151,101],"39":["badlands_plateau",202,140,101],"40":["small_end_islands",75,75,171],"41":["end_midlands",201,201,89],"42":["end_highlands",181,181,54],"43":["end_barrens",112,112,204],"44":["warm_ocean",0,0,172],"45":["lukewarm_ocean",0,0,144],"46":["cold_ocean",32,32,112],"47":["deep_warm_ocean",0,0,80],"48":["deep_lukewarm_ocean",0,0,64],"49":["deep_cold_ocean",32,32,56],"50":["deep_frozen_ocean",64,64,144],"51":["seasonal_forest",47,86,15],"52":["rainforest",71,132,14],"53":["shrubland",120,158,49],"127":["the_void",0,0,0],"129":["sunflower_plains",181,219,136],"130":["desert_lakes",255,188,64],"131":["windswept_gravelly_hills",136,136,136],"132":["flower_forest",45,142,73],"133":["taiga_mountains",51,146,135],"134":["swamp_hills",47,255,218],"140":["ice_spikes",180,220,220],"149":["modified_jungle",120,163,50],"151":["modified_jungle_edge",136,187,55],"155":["old_growth_birch_forest",88,156,108],"156":["tall_birch_hills",71,135,90],"157":["dark_forest_hills",104,121,66],"158":["snowy_taiga_mountains",89,125,114],"160":["old_growth_spruce_taiga",129,142,121],"161":["giant_spruce_taiga_hills",109,119,102],"162":["modified_gravelly_mountains",131,155,122],"163":["windswept_savanna",229,218,135],"164":["shattered_savanna_plateau",207,197,140],"165":["eroded_badlands",255,109,61],"166":["modified_wooded_badlands_plateau",216,191,141],"167":["modified_badlands_plateau",242,180,141],"168":["bamboo_jungle",132,149,0],"169":["bamboo_jungle_hills",92,108,4],"170":["soul_sand_valley",77,58,46],"171":["crimson_forest",152,26,17],"172":["warped_forest",73,144,123],"173":["basalt_deltas",100,95,99],"174":["dripstone_caves",78,48,18],"175":["lush_caves",40,60,0],"177":["meadow",96,164,69],"178":["grove",71,114,108],"179":["snowy_slopes",196,196,196],"180":["jagged_peaks",220,220,200],"181":["frozen_peaks",176,179,206],"182":["stony_peaks",123,143,116],"183":["deep_dark",3,31,41],"184":["mangrove_swamp",44,204,142],"185":["cherry_grove",255,145,200],"186":["pale_garden",105,109,149]};

// overworld structure types the map can plot: [label, cubiomes enum id, marker color, keywords]
const STRUCTS = [
  {key:"village",     label:"Village",         id:5,  col:"#ffd45e", kw:"village villager trade"},
  {key:"outpost",     label:"Pillager Outpost",id:10, col:"#c07a3a", kw:"pillager outpost raid"},
  {key:"monument",    label:"Ocean Monument",  id:8,  col:"#57e0d0", kw:"monument guardian prismarine ocean"},
  {key:"mansion",     label:"Woodland Mansion",id:9,  col:"#b06a3a", kw:"mansion woodland totem"},
  {key:"ancient",     label:"Ancient City",    id:13, col:"#39c3d6", kw:"ancient city warden deep dark sculk"},
  {key:"trial",       label:"Trial Chamber",   id:24, col:"#7bd66a", kw:"trial chamber vault key mace"},
  {key:"desert",      label:"Desert Pyramid",  id:1,  col:"#e6cf7a", kw:"desert temple pyramid"},
  {key:"jungle",      label:"Jungle Temple",   id:2,  col:"#6a9a3a", kw:"jungle temple pyramid"},
  {key:"hut",         label:"Swamp Hut",       id:3,  col:"#7a4fa0", kw:"witch hut swamp"},
  {key:"igloo",       label:"Igloo",           id:4,  col:"#d8ecff", kw:"igloo snow"},
  {key:"portal",      label:"Ruined Portal",   id:11, col:"#a24bff", kw:"ruined portal gold"},
  {key:"trail",       label:"Trail Ruins",     id:23, col:"#c9a06a", kw:"trail ruins archaeology"},
  {key:"oceanruin",   label:"Ocean Ruins",     id:6,  col:"#6ab0c0", kw:"ocean ruins"},
  {key:"shipwreck",   label:"Shipwreck",       id:7,  col:"#caa06a", kw:"shipwreck treasure map"},
  {key:"treasure",    label:"Buried Treasure", id:14, col:"#ffcf3a", kw:"buried treasure heart of the sea"},
  {key:"mineshaft",   label:"Mineshaft",       id:15, col:"#9a9a9a", kw:"mineshaft rail"}
];
const DEFAULT_ON = new Set(["village","outpost","monument","mansion","stronghold","spawn"]);

const ZOOM = [
  {scale:4,   cp:6}, {scale:4,   cp:4}, {scale:4,  cp:2}, {scale:4,  cp:1},
  {scale:16,  cp:2}, {scale:16,  cp:1}, {scale:64, cp:1}, {scale:256, cp:1}
];
const MARKER_ZI_MAX = 6; // show structure markers at this zoom index or lower (i.e. <= 64 blk/px)

function biomeName(id){ const b = BIOMES[id]; return b ? b[0].replace(/_/g," ").replace(/\b\w/g, c=>c.toUpperCase()) : ("Biome "+id); }

window.initMcMap = function(opts){
  const M = opts.module, canvas = opts.canvas;
  const ctx = canvas.getContext("2d");
  const off = document.createElement("canvas");
  const octx = off.getContext("2d");

  const c_setup = M.cwrap("mc_setup", null, ["number","number"]);
  const c_apply = M.cwrap("mc_apply", null, ["number","string"]);
  const c_biome = M.cwrap("mc_biome_at","number",["number","number","number","number"]);
  const c_gen   = M.cwrap("mc_gen_map","number",["number","number","number","number","number","number","number"]);
  const c_find  = M.cwrap("mc_find_structures","number",["number","number","number","number","number","number","number"]);
  const c_sh    = M.cwrap("mc_strongholds","number",["number","number"]);
  const c_spawn = M.cwrap("mc_spawn", null, ["number"]);

  let rgbPtr = 0, rgbCap = 0, intPtr = 0, intCap = 0;
  function ensureRgb(bytes){ if(bytes>rgbCap){ if(rgbPtr)M._free(rgbPtr); rgbPtr=M._malloc(bytes); rgbCap=bytes; } }
  function ensureInt(count){ const b=count*4; if(b>intCap){ if(intPtr)M._free(intPtr); intPtr=M._malloc(b); intCap=b; } }

  const state = {
    mc:28, dim:0, seed:"0", ready:false,
    cx:0, cz:0, zi:5,          // center block + zoom index
    enabled:new Set(DEFAULT_ON),
    spawn:null, strongholds:[], you:null, highlight:null,
    markers:[]                  // {x,z,type,label,col} in current view (for hover)
  };

  const bpp = () => ZOOM[state.zi].scale / ZOOM[state.zi].cp;
  const sx = bx => canvas.width/2 + (bx - state.cx)/bpp();
  const sy = bz => canvas.height/2 + (bz - state.cz)/bpp();
  const bx = px => Math.round(state.cx + (px - canvas.width/2)*bpp());
  const bz = py => Math.round(state.cz + (py - canvas.height/2)*bpp());

  function fitCanvas(){
    const r = canvas.getBoundingClientRect();
    const w = Math.max(200, Math.floor(r.width)), h = Math.max(200, Math.floor(r.height));
    if (canvas.width !== w || canvas.height !== h){ canvas.width = w; canvas.height = h; }
    ensureRgb(w*h*3);
  }

  function findStructs(id, x0,z0,x1,z1, max){
    ensureInt(max*2);
    const n = c_find(id, x0,z0,x1,z1, intPtr, max);
    const out = []; const H = M.HEAP32, base = intPtr>>2;
    for (let i=0;i<n;i++) out.push([H[base+i*2], H[base+i*2+1]]);
    return out;
  }

  function computeSeedFeatures(){
    // spawn
    ensureInt(2); c_spawn(intPtr);
    state.spawn = [M.HEAP32[intPtr>>2], M.HEAP32[(intPtr>>2)+1]];
    // strongholds (first ~16)
    ensureInt(32);
    const n = c_sh(intPtr, 16); const H=M.HEAP32, base=intPtr>>2; const sh=[];
    for (let i=0;i<n;i++) sh.push([H[base+i*2], H[base+i*2+1]]);
    state.strongholds = sh;
  }

  function apply(mc, seed, dim){
    state.mc = mc; state.seed = seed; state.dim = dim||0;
    c_setup(mc, 0);
    c_apply(state.dim, String(seed));
    computeSeedFeatures();
    state.ready = true;
    // center on spawn on fresh load
    state.cx = state.spawn[0]; state.cz = state.spawn[1];
    render();
  }

  function drawMarker(px,py, col, shape){
    ctx.save();
    ctx.translate(px,py);
    ctx.lineWidth = 1.5; ctx.strokeStyle = "rgba(0,0,0,.85)";
    ctx.fillStyle = col;
    if (shape === "spawn"){
      ctx.beginPath(); ctx.arc(0,0,5,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(0,0,2,0,Math.PI*2); ctx.fillStyle="rgba(0,0,0,.8)"; ctx.fill();
    } else if (shape === "stronghold"){
      ctx.beginPath(); ctx.arc(0,0,5.5,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle="#101018"; ctx.beginPath(); ctx.ellipse(0,0,3,2,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#c9f"; ctx.beginPath(); ctx.arc(0,0,1.1,0,Math.PI*2); ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(0,-5); ctx.lineTo(5,0); ctx.lineTo(0,5); ctx.lineTo(-5,0); ctx.closePath();
      ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }

  function render(){
    if (!state.ready) return;
    fitCanvas();
    const W = canvas.width, H = canvas.height, z = ZOOM[state.zi], scale=z.scale, cp=z.cp;
    // biome raster
    const blockLeft = state.cx - (W/2)*bpp(), blockTop = state.cz - (H/2)*bpp();
    const cellLeft = Math.floor(blockLeft/scale), cellTop = Math.floor(blockTop/scale);
    const cellRight = Math.floor((state.cx + (W/2)*bpp())/scale);
    const cellBot   = Math.floor((state.cz + (H/2)*bpp())/scale);
    const cw = (cellRight-cellLeft)+2, ch = (cellBot-cellTop)+2;
    ensureRgb(cw*ch*3);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#05070c"; ctx.fillRect(0,0,W,H);
    if (c_gen(scale, cellLeft, cellTop, cw, ch, 15, rgbPtr)){
      const img = octx.createImageData(cw, ch);
      const src = M.HEAPU8, base = rgbPtr;
      const d = img.data;
      for (let i=0, j=0; i<cw*ch; i++){
        d[j++] = src[base+i*3]; d[j++] = src[base+i*3+1]; d[j++] = src[base+i*3+2]; d[j++] = 255;
      }
      off.width = cw; off.height = ch; octx.putImageData(img, 0, 0);
      const destX = W/2 + (cellLeft*scale - state.cx)/bpp();
      const destY = H/2 + (cellTop*scale - state.cz)/bpp();
      ctx.drawImage(off, 0,0,cw,ch, destX, destY, cw*cp, ch*cp);
    }
    // markers
    state.markers = [];
    const pad = 64;
    const x0 = bx(0)-pad, z0 = bz(0)-pad, x1 = bx(W)+pad, z1 = bz(H)+pad;
    if (state.zi <= MARKER_ZI_MAX){
      for (const s of STRUCTS){
        if (!state.enabled.has(s.key)) continue;
        const list = findStructs(s.id, x0,z0,x1,z1, 600);
        for (const [x,z] of list){
          const px=sx(x), py=sy(z);
          drawMarker(px,py, s.col, "diamond");
          state.markers.push({x,z,px,py,label:s.label,col:s.col});
        }
      }
    }
    if (state.enabled.has("stronghold")){
      for (const [x,z] of state.strongholds){
        const px=sx(x), py=sy(z);
        if (px<-20||px>W+20||py<-20||py>H+20) continue;
        drawMarker(px,py, "#c98bff", "stronghold");
        state.markers.push({x,z,px,py,label:"Stronghold",col:"#c98bff"});
      }
    }
    if (state.enabled.has("spawn") && state.spawn){
      const px=sx(state.spawn[0]), py=sy(state.spawn[1]);
      drawMarker(px,py, "#7dff5a", "spawn");
      state.markers.push({x:state.spawn[0],z:state.spawn[1],px,py,label:"World Spawn",col:"#7dff5a"});
    }
    if (state.you){
      const px=sx(state.you[0]), py=sy(state.you[1]);
      ctx.save(); ctx.strokeStyle="#fff"; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(px,py,7,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px-10,py); ctx.lineTo(px+10,py); ctx.moveTo(px,py-10); ctx.lineTo(px,py+10); ctx.stroke();
      ctx.restore();
    }
    if (state.highlight){
      const px=sx(state.highlight[0]), py=sy(state.highlight[1]);
      ctx.save(); ctx.strokeStyle="#fff"; ctx.lineWidth=2.5;
      const t = (performance.now?performance.now():0);
      ctx.beginPath(); ctx.arc(px,py,11,0,Math.PI*2); ctx.stroke();
      ctx.restore();
    }
    if (opts.onRender) opts.onRender(state);
  }

  // ---- nearest search ----
  function nearestStructure(id, fromX, fromZ){
    const rings = [512,1024,2048,4096,8192,16384,32768,65536];
    for (const r of rings){
      const list = findStructs(id, fromX-r, fromZ-r, fromX+r, fromZ+r, 4000);
      if (list.length){
        let best=null, bd=Infinity;
        for (const [x,z] of list){ const d=(x-fromX)**2+(z-fromZ)**2; if(d<bd){bd=d;best=[x,z];} }
        return best;
      }
    }
    return null;
  }
  function nearestStronghold(fromX, fromZ){
    let best=null,bd=Infinity;
    for (const [x,z] of state.strongholds){ const d=(x-fromX)**2+(z-fromZ)**2; if(d<bd){bd=d;best=[x,z];} }
    return best;
  }
  function nearestBiome(targetId, fromX, fromZ){
    // coarse outward spiral sample at 1:64
    const step=64; let x=0,z=0,dx=0,dz=-1;
    const maxR=20000, maxSteps=Math.ceil((2*maxR/step)**1.2)+4000;
    for (let i=0;i<maxSteps;i++){
      const wx=fromX+x*step, wz=fromZ+z*step;
      if (Math.abs(x*step)<=maxR && Math.abs(z*step)<=maxR){
        if (c_biome(4, wx, 15, wz) === targetId) return [wx, wz];
      }
      if (x===z || (x<0&&x===-z) || (x>0&&x===1-z)){ const t=dx; dx=-dz; dz=t; }
      x+=dx; z+=dz;
    }
    return null;
  }

  // ---- interaction ----
  let dragging=false, lastX=0, lastY=0, moved=false, raf=0;
  function schedule(){ if(!raf) raf=requestAnimationFrame(()=>{ raf=0; render(); }); }
  canvas.addEventListener("pointerdown", e=>{ dragging=true; moved=false; lastX=e.clientX; lastY=e.clientY; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener("pointermove", e=>{
    const r = canvas.getBoundingClientRect();
    if (dragging){
      const dx=e.clientX-lastX, dy=e.clientY-lastY;
      if (Math.abs(dx)+Math.abs(dy)>2) moved=true;
      state.cx -= dx*bpp(); state.cz -= dy*bpp();
      lastX=e.clientX; lastY=e.clientY; schedule();
    } else {
      const mx=e.clientX-r.left, my=e.clientY-r.top;
      const wx=bx(mx), wz=bz(my);
      let hit=null;
      for (const m of state.markers){ if ((m.px-mx)**2+(m.py-my)**2 < 64){ hit=m; break; } }
      if (opts.onHover) opts.onHover({ x:wx, z:wz, biome:biomeName(c_biome(1, wx, 63, wz)), marker:hit });
      canvas.style.cursor = hit ? "pointer" : "grab";
    }
  });
  canvas.addEventListener("pointerup", e=>{ dragging=false; try{canvas.releasePointerCapture(e.pointerId);}catch(_){} });
  canvas.addEventListener("pointerleave", ()=>{ if(opts.onHover) opts.onHover(null); });
  canvas.addEventListener("wheel", e=>{
    e.preventDefault();
    const r=canvas.getBoundingClientRect(); const mx=e.clientX-r.left, my=e.clientY-r.top;
    const wxBefore=state.cx+(mx-canvas.width/2)*bpp(), wzBefore=state.cz+(my-canvas.height/2)*bpp();
    const dir = e.deltaY>0 ? 1 : -1;
    const nzi = Math.max(0, Math.min(ZOOM.length-1, state.zi+dir));
    if (nzi===state.zi) return;
    state.zi = nzi;
    // keep cursor world point stable
    state.cx = wxBefore - (mx-canvas.width/2)*bpp();
    state.cz = wzBefore - (my-canvas.height/2)*bpp();
    schedule();
  }, {passive:false});

  window.addEventListener("resize", schedule);

  return {
    apply,
    render, schedule,
    state,
    setEnabled(key, on){ if(on) state.enabled.add(key); else state.enabled.delete(key); render(); },
    isEnabled(key){ return state.enabled.has(key); },
    zoomIn(){ state.zi=Math.max(0,state.zi-1); render(); },
    zoomOut(){ state.zi=Math.min(ZOOM.length-1,state.zi+1); render(); },
    centerOn(x,z,zi){ state.cx=x; state.cz=z; if(zi!=null)state.zi=zi; render(); },
    setYou(x,z){ state.you=(x==null?null:[x,z]); render(); },
    biomeAt(x,z){ return biomeName(c_biome(1,x,63,z)); },
    STRUCTS, biomeName,
    locate(query, fromX, fromZ){
      const q = (query||"").toLowerCase().trim();
      if (/stronghold/.test(q)){ const p=nearestStronghold(fromX,fromZ); return p&&{pos:p,label:"Stronghold"}; }
      if (/spawn/.test(q)){ return state.spawn&&{pos:state.spawn,label:"World Spawn"}; }
      // structure match
      let s = STRUCTS.find(s=> s.label.toLowerCase()===q || s.key===q);
      if (!s) s = STRUCTS.find(s=> (s.label+" "+s.kw).toLowerCase().includes(q));
      if (s){ const p=nearestStructure(s.id, fromX, fromZ); if(p){ if(!state.enabled.has(s.key)){state.enabled.add(s.key);} return {pos:p,label:s.label}; } return {pos:null,label:s.label}; }
      // biome match
      const bmatch = Object.entries(BIOMES).find(([id,v]) => v[0].replace(/_/g," ").includes(q) || v[0].includes(q.replace(/ /g,"_")));
      if (bmatch){ const p=nearestBiome(+bmatch[0], fromX, fromZ); return {pos:p,label:biomeName(+bmatch[0]),biome:true}; }
      return null;
    },
    highlightAt(x,z){ state.highlight=(x==null?null:[x,z]); render(); }
  };
};
})();
