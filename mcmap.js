/* Interactive Minecraft world map, rendered natively in the browser from a
   cubiomes WASM build (see cubiomes.js / CUBIOMES-LICENSE.txt). Original glue. */
"use strict";
(function(){
const BIOMES = {"0":["ocean",0,0,112],"1":["plains",141,179,96],"2":["desert",250,148,24],"3":["windswept_hills",96,96,96],"4":["forest",5,102,33],"5":["taiga",11,106,95],"6":["swamp",7,249,178],"7":["river",0,0,255],"8":["nether_wastes",87,37,38],"9":["the_end",128,128,255],"10":["frozen_ocean",112,112,214],"11":["frozen_river",160,160,255],"12":["snowy_plains",255,255,255],"13":["snowy_mountains",160,160,160],"14":["mushroom_fields",255,0,255],"15":["mushroom_field_shore",160,0,255],"16":["beach",250,222,85],"17":["desert_hills",210,95,18],"18":["wooded_hills",34,85,28],"19":["taiga_hills",22,57,51],"20":["mountain_edge",114,120,154],"21":["jungle",80,123,10],"22":["jungle_hills",44,66,5],"23":["sparse_jungle",96,147,15],"24":["deep_ocean",0,0,48],"25":["stony_shore",162,162,132],"26":["snowy_beach",250,240,192],"27":["birch_forest",48,116,68],"28":["birch_forest_hills",31,95,50],"29":["dark_forest",64,81,26],"30":["snowy_taiga",49,85,74],"31":["snowy_taiga_hills",36,63,54],"32":["old_growth_pine_taiga",89,102,81],"33":["giant_tree_taiga_hills",69,79,62],"34":["windswept_forest",91,115,82],"35":["savanna",189,178,95],"36":["savanna_plateau",167,157,100],"37":["badlands",217,69,21],"38":["wooded_badlands",176,151,101],"39":["badlands_plateau",202,140,101],"40":["small_end_islands",75,75,171],"41":["end_midlands",201,201,89],"42":["end_highlands",181,181,54],"43":["end_barrens",112,112,204],"44":["warm_ocean",0,0,172],"45":["lukewarm_ocean",0,0,144],"46":["cold_ocean",32,32,112],"47":["deep_warm_ocean",0,0,80],"48":["deep_lukewarm_ocean",0,0,64],"49":["deep_cold_ocean",32,32,56],"50":["deep_frozen_ocean",64,64,144],"51":["seasonal_forest",47,86,15],"52":["rainforest",71,132,14],"53":["shrubland",120,158,49],"127":["the_void",0,0,0],"129":["sunflower_plains",181,219,136],"130":["desert_lakes",255,188,64],"131":["windswept_gravelly_hills",136,136,136],"132":["flower_forest",45,142,73],"133":["taiga_mountains",51,146,135],"134":["swamp_hills",47,255,218],"140":["ice_spikes",180,220,220],"149":["modified_jungle",120,163,50],"151":["modified_jungle_edge",136,187,55],"155":["old_growth_birch_forest",88,156,108],"156":["tall_birch_hills",71,135,90],"157":["dark_forest_hills",104,121,66],"158":["snowy_taiga_mountains",89,125,114],"160":["old_growth_spruce_taiga",129,142,121],"161":["giant_spruce_taiga_hills",109,119,102],"162":["modified_gravelly_mountains",131,155,122],"163":["windswept_savanna",229,218,135],"164":["shattered_savanna_plateau",207,197,140],"165":["eroded_badlands",255,109,61],"166":["modified_wooded_badlands_plateau",216,191,141],"167":["modified_badlands_plateau",242,180,141],"168":["bamboo_jungle",132,149,0],"169":["bamboo_jungle_hills",92,108,4],"170":["soul_sand_valley",77,58,46],"171":["crimson_forest",152,26,17],"172":["warped_forest",73,144,123],"173":["basalt_deltas",100,95,99],"174":["dripstone_caves",78,48,18],"175":["lush_caves",40,60,0],"177":["meadow",96,164,69],"178":["grove",71,114,108],"179":["snowy_slopes",196,196,196],"180":["jagged_peaks",220,220,200],"181":["frozen_peaks",176,179,206],"182":["stony_peaks",123,143,116],"183":["deep_dark",3,31,41],"184":["mangrove_swamp",44,204,142],"185":["cherry_grove",255,145,200],"186":["pale_garden",105,109,149]};
const NON_OVERWORLD = new Set([8,9,40,41,42,43,127,170,171,172,173]);

// overworld structure types: key, label, cubiomes id, marker color, icon shape, keywords
const STRUCTS = [
  {key:"village",   label:"Village",         id:5,  col:"#ffd45e", shape:"house",   kw:"village villager trade"},
  {key:"outpost",   label:"Pillager Outpost",id:10, col:"#e07a3a", shape:"banner",  kw:"pillager outpost raid"},
  {key:"monument",  label:"Ocean Monument",  id:8,  col:"#57e0d0", shape:"gem",     kw:"monument guardian prismarine ocean"},
  {key:"mansion",   label:"Woodland Mansion",id:9,  col:"#b8763f", shape:"mansion", kw:"mansion woodland totem"},
  {key:"ancient",   label:"Ancient City",    id:13, col:"#39c3d6", shape:"skull",   kw:"ancient city warden deep dark sculk"},
  {key:"trial",     label:"Trial Chamber",   id:24, col:"#7bd66a", shape:"vault",   kw:"trial chamber vault key mace"},
  {key:"desert",    label:"Desert Pyramid",  id:1,  col:"#e6cf7a", shape:"pyramid", kw:"desert temple pyramid"},
  {key:"jungle",    label:"Jungle Temple",   id:2,  col:"#6fae3a", shape:"temple",  kw:"jungle temple pyramid"},
  {key:"hut",       label:"Swamp Hut",       id:3,  col:"#9a6fd0", shape:"hut",     kw:"witch hut swamp"},
  {key:"igloo",     label:"Igloo",           id:4,  col:"#d8ecff", shape:"dome",    kw:"igloo snow"},
  {key:"portal",    label:"Ruined Portal",   id:11, col:"#c04bff", shape:"portal",  kw:"ruined portal gold"},
  {key:"trail",     label:"Trail Ruins",     id:23, col:"#caa06a", shape:"dots",    kw:"trail ruins archaeology"},
  {key:"oceanruin", label:"Ocean Ruins",     id:6,  col:"#6ab0c0", shape:"arch",    kw:"ocean ruins"},
  {key:"shipwreck", label:"Shipwreck",       id:7,  col:"#c98f5a", shape:"ship",    kw:"shipwreck treasure map"},
  {key:"treasure",  label:"Buried Treasure", id:14, col:"#ffcf3a", shape:"chest",   kw:"buried treasure heart of the sea"},
  {key:"mineshaft", label:"Mineshaft",       id:15, col:"#b0b0b0", shape:"cart",    kw:"mineshaft rail"}
];
const DEFAULT_ON = new Set(["village","outpost","monument","mansion","stronghold","spawn"]);

const MINBPP = 0.75, MAXBPP = 640;   // blocks per screen pixel (continuous zoom)
const GEN_SCALES = [4,16,64,256];
const MARKER_BPP = 40;               // structure markers appear once zoomed past this
const now = (window.performance && performance.now) ? (()=>performance.now()) : (()=>Date.now());
const easeOut = t => 1 - Math.pow(1-t, 3);
const clamp = (v,a,b)=> v<a?a:(v>b?b:v);

function biomeName(id){ const b=BIOMES[id]; return b ? b[0].replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase()) : ("Biome "+id); }

/* ---- distinct icon per marker type (ctx-agnostic so chips can reuse it) ---- */
function drawIcon(g, px, py, col, shape){
  g.save(); g.translate(px,py); g.lineJoin="round"; g.lineCap="round";
  const stroke="rgba(5,7,11,.95)", dark="rgba(5,7,11,.9)";
  const P = fn => { g.beginPath(); fn(); };
  const fill2 = fn => { g.lineWidth=3; g.strokeStyle=stroke; P(fn); g.stroke(); g.fillStyle=col; P(fn); g.fill(); };
  const strokeOnly = (fn,w) => { g.lineWidth=(w||2)+2.5; g.strokeStyle=stroke; P(fn); g.stroke(); g.lineWidth=(w||2); g.strokeStyle=col; P(fn); g.stroke(); };
  switch(shape){
    case "house": fill2(()=>{ g.moveTo(-5,6);g.lineTo(-5,-1);g.lineTo(0,-6);g.lineTo(5,-1);g.lineTo(5,6);g.closePath(); }); break;
    case "mansion":
      fill2(()=>{ g.moveTo(-7,6);g.lineTo(-7,-2);g.lineTo(-3.5,-6);g.lineTo(0,-2);g.lineTo(3.5,-6);g.lineTo(7,-2);g.lineTo(7,6);g.closePath(); });
      g.fillStyle=dark; g.fillRect(-1.5,1,3,5); break;
    case "banner":
      g.lineWidth=3.5; g.strokeStyle=stroke; P(()=>{g.moveTo(-4,7);g.lineTo(-4,-7);}); g.stroke();
      g.lineWidth=1.6; g.strokeStyle="#d8d8e0"; P(()=>{g.moveTo(-4,7);g.lineTo(-4,-7);}); g.stroke();
      fill2(()=>{ g.moveTo(-4,-7);g.lineTo(6,-4.5);g.lineTo(-4,-2);g.closePath(); }); break;
    case "gem":
      fill2(()=>{ g.moveTo(0,-6);g.lineTo(6,0);g.lineTo(0,6);g.lineTo(-6,0);g.closePath(); });
      g.fillStyle=dark; P(()=>{g.moveTo(0,-2.6);g.lineTo(2.6,0);g.lineTo(0,2.6);g.lineTo(-2.6,0);g.closePath();}); g.fill(); break;
    case "pyramid": fill2(()=>{ g.moveTo(0,-6);g.lineTo(6,6);g.lineTo(-6,6);g.closePath(); }); break;
    case "temple":
      fill2(()=>{ g.moveTo(-6,6);g.lineTo(-4,1);g.lineTo(-2,1);g.lineTo(-1,-5);g.lineTo(1,-5);g.lineTo(2,1);g.lineTo(4,1);g.lineTo(6,6);g.closePath(); }); break;
    case "hut":
      fill2(()=>{ g.moveTo(-5,1);g.lineTo(0,-5);g.lineTo(5,1);g.lineTo(4,1);g.lineTo(4,4);g.lineTo(-4,4);g.lineTo(-4,1);g.closePath(); });
      g.strokeStyle=stroke; g.lineWidth=2.5; P(()=>{g.moveTo(-3,4);g.lineTo(-3,7);g.moveTo(3,4);g.lineTo(3,7);}); g.stroke();
      g.strokeStyle=col; g.lineWidth=1.6; P(()=>{g.moveTo(-3,4);g.lineTo(-3,7);g.moveTo(3,4);g.lineTo(3,7);}); g.stroke(); break;
    case "dome":
      fill2(()=>{ g.moveTo(-6,5);g.arc(0,5,6,Math.PI,0,true);g.closePath(); });
      g.fillStyle=dark; g.fillRect(-1.6,0.5,3.2,4.5); break;
    case "portal": strokeOnly(()=>{ g.moveTo(-4.5,-6);g.lineTo(4.5,-6);g.lineTo(4.5,6);g.lineTo(-4.5,6);g.closePath(); }, 2.4); break;
    case "dots":
      for(const dx of [-5,0,5]){ g.lineWidth=6.5; g.strokeStyle=stroke; P(()=>{g.arc(dx,0,0.1,0,Math.PI*2);}); g.stroke();
        g.fillStyle=col; P(()=>{g.arc(dx,0,2.4,0,Math.PI*2);}); g.fill(); } break;
    case "arch": strokeOnly(()=>{ g.arc(0,3,6,Math.PI,0,false); }, 3); break;
    case "ship":
      fill2(()=>{ g.moveTo(-6,1);g.lineTo(6,1);g.lineTo(4,6);g.lineTo(-4,6);g.closePath(); });
      g.strokeStyle=stroke; g.lineWidth=3; P(()=>{g.moveTo(0,1);g.lineTo(0,-6);}); g.stroke();
      g.strokeStyle=col; g.lineWidth=1.6; P(()=>{g.moveTo(0,1);g.lineTo(0,-6);}); g.stroke();
      fill2(()=>{ g.moveTo(0,-6);g.lineTo(5,-4);g.lineTo(0,-2);g.closePath(); }); break;
    case "chest":
      fill2(()=>{ g.moveTo(-6,-2);g.lineTo(6,-2);g.lineTo(6,6);g.lineTo(-6,6);g.closePath(); });
      g.fillStyle=dark; g.fillRect(-6,0.2,12,1.6); g.fillRect(-1,1.4,2,2.4); break;
    case "cart":
      fill2(()=>{ g.moveTo(-6,-3);g.lineTo(6,-3);g.lineTo(4,3);g.lineTo(-4,3);g.closePath(); });
      g.fillStyle=stroke; P(()=>{g.arc(-3,5,1.9,0,Math.PI*2);g.arc(3,5,1.9,0,Math.PI*2);}); g.fill(); break;
    case "eye":
      g.lineWidth=3; g.strokeStyle=stroke; P(()=>{g.ellipse(0,0,6.5,4.6,0,0,Math.PI*2);}); g.stroke();
      g.fillStyle=col; P(()=>{g.ellipse(0,0,6.5,4.6,0,0,Math.PI*2);}); g.fill();
      g.fillStyle="#161029"; P(()=>{g.ellipse(0,0,3,2.2,0,0,Math.PI*2);}); g.fill();
      g.fillStyle="#dfc6ff"; P(()=>{g.arc(0,0,1.1,0,Math.PI*2);}); g.fill(); break;
    case "spawn":
      fill2(()=>{ for(let i=0;i<8;i++){ const a=i*Math.PI/4, r=(i%2?2.8:6.8); const fx=Math.cos(a)*r, fy=Math.sin(a)*r; i?g.lineTo(fx,fy):g.moveTo(fx,fy);} g.closePath(); });
      g.fillStyle=dark; P(()=>{g.arc(0,0,1.7,0,Math.PI*2);}); g.fill(); break;
    case "vault":
      fill2(()=>{ g.moveTo(-5.5,-5.5);g.lineTo(5.5,-5.5);g.lineTo(5.5,5.5);g.lineTo(-5.5,5.5);g.closePath(); });
      g.fillStyle=dark; P(()=>{g.arc(0,-0.6,2.1,0,Math.PI*2);}); g.fill(); g.fillRect(-1,-0.6,2,4); break;
    case "skull":
      fill2(()=>{ g.moveTo(-5.5,-3);g.arc(0,-3,5.5,Math.PI,0,false);g.lineTo(5.5,2);g.lineTo(3,2);g.lineTo(3,5);g.lineTo(-3,5);g.lineTo(-3,2);g.lineTo(-5.5,2);g.closePath(); });
      g.fillStyle="#0a1620"; P(()=>{g.arc(-2.4,-2.2,1.5,0,Math.PI*2);g.arc(2.4,-2.2,1.5,0,Math.PI*2);}); g.fill(); break;
    default: fill2(()=>{ g.moveTo(0,-6);g.lineTo(6,0);g.lineTo(0,6);g.lineTo(-6,0);g.closePath(); });
  }
  g.restore();
}

window.initMcMap = function(opts){
  const M = opts.module, canvas = opts.canvas;
  const ctx = canvas.getContext("2d");

  const c_setup = M.cwrap("mc_setup", null, ["number","number"]);
  const c_apply = M.cwrap("mc_apply", null, ["number","string"]);
  const c_biome = M.cwrap("mc_biome_at","number",["number","number","number","number"]);
  const c_gen   = M.cwrap("mc_gen_map","number",["number","number","number","number","number","number","number"]);
  const c_find  = M.cwrap("mc_find_structures","number",["number","number","number","number","number","number","number"]);
  const c_sh    = M.cwrap("mc_strongholds","number",["number","number"]);
  const c_spawn = M.cwrap("mc_spawn", null, ["number"]);

  let rgbPtr=0, rgbCap=0, intPtr=0, intCap=0;
  function ensureRgb(bytes){ if(bytes>rgbCap){ if(rgbPtr)M._free(rgbPtr); rgbPtr=M._malloc(bytes); rgbCap=bytes; } }
  function ensureInt(count){ const b=count*4; if(b>intCap){ if(intPtr)M._free(intPtr); intPtr=M._malloc(b); intCap=b; } }

  const state = {
    mc:28, dim:0, seed:"0", ready:false,
    cx:0, cz:0, bpp:16,
    enabled:new Set(DEFAULT_ON),
    spawn:null, strongholds:[], you:null, highlight:null,
    markers:[], markersGated:false, generating:false
  };
  // two offscreen bitmaps so a fresh layer can fade over the previous one
  const offs = [document.createElement("canvas"), document.createElement("canvas")];
  let offIdx = 0;
  let cache = null, prevCache = null;   // {scale,cellLeft,cellTop,cw,ch,structs,cv}
  let fade = null;                      // {t0,dur}
  let anim = null;                      // zoom/pan animation
  let genPending=false, genQueued=false, genTimer=0;

  const sx = b => canvas.width/2  + (b - state.cx)/state.bpp;
  const sy = b => canvas.height/2 + (b - state.cz)/state.bpp;
  const bx = p => Math.round(state.cx + (p - canvas.width/2)*state.bpp);
  const bz = p => Math.round(state.cz + (p - canvas.height/2)*state.bpp);

  function fitCanvas(){
    const r = canvas.getBoundingClientRect();
    const w = Math.max(200, Math.floor(r.width)), h = Math.max(200, Math.floor(r.height));
    if (canvas.width!==w || canvas.height!==h){ canvas.width=w; canvas.height=h; }
  }
  function genScaleFor(bpp){ for(const s of GEN_SCALES){ if(s>=bpp) return s; } return 256; }

  function findStructs(id,x0,z0,x1,z1,max){
    ensureInt(max*2);
    const n = c_find(id,x0,z0,x1,z1,intPtr,max);
    const H=M.HEAP32, base=intPtr>>2, out=[];
    for(let i=0;i<n;i++) out.push([H[base+i*2], H[base+i*2+1]]);
    return out;
  }
  function computeSeedFeatures(){
    ensureInt(2); c_spawn(intPtr);
    state.spawn=[M.HEAP32[intPtr>>2], M.HEAP32[(intPtr>>2)+1]];
    ensureInt(32); const n=c_sh(intPtr,16), H=M.HEAP32, base=intPtr>>2, sh=[];
    for(let i=0;i<n;i++) sh.push([H[base+i*2], H[base+i*2+1]]);
    state.strongholds=sh;
  }

  /* ---- world generation (async-scheduled; coarse override for instant first paint) ---- */
  function generateLayer(forceScale, withStructs){
    fitCanvas();
    const W=canvas.width, H=canvas.height, bpp=state.bpp;
    const scale = forceScale || genScaleFor(bpp);
    const halfW = W*0.9*bpp, halfH = H*0.9*bpp;
    let cellLeft=Math.floor((state.cx-halfW)/scale), cellTop=Math.floor((state.cz-halfH)/scale);
    let cw=Math.ceil((state.cx+halfW)/scale)-cellLeft, ch=Math.ceil((state.cz+halfH)/scale)-cellTop;
    const MAXC=600; cw=clamp(cw,1,MAXC); ch=clamp(ch,1,MAXC);
    ensureRgb(cw*ch*3);
    const cv = offs[offIdx]; offIdx ^= 1;
    if (c_gen(scale, cellLeft, cellTop, cw, ch, 15, rgbPtr)){
      const g2 = cv.getContext("2d");
      const img=g2.createImageData(cw,ch), d=img.data, src=M.HEAPU8, base=rgbPtr;
      for(let i=0,j=0;i<cw*ch;i++){ d[j++]=src[base+i*3]; d[j++]=src[base+i*3+1]; d[j++]=src[base+i*3+2]; d[j++]=255; }
      cv.width=cw; cv.height=ch; g2.putImageData(img,0,0);
    }
    const structs=[];
    state.markersGated = bpp > MARKER_BPP;
    if (withStructs && !state.markersGated){
      const bx0=cellLeft*scale, bz0=cellTop*scale, bx1=(cellLeft+cw)*scale, bz1=(cellTop+ch)*scale;
      for(const s of STRUCTS){ if(!state.enabled.has(s.key)) continue;
        for(const [x,z] of findStructs(s.id,bx0,bz0,bx1,bz1,700)) structs.push({x,z,col:s.col,shape:s.shape,label:s.label}); }
    }
    return {scale, cellLeft, cellTop, cw, ch, structs, cv};
  }

  function requestRegen(delay){
    if (!state.ready) return;
    clearTimeout(genTimer);
    genTimer = setTimeout(()=>{
      if (genPending){ genQueued=true; return; }
      genPending=true; state.generating=true;
      if (opts.onStatus) opts.onStatus(true);
      setTimeout(()=>{
        const fresh = generateLayer(0, true);
        prevCache = cache; cache = fresh;
        genPending=false; state.generating=false;
        if (opts.onStatus) opts.onStatus(false);
        if (prevCache && !document.hidden){ fade={t0:now(),dur:200}; requestAnimationFrame(stepFade); }
        else { fade=null; prevCache=null; drawFrame(); }
        if (genQueued){ genQueued=false; requestRegen(0); }
      }, 0);
    }, delay||0);
  }
  function stepFade(){
    if (!fade) return;
    const t = Math.min(1,(now()-fade.t0)/fade.dur);
    drawFrame(t);
    if (t<1) requestAnimationFrame(stepFade);
    else { fade=null; prevCache=null; drawFrame(); }
  }

  /* ---- cheap composite: cached bitmap(s) + markers, no WASM ---- */
  function drawLayer(c, alpha){
    if (!c) return;
    ctx.globalAlpha = alpha;
    const sc=c.scale, dx=sx(c.cellLeft*sc), dy=sy(c.cellTop*sc);
    ctx.drawImage(c.cv, 0,0,c.cw,c.ch, dx, dy, c.cw*sc/state.bpp, c.ch*sc/state.bpp);
    ctx.globalAlpha = 1;
  }
  function drawScaleBar(){
    const targetPx=110, raw=targetPx*state.bpp;
    const nice=[16,32,64,128,256,500,1000,2000,4000,8000,16000,32000,64000,128000];
    let len=nice[nice.length-1]; for(const n of nice){ if(n>=raw){ len=n; break; } }
    const px=len/state.bpp, x=12, y=canvas.height-14;
    ctx.save();
    ctx.fillStyle="rgba(5,8,12,.72)"; ctx.fillRect(x-6, y-19, px+12, 26);
    ctx.strokeStyle="#dfe8e2"; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+px,y); ctx.moveTo(x,y-4); ctx.lineTo(x,y+3); ctx.moveTo(x+px,y-4); ctx.lineTo(x+px,y+3); ctx.stroke();
    ctx.fillStyle="#cfd8d2"; ctx.font="10.5px 'Cascadia Mono',Consolas,monospace"; ctx.textBaseline="alphabetic";
    ctx.fillText(len.toLocaleString("en-US")+" blocks", x+4, y-8);
    ctx.restore();
  }
  function drawFrame(fadeT){
    fitCanvas();
    const W=canvas.width, H=canvas.height;
    ctx.imageSmoothingEnabled=false;
    ctx.fillStyle="#05070c"; ctx.fillRect(0,0,W,H);
    if (fade!=null && prevCache){ drawLayer(prevCache,1); drawLayer(cache, easeOut(fadeT!=null?fadeT:1)); }
    else drawLayer(cache,1);
    state.markers=[];
    if (cache){
      for(const m of cache.structs){
        const px=sx(m.x), py=sy(m.z);
        if(px<-16||px>W+16||py<-16||py>H+16) continue;
        drawIcon(ctx,px,py,m.col,m.shape);
        state.markers.push({x:m.x,z:m.z,px,py,label:m.label,col:m.col});
      }
    }
    if (state.enabled.has("stronghold")){
      for(const [x,z] of state.strongholds){
        const px=sx(x), py=sy(z);
        if(px<-16||px>W+16||py<-16||py>H+16) continue;
        drawIcon(ctx,px,py,"#c98bff","eye");
        state.markers.push({x,z,px,py,label:"Stronghold",col:"#c98bff"});
      }
    }
    if (state.enabled.has("spawn") && state.spawn){
      const px=sx(state.spawn[0]), py=sy(state.spawn[1]);
      drawIcon(ctx,px,py,"#7dff5a","spawn");
      state.markers.push({x:state.spawn[0],z:state.spawn[1],px,py,label:"World Spawn",col:"#7dff5a"});
    }
    if (state.you){
      const px=sx(state.you[0]), py=sy(state.you[1]);
      ctx.save(); ctx.strokeStyle="rgba(6,8,12,.9)"; ctx.lineWidth=4;
      ctx.beginPath(); ctx.arc(px,py,7,0,Math.PI*2); ctx.moveTo(px-11,py); ctx.lineTo(px+11,py); ctx.moveTo(px,py-11); ctx.lineTo(px,py+11); ctx.stroke();
      ctx.strokeStyle="#fff"; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(px,py,7,0,Math.PI*2); ctx.moveTo(px-11,py); ctx.lineTo(px+11,py); ctx.moveTo(px,py-11); ctx.lineTo(px,py+11); ctx.stroke();
      ctx.restore();
    }
    if (state.highlight){
      const px=sx(state.highlight[0]), py=sy(state.highlight[1]);
      ctx.save(); ctx.strokeStyle="#fff"; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.arc(px,py,12,0,Math.PI*2); ctx.stroke();
      ctx.strokeStyle="rgba(255,255,255,.4)"; ctx.beginPath(); ctx.arc(px,py,16,0,Math.PI*2); ctx.stroke();
      ctx.restore();
    }
    drawScaleBar();
    if (opts.onRender) opts.onRender(state);
  }

  /* ---- smooth eased zoom & pan animation ---- */
  function animateView(target){
    const from = { b:state.bpp, cx:state.cx, cz:state.cz };
    anim = { t0:now(), dur:target.dur||420, from,
             toB:clamp(target.bpp!=null?target.bpp:state.bpp, MINBPP, MAXBPP),
             toCx:target.cx!=null?target.cx:state.cx,
             toCz:target.cz!=null?target.cz:state.cz,
             anchor:target.anchor||null };
    if (document.hidden){ // rAF is paused: jump straight to the end state
      state.bpp=anim.toB;
      if (anim.anchor){ state.cx=anim.anchor.wx-(anim.anchor.px-canvas.width/2)*state.bpp; state.cz=anim.anchor.wz-(anim.anchor.py-canvas.height/2)*state.bpp; }
      else { state.cx=anim.toCx; state.cz=anim.toCz; }
      anim=null; requestRegen(0); return;
    }
    requestAnimationFrame(stepAnim);
  }
  function stepAnim(){
    if (!anim) return;
    const t = Math.min(1,(now()-anim.t0)/anim.dur), e=easeOut(t);
    state.bpp = anim.from.b + (anim.toB-anim.from.b)*e;
    if (anim.anchor){
      state.cx = anim.anchor.wx - (anim.anchor.px - canvas.width/2)*state.bpp;
      state.cz = anim.anchor.wz - (anim.anchor.py - canvas.height/2)*state.bpp;
    } else {
      state.cx = anim.from.cx + (anim.toCx-anim.from.cx)*e;
      state.cz = anim.from.cz + (anim.toCz-anim.from.cz)*e;
    }
    drawFrame();
    if (t<1) requestAnimationFrame(stepAnim);
    else { anim=null; requestRegen(0); }
  }

  /* ---- interaction ---- */
  let dragging=false, lastX=0, lastY=0, panRaf=0;
  canvas.addEventListener("pointerdown", e=>{ dragging=true; lastX=e.clientX; lastY=e.clientY; try{canvas.setPointerCapture(e.pointerId);}catch(_){} });
  canvas.addEventListener("pointermove", e=>{
    const r=canvas.getBoundingClientRect();
    if (dragging){
      const dx=e.clientX-lastX, dy=e.clientY-lastY;
      state.cx-=dx*state.bpp; state.cz-=dy*state.bpp; lastX=e.clientX; lastY=e.clientY;
      if (!panRaf) panRaf=requestAnimationFrame(()=>{ panRaf=0; drawFrame(); });
      requestRegen(140);
    } else {
      const mx=e.clientX-r.left, my=e.clientY-r.top, wx=bx(mx), wz=bz(my);
      let hit=null; for(const m of state.markers){ if((m.px-mx)**2+(m.py-my)**2<80){ hit=m; break; } }
      if (opts.onHover) opts.onHover({ x:wx, z:wz, biome:biomeName(c_biome(1,wx,63,wz)), marker:hit });
      canvas.style.cursor = hit ? "pointer" : "grab";
    }
  });
  function endDrag(e){ if(!dragging) return; dragging=false; try{canvas.releasePointerCapture(e.pointerId);}catch(_){} requestRegen(0); }
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("pointerleave", ()=>{ if(opts.onHover) opts.onHover(null); });
  canvas.addEventListener("wheel", e=>{
    e.preventDefault();
    const r=canvas.getBoundingClientRect(), px=e.clientX-r.left, py=e.clientY-r.top;
    const wx=state.cx+(px-canvas.width/2)*state.bpp, wz=state.cz+(py-canvas.height/2)*state.bpp;
    const base = anim ? anim.toB : state.bpp;
    const factor = Math.pow(1.22, e.deltaY>0 ? 1 : -1);
    animateView({ bpp: base*factor, anchor:{wx,wz,px,py} });
  }, {passive:false});
  window.addEventListener("resize", ()=>requestRegen(150));

  /* ---- seed application: instant coarse paint, then crisp pass fades in ---- */
  function apply(mc, seed, dim){
    state.mc=mc; state.seed=seed; state.dim=dim||0;
    c_setup(mc,0); c_apply(state.dim, String(seed)); computeSeedFeatures();
    state.ready=true;
    state.cx=state.spawn[0]; state.cz=state.spawn[1];
    state.highlight=null;
    cache = generateLayer(genScaleFor(state.bpp)===4?16:256, false);  // fast coarse paint
    prevCache=null; fade=null;
    drawFrame();
    requestRegen(0);
  }

  /* ---- nearest search ---- */
  function nearestStructure(id, fx, fz){
    for (const r of [512,1024,2048,4096,8192,16384,32768,65536]){
      const list=findStructs(id, fx-r, fz-r, fx+r, fz+r, 4000);
      if (list.length){ let best=null,bd=Infinity; for(const[x,z]of list){const d=(x-fx)**2+(z-fz)**2; if(d<bd){bd=d;best=[x,z];}} return best; }
    }
    return null;
  }
  function nearestStronghold(fx,fz){ let best=null,bd=Infinity; for(const[x,z]of state.strongholds){const d=(x-fx)**2+(z-fz)**2; if(d<bd){bd=d;best=[x,z];}} return best; }
  function nearestBiome(target, fx, fz){
    const step=64, maxR=20000; let x=0,z=0,dx=0,dz=-1;
    const steps=Math.ceil((2*maxR/step+2)**2)+16;
    for(let i=0;i<steps;i++){
      if(Math.abs(x)*step<=maxR && Math.abs(z)*step<=maxR){
        const wx=fx+x*step, wz=fz+z*step;
        if(c_biome(4,wx,15,wz)===target) return [wx,wz];
      }
      if(x===z||(x<0&&x===-z)||(x>0&&x===1-z)){ const t=dx; dx=-dz; dz=t; }
      x+=dx; z+=dz;
    }
    return null;
  }

  return {
    apply, state, STRUCTS, biomeName,
    setEnabled(key,on){ if(on)state.enabled.add(key); else state.enabled.delete(key); requestRegen(0); },
    setEnabledMany(keys){ state.enabled=new Set(keys); if(state.ready) requestRegen(0); },
    isEnabled(key){ return state.enabled.has(key); },
    zoomIn(){  animateView({ bpp:(anim?anim.toB:state.bpp)/1.9 }); },
    zoomOut(){ animateView({ bpp:(anim?anim.toB:state.bpp)*1.9 }); },
    centerOn(x,z,targetBpp){
      if (!state.ready) return;
      animateView({ cx:x, cz:z, bpp:targetBpp!=null?targetBpp:state.bpp, dur:600 });
    },
    jumpTo(x,z){ state.cx=x; state.cz=z; requestRegen(0); },
    setYou(x,z){ state.you=(x==null?null:[x,z]); drawFrame(); },
    biomeAt(x,z){ return biomeName(c_biome(1,x,63,z)); },
    highlightAt(x,z){ state.highlight=(x==null?null:[x,z]); drawFrame(); },
    drawIconInto(canvas2, key){
      const g=canvas2.getContext("2d");
      g.clearRect(0,0,canvas2.width,canvas2.height);
      let col="#fff", shape="gem";
      if (key==="spawn"){ col="#7dff5a"; shape="spawn"; }
      else if (key==="stronghold"){ col="#c98bff"; shape="eye"; }
      else { const s=STRUCTS.find(s=>s.key===key); if(s){ col=s.col; shape=s.shape; } }
      drawIcon(g, canvas2.width/2, canvas2.height/2, col, shape);
    },
    biomeSearch(q){
      q=(q||"").toLowerCase().trim(); if(!q) return [];
      const out=[];
      for(const [id,v] of Object.entries(BIOMES)){
        if (NON_OVERWORLD.has(+id)) continue;
        if (v[0].replace(/_/g," ").includes(q) || v[0].includes(q.replace(/ /g,"_")))
          out.push({ id:+id, name:biomeName(+id) });
        if (out.length>=6) break;
      }
      return out;
    },
    locate(query, fx, fz){
      const q=(query||"").toLowerCase().trim();
      if(/stronghold/.test(q)){ const p=nearestStronghold(fx,fz); return p&&{pos:p,label:"Stronghold"}; }
      if(/spawn/.test(q)){ return state.spawn&&{pos:state.spawn,label:"World Spawn"}; }
      let s=STRUCTS.find(s=>s.label.toLowerCase()===q||s.key===q) || STRUCTS.find(s=>(s.label+" "+s.kw).toLowerCase().includes(q));
      if(s){ if(!state.enabled.has(s.key)) state.enabled.add(s.key); const p=nearestStructure(s.id,fx,fz); return {pos:p,label:s.label}; }
      const bm=Object.entries(BIOMES).find(([id,v])=>!NON_OVERWORLD.has(+id)&&(v[0].replace(/_/g," ").includes(q)||v[0].includes(q.replace(/ /g,"_"))));
      if(bm){ const p=nearestBiome(+bm[0],fx,fz); return {pos:p,label:biomeName(+bm[0]),biome:true}; }
      return null;
    }
  };
};
})();
