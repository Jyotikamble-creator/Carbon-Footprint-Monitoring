const http = require('http');
const https = require('https');
const util = require('util');
const urls = [
  'http://localhost:3000/',
  'http://localhost:3000/activities',
  'http://localhost:3000/factors/preview',
  'http://localhost:3000/admin/users',
  'http://localhost:5000/v1/activities'
];

function fetch(u){
  return new Promise((resolve)=>{
    const lib = u.startsWith('https') ? https : http;
    const req = lib.get(u, (res)=>{
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (c)=> body += c);
      res.on('end', ()=> resolve({ url: u, status: res.statusCode, headers: res.headers, body: body.slice(0, 1200) }));
    });
    req.on('error', (e)=> {
      try{
        const inspected = util.inspect(e, { depth: 3 });
        resolve({ url: u, error: inspected });
      }catch(err){
        resolve({ url: u, error: String(e) });
      }
    });
    req.setTimeout(5000, ()=>{ req.abort(); resolve({ url: u, error: 'timeout' }); });
  });
}

(async ()=>{
  for(const u of urls){
    const r = await fetch(u);
    console.log('---');
    console.log('URL:', r.url);
    if(r.error){
      console.log('ERROR:', r.error);
      continue;
    }
    console.log('STATUS:', r.status);
    console.log('HEADERS:', Object.keys(r.headers).slice(0,10).map(k=>`${k}: ${r.headers[k]}`).join(' | '));
    console.log('BODY_EXCERPT:\n', r.body);
  }
})();
