'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=__dirname,legacy=path.resolve(root,'../b1-a');
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.ttf':'font/ttf','.woff2':'font/woff2','.txt':'text/plain','.webp':'image/webp','.png':'image/png'};
const assets=new Map();
for(const name of ['index.html','brand.html','site.css','site.js','story.css','story.js','fonts.css','assets/coaching-editorial.webp','assets/mark.svg','assets/mark-ink.svg','assets/mark-white.svg'])assets.set('/'+name,path.join(root,name));
assets.set('/story.html',path.join(root,'index.html'));
const visual=path.resolve(root,'../landing-v3');
assets.set('/directions/',path.join(visual,'index.html'));
const specimen=path.resolve(root,'../coaching-specimen');
assets.set('/',path.join(specimen,'index.html'));
assets.set('/coaching/',path.join(specimen,'index.html'));
for(const name of ['specimen.css','specimen.js','assets/coaching-afternoon.png','assets/mark.svg'])assets.set('/coaching/'+name,path.join(specimen,name));
assets.set('/design/',path.join(visual,'index.html'));
for(const name of ['design.css','ui.css','design.js'])assets.set('/design/'+name,path.join(visual,name));
for(const name of fs.readdirSync(path.join(root,'assets/fonts')))if(/\.(ttf|woff2)$/.test(name))assets.set('/assets/fonts/'+name,path.join(root,'assets/fonts',name));
for(const name of ['index.html','styles.css','refresh.css','app.js','charts.js'])assets.set('/demo/'+name,path.join(legacy,name));
assets.set('/demo/',path.join(legacy,'index.html'));
http.createServer((req,res)=>{
 const pathname=new URL(req.url,'http://127.0.0.1:3102').pathname,file=assets.get(pathname);
 res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; form-action 'none'; frame-ancestors 'none'; base-uri 'none'");
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
 if(!file||!['GET','HEAD'].includes(req.method)||!fs.existsSync(file)){res.writeHead(404);res.end('Not found');return;}
 const type=types[path.extname(file)]||'application/octet-stream';res.setHeader('Content-Type',type+(/^(text|image\/svg)/.test(type)?'; charset=utf-8':''));res.writeHead(200);if(req.method==='HEAD')res.end();else if(file===path.join(visual,'index.html')){let html=fs.readFileSync(file,'utf8');if(new URL(req.url,'http://127.0.0.1:3102').searchParams.get('direction')==='field')html=html.replace('data-direction="studio"','data-direction="field"').replace('data-direction-link="studio" aria-current="page"','data-direction-link="studio"').replace('data-direction-link="field"','data-direction-link="field" aria-current="page"');res.end(html);}else fs.createReadStream(file).pipe(res);
}).listen(3102,'127.0.0.1',()=>console.log('FitSync coaching specimen: http://127.0.0.1:3102 — local only'));
