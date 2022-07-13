/**
* 互助码数据库更新
* cron: 45 0-23/3,23 * * *
*/
let JDPATH : string = "";
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
!(async () => {
  //let cookiesArr: string[] = await getCookie();
  //for (let i = 0; i < cookiesArr.length; i++) {
  let db_results: string[] = await db_query("SELECT * FROM `jd` WHERE active = 1 AND block = 0 ORDER BY sequence");
  for (let i = 0; db_results && i < db_results.length; i++) {
    let db_joy: string = '', db_bookshop: string = '', db_cash: string = '', db_jxnc: string = '', db_jdzz: string = '', db_cfd: string = '';
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
        await db_query(db_sql);
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


