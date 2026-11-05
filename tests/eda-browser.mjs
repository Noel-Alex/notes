import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base=process.env.EDA_BASE || 'http://127.0.0.1:8765/subjects/eda/fat/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const labs=['02-scaling','02-binning','03-corr','03-simpson','03-ts2','04-frequency','04-contingency','05-kmeans','05-text','06-som-worked','06-svd','06-factor','07-confusion','07-reg'];
const issues=[];
async function run(label,fn){try{await fn();console.log('✓ '+label)}catch(e){issues.push(label+': '+e.message);console.error('✗ '+label+': '+e.message)}}
const page=await browser.newPage({viewport:{width:1365,height:850}});
page.on('pageerror',e=>issues.push('desktop uncaught JS error: '+e.message));
page.on('response',r=>{if(r.status()>=400 && r.url().includes('127.0.0.1:8765'))issues.push('HTTP '+r.status()+': '+r.url())});
await run('Textbook loads without blank screen',async()=>{await page.goto(base,{waitUntil:'networkidle'});await page.locator('.module-tile').first().waitFor();assert.equal(await page.locator('.chapter-link').count(),50);assert.equal(await page.locator('.module-tile').count(),7)});
await run('All 50 lessons and source labels render',async()=>{const ids=await page.locator('.chapter-link').evaluateAll(nodes=>nodes.map(n=>n.dataset.id));for(const id of ids){await page.goto(base+'#read/'+id);await page.locator('.lesson-header h1').waitFor();assert.ok((await page.locator('.lesson-body').innerText()).length>300,'Tiny or missing '+id);assert.ok(await page.locator('.source-note').count(),'No source label '+id)}});
await run('Module pages and supplementary views',async()=>{for(let i=1;i<=7;i++){await page.goto(base+'#module/'+i);assert.ok(await page.locator('.chapter-card').count(),'Missing module '+i)}for(const [route,selector] of [['cover','.module-grid'],['formulas','.formula-item'],['practice','.feature-panel'],['sources','.summary-panel']]){await page.goto(base+'#'+route);assert.ok(await page.locator(selector).count(),'Missing '+route)}assert.equal(await page.locator('.summary-panel').count(),8)});
await run('Formula vault has 37 entries',async()=>{await page.goto(base+'#formulas');assert.equal(await page.locator('.formula-item').count(),37);await page.locator('.formula-item [data-go]').first().click();await page.locator('.lesson-header h1').waitFor()});
await run('Search filters by full lesson text',async()=>{await page.goto(base);await page.locator('#lessonSearch').fill('Simpson');assert.equal(await page.locator('.chapter-link:not(.hide)').count(),1);assert.match(await page.locator('#searchStatus').innerText(),/1 matching/);await page.locator('#lessonSearch').fill('')});
await run('Previous/next, mark read, persistence, recall',async()=>{await page.goto(base+'#read/05-kmeans');await page.locator('[data-action="next"]').click();await page.waitForURL(/#read\/05-hier$/);await page.locator('[data-action="prev"]').click();await page.waitForURL(/#read\/05-kmeans$/);await page.locator('[data-action="complete"]').click();assert.match(await page.locator('#sideProgressText').innerText(),/1 \/ 50/);await page.reload();assert.match(await page.locator('#sideProgressText').innerText(),/1 \/ 50/);await page.locator('[data-action="reveal"]').click();assert.ok(await page.locator('#recallAnswer').evaluate(n=>n.classList.contains('open')))});
await run('All 14 learning labs initialize and react',async()=>{for(const id of labs){await page.goto(base+'#read/'+id);await page.locator('#edaExperiment .laboutput').waitFor();let original=await page.locator('#edaExperiment .laboutput').innerText();assert.ok(original.length>20,'Lab output empty: '+id);assert.ok(!/NaN|Infinity/.test(original),'Lab invalid: '+id);const field=page.locator('#edaExperiment [data-field]').first();if(await field.count()){const tag=await field.evaluate(x=>x.tagName);if(tag==='SELECT'){const opts=await field.locator('option').evaluateAll(x=>x.map(o=>o.value));if(opts.length>1)await field.selectOption(opts[opts.length-1]);}else {const min=Number(await field.getAttribute('min')),max=Number(await field.getAttribute('max'));await field.fill(String(max===min?min:max));await field.dispatchEvent('input')}} else {const btn=page.locator('#edaExperiment [data-action-lab="advance"]');if(await btn.count())await btn.click()}let changed=await page.locator('#edaExperiment .laboutput').innerText();assert.ok(!/NaN|Infinity/.test(changed),'Lab invalid after input '+id);assert.ok(changed.length>20,'Lab broken '+id)}});
await run('Numerical workbook: 27 problems and filters',async()=>{await page.goto(new URL('workbook/',base).href);assert.equal(await page.locator('article.atlas-figure').count(),27);await page.locator('details.solution summary').first().click();assert.ok(await page.locator('details.solution').first().evaluate(n=>n.open));await page.locator('[data-filter="5"]').click();assert.equal(await page.locator('article.atlas-figure').count(),6);assert.equal(await page.locator('#quick a').count(),6);await page.locator('#searchAtlas').fill('impossible-query');assert.equal(await page.locator('article.atlas-figure').count(),0);assert.equal(await page.locator('#quick a').count(),0)});
const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
mobile.on('pageerror',e=>issues.push('mobile uncaught JS error: '+e.message));
await run('Mobile navigation and lesson opening',async()=>{await mobile.goto(base,{waitUntil:'networkidle'});await mobile.locator('[data-action="show-nav"]').click();await mobile.locator('.chapter-link').first().click();await mobile.locator('.lesson-header h1').waitFor();assert.ok((await mobile.locator('body').innerText()).includes('What EDA actually is'))});
await run('Mobile content fits viewport',async()=>{const sizes=await mobile.evaluate(()=>({body:document.documentElement.scrollWidth,viewport:window.innerWidth}));assert.ok(sizes.body<=sizes.viewport+14,'Horizontal overflow '+JSON.stringify(sizes))});

await run('Every lesson has expanded deep-study teaching and a quiz link',async()=>{
  await page.goto(base,{waitUntil:'networkidle'});
  assert.equal(await page.evaluate(()=>window.EDA_DEEP_COUNT),50,'Exactly 50 deep-study sections must be merged');
  const ids=await page.locator('.chapter-link').evaluateAll(nodes=>nodes.map(n=>n.dataset.id));
  for(const id of ids){
    await page.goto(base+'#read/'+id);
    await page.locator('.deep-study').waitFor();
    const wordCount=(await page.locator('.lesson-body').innerText()).split(/\s+/).length;
    assert.ok(wordCount>=420,id+': lesson remains too short at '+wordCount+' words');
    const quizLink=page.locator('.lesson-body a[href^="quiz/?chapter="]');
    assert.equal(await quizLink.count(),1,'Missing quiz deep link '+id);
    assert.equal(await quizLink.getAttribute('href'),'quiz/?chapter='+id,'Quiz link mismatch '+id);
  }
});
await run('Source ledger tracks all 24 files and filtered entries',async()=>{
  await page.goto(new URL('coverage/',base).href,{waitUntil:'networkidle'});
  assert.equal(await page.locator('.card').count(),24);
  await page.locator('[data-m="5"]').click();
  assert.equal(await page.locator('.card').count(),6);
  await page.locator('[data-m="all"]').click();
  await page.locator('#query').fill('SOM');
  assert.ok(await page.locator('.card').count()>=1);
  await page.locator('#query').fill('');
  await page.locator('.card .links a').first().click();
  await page.locator('.lesson-header h1').waitFor();
});
await run('Quiz studio loads 76 questions and chapter deep links',async()=>{
  await page.goto(new URL('quiz/',base).href,{waitUntil:'networkidle'});
  assert.equal(await page.evaluate(()=>window.EDA_QUIZ_BANK.length),76);
  const valid=await page.evaluate(()=>{
    const ids=window.EDA_QUIZ_BANK.map(q=>q[0]);
    return ids.length===76&&ids.every(id=>/^\d{2}-[\w-]+$/.test(id));
  });
  assert.ok(valid,'Quiz identifiers invalid');
  assert.equal(await page.locator('#dots button').count(),76);
  assert.equal(await page.locator('.choices .choice').count(),4);
  await page.locator('[data-answer="0"]').click();
  assert.ok(await page.locator('.feedback.wrong').count(),'Wrong answer explanation missing');
  assert.match(await page.locator('#progressStats').innerText(),/1 answered/);
  await page.reload();
  assert.ok(await page.locator('.feedback.wrong').count(),'Answered state failed to persist');
  await page.locator('[data-scope="wrong"]').click();
  assert.equal(await page.locator('#dots button').count(),1);
  await page.locator('[data-scope="all"]').click();
  await page.locator('[data-action="retry"]').click();
  assert.equal(await page.locator('.feedback').count(),0);
  await page.locator('[data-answer="1"]').click();
  assert.match(await page.locator('.feedback strong').innerText(),/Correct/);
  await page.locator('#moduleFilter').selectOption('6');
  assert.equal(await page.locator('#dots button').count(),8);
  await page.locator('#moduleFilter').selectOption('all');
  await page.locator('#shuffle').click();
  assert.equal(await page.locator('#dots button').count(),76);
  await page.goto(new URL('quiz/?chapter=06-svd',base).href);
  assert.ok((await page.locator('.qnumber').innerText()).includes('06-svd'),'Quiz deep link wrong');
});
await run('Mobile quiz and ledger fit viewport',async()=>{
  for(const rel of ['quiz/','coverage/']){
    await mobile.goto(new URL(rel,base).href,{waitUntil:'networkidle'});
    const sizes=await mobile.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:innerWidth}));
    assert.ok(sizes.scroll<=sizes.inner+14,rel+' overflow '+JSON.stringify(sizes));
  }
});

await browser.close();if(issues.length){console.error('\n'+issues.length+' failure(s):\n'+issues.join('\n'));process.exitCode=1}else console.log('ALL EDA BROWSER CHECKS PASSED');