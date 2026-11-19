(function(){
"use strict";
const $=id=>document.getElementById(id);
const DEFAULT_KB=window.TB_KNOWLEDGE, DEFAULT_INSTR=window.TB_INSTRUCTIONS;
let KB=DEFAULT_KB, INSTR=DEFAULT_INSTR;
const state={profile:null,budget:null,build:null,example:true,custom:false,history:[],issue:null,tickets:[],ticket:null,run:null,runs:0};
let sample=null, busy=false;
const PAUSE=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches?0:230;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const DASH=new RegExp(String.fromCharCode(8212),"g");

function opts(){return {storm:$("optStorm").checked,win:$("optWin").checked,desk:$("optDesk").checked};}
function taxPct(){const v=parseFloat($("tax").value);return isFinite(v)&&v>=0?v:0;}
function allItems(){const b=state.build;return b.items.concat(addonItems(b.profile,opts(),b.items));}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function short(s,n){s=String(s);n=n||60;return s.length>n?s.slice(0,n-1)+"...":s;}
function plainMoney(n){return money(n).replace(".00","");}

// ================= Build sheet =================
function render(){
  const b=state.build; if(!b) return;
  const items=allItems(); const t=totals(items,taxPct());
  $("bTitle").textContent=(state.example?"Example: ":"")+b.title;
  $("bBlurb").textContent=b.blurb||"";
  const fit=$("bFit");
  if(state.budget){
    const d=round2(state.budget-t.total);
    fit.className="pill "+(d>=0?"good":"bad");
    fit.textContent=d>=0?`${money(d)} under your ${plainMoney(state.budget)} budget`:`${money(-d)} over your ${plainMoney(state.budget)} budget`;
  }else{fit.className="pill note";fit.textContent="No budget set yet";}
  $("bRows").innerHTML=items.map(it=>{const p=P[it.id];return `<li><span class="cat">${esc(CATS[p.cat])}</span><span><span class="pname">${esc(p.name)}</span><br><span class="spec">${esc(p.spec)}</span></span><span class="price">${money(p.price)}</span><span class="why"><b>Why:</b> ${esc(it.why||"Chosen to fit the build.")}</span></li>`;}).join("");
  $("bTotals").innerHTML=`<span>Parts subtotal</span><span>${money(t.sub)}</span><span>Sales tax (${taxPct()}%)</span><span>${money(t.tax)}</span><span class="grand">Total</span><span class="grand">${money(t.total)}</span>`;
  $("bChecks").innerHTML=checkBuild(b.items).map(c=>`<li class="${c.ok?"":"no"}">${esc(c.text)}</li>`).join("");
  $("stormName").textContent=b.profile==="business"?"Battery backup, UPS ($90)":"Surge protector ($25)";
  $("winName").textContent=b.profile==="business"?"Windows 11 Pro license ($199)":"Windows 11 Home license ($139)";
}
function renderCatalog(){
  const groups={}; Object.values(P).forEach(p=>{(groups[p.cat]=groups[p.cat]||[]).push(p);});
  $("catView").innerHTML=`<p class="foot" style="margin-top:0">Every recommendation comes from this list. Prices are sample estimates from November 2026.</p>`+
    Object.keys(CATS).filter(c=>groups[c]).map(c=>`<div class="catgroup"><h4>${esc(CATS[c])}</h4><table>${groups[c].map(p=>`<tr><td><b>${esc(p.name)}</b><br><span class="spec">${esc(p.spec)}</span></td><td>${money(p.price)}</td></tr>`).join("")}</table></div>`).join("");
}
function showTab(build){
  $("buildView").hidden=!build; $("catView").hidden=build;
  $("tabBuild").setAttribute("aria-selected",build); $("tabCat").setAttribute("aria-selected",!build);
  $("copy").hidden=!build;
}

// ================= Chat =================
function addMsg(who,text){
  const d=document.createElement("div"); d.className="msg "+who; d.textContent=text;
  $("log").appendChild(d); $("log").scrollTop=$("log").scrollHeight; return d;
}
function say(text){addMsg("bot",text);state.history.push({role:"Advisor",text});}
function setChips(list){
  $("chips").innerHTML="";
  list.forEach(([label,send])=>{const b=document.createElement("button");b.type="button";b.className="chip";b.textContent=label;b.onclick=()=>handle(send||label,true);$("chips").appendChild(b);});
}
const START_CHIPS=[["Office PC on a budget","I need an office PC on a budget"],["Gaming PC","I want a gaming PC"],["Small business setup","I need computers for my small business"],["My PC has a problem","My PC has a problem"],["Help with my files","I need help with my files"]];
const BUDGET_CHIPS={office:[["About $400","$400"],["About $650","$650"],["About $1,000","$1,000"]],gamer:[["About $1,000","$1,000"],["About $1,600","$1,600"],["About $2,500","$2,500"]],business:[["About $450 per PC","$450"],["About $900 per PC","$900"],["About $1,200 per PC","$1,200"],["About $1,800 per PC","$1,800"]]};
const AFTER_CHIPS=[["Make it cheaper","make it cheaper"],["Step it up","step it up"],["Why these parts?","why these parts?"],["Where do I buy?","where do I buy?"]];
const ISSUE_CHIPS=[["That fixed it","that fixed it"],["Still not working","still not working"],["Start a new request","start over"]];
const HW_CHIPS=[["It will not turn on","My PC will not turn on"],["The screen is blank","The screen is blank"],["It is very slow","My computer is very slow"],["It shuts off by itself","My PC shuts off by itself"]];
const FILE_CHIPS=[["I deleted a file","I deleted a file by mistake"],["I cannot find a file","I cannot find a file"],["Back up my files","How do I back up my files?"],["A file will not open","A file will not open"]];

function setDefaults(profile){ $("optStorm").checked=true; $("optWin").checked=profile==="business"; }
function present(forceTier){
  state.example=false; state.custom=false;
  state.build=makeBuild(state.profile,state.budget,opts(),taxPct(),forceTier);
  render(); showTab(true);
  const b=state.build; const t=totals(allItems(),taxPct());
  let msg=`Here is my pick for a ${LABEL[b.profile]}: the ${b.title}, ${money(t.total)} with tax. ${b.blurb}`;
  if(state.budget){
    if(t.total>state.budget) msg+=`\n\nThis is ${money(round2(t.total-state.budget))} over your budget. It is the lowest cost option in the catalog for this use, so I would not go cheaper with new parts. You can turn off options on the build sheet to bring it down.`;
    else msg+=`\n\nThat leaves ${money(round2(state.budget-t.total))} of your budget unspent.`;
  }
  msg+="\n\nThe build sheet lists every part with the reason I chose it, plus the compatibility checks.";
  say(msg); setChips(AFTER_CHIPS);
  return `Build ready: ${b.title}, ${money(t.total)} with tax.`;
}
function articleText(a){
  let t=`This sounds like: ${a.title}.\n\nTry these steps in order:\n`+a.steps.map((s,i)=>`${i+1}. ${s}`).join("\n");
  if(a.replace&&P[a.replace.part]){const p=P[a.replace.part]; t+=`\n\nIf the steps do not fix it: ${a.replace.note} From our catalog: ${p.name}, ${money(p.price)}.`;}
  if(a.open) t+="\n\nSafety first: shut down and unplug the PC before you open the case.";
  return t;
}

// Step 2 of the workflow: decide what kind of request this is
function classify(text){
  const low=text.toLowerCase().replace(/['’]/g,"");
  if(state.issue){
    if(/\b(still|did not work|didnt work|not working|no luck|not fixed)\b/.test(low)) return {type:"command",cmd:"stuck",label:"Follow-up: the fix did not work"};
    if(/\b(that fixed it|fixed|works now|working now|it worked|solved)\b/.test(low)) return {type:"command",cmd:"fixed",label:"Follow-up: the fix worked"};
  }
  const hits=matchArticles(KB,text); const strong=hits.length&&hits[0].score>=4;
  if(state.build&&!state.example&&!strong){
    if(/\b(cheaper|less|lower|save|too (much|expensive))\b/.test(low)) return {type:"command",cmd:"cheaper",label:"Follow-up: wants a lower price"};
    if(/\b(step it up|upgrade|better|faster|more power|stronger)\b/.test(low)) return {type:"command",cmd:"up",label:"Follow-up: wants more performance"};
    if(/\bwhy\b/.test(low)) return {type:"command",cmd:"why",label:"Follow-up: wants the reasons"};
  }
  if(/\b(where|buy|store|pickup|micro ?center)\b/.test(low)&&/\b(where|store|pickup|micro ?center)\b/.test(low)&&!hits.length) return {type:"command",cmd:"where",label:"Question: where to buy"};
  const p=parseProfile(text), b=parseBudget(text);
  const buildWords=/\b(build|buy|shopping|recommend|budget|new (pc|computer)|gaming pc|office pc|(pc|computer|computers) for|setup)\b/.test(low);
  const troubleWords=/\b(problem|broken|fix|issue|not working|trouble|wont|doesnt|cant|cannot|help with|repair)\b/.test(low);
  if(hits.length&&(strong||!buildWords)&&!b) return {type:hits[0].article.type,hits,label:hits[0].article.type==="files"?"File help":"Hardware problem"};
  if(!buildWords&&!b&&/\bfiles?\b/.test(low)) return {type:"ask",ask:"files",label:"File help, needs details"};
  if(!buildWords&&!b&&troubleWords) return {type:"ask",ask:"hardware",label:"Problem report, needs details"};
  if(buildWords||p||b) return {type:"build",profile:p,budget:b,label:"New PC build"};
  return {type:"ask",ask:"start",label:"Not sure yet, needs details"};
}

// Step 4 when live AI is off: answer from the knowledge file and the catalog
function planLocal(text,s){
  if(s.type==="command"){
    if(s.cmd==="fixed"){ say("Glad that fixed it. I marked your ticket as solved. Is there anything else I can help with?"); setChips(START_CHIPS); const r={note:"Customer confirmed the fix.",status:"Solved"}; return r; }
    if(s.cmd==="stuck"){
      const is=state.issue;
      if(is.idx+1<is.hits.length){ is.idx++; const a=is.hits[is.idx].article; say("Thanks for trying that. Here is the next most likely cause.\n\n"+articleText(a)); setChips(ISSUE_CHIPS); return {note:`Sent next article: ${a.title}.`,status:"More steps sent"}; }
      say("Thanks for trying those steps. I have sent your ticket to a TechByte technician, who will look at it in person. If you smell burning, see smoke, or the device got wet, unplug it and stop using it.");
      setChips(START_CHIPS); return {note:"Out of articles. Escalated.",status:"Sent to a technician"};
    }
    if(s.cmd==="cheaper"){
      if(state.build.tierIndex===0||state.custom){say("This is already the lowest cost option I can offer for this use. You can turn off options on the build sheet to lower the total.");setChips(AFTER_CHIPS);return {note:"Already at the lowest tier."};}
      state.budget=null; return {note:present(state.build.tierIndex-1)};
    }
    if(s.cmd==="up"){
      if(state.custom||state.build.tierIndex>=TIERS[state.profile].length-1){say("This is the top build in the catalog for this use.");setChips(AFTER_CHIPS);return {note:"Already at the top tier."};}
      state.budget=null; return {note:present(state.build.tierIndex+1)};
    }
    if(s.cmd==="why"){ say("Here is the short version:\n\n"+state.build.items.map(it=>`${CATS[P[it.id].cat]}: ${P[it.id].name}. ${it.why}`).join("\n\n")); setChips(AFTER_CHIPS); return {note:"Explained each part."}; }
    say("Online stores like Newegg, Amazon, and B&H ship everything in this catalog to Oklahoma and the Midwest. For same day needs, Best Buy carries common parts. The closest Micro Center stores for in-person pickup are in the Kansas City area (Overland Park, KS) and Dallas, TX. For refurbished business desktops, look for a seller that gives at least a 90 day warranty. Prices move weekly right now, so compare two stores before you order.");
    setChips(state.build&&!state.example?AFTER_CHIPS:START_CHIPS); return {note:"Shared where to buy."};
  }
  if(s.type==="hardware"||s.type==="files"){
    const a=state.issue.hits[0].article; say(articleText(a)); setChips(ISSUE_CHIPS);
    return {note:`Sent steps from "${a.title}".`,status:"Steps sent"};
  }
  if(s.type==="ask"){
    if(s.ask==="hardware"){say("Sorry to hear that. What is the computer doing? Pick the closest match or describe it in your own words.");setChips(HW_CHIPS);return {note:"Asked what the computer is doing."};}
    if(s.ask==="files"){say("I can help with files. What do you need to do?");setChips(FILE_CHIPS);return {note:"Asked what kind of file help."};}
    say("I can help three ways: pick parts for a new PC, fix a computer problem, or help with files. Which one do you need?"); setChips(START_CHIPS); return {note:"Asked what the customer needs."};
  }
  // build
  if(s.profile&&s.profile!==state.profile){state.profile=s.profile; setDefaults(s.profile);}
  if(s.budget) state.budget=s.budget;
  if(!state.profile){say("Happy to help you pick parts. Who is this computer for?"); setChips(START_CHIPS.slice(0,3)); return {note:"Asked who the PC is for."};}
  if(!state.budget){
    const q={office:"What is your budget for the PC? Memory prices are high this year, so I will be careful with every dollar.",gamer:"What is your budget for the tower? Tell me a number, or pick one below.",business:"What is your budget per computer? I will include Windows 11 Pro and a battery backup, since a business needs both."}[state.profile];
    say(q); setChips(BUDGET_CHIPS[state.profile]); return {note:"Asked for the budget."};
  }
  return {note:present(null)};
}

// Step 4 when live AI is on: Claude answers using the instructions and knowledge file
function catalogText(){return Object.entries(P).filter(([,p])=>p.cat!=="addon").map(([id,p])=>`${id} | ${CATS[p.cat]} | ${p.name} | ${p.spec} | $${p.price}`).join("\n");}
function knowledgeText(){return (KB.articles||[]).map(a=>`[${a.type}] ${a.title}: ${(a.steps||[]).join(" ")}${a.replace&&P[a.replace.part]?` Replacement part: ${a.replace.part}. ${a.replace.note}`:""}`).join("\n");}
function prompt(){
  const cur=state.build&&!state.example?`Current build on the sheet: ${state.build.title} (${state.build.items.map(i=>i.id).join(", ")}).`:"No customer build on the sheet yet.";
  return `${INSTR}

EXTRA RULES FOR THIS APP
- To show a full build, call the show_build tool with every part id and a one or two sentence plain reason for each. A build needs a processor, motherboard, memory, storage, power supply, and case, plus a cooler if the processor has none in the box and a graphics card for gaming or if the processor has no built-in graphics. For very low office or business budgets, the refurbished business desktop (pre_refurb) alone is a valid build. The tool reports problems and the total with tax. Fix problems and stay within the budget.
- Extras (surge protector or battery backup, Windows license, monitor set) are toggles on the build sheet. Do not add them as parts. Current sales tax: ${taxPct()}%.
- Reply in plain text under 130 words. Use numbered steps for fixes.

KNOWLEDGE FILE
${knowledgeText()}

PARTS CATALOG (id | category | name | details | price)
${catalogText()}

${cur}

CONVERSATION SO FAR
${state.history.slice(-12).map(m=>`${m.role}: ${m.text}`).join("\n")}

Write the Advisor's next reply.`;
}
const showBuildTool={
  name:"show_build",
  description:"Put a full PC build on the customer's build sheet. Returns the total with tax and any compatibility problems.",
  inputSchema:{type:"object",properties:{
    title:{type:"string",description:"Short build name"},
    summary:{type:"string",description:"One sentence on who this build is for"},
    customer_type:{type:"string",enum:["office","gamer","business"]},
    budget:{type:"number",description:"Customer budget in dollars, if known"},
    items:{type:"array",items:{type:"object",properties:{id:{type:"string"},why:{type:"string"}},required:["id","why"]}}
  },required:["title","customer_type","items"]},
  execute(input){
    const bad=(input.items||[]).filter(i=>!P[i.id]||P[i.id].cat==="addon").map(i=>i.id);
    if(bad.length) throw new Error("Unknown or not allowed part ids: "+bad.join(", "));
    const prof=TIERS[input.customer_type]?input.customer_type:"office";
    if(prof!==state.profile){state.profile=prof; setDefaults(prof);}
    if(input.budget>0) state.budget=Math.round(input.budget);
    setCustomBuild(prof,String(input.title).slice(0,60),String(input.summary||"").slice(0,200),input.items.map(i=>({id:i.id,why:String(i.why).slice(0,400)})));
    const t=totals(allItems(),taxPct());
    return {total_with_tax:t.total,budget:state.budget,over_budget:state.budget?t.total>state.budget:false,problems:checkBuild(state.build.items).filter(c=>!c.ok).map(c=>c.text)};
  }
};
function setCustomBuild(profile,title,blurb,items){
  state.example=false; state.custom=true;
  state.build={profile,tierIndex:0,title,blurb,items};
  render(); showTab(true);
}
function clean(s){return String(s||"").replace(/\*\*/g,"").replace(DASH,",").trim();}
async function planAI(text,s){
  const bubble=addMsg("bot","Thinking...");
  const before=state.build;
  try{
    const res=await sample(prompt(),{cache:false,tools:[showBuildTool],onText:({text})=>{if(text){bubble.textContent=clean(text);$("log").scrollTop=$("log").scrollHeight;}}});
    const out=clean(res&&res.text)||"I put a build on the sheet for you. Each part has its reason listed.";
    bubble.textContent=out; state.history.push({role:"Advisor",text:out});
    const issue=s.type==="hardware"||s.type==="files";
    setChips(issue?ISSUE_CHIPS:(state.build&&!state.example?AFTER_CHIPS:START_CHIPS));
    return {note:"Live AI answer sent"+(state.build!==before?`, with build "${state.build.title}".`:"."),status:issue?"Steps sent":undefined};
  }catch(e){
    bubble.remove();
    if(e&&e.code==="not_granted"){sample=null;setStatus();}
    if(e&&e.code==="rate_limited") say("The live AI is busy right now, so I am answering from the knowledge file.");
    return planLocal(text,s);
  }
}

// ================= Workflow (trigger, then actions, each passing data to the next) =================
const ZAP=[
  {kind:"Trigger",app:"Chat",name:"New customer request",does:"Starts the workflow every time a customer sends a message."},
  {kind:"Action",app:"Sorter",name:"Sort the request",does:"Decides if this is a new PC build, a hardware problem, or file help."},
  {kind:"Action",app:"Knowledge file",name:"Search the knowledge file and catalog",does:"Finds the matching help article or the right section of the parts catalog."},
  {kind:"Action",app:"Advisor",name:"Write the fix plan or build",does:"Answers the customer with steps to try or a full parts list with reasons."},
  {kind:"Action",app:"Tickets",name:"Create or update the ticket",does:"Logs the request so the team can track it."},
  {kind:"Action",app:"Message",name:"Draft the follow-up message",does:"Writes a message the team can send to the customer."}
];
function renderZap(){
  const run=state.run; const lab={wait:"Waiting",run:"Running",done:"Done",fail:"Failed"}; const cls={wait:"note",run:"warn",done:"good",fail:"bad"};
  $("zap").innerHTML=ZAP.map((z,i)=>{const st=run?run.steps[i]:{status:"wait",out:""};
    return `<li class="z ${st.status}"><span class="znum">${i+1}</span><div class="zbody"><div class="zhead"><span class="zkind">${z.kind} / ${esc(z.app)}</span><span class="pill ${cls[st.status]}">${lab[st.status]}</span></div><div class="zname">${esc(z.name)}</div><div class="zout">${esc(st.out||z.does)}</div></div></li>`;}).join("");
  $("zapRun").textContent=run?`Run ${run.n}: "${short(run.input,40)}"`:"No runs yet";
}
function renderTickets(){
  $("tickets").innerHTML=state.tickets.length?`<table class="tk"><thead><tr><th>Ticket</th><th>Type</th><th>Summary</th><th>Status</th></tr></thead><tbody>${state.tickets.map(t=>`<tr><td class="mono">${t.id}<br><span class="spec">${t.time}</span></td><td>${esc(t.kind)}</td><td>${esc(t.summary)}</td><td><span class="pill ${t.status==="Solved"||t.status==="Quote ready"?"good":t.status==="Sent to a technician"?"bad":"warn"}">${esc(t.status)}</span></td></tr>`).join("")}</tbody></table>`:`<p class="lead">No tickets yet. Send a message in the Advisor or run a test request.</p>`;
  $("follow").textContent=state.run&&state.run.follow?state.run.follow:"The follow-up message appears here after a ticket is created.";
}
function ticketStep(s,plan){
  const kinds={build:"New PC build",hardware:"Hardware problem",files:"File help"};
  let t=state.ticket;
  if(kinds[s.type]&&(s.type!=="build"||!t||t.kind!==kinds.build)){
    t={id:"TB-"+(1001+state.tickets.length),kind:kinds[s.type],summary:"",status:"Open",time:new Date().toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})};
    state.tickets.unshift(t); state.ticket=t;
  }
  if(!t) return "No ticket yet. Waiting for the customer to say what they need.";
  if(t.kind===kinds.build){
    if(s.type==="build"||(s.type==="command"&&["cheaper","up"].includes(s.cmd))||state.custom){
      if(state.build&&!state.example){t.summary=`${state.build.title}, ${money(totals(allItems(),taxPct()).total)} with tax`; t.status="Quote ready";}
      else{t.summary="Collecting customer type and budget"; t.status="Gathering details";}
    }
  }else{
    if(plan&&plan.status) t.status=plan.status;
    if(state.issue) t.summary=state.issue.hits[state.issue.idx].article.title;
  }
  return `${t.id}, ${t.kind}. Status: ${t.status}.`;
}
function followStep(){
  const t=state.ticket; if(!t) return "";
  if(t.kind==="New PC build"){
    if(t.status!=="Quote ready") return `Hi, thanks for contacting TechByte. We are putting your PC quote together under ticket ${t.id}. Reply with who the PC is for and your budget and we will finish it.`;
    return `Hi, thanks for visiting TechByte. Your quote is ready under ticket ${t.id}: ${t.summary}. Every part was picked for your needs, and the reasons are on your build sheet. Prices are sample estimates and can change, so check with us before you order. Reply to this message if you want any changes.`;
  }
  if(t.status==="Solved") return `Hi, this is TechByte. We are glad the fix for "${t.summary}" worked. Ticket ${t.id} is now closed. One tip: keep a backup of your important files so you are covered next time.`;
  if(t.status==="Sent to a technician") return `Hi, this is TechByte. The steps for "${t.summary}" did not solve the problem, so ticket ${t.id} is now with a technician. Please bring the device in, or reply with a good time for us to call.`;
  return `Hi, this is TechByte. We sent you steps for "${t.summary}" under ticket ${t.id}. Try them in order. If the problem is still there, reply with your ticket number and we will take the next step.`;
}
async function runWorkflow(text,fromChip){
  const run={n:++state.runs,input:text,steps:ZAP.map(()=>({status:"wait",out:""})),follow:""}; state.run=run; renderZap();
  const step=async(i,fn)=>{
    run.steps[i].status="run"; renderZap(); if(PAUSE) await wait(PAUSE);
    try{run.steps[i].out=await fn(); run.steps[i].status="done";}catch(e){run.steps[i].status="fail"; run.steps[i].out="This step failed: "+(e&&e.message||e);}
    renderZap();
  };
  let s={type:"ask",ask:"start",label:"Not sure yet"}, plan=null;
  await step(0,()=>`Received from the chat: "${short(text,80)}"`);
  await step(1,()=>{ s=classify(text); let o=`Sorted as: ${s.label}.`; if(s.profile) o+=` Customer type: ${LABEL[s.profile]}.`; if(s.budget) o+=` Budget: ${plainMoney(s.budget)}.`; return o; });
  await step(2,()=>{
    if(s.type==="hardware"||s.type==="files"){ state.issue={hits:s.hits,idx:0}; return `Found ${s.hits.length} matching article${s.hits.length>1?"s":""}. Best match: "${s.hits[0].article.title}" (${s.hits[0].article.source||"knowledge file"}).`; }
    if(s.type==="build"||(s.type==="command"&&["cheaper","up","why"].includes(s.cmd))) return `Opened the parts catalog: ${Object.keys(P).length} parts and ${Object.values(TIERS).reduce((n,t)=>n+t.length,0)} tested builds.`;
    if(s.type==="command"&&state.issue) return `Using the open issue: "${state.issue.hits[state.issue.idx].article.title}".`;
    return "Nothing to look up yet. More details are needed.";
  });
  await step(3,async()=>{ plan=(sample&&!fromChip&&s.type!=="command")?await planAI(text,s):planLocal(text,s); return plan.note; });
  await step(4,()=>ticketStep(s,plan));
  await step(5,()=>{ run.follow=followStep(); return run.follow?"Draft ready. See the follow-up message panel.":"No message needed yet."; });
  renderTickets();
}
async function handle(text,fromChip){
  text=String(text).trim(); if(!text||busy) return;
  if(/^(start over|reset|restart)$/i.test(text)){resetChat();return;}
  addMsg("user",text); state.history.push({role:"Customer",text});
  $("chips").innerHTML=""; busy=true; $("send").disabled=true;
  try{ await runWorkflow(text,fromChip); }
  finally{busy=false;$("send").disabled=false;}
}
function setStatus(){
  $("status").classList.toggle("on",!!sample);
  $("statusText").textContent=sample?"Live AI answers on":"Guided demo mode";
}
function resetChat(){
  state.profile=null;state.budget=null;state.history=[];state.example=true;state.custom=false;state.issue=null;state.ticket=null;
  $("log").innerHTML=""; $("optStorm").checked=true; $("optWin").checked=false; $("optDesk").checked=false;
  state.build=makeBuild("office",650,opts(),taxPct(),null);
  render(); showTab(true);
  say("Hi, I am the TechByte Advisor. I can pick parts for a new PC and explain every choice, help fix a computer problem, or help with your files.\n\nThe build sheet shows an example office PC to start. Pick an option below or type your own request.");
  setChips(START_CHIPS);
}

// ================= Build simulator =================
const MISSIONS=[
  {name:"Front desk PC",brief:"A dental office needs a reliable PC for scheduling and email. Build one that starts up and scores 45 or higher for everyday work, using $600 or less in parts.",budget:600,goal:["work",45]},
  {name:"1080p gamer",brief:"A high school senior saved up for a first gaming PC. Reach a 1080p gaming score of 70 or higher for $1,300 or less in parts.",budget:1300,goal:["g1080",70]},
  {name:"1440p dream rig",brief:"A streamer wants max settings at 1440p. Reach a 1440p gaming score of 85 or higher for $2,000 or less in parts.",budget:2000,goal:["g1440",85]},
  {name:"Free build",brief:"No rules. Try any mix of parts and see if it starts up. Mistakes cost nothing here.",budget:null,goal:null}
];
const SCORE_NAMES={work:"Everyday work",g1080:"1080p gaming",g1440:"1440p gaming"};
const sim={mission:0,slots:{},pick:"cpu",booted:false,timer:null};
function simTile(k){const id=sim.slots[k]; const p=id?P[id]:null;
  return `<button type="button" class="tile ${p?"full":""} ${sim.pick===k?"sel":""} t-${k}" data-slot="${k}"><span class="cat">${esc(CATS[k])}</span><span class="tname">${p?esc(p.name):"Empty slot"}</span><span class="tprice">${p?money(p.price):"Choose a part"}</span></button>`;}
function renderSim(){
  const m=MISSIONS[sim.mission];
  $("missions").innerHTML=MISSIONS.map((x,i)=>`<button type="button" class="chip ${i===sim.mission?"on":""}" data-m="${i}">${esc(x.name)}</button>`).join("");
  $("brief").textContent=m.brief;
  const cost=simCost(sim.slots);
  if(m.budget){const pct=Math.min(100,Math.round(cost/m.budget*100)); $("meterBar").style.width=pct+"%"; $("meterBar").className=cost>m.budget?"over":""; $("meterText").textContent=`${money(cost)} of ${plainMoney(m.budget)} spent`+(cost>m.budget?`, ${money(cost-m.budget)} over`:"");}
  else{$("meterBar").style.width="0%"; $("meterText").textContent=`${money(cost)} in parts`;}
  $("tower").innerHTML=SLOTS.map(simTile).join("");
  const list=Object.entries(P).filter(([,p])=>p.cat===sim.pick);
  $("shelfTitle").textContent="Parts shelf: "+CATS[sim.pick];
  $("shelf").innerHTML=list.map(([id,p])=>`<button type="button" class="part ${sim.slots[sim.pick]===id?"on":""}" data-part="${id}"><span><b>${esc(p.name)}</b><br><span class="spec">${esc(p.spec)}</span></span><span class="price">${money(p.price)}</span></button>`).join("")+(sim.slots[sim.pick]?`<button type="button" class="btn ghost" data-part="">Remove this part</button>`:"");
  $("toAdvisor").disabled=!sim.booted;
}
function simInvalidate(){ sim.booted=false; clearTimeout(sim.timer); $("post").textContent="Parts changed. Press Power on to test the build."; $("simResult").innerHTML=""; }
function powerOn(){
  clearTimeout(sim.timer);
  const checks=simChecks(sim.slots); const post=$("post"); post.textContent="TechByte Build Bench\nStarting self test...\n"; $("simResult").innerHTML="";
  const firstFail=checks.findIndex(c=>!c.ok); const shown=firstFail===-1?checks:checks.slice(0,firstFail+1);
  let i=0;
  const next=()=>{
    if(i<shown.length){const c=shown[i++]; post.textContent+=`[${c.ok?" OK ":"FAIL"}] ${c.label}: ${c.text}\n`; post.scrollTop=post.scrollHeight; sim.timer=setTimeout(next,PAUSE?260:0); return;}
    const ok=firstFail===-1; sim.booted=ok;
    post.textContent+=ok?"\nSelf test passed. Loading Windows... Welcome!":"\nThe PC did not start. Fix the failed check and power on again.";
    post.scrollTop=post.scrollHeight; simFinish(ok,checks); renderSim();
  };
  next();
}
function simFinish(ok,checks){
  const m=MISSIONS[sim.mission]; const cost=simCost(sim.slots);
  if(!ok){
    const more=checks.filter(c=>!c.ok).length-1;
    $("simResult").innerHTML=`<div class="result bad"><h4>It did not start</h4><p>${esc(checks.find(c=>!c.ok).text)}${more>0?` There ${more===1?"is 1 more problem":`are ${more} more problems`} after this one.`:""}</p><p class="spec">This is the same order a technician checks a PC that will not start: power first, then the board, processor, memory, display, and boot drive.</p></div>`;
    return;
  }
  const sc=simScores(sim.slots);
  const bars=Object.keys(SCORE_NAMES).map(k=>`<div class="bar"><span>${SCORE_NAMES[k]}</span><div class="track"><div style="width:${sc[k]}%"></div></div><b>${sc[k]}</b></div>`).join("");
  let head="It starts up", note="Free build: there is no goal here. Try a mission to earn stars.", stars="";
  if(m.goal){
    const hit=sc[m.goal[0]]>=m.goal[1], inBudget=cost<=m.budget; const n=1+(hit?1:0)+(hit&&inBudget?1:0);
    stars=`<span class="stars" aria-label="${n} of 3 stars">${"★".repeat(n)}<i>${"★".repeat(3-n)}</i></span>`;
    head=n===3?"Mission complete":n===2?"So close":"It starts up";
    note=n===3?`You hit the goal with ${money(m.budget-cost)} to spare. A real customer would be happy with this build.`
      :n===2?`The score is high enough, but the parts cost ${money(cost-m.budget)} more than the customer can spend. Find a cheaper part that still meets the goal.`
      :`${SCORE_NAMES[m.goal[0]]} scored ${sc[m.goal[0]]}, and the goal is ${m.goal[1]}. ${m.goal[0]==="work"?"A faster processor or more memory raises this score.":"The graphics card matters most for gaming scores."}`;
  }
  $("simResult").innerHTML=`<div class="result good"><h4>${head} ${stars}</h4><p>${esc(note)}</p>${bars}<p class="spec">Scores are simulator estimates on a 0 to 100 scale, not real benchmarks.</p></div>`;
}

// ================= Instructions and knowledge editor =================
function store(k,v){try{if(v==null) localStorage.removeItem(k); else localStorage.setItem(k,v);}catch(_){}}
function load(k){try{return localStorage.getItem(k);}catch(_){return null;}}
function checkKB(obj){
  if(!obj||!Array.isArray(obj.articles)||!obj.articles.length) throw new Error('The knowledge file needs an "articles" list with at least one article.');
  obj.articles.forEach((a,i)=>{ if(!a.title||!Array.isArray(a.keywords)||!Array.isArray(a.steps)) throw new Error(`Article ${i+1} needs a "title", a "keywords" list, and a "steps" list.`); if(a.type!=="hardware"&&a.type!=="files") throw new Error(`Article ${i+1} ("${a.title}") needs "type" set to "hardware" or "files".`); });
  return obj;
}
function brainMsg(text,ok){const el=$("brainMsg"); el.textContent=text; el.className="pill "+(ok?"good":"bad");}
function fillBrain(){ $("instr").value=INSTR; $("kb").value=JSON.stringify(KB,null,1); $("kbCount").textContent=`${KB.articles.length} articles`; }
function applyBrain(){
  let obj; try{obj=checkKB(JSON.parse($("kb").value));}catch(e){brainMsg("Knowledge file not saved. "+e.message,false);return;}
  const ins=$("instr").value.trim(); if(!ins){brainMsg("Instructions cannot be empty.",false);return;}
  KB=obj; INSTR=ins; store("tb_kb",JSON.stringify(obj)); store("tb_instr",ins); fillBrain();
  brainMsg("Saved. The chatbot is now using your instructions and knowledge file.",true);
}
function restoreBrain(){ KB=DEFAULT_KB; INSTR=DEFAULT_INSTR; store("tb_kb",null); store("tb_instr",null); fillBrain(); brainMsg("Restored the original files.",true); }

// ================= Navigation and wiring =================
const VIEWS=["advisor","workflow","simulator","brain"];
function route(){
  const h=location.hash.slice(1); const v=VIEWS.includes(h)?h:"advisor";
  VIEWS.forEach(x=>{$("view-"+x).hidden=x!==v; $("nav-"+x).setAttribute("aria-current",x===v?"page":"false");});
}
window.addEventListener("hashchange",route);

$("ask").addEventListener("submit",e=>{e.preventDefault();const v=$("q").value;$("q").value="";handle(v,false);});
$("reset").addEventListener("click",resetChat);
$("tabBuild").addEventListener("click",()=>showTab(true));
$("tabCat").addEventListener("click",()=>showTab(false));
["optStorm","optWin","optDesk","tax"].forEach(id=>$(id).addEventListener("input",()=>{
  if(state.build&&!state.custom&&!state.example&&state.budget){state.build=makeBuild(state.profile,state.budget,opts(),taxPct(),null);}
  render();
}));
async function copyText(btn,txt,label){
  try{await navigator.clipboard.writeText(txt);btn.textContent="Copied";}catch(_){btn.textContent="Copy not allowed here";}
  setTimeout(()=>{btn.textContent=label;},1800);
}
$("copy").addEventListener("click",()=>{
  const items=allItems(); const t=totals(items,taxPct());
  copyText($("copy"),`TechByte Advisor build: ${state.build.title}\n`+items.map(it=>`- ${CATS[P[it.id].cat]}: ${P[it.id].name} (${money(P[it.id].price)})\n  Why: ${it.why}`).join("\n")+`\nSubtotal ${money(t.sub)}, tax ${money(t.tax)}, total ${money(t.total)}\nSample prices from November 2026. Check live prices before buying.`,"Copy build");
});
$("copyFollow").addEventListener("click",()=>copyText($("copyFollow"),$("follow").textContent,"Copy message"));
[["Gaming PC, $1,600","I want a gaming PC for about $1,600"],["PC will not turn on","My PC will not turn on"],["Deleted a file","I deleted a file by mistake"],["Small business, $900","I need a computer for my small business, about $900"]].forEach(([label,text])=>{
  const b=document.createElement("button"); b.type="button"; b.className="chip"; b.textContent=label; b.onclick=()=>handle(text,true); $("zapTests").appendChild(b);
});
$("missions").addEventListener("click",e=>{const b=e.target.closest("[data-m]"); if(!b) return; sim.mission=+b.dataset.m; simInvalidate(); renderSim();});
$("tower").addEventListener("click",e=>{const b=e.target.closest("[data-slot]"); if(!b) return; sim.pick=b.dataset.slot; renderSim();});
$("shelf").addEventListener("click",e=>{const b=e.target.closest("[data-part]"); if(!b) return; const id=b.dataset.part; if(id) sim.slots[sim.pick]=id; else delete sim.slots[sim.pick];
  if(id){const i=SLOTS.indexOf(sim.pick); const nextEmpty=SLOTS.slice(i+1).concat(SLOTS.slice(0,i)).find(k=>!sim.slots[k]&&!(k==="cooler"&&sim.slots.cpu&&P[sim.slots.cpu].cooler)); if(nextEmpty) sim.pick=nextEmpty;}
  simInvalidate(); renderSim();});
$("powerOn").addEventListener("click",powerOn);
$("simClear").addEventListener("click",()=>{sim.slots={};sim.pick="cpu";simInvalidate();$("post").textContent="Add parts, then press Power on.";renderSim();});
$("toAdvisor").addEventListener("click",()=>{
  if(!sim.booted) return;
  const prof=sim.slots.gpu?"gamer":"office"; state.profile=prof; state.budget=null; setDefaults(prof);
  setCustomBuild(prof,"My simulator build","Built by the customer on the TechByte Build Bench.",SLOTS.filter(k=>sim.slots[k]).map(k=>({id:sim.slots[k],why:"You picked this part in the simulator. Ask the Advisor if you want a second opinion on it."})));
  say("I loaded your simulator build onto the build sheet with tax and the compatibility checks. Ask me anything about it, or tell me your budget and I will suggest changes.");
  setChips(START_CHIPS.slice(0,3)); location.hash="advisor";
});
$("applyBrain").addEventListener("click",applyBrain);
$("restoreBrain").addEventListener("click",restoreBrain);

// Start up
(function boot(){
  const ins=load("tb_instr"), kb=load("tb_kb");
  if(ins) INSTR=ins;
  if(kb){try{KB=checkKB(JSON.parse(kb));}catch(_){KB=DEFAULT_KB;}}
  renderCatalog(); resetChat(); setStatus(); renderZap(); renderTickets(); renderSim(); fillBrain(); route();
  (async()=>{try{ if(window.claude&&typeof window.claude.use==="function"){ sample=await window.claude.use("sample"); setStatus(); } }catch(_){ sample=null; }})();
})();
})();
