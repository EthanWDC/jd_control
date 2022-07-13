/**
* 互助码数据库更新
* cron: 45 0-23/3,23 * * *
*/
import {getCookie, wait} from "/ql/data/scripts/JDHelloWorld_jd_scripts_main/TS_USER_AGENTS.ts";
import {bean, farm, pet, factory, sgmh, jxfactory, health} from "/ql/data/scripts/JDHelloWorld_jd_scripts_main/utils/shareCodesTool.ts";

//Ethan Added =====Start=====
//引入数据库
var mysql=require('mysql');

//实现本地链接
var pool = mysql.createPool({
    host: '107.150.5.114',
    user: 'autotask_read',
    password: 'mainsite#888!',
    database: 'autotask'
})

function db_query(sql){
   //使用promise函数只调函数执行完成时才会返回调用
   return new Promise(function(resolve, reject){
      pool.getConnection(function(err,conn){
         if(err) reject(err);
         else{
            conn.query(sql,function(err,rows){
               conn.release();
               if(err) reject(err);
               else{
                  conn.destroy();
                  resolve(rows);
               }
            })
         }
      })
   })
}
//Ethan Added =====End=====

let cookie: string = '', UserName: string, index: number
let beans: string = '', farms: string = '', healths: string = '', pets: string = '', factorys: string = '', jxfactorys: string = '', sgmhs: string = '', s: string = '';
let db_plantbean: string = '', db_fruit: string = '', db_health: string = '', db_pet: string = '', db_ddfactory: string = '', db_dreamfactory: string = '', db_sgmh: string = '';
let db_joy: string = '', db_bookshop: string = '', db_cash: string = '', db_jxnc: string = '', db_jdzz: string = '', db_cfd: string = '';
!(async () => {
  //let cookiesArr: string[] = await getCookie();
  //for (let i = 0; i < cookiesArr.length; i++) {
  let db_results: string[] = await db_query("SELECT * FROM `jd` WHERE active = 1 AND block = 0 ORDER BY sequence");
  for (let i = 0; db_results && i < db_results.length; i++) {
    //cookie = cookiesArr[i];
    cookie = db_results[i].jdcookie;
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);
    s = await bean(cookie)
    s ? beans += s + '&' : ''
    console.log('种豆得豆:', s)
    db_plantbean = s    //
      
    s = await farm(cookie)
    s ? farms += s + '&' : ''
    console.log('东东农场:', s)
    db_fruit = s    //
      
    s = await health(cookie)
    s ? healths += s + '&' : ''
    console.log('京东健康:', s)
    db_health = s   //
    
    s = await pet(cookie)
    s ? pets += s + '&' : ''
    console.log('东东萌宠:', s)
    db_pet = s  //
      
    s = await factory(cookie)
    s ? factorys += s + '&' : ''
    console.log('东东工厂:', s)
    db_ddfactory = s    //
      
    s = await jxfactory(cookie)
    s ? jxfactorys += s + '&' : ''
    console.log('京喜工厂:', s)
    db_dreamfactory = s //
      
    s = await sgmh(cookie)
    s ? sgmhs += s + '&' : ''
    console.log('闪购盲盒:', s)
    db_sgmh = s //
     
    //Ethan Added=====Start=====
    $.db_cash = ""
    await getJdCash()
    db_cash = $.db_cash
      
    //如果此次获取失败，但原来有，仍然保持原来
    if(!db_plantbean && db_results[i].plantbean){db_plantbean=db_results[i].plantbean;}
    if(!db_fruit && db_results[i].fruit){db_fruit=db_results[i].fruit;}
    if(!db_health && db_results[i].health){db_health=db_results[i].health;}
    if(!db_pet && db_results[i].pet){db_pet=db_results[i].pet;}
    if(!db_ddfactory && db_results[i].ddfactory){db_ddfactory=db_results[i].ddfactory;}
    if(!db_dreamfactory && db_results[i].dreamfactory){db_dreamfactory=db_results[i].dreamfactory;}
    if(!db_sgmh && db_results[i].sgmh){db_sgmh=db_results[i].sgmh;}

    if(!db_joy && db_results[i].joy){db_joy=db_results[i].joy;}
    if(!db_bookshop && db_results[i].bookshop){db_bookshop=db_results[i].bookshop;}
    if(!db_cash && db_results[i].cash){db_cash=db_results[i].cash;}
    if(!db_jxnc && db_results[i].jxnc){db_jxnc=db_results[i].jxnc;}
    if(!db_jdzz && db_results[i].jdzz){db_jdzz=db_results[i].jdzz;}
    if(!db_cfd && db_results[i].cfd){db_cfd=db_results[i].cfd;}

    let db_sql = `update jd set fruit='${db_fruit}',pet='${db_pet}',plantbean='${db_plantbean}',ddfactory='${db_ddfactory}',dreamfactory='${db_dreamfactory}',joy='${db_joy}',bookshop='${db_bookshop}',cash='${db_cash}',jxnc='${db_jxnc}',sgmh='${db_sgmh}',jdzz='${db_jdzz}',cfd='${db_cfd}',health='${db_health}' WHERE userid = '${db_results[i].userid}'`;
    try{
        //console.log(db_sql);
        //await db_query(db_sql);
        console.log("将互助码提交到数据库成功！\n");
    }catch(e){
        console.log("DB update error, continue...\n");
        continue;
    }
    //Ethan Added=====End=====
    await wait(5000)
  }
  console.log('/bean', beans.substring(0, beans.length - 1))
  console.log('/farm', farms.substring(0, farms.length - 1))
  console.log('/health', healths.substring(0, healths.length - 1))
  console.log('/pet', pets.substring(0, pets.length - 1))
  console.log('/factory', factorys.substring(0, factorys.length - 1))
  console.log('/jxfactory', jxfactorys.substring(0, jxfactorys.length - 1))
  console.log('/sgmh', sgmhs.substring(0, sgmhs.length - 1))

})()
      /*                                  
function getCash() {
  const CASH_API_HOST = 'https://api.m.jd.com/client.action';
  function cash_taskUrl(functionId, body = {}) {
    return {
      url: `${CASH_API_HOST}?functionId=${functionId}&body=${escape(JSON.stringify(body))}&appid=CashRewardMiniH5Env&appid=9.1.0`,
      headers: {
        'Cookie': cookie,
        'Host': 'api.m.jd.com',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'Referer': 'http://wq.jd.com/wxapp/pages/hd-interaction/index/index',
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
      }
    }
  }
  return new Promise((resolve) => {
    $.get(cash_taskUrl("cash_mob_home",), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if(data.code===0 && data.data.result){
            
              console.log(`【账号${$.index}（${$.nickName || $.UserName}）签到领现金】${data.data.result.inviteCode}`);
              //console.log(`您的助力码为${data.data.result.inviteCode}`)
              $.db_cash = data.data.result.inviteCode; //Ethan Added
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
*/
