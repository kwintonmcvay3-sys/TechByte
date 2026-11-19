// ---------- Parts catalog (sample prices, November 2026) ----------
const CATS = {cpu:"Processor", cooler:"Cooler", board:"Motherboard", ram:"Memory", ssd:"Storage", hdd:"Backup drive", gpu:"Graphics", psu:"Power supply", case:"Case", pre:"Ready-made PC", addon:"Add-on"};
const P = {
  cpu_i3:{cat:"cpu",name:"Intel Core i3-14100",spec:"4 cores, LGA1700, built-in graphics, cooler included",price:120,socket:"LGA1700",igpu:true,cooler:true,watts:60},
  cpu_8600g:{cat:"cpu",name:"AMD Ryzen 5 8600G",spec:"6 cores, AM5, strong built-in graphics, cooler included",price:190,socket:"AM5",igpu:true,cooler:true,watts:88},
  cpu_5600:{cat:"cpu",name:"AMD Ryzen 5 5600",spec:"6 cores, AM4, cooler included, needs a graphics card",price:125,socket:"AM4",igpu:false,cooler:true,watts:76},
  cpu_7600:{cat:"cpu",name:"AMD Ryzen 5 7600",spec:"6 cores, AM5, cooler included",price:209,socket:"AM5",igpu:true,cooler:true,watts:88},
  cpu_9600x:{cat:"cpu",name:"AMD Ryzen 5 9600X",spec:"6 cores, AM5, no cooler in the box",price:199,socket:"AM5",igpu:true,cooler:false,watts:88},
  cpu_9700x:{cat:"cpu",name:"AMD Ryzen 7 9700X",spec:"8 cores, AM5, no cooler in the box",price:299,socket:"AM5",igpu:true,cooler:false,watts:88},
  cpu_7800x3d:{cat:"cpu",name:"AMD Ryzen 7 7800X3D",spec:"8 cores, AM5, extra game cache, no cooler in the box",price:337,socket:"AM5",igpu:true,cooler:false,watts:162},
  cpu_9800x3d:{cat:"cpu",name:"AMD Ryzen 7 9800X3D",spec:"8 cores, AM5, fastest gaming chip here, no cooler in the box",price:449,socket:"AM5",igpu:true,cooler:false,watts:162},
  cool_pa120:{cat:"cooler",name:"Thermalright Peerless Assassin 120 SE",spec:"Dual tower air cooler, fits AM5 and LGA1700",price:36},
  mb_h610:{cat:"board",name:"ASRock H610M",spec:"LGA1700, DDR4, micro ATX, Ethernet",price:80,socket:"LGA1700",ram:"DDR4",size:"mATX",wifi:false},
  mb_b550:{cat:"board",name:"B550M WiFi board",spec:"AM4, DDR4, micro ATX, Wi-Fi",price:100,socket:"AM4",ram:"DDR4",size:"mATX",wifi:true},
  mb_b650m:{cat:"board",name:"ASRock B650M-HDV/M.2",spec:"AM5, DDR5, micro ATX, Ethernet only",price:100,socket:"AM5",ram:"DDR5",size:"mATX",wifi:false},
  mb_b650:{cat:"board",name:"MSI B650 Gaming Plus WiFi",spec:"AM5, DDR5, ATX, Wi-Fi",price:120,socket:"AM5",ram:"DDR5",size:"ATX",wifi:true},
  mb_b850:{cat:"board",name:"MSI MAG B850 Tomahawk MAX WiFi",spec:"AM5, DDR5, ATX, Wi-Fi 7",price:210,socket:"AM5",ram:"DDR5",size:"ATX",wifi:true},
  ram_d4_16:{cat:"ram",name:"16GB DDR4-3200 (2 x 8GB)",spec:"DDR4, two sticks",price:120,type:"DDR4",gb:16},
  ram_d4_32:{cat:"ram",name:"32GB DDR4-3200 (2 x 16GB)",spec:"DDR4, two sticks",price:230,type:"DDR4",gb:32},
  ram_d5_16:{cat:"ram",name:"16GB DDR5-6000 (2 x 8GB)",spec:"DDR5, two sticks",price:253,type:"DDR5",gb:16},
  ram_d5_32:{cat:"ram",name:"32GB DDR5-6000 (2 x 16GB)",spec:"DDR5, two sticks",price:480,type:"DDR5",gb:32},
  ssd_500:{cat:"ssd",name:"500GB NVMe SSD",spec:"M.2 solid state drive",price:95},
  ssd_1tb:{cat:"ssd",name:"Kingston NV3 1TB NVMe SSD",spec:"M.2 solid state drive, PCIe 4.0",price:157},
  ssd_2tb:{cat:"ssd",name:"WD Black SN850X 2TB NVMe SSD",spec:"M.2 solid state drive, PCIe 4.0",price:420},
  hdd_4tb:{cat:"hdd",name:"4TB 3.5 inch hard drive",spec:"SATA, for local backups",price:130},
  gpu_b570:{cat:"gpu",name:"Intel Arc B570 10GB",spec:"1080p gaming, about 150 watts",price:219,watts:150},
  gpu_7600:{cat:"gpu",name:"AMD Radeon RX 7600 8GB",spec:"1080p gaming, about 165 watts",price:339,watts:165},
  gpu_5060ti:{cat:"gpu",name:"Nvidia RTX 5060 Ti 8GB",spec:"1080p high refresh, 1440p with upscaling, about 180 watts",price:499,watts:180},
  gpu_9070xt:{cat:"gpu",name:"AMD Radeon RX 9070 XT 16GB",spec:"1440p max settings, 4K with upscaling, about 300 watts",price:849,watts:304},
  psu_500:{cat:"psu",name:"500W 80 Plus Bronze power supply",spec:"500 watts",price:50,watts:500},
  psu_750:{cat:"psu",name:"Corsair RM750e 750W Gold",spec:"750 watts, modular cables",price:90,watts:750},
  psu_850:{cat:"psu",name:"Seasonic Focus GX-850 850W Gold",spec:"850 watts, modular cables",price:110,watts:850},
  case_office:{cat:"case",name:"Compact micro ATX office case",spec:"Small footprint, fits micro ATX boards",price:60,fits:["mATX"]},
  case_903:{cat:"case",name:"Montech AIR 903 MAX",spec:"ATX mid tower, mesh front, fans included",price:80,fits:["ATX","mATX"]},
  case_207:{cat:"case",name:"Lian Li Lancool 207",spec:"ATX mid tower, high airflow, four fans included",price:80,fits:["ATX","mATX"]},
  pre_refurb:{cat:"pre",name:"Refurbished business desktop",spec:"Example: Dell OptiPlex or Lenovo ThinkCentre, Core i5, 16GB, 256GB SSD, Windows 11 Pro",price:280,hasOS:true},
  add_surge:{cat:"addon",name:"Surge protector",spec:"Power strip with surge protection",price:25},
  add_ups:{cat:"addon",name:"Battery backup (UPS), 600VA",spec:"Keeps the PC on long enough to save and shut down",price:90},
  add_winhome:{cat:"addon",name:"Windows 11 Home license",spec:"Retail license",price:139},
  add_winpro:{cat:"addon",name:"Windows 11 Pro license",spec:"Adds BitLocker, Remote Desktop, and domain join",price:199},
  add_desk:{cat:"addon",name:"24 inch monitor, keyboard, and mouse",spec:"1080p monitor with basic wired set",price:130}
};

// ---------- Build tiers: every pick carries its reason ----------
const TIERS = {
  office:[
    {name:"Refurbished Office Starter",blurb:"At this budget a new custom build cannot beat a refurbished business desktop, because memory prices are so high right now.",
     parts:[["pre_refurb","Business desktops are built to run all day and come off lease in good shape. You get a working PC with Windows 11 Pro for less than the cost of new memory and storage alone. Ask the seller for at least a 90 day warranty."]]},
    {name:"Office Essentials",blurb:"A new, quiet desktop for email, documents, spreadsheets, and video calls.",
     parts:[
      ["cpu_i3","Four fast cores handle Office, web apps, and video calls without slowdowns. It has built-in graphics and a cooler in the box, so you buy nothing extra."],
      ["mb_h610","A simple board that uses DDR4 memory, which costs about half as much as DDR5 today. Ask the seller to confirm it ships with a BIOS that supports 14th generation chips."],
      ["ram_d4_16","16GB is the comfortable amount for many browser tabs plus Office. Two sticks run in dual channel, which is faster than one stick."],
      ["ssd_500","A solid state drive boots in seconds. 500GB is enough for office files, and cloud storage like OneDrive covers the rest."],
      ["psu_500","This PC draws very little power, so 500 watts is plenty and leaves room for a small graphics card later."],
      ["case_office","Small enough to sit on or under a desk and it fits the micro ATX board."]],
     upgrades:[["ssd_500","ssd_1tb","Your budget had room, so storage doubles to 1TB. That means years of files without cleanup."],["ram_d4_16","ram_d4_32","With budget left over, 32GB keeps heavy multitasking and large spreadsheets smooth."]]},
    {name:"Office Plus",blurb:"A faster desktop for heavy multitasking, big spreadsheets, and light photo or video work.",
     parts:[
      ["cpu_8600g","Six cores for heavier multitasking, with the strongest built-in graphics in the catalog. It can drive two monitors and light creative work with no graphics card."],
      ["mb_b650m","The lowest cost way onto the AM5 platform, which AMD still releases new chips for. You can upgrade the processor later without replacing the board."],
      ["ram_d5_16","Built-in graphics borrow system memory, so fast DDR5 in two sticks directly improves display performance."],
      ["ssd_1tb","1TB gives room for programs and several years of files."],
      ["psu_500","More than enough for a PC with no graphics card."],
      ["case_office","Compact and fits the micro ATX board."]],
     upgrades:[["ram_d5_16","ram_d5_32","With budget left over, 32GB helps large spreadsheets, many tabs, and photo editing."]]}
  ],
  gamer:[
    {name:"1080p Starter",blurb:"The lowest cost new build that plays popular games well at 1080p.",
     parts:[
      ["cpu_5600","A proven six core gaming chip at a low price, with a cooler included. It uses the older AM4 platform on purpose, because that lets us use cheaper DDR4 memory."],
      ["mb_b550","Matches the AM4 processor, has Wi-Fi built in, and takes DDR4 memory."],
      ["ram_d4_16","16GB is the minimum for current games. DDR4 saves over $100 compared with DDR5 right now, and that money goes into the graphics card."],
      ["ssd_1tb","Modern games are large. 1TB holds Windows plus a handful of big titles."],
      ["gpu_b570","The best value card in the catalog. It has 10GB of video memory, which helps with newer games at 1080p."],
      ["psu_500","The whole system needs about 300 watts at full load, so 500 watts gives a safe margin."],
      ["case_903","Mesh front and included fans keep parts cool without buying extra fans."]],
     upgrades:[["gpu_b570","gpu_7600","Your budget had room, so the graphics card steps up for higher frame rates at 1080p."],["ram_d4_16","ram_d4_32","With budget left over, 32GB helps if you stream or keep apps open while gaming."]]},
    {name:"1080p High Refresh",blurb:"Smooth high frame rates at 1080p and solid 1440p with upscaling.",
     parts:[
      ["cpu_7600","Fast in games and it comes with a cooler. It sits on AM5, so you can drop in a faster chip years from now."],
      ["mb_b650","A full size AM5 board with Wi-Fi and good power delivery, ready for a future processor upgrade."],
      ["ram_d5_16","AM5 requires DDR5. Memory prices are very high this year, so 16GB at the ideal 6000 speed keeps the build in budget. You can add more later."],
      ["ssd_1tb","Fast load times and space for your main games."],
      ["gpu_5060ti","The biggest share of a gaming budget belongs here. This card runs esports titles at very high frame rates and supports DLSS upscaling."],
      ["psu_750","Gold rated efficiency and enough headroom to move to a stronger graphics card later without replacing it."],
      ["case_207","High airflow with four fans included, and room for long graphics cards."]],
     upgrades:[["ram_d5_16","ram_d5_32","With budget left over, 32GB is the comfortable amount for new releases and streaming."]]},
    {name:"1440p Performance",blurb:"Max settings at 1440p and a strong start on 4K with upscaling.",
     parts:[
      ["cpu_7800x3d","Its extra cache makes it one of the fastest gaming processors you can buy, and it costs much less than the newest model."],
      ["cool_pa120","This chip does not include a cooler. This air cooler is quiet, inexpensive, and has no liquid to leak."],
      ["mb_b650","Handles this processor without trouble and keeps money free for the graphics card."],
      ["ram_d5_32","32GB is the right amount for a high end gaming PC, and 6000 speed is the sweet spot for Ryzen."],
      ["ssd_1tb","Fast storage for Windows and your current games. A second drive is an easy upgrade later."],
      ["gpu_9070xt","Runs 1440p at max settings and has 16GB of video memory, so it will not run short in new games."],
      ["psu_850","This graphics card can pull about 300 watts by itself. 850 watts keeps the system stable with room to spare."],
      ["case_207","Strong airflow for hot parts and space for a large graphics card."]],
     upgrades:[["ssd_1tb","ssd_2tb","With budget left over, 2TB means you can keep many more games installed."]]},
    {name:"1440p High Refresh Flagship",blurb:"Top tier frame rates at 1440p and comfortable 4K with upscaling.",
     parts:[
      ["cpu_9800x3d","The fastest gaming processor in the catalog. It is the right pick when you want the highest frame rates for competitive play."],
      ["cool_pa120","No cooler comes with this chip. This dual tower air cooler keeps it cool and quiet."],
      ["mb_b850","A newer board with Wi-Fi 7, more fast storage slots, and stronger power delivery for a flagship chip."],
      ["ram_d5_32","32GB at 6000 speed is the ideal match for this processor."],
      ["ssd_2tb","2TB holds a large game library on fast storage."],
      ["gpu_9070xt","The strongest graphics card in the catalog, with 16GB of video memory for high settings."],
      ["psu_850","Plenty of clean power for a 300 watt graphics card and a flagship processor."],
      ["case_207","High airflow keeps these parts cool under long gaming sessions."]]}
  ],
  business:[
    {name:"Refurbished Front Desk PC",blurb:"The most affordable reliable business computer. Good for a front desk, point of sale, or bookkeeping station.",
     parts:[["pre_refurb","These were built for offices, run all day, and already include Windows 11 Pro. Buying refurbished avoids today's high memory prices. Buy from a seller that gives a warranty of 90 days or more."]]},
    {name:"Front Desk Workstation",blurb:"A new desktop for scheduling, invoicing, email, and web based business apps.",
     parts:[
      ["cpu_i3","Plenty of speed for QuickBooks, scheduling software, and web apps, with built-in graphics and a cooler included."],
      ["mb_h610","Uses lower cost DDR4 memory and has wired Ethernet, which is more reliable than Wi-Fi for a business PC. Ask the seller to confirm 14th generation BIOS support."],
      ["ram_d4_16","16GB keeps a business app, email, and a browser running together without slowdowns."],
      ["ssd_500","Fast startup every morning. Keep business files in cloud storage or on a backup drive, not only on this PC."],
      ["psu_500","Low power draw means a low power bill and less heat."],
      ["case_office","Small enough for a counter or a reception desk."]],
     upgrades:[["ssd_500","ssd_1tb","Your budget had room, so storage doubles to 1TB for local records."]]},
    {name:"Business Workhorse",blurb:"For staff who multitask all day with large files, many tabs, and two monitors.",
     parts:[
      ["cpu_8600g","Six cores for heavy multitasking and strong built-in graphics for two monitors, with no graphics card to buy or maintain."],
      ["mb_b650m","Puts the business on the current AM5 platform, so the processor can be upgraded later in place of buying a new PC."],
      ["ram_d5_16","Fast DDR5 in two sticks helps both general speed and the built-in graphics."],
      ["ssd_1tb","Room for programs and years of documents."],
      ["psu_500","Efficient and more than enough for this system."],
      ["case_office","Compact and easy to place in an office."]],
     upgrades:[["ram_d5_16","ram_d5_32","With budget left over, 32GB helps large spreadsheets and heavy multitasking."]]},
    {name:"Owner or Creator Workstation",blurb:"For design, video, large data files, or running several heavy programs at once.",
     parts:[
      ["cpu_9700x","Eight efficient cores speed up exports, large spreadsheets, and running many programs at once. Its built-in graphics drive your monitors."],
      ["cool_pa120","This processor does not include a cooler. This one is quiet, which matters in an office."],
      ["mb_b650","A full size board with Wi-Fi, extra drive connections for the backup drive, and a path to future upgrades."],
      ["ram_d5_32","32GB is the working amount for creative software and big files."],
      ["ssd_1tb","Fast main drive for Windows, programs, and current projects."],
      ["hdd_4tb","A second drive for automatic local backups. A business should keep a copy here and another copy in the cloud."],
      ["psu_500","There is no graphics card, so 500 watts covers this system with a wide margin."],
      ["case_903","Fits the full size board and the extra hard drive, with good airflow."]]}
  ]
};
const LABEL = {office:"office worker", gamer:"gamer", business:"small business"};

function money(n){return "$"+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});}
function round2(n){return Math.round(n*100)/100;}

// Add-ons chosen by the option toggles
function addonItems(profile, opts, items){
  const out=[]; const pre = items.some(it=>P[it.id].cat==="pre");
  if(opts.storm){
    out.push(profile==="business"
      ? {id:"add_ups",why:"Storms and power flickers are common in Oklahoma. A battery backup gives staff time to save work and shut down, and it protects against surges."}
      : {id:"add_surge",why:"Low cost protection against the power surges that come with Oklahoma storm season."});
  }
  if(opts.win && !pre){
    out.push(profile==="business"
      ? {id:"add_winpro",why:"Pro adds BitLocker drive encryption and Remote Desktop, which a business should have for customer data."}
      : {id:"add_winhome",why:"A new build has no operating system. Home covers everyday use and gaming."});
  }
  if(opts.desk) out.push({id:"add_desk",why:"Everything needed to start using the PC on day one."});
  return out;
}
function totals(items, taxPct){
  const sub = items.reduce((s,it)=>s+P[it.id].price,0);
  const tax = round2(sub*taxPct/100);
  return {sub, tax, total:round2(sub+tax)};
}
// Pick the best tier that fits the budget, then spend what is left on upgrades
function makeBuild(profile, budget, opts, taxPct, forceTier){
  const tiers = TIERS[profile];
  const full = (parts)=>{ const core=parts.map(([id,why])=>({id,why})); return core.concat(addonItems(profile,opts,core)); };
  let idx = 0;
  if(forceTier!=null){ idx = Math.max(0,Math.min(tiers.length-1,forceTier)); }
  else if(budget){ for(let i=0;i<tiers.length;i++){ if(totals(full(tiers[i].parts),taxPct).total<=budget) idx=i; } }
  const tier = tiers[idx];
  let parts = tier.parts.map(p=>p.slice());
  if(forceTier==null && budget){
    for(const [from,to,why] of (tier.upgrades||[])){
      const trial = parts.map(p=>p[0]===from?[to,why]:p);
      if(totals(full(trial),taxPct).total<=budget) parts = trial;
    }
  }
  return {profile, tierIndex:idx, title:tier.name, blurb:tier.blurb, items:parts.map(([id,why])=>({id,why}))};
}
// Compatibility checks, the same ones a technician runs before ordering
function checkBuild(items){
  const by={}; items.forEach(it=>{by[P[it.id].cat]=P[it.id];});
  if(by.pre) return [{ok:true,text:"Ready-made PC. Nothing to assemble, and Windows is already installed."}];
  const out=[]; const {cpu,board,ram,gpu,psu,cooler,ssd}=by; const cs=by["case"];
  if(!cpu||!board||!ram||!psu||!cs||!ssd){ out.push({ok:false,text:"The build is missing a required part (processor, motherboard, memory, storage, power supply, or case)."}); return out; }
  out.push({ok:cpu.socket===board.socket,text:cpu.socket===board.socket?`Processor and motherboard both use the ${cpu.socket} socket.`:`Socket mismatch: the processor is ${cpu.socket} and the board is ${board.socket}.`});
  out.push({ok:ram.type===board.ram,text:ram.type===board.ram?`Memory is ${ram.type}, which matches the motherboard.`:`Memory is ${ram.type} but the board needs ${board.ram}.`});
  const fits=cs.fits.includes(board.size);
  out.push({ok:fits,text:fits?`The ${board.size==="mATX"?"micro ATX":"ATX"} board fits the case.`:"The motherboard is too large for this case."});
  const cool=cpu.cooler||!!cooler;
  out.push({ok:cool,text:cool?(cooler?"A separate cooler is included for the processor.":"The processor comes with its own cooler."):"This processor needs a cooler and none is in the build."});
  const vid=cpu.igpu||!!gpu;
  out.push({ok:vid,text:vid?(gpu?"A graphics card handles the display.":"Built-in graphics handle the display, so no graphics card is needed."):"There is no display output: this processor has no built-in graphics and no card is in the build."});
  const need=cpu.watts+(gpu?gpu.watts:0)+75; const okp=psu.watts>=need*1.3;
  out.push({ok:okp,text:okp?`Estimated load is about ${need} watts. The ${psu.watts} watt power supply leaves safe headroom.`:`Estimated load is about ${need} watts, which is too close to the ${psu.watts} watt power supply.`});
  return out;
}
function parseBudget(t){
  let m=t.match(/(\d+(?:\.\d+)?)\s*k\b/i); if(m) return Math.round(parseFloat(m[1])*1000);
  m=t.match(/\$\s*(\d{1,2},\d{3}|\d{3,5})/)||t.match(/\b(\d{1,2},\d{3}|\d{3,5})\b/); if(m) return parseInt(m[1].replace(/,/g,""),10);
  return null;
}
function parseProfile(t){
  t=t.toLowerCase();
  if(/\b(business|shop|store|employees?|staff|clients?|point of sale|pos|quickbooks|invoic|front desk|company|llc)\b/.test(t)) return "business";
  if(/\b(gam(e|es|er|ing)|fortnite|fps|esports|minecraft|roblox|stream(ing)?|1440p|4k|valorant|call of duty)\b/.test(t)) return "gamer";
  if(/\b(office|work|school|student|email|excel|word|spreadsheets?|zoom|teams|home|homework|browsing|documents?)\b/.test(t)) return "office";
  return null;
}

// ---------- Knowledge file search ----------
function norm(s){return " "+String(s).toLowerCase().replace(/['’]/g,"").replace(/[^a-z0-9.+ ]+/g," ").replace(/\s+/g," ")+" ";}
function matchArticles(kb,text){
  const t=norm(text); const out=[];
  (kb&&kb.articles||[]).forEach(a=>{
    let score=0;
    (a.keywords||[]).forEach(k=>{const kk=norm(k); if(kk.trim()&&t.includes(kk)) score+=2*kk.trim().split(" ").length;});
    if(score>0) out.push({article:a,score});
  });
  out.sort((x,y)=>y.score-x.score);
  return out;
}

// ---------- Build simulator ----------
const PERF={cpu_i3:{g:45,w:40,i:8},cpu_8600g:{g:60,w:62,i:30},cpu_5600:{g:62,w:58,i:0},cpu_7600:{g:75,w:66,i:8},cpu_9600x:{g:80,w:72,i:8},cpu_9700x:{g:82,w:88,i:8},cpu_7800x3d:{g:95,w:84,i:8},cpu_9800x3d:{g:100,w:90,i:8},
  gpu_b570:{a:55,b:35},gpu_7600:{a:60,b:38},gpu_5060ti:{a:78,b:55},gpu_9070xt:{a:100,b:92}};
const SLOTS=["case","board","cpu","cooler","ram","ssd","gpu","psu"];
// Startup checks in the order a real PC fails. slots = {cpu:"cpu_7600", ...}
function simChecks(slots){
  const g=k=>slots[k]?P[slots[k]]:null; const cpu=g("cpu"),board=g("board"),ram=g("ram"),ssd=g("ssd"),gpu=g("gpu"),psu=g("psu"),cs=g("case"),cooler=g("cooler");
  const out=[]; const add=(label,ok,text)=>out.push({label,ok,text});
  add("Power supply",!!psu,psu?`${psu.watts} watt supply is connected.`:"No power. Nothing happens when you press the button. Add a power supply.");
  add("Motherboard",!!board,board?`${board.name} powers up.`:"There is no motherboard, so the parts have nothing to plug into.");
  if(!cpu) add("Processor",false,"No processor installed. The board has power but cannot think.");
  else if(board) add("Processor",cpu.socket===board.socket,cpu.socket===board.socket?`Seated in the ${board.socket} socket.`:`The processor is ${cpu.socket} but the board socket is ${board.socket}. It will not fit.`);
  if(cpu){const ok=cpu.cooler||!!cooler; add("Cooling",ok,ok?(cooler?"Tower cooler installed.":"Using the cooler that came with the processor."):"This processor has no cooler in the box. It overheats and shuts off in seconds. Add a cooler.");}
  if(!ram) add("Memory",false,"No memory installed. A real board would beep at you here.");
  else if(board) add("Memory",ram.type===board.ram,ram.type===board.ram?`${ram.gb}GB of ${ram.type} detected.`:`These sticks are ${ram.type} but the board only takes ${board.ram}. The notch is in a different place, so they do not fit.`);
  if(cpu){const ok=cpu.igpu||!!gpu; add("Display",ok,ok?(gpu?`Picture from the ${gpu.name}.`:"Picture from the processor's built-in graphics."):"Blank screen. This processor has no built-in graphics, so it needs a graphics card.");}
  add("Boot drive",!!ssd,ssd?`${ssd.name} found.`:"No boot device found. Add a storage drive for Windows.");
  if(!cs) add("Case",false,"The parts are loose on the bench. Add a case.");
  else if(board){const ok=cs.fits.includes(board.size); add("Case",ok,ok?"The motherboard fits the case.":"This full size ATX board is too big for the compact case.");}
  if(cpu&&psu){const need=cpu.watts+(gpu?gpu.watts:0)+75; const ok=psu.watts>=need*1.3; add("Power headroom",ok,ok?`About ${need} watts needed, ${psu.watts} available.`:`The parts need about ${need} watts. A ${psu.watts} watt supply is too small and the PC shuts off under load.`);}
  return out;
}
function simCost(slots){return SLOTS.reduce((s,k)=>s+(slots[k]?P[slots[k]].price:0),0);}
function simScores(slots){
  const c=PERF[slots.cpu]||{g:0,w:0,i:0}; const v=slots.gpu?PERF[slots.gpu]:{a:c.i,b:Math.round(c.i*0.4)}; const gb=slots.ram?P[slots.ram].gb:0; const bonus=gb>=32?3:0;
  return {work:Math.min(100,Math.round(c.w*0.7+(gb>=32?30:20))),g1080:Math.min(100,Math.round(0.35*c.g+0.65*v.a)+bonus),g1440:Math.min(100,Math.round(0.35*c.g+0.65*v.b)+bonus)};
}
if(typeof module!=="undefined") module.exports={P,TIERS,CATS,makeBuild,checkBuild,totals,addonItems,parseBudget,parseProfile,matchArticles,simChecks,simCost,simScores};
