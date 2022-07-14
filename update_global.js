/**
* 更新环境变量
* cron: 0-59/5 * * * *
*/

const $ = new Env('更新环境变量');
const notify = $.isNode() ? require(process.env.JDPATH + 'sendNotify.js') : '';

const fs = require('fs');
const download = require('download');
const exec = require('child_process').execSync;

var sd = require('silly-datetime');

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

Array.prototype.contains = function (obj) { 
	var index = this.length; 
	while (index--) { 
     	if (this[index] === obj) { 
         	return index; 
     	} 
	} 
	return -1; 
}

!(async () => {
  $.cookies_py = [];
  $.db_results = await db_query("SELECT * FROM `jd` WHERE active = 1 AND block = 0 ORDER BY sequence");
  await update_env($.db_results);
  await update_file($.db_results);
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    //$.done();
  })


async function update_env(results) {
	let jdcookies = [];
	let users = [];
	let fruit = [];
	let pet = [];
	let plantbean = [];
	let ddfactory = [];
	let dreamfactory = [];
	let joy = [];
	let bookshop = [];
	let cash = [];
	let jxnc = [];
	let sgmh = [];
	let jdzz = [];
	let cfd = [];
	let health = [];
	for (let i=0;i<results.length;i++){
    	//判断重复cookie
    	let contains_i = jdcookies.contains(results[i].jdcookie);
    	if( contains_i != -1){
        	console.log(`【账号${i+1}-${results[i].userid}】与【账号${contains_i+1}-${results[contains_i].userid}】的cookie重复，执行暂停机制\n${results[i].jdcookie}`);
        	await db_query(`UPDATE jd set active = 0 WHERE userid='${results[i].userid}'`);
        	if ($.isNode()) {
                let QYWX_AM = "wwf6b6a7bfc4965863,YSUKVdy3aRS1cEVhwsZdw7BnZbI41mSvgjVujJwYh8U," + results[i].userid + ",1000002,2";
            	try{
    				await qywxamNotify(`提交重复cookie`, `您所提交的cookie与用户${results[contains_i].userid}的一样，京东管家已被暂停，请重新提交cookie后激活。`, QYWX_AM);
                }catch(e){}
                //发送到专用App
            	QYWX_AM = "wwf6b6a7bfc4965863,PwARUNVQPOx2NhLuJoEdt9b0FREnGvsEHFmSR4R0Ius," + results[i].userid + ",1000011,2";
            	try{	
            		await qywxamNotify(`提交重复cookie`, `您所提交的cookie与用户${results[contains_i].userid}的一样，京东管家已被暂停，请重新提交cookie后激活。\n\ud83d\udd14本应用仅作失效提醒，不推送其他任何信息，请保持关注。不接受任何交互，请移步去"京东管家"进行操作。`, QYWX_AM);
                }catch(e){}
            }
        	continue;
        }
    	//检查cookie有效性
    	let currentCookie = results[i].jdcookie;
      	$.UserName = decodeURIComponent(currentCookie.match(/pt_pin=([^; ]+)(?=;?)/) && currentCookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      	$.isLogin = true;
    	await TotalBean(currentCookie);
     	if (!$.isLogin) {
        	console.log(`【账号${i+1}-${results[i].userid}】的cookie失效，执行暂停机制`);
        	await db_query(`UPDATE jd set active = 0, expired_at = '${sd.format(new Date(), "YYYY-MM-DD HH:mm:ss")}' WHERE userid='${results[i].userid}'`);
        	if ($.isNode()) {
   				//京东管家App     	
            	let QYWX_AM = "wwf6b6a7bfc4965863,YSUKVdy3aRS1cEVhwsZdw7BnZbI41mSvgjVujJwYh8U," + results[i].userid + ",1000002,2";
            	try{	
            		await qywxamNotify(`京东cookie已失效`, `京东账号 ${$.UserName}\n您的京东管家因cookie失效将被暂停。请重新提交cookie后激活。`, QYWX_AM);
                }catch(e){}
            	//发送到专用App
            	QYWX_AM = "wwf6b6a7bfc4965863,PwARUNVQPOx2NhLuJoEdt9b0FREnGvsEHFmSR4R0Ius," + results[i].userid + ",1000011,2";
            	try{	
            		await qywxamNotify(`京东cookie已失效`, `京东账号 ${$.UserName}\n您的京东管家因cookie失效将被暂停。请重新提交cookie后激活。\n\ud83d\udd14本应用仅作失效提醒，不推送其他任何信息，请保持关注。不接受任何交互，请移步去"京东管家"进行操作。`, QYWX_AM);
                }catch(e){}
            }
        	continue;
      	}
    	
        jdcookies[jdcookies.length] = results[i].jdcookie;
    	users[users.length] = results[i].userid;
    	//互助码
    	fruit[fruit.length] = results[i].fruit;
    	pet[pet.length] = results[i].pet;
    	plantbean[plantbean.length] = results[i].plantbean;
    	ddfactory[ddfactory.length] = results[i].ddfactory;
    	dreamfactory[dreamfactory.length] = results[i].dreamfactory;
    	joy[joy.length] = results[i].joy;
    	bookshop[bookshop.length] = results[i].bookshop;
    	cash[cash.length] = results[i].cash;
    	jxnc[jxnc.length] = results[i].jxnc;
    	sgmh[sgmh.length] = results[i].sgmh;
    	jdzz[jdzz.length] = results[i].jdzz;	
    	cfd[cfd.length] = results[i].cfd;
    	health[health.length] = results[i].health;
    }

	let jd_cookie = jdcookies.join("&");
	$.jd_cookie_txt = jdcookies.join("\n"); //prepare cookie for JDCookie.txt
    	let jd_user = users.join("|");
	let fruit_sc = fruit.join("@"); //一个账号的sharecode
	let pet_sc = pet.join("@"); //一个账号的sharecode
	let plantbean_sc = plantbean.join("@"); //一个账号的sharecode
	let ddfactory_sc = ddfactory.join("@"); //一个账号的sharecode
	let dreamfactory_sc = dreamfactory.join("@"); //一个账号的sharecode
	let joy_sc = joy.join("@"); //一个账号的sharecode
	let bookshop_sc = bookshop.join("@"); //一个账号的sharecode
	let cash_sc = cash.join("@"); //一个账号的sharecode
	let jxnc_sc = jxnc.join("@"); //一个账号的sharecode
	let sgmh_sc = sgmh.join("@"); //一个账号的sharecode
	let jdzz_sc = jdzz.join("@"); //一个账号的sharecode
	let cfd_sc = cfd.join("@"); //一个账号的sharecode
	let health_sc = health.join("@"); //一个账号的sharecode
	
	if(jd_cookie && jd_user){
    	let ENV_JD_COOKIE = jd_cookie;
    	let ENV_QYWX_AM = "wwf6b6a7bfc4965863,YSUKVdy3aRS1cEVhwsZdw7BnZbI41mSvgjVujJwYh8U," + jd_user + ",1000002,2";
    	
    	let env_fruit_sc = [];
	let env_pet_sc = [];
	let env_plantbean_sc = [];
	let env_ddfactory_sc = [];
	let env_dreamfactory_sc = [];
	let env_joy_sc = [];
	let env_bookshop_sc = [];
	let env_cash_sc = [];
	let env_jxnc_sc = [];
	let env_sgmh_sc = [];
	let env_jdzz_sc = [];
    	let env_cfd_sc = [];
    	let env_health_sc = [];
    
    	for(let i=0;i<results.length;i++){
        	//将sharecode复制多份，满足每个账号都有一份
        	env_fruit_sc[i] = fruit_sc;
        	env_pet_sc[i] = pet_sc;
        	env_plantbean_sc[i] = plantbean_sc;
        	env_ddfactory_sc[i] = ddfactory_sc;
        	env_dreamfactory_sc[i] = dreamfactory_sc;
        	env_joy_sc[i] = joy_sc;
        	env_bookshop_sc[i] = bookshop_sc;
        	env_cash_sc[i] = cash_sc;
        	env_jxnc_sc[i] = jxnc_sc;
        	env_sgmh_sc[i] = sgmh_sc;
        	env_jdzz_sc[i] = jdzz_sc;
        	env_cfd_sc[i] = cfd_sc;
        	env_health_sc[i] = health_sc;
        }
      	let ENV_FRUITSHARECODES = env_fruit_sc.join("&");
    	let ENV_PETSHARECODES = env_pet_sc.join("&");
        let ENV_PLANT_BEAN_SHARECODES = env_plantbean_sc.join("&");
        let ENV_DDFACTORY_SHARECODES = env_ddfactory_sc.join("&");
        let ENV_DREAM_FACTORY_SHARE_CODES = env_dreamfactory_sc.join("&");
        let ENV_JDJOY_SHARECODES = env_joy_sc.join("&");
        let ENV_BOOKSHOP_SHARECODES = env_bookshop_sc.join("&");
        let ENV_JD_CASH_SHARECODES = env_cash_sc.join("&");
        let ENV_JXNC_SHARECODES = env_jxnc_sc.join("&");
        let ENV_JDSGMH_SHARECODES = env_sgmh_sc.join("&");
        let ENV_JDZZ_SHARECODES = env_jdzz_sc.join("&");
    	let ENV_JDCFD_SHARECODES = env_cfd_sc.join("&");
    	let ENV_JDHEALTH_SHARECODES = env_health_sc.join("&");
    
    	let content = "";
    	content += "JD_COOKIE=" + ENV_JD_COOKIE + "\n";
    	content += "QYWX_AM=" + ENV_QYWX_AM + "\n";
    	content += "FRUITSHARECODES=" + ENV_FRUITSHARECODES + "\n";
    	content += "PETSHARECODES=" + ENV_PETSHARECODES + "\n";
    	content += "PLANT_BEAN_SHARECODES=" + ENV_PLANT_BEAN_SHARECODES + "\n";
    	content += "DDFACTORY_SHARECODES=" + ENV_DDFACTORY_SHARECODES + "\n";
    	content += "DREAM_FACTORY_SHARE_CODES=" + ENV_DREAM_FACTORY_SHARE_CODES + "\n";
    	content += "JDJOY_SHARECODES=" + ENV_JDJOY_SHARECODES + "\n";
    	content += "BOOKSHOP_SHARECODES=" + ENV_BOOKSHOP_SHARECODES + "\n";
    	content += "JD_CASH_SHARECODES=" + ENV_JD_CASH_SHARECODES + "\n";
    	content += "JXNC_SHARECODES=" + ENV_JXNC_SHARECODES + "\n";
    	content += "JDSGMH_SHARECODES=" + ENV_JDSGMH_SHARECODES + "\n";
    	content += "JDZZ_SHARECODES=" + ENV_JDZZ_SHARECODES + "\n";
    	content += "JDCFD_SHARECODES=" + ENV_JDCFD_SHARECODES + "\n";
    	content += "JDHEALTH_SHARECODES=" + ENV_JDHEALTH_SHARECODES + "\n";
    
    	//城城现金，设置仅内部助力，前一个是gua，后一个是helloworld
    	content += "JD_CITY_HELPSHARE=false\nJD_CITY_HELPPOOL=false\n";
    	//城城现金，自动开启抽奖
    	let city_exchange_date = 16;
    	if ( new Date().getDate() >= city_exchange_date ){
        	content += "JD_CITY_EXCHANGE=true\n";
        	console.log(`${city_exchange_date}号已到，城城现金开启抽奖`);
        }

    	//特殊环境变量输出
    	//jd_zjb邀请码
    	content += "ZJB_INVITERPIN=/r7O04L0dK6sR9EVNTxTjA==\n";
    	//新的财富岛
    	content += "CFD_HELP_HW=false\nCFD_HELP_POOL=false\n";
    	//angryBean
    	content += "angryBeanMode=priority\nangryBeanPins=" + ENV_JD_COOKIE + "\n";
    	//angryKoi
    	content += "kois=" + ENV_JD_COOKIE + "\n";
    	//京喜-88红包-宝箱，设置内部助力优先
    	content += "HW_Priority=false\n";
    	//炸年兽，过期删除
    	//content += "ZNS=true\n";
    	//年货节，过期删除
    	//content += "gua_nhjRed_rebateCode=SCLyQi4\n";
    	//特殊环境变量输出============================
    
    	console.log("更新环境变量文件.env");
    	await fs.writeFileSync( process.env.JDPATH + '.env', content, 'utf8');      
    }
}

async function update_file(results) {
	//京喜工厂修改
	await updateTuanIdsCDN('https://raw.githubusercontent.com/gitupdate/updateTeam/master/shareCodes/jd_updateFactoryTuanId.json'); //获取京喜团活动ID
    
    	let content = await fs.readFileSync(process.env.JDPATH + 'jd_dreamFactory.js', 'utf8');
	//let replace_str = `(pin === '${results[0].dreamfactory}' || pin === '${results[1].dreamfactory}' || pin === '${results[2].dreamfactory}' || pin === '${results[3].dreamfactory}')`;
   	//content = content.replace(/\(pin === '(.*)'\)/, replace_str); //避免0,1,2,3账号被偷
	content = content.replace(/if\s*\(\$\.canHelp\)\s*await\s*joinLeaderTuan\(\);/, ``); //不加入作者的团
	content = content.replace(/await\s*JoinTuan\s*\(\s*item\s*\);/, `console.log("更正团号:"+$.tuanIds[1]);await JoinTuan($.tuanIds[1]);break;`); //只加入0号的团 ============现在是1号
	if ($.tuanIdS && $.tuanIdS.tuanActiveId) {
    	content = content.replace(/let\s*tuanActiveId\s*=\s*`(.*)`;/, "let tuanActiveId = `"+$.tuanIdS.tuanActiveId+"`;"); 
    	console.log("TuanActiveId:" + $.tuanIdS.tuanActiveId);
    	}

	//覆盖获取TuanActivityId源
	let json_address = 'https://raw.githubusercontent.com/gitupdate/updateTeam/master/shareCodes/jd_updateFactoryTuanId.json';
	content = content.replace(/https\:\/\/raw\.githubusercontent\.com\/JDHelloWorld\/jd_scripts\/main\/tools\/empty\.json/, json_address);

    	await fs.writeFileSync( process.env.JDPATH + 'jd_dreamFactory.js', content, 'utf8');
    	console.log("更新jd_dreamFactory.js完毕");

	//let cont_cookie = await fs.readFileSync('/custom/jdCookie.js', 'utf8');
	//await fs.writeFileSync( '/scripts/jdCookie.js', cont_cookie, 'utf8');
    	//console.log("覆盖jdCookie.js");
	//let cont_notify = await fs.readFileSync('/custom/sendNotify.js', 'utf8');
	//await fs.writeFileSync( '/scripts/sendNotify.js', cont_notify, 'utf8');
    	//console.log("覆盖sendNotify.js");

	//将cookie提交到jdEnv.py
	try{
    	await fs.writeFileSync( process.env.JDPATH + 'JDCookies.txt', $.jd_cookie_txt, 'utf8');
    	console.log("cookie已成功提交到JDCookies.txt!");
    }catch(e){
    	console.log("将cookie提交到JDCookies.txt失败...");
    }
    //修改jd_bean_sign.ts
    try{
	let cont_beansign = await fs.readFileSync(process.env.JDPATH + 'jd_bean_sign.ts', 'utf8');
 	//replace之后的内容稍有不同，防止重复replace
    	cont_beansign = cont_beansign.replace(/replace\(\/红包\/g, \'红包\\n\\n\'\)/, "replace(/\\n【签到号/g, '\\n\\n【签到号 ').replace(/号一/g, '号 1').replace(/号 二/g, '号 2').replace(/号 三/g, '号 3').replace(/号 四/g, '号 4').replace(/号 五/g, '号 5').replace(/号 六/g, '号 6').replace(/号 七/g, '号 7').replace(/号 八/g, '号 8').replace(/号 九/g, '号 9').replace(/号 十/g, '号 10')");
	await fs.writeFileSync(process.env.JDPATH + 'jd_bean_sign.ts', cont_beansign, 'utf8');
    	console.log("jd_bean_sign.ts已成功修改!");
    }catch(e){
    	console.log("jd_bean_sign.ts修改失败...");
    }	
	
	//修改jd_speed_sign.js
	try{
		let cont_speed = await fs.readFileSync(process.env.JDPATH + 'jd_speed_sign.js', 'utf8');
 		//replace之后的内容稍有不同，防止重复replace
    		cont_speed = cont_speed.replace(/\$\.msg\(\$\.name\,\s*\'\'\,\s*\`京东账号\$\{\$\.index\}\$\{\$\.nickName\}\\n\$\{message\}\`\)\;/, "$.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n${message}`); notify.sendNotify($.name, `京东账号${$.index} ${$.nickName}\n${message}`);");
		await fs.writeFileSync(process.env.JDPATH + 'jd_speed_sign.js', cont_speed, 'utf8');
    		console.log("jd_speed_sign.js已成功修改!");
    }catch(e){
    	console.log("jd_speed_sign.js修改失败...");
    }
}

function updateTuanIdsCDN(url) {
  return new Promise(async resolve => {
    $.get({url,
      headers:{
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }}, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        } else {
          if (safeGet(data)) {
            $.tuanIdS = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
    await $.wait(3000)
    resolve();
  })
}

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}

function qywxamNotify(text, desp, QYWX_AM) {
  return new Promise(resolve => {
    if (QYWX_AM) {
      const QYWX_AM_AY = QYWX_AM.split(',');
      const options_accesstoken = {
        url: `https://qyapi.weixin.qq.com/cgi-bin/gettoken`,
        json: {
          corpid: `${QYWX_AM_AY[0]}`,
          corpsecret: `${QYWX_AM_AY[1]}`,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      $.post(options_accesstoken, (err, resp, data) => {
        html = desp.replace(/\n/g, "<br/>")
        var json = JSON.parse(data);
        accesstoken = json.access_token;
        let options;

        switch (QYWX_AM_AY[4]) {
          case '0':
            options = {
              msgtype: 'textcard',
              textcard: {
                title: `${text}`,
                description: `${desp}`,
                url: 'https://www.333234.xyz'
              }
            }
            break;

          case '1':
            options = {
              msgtype: 'text',
              text: {
                content: `${text}\n\n${desp}`
              }
            }
            break;
        
          case '2':
            options = {
              msgtype: 'news',
              news: {
			  	articles: [{
      				title: `${text}`,
      				description: `${desp}`,
      				url: null,
      				picurl: null
    			}]
  			  },
            }
            break;

          default:
            options = {
              msgtype: 'mpnews',
              mpnews: {
                articles: [
                  {
                    title: `${text}`,
                    thumb_media_id: `${QYWX_AM_AY[4]}`,
                    author: `智能助手`,
                    content_source_url: ``,
                    content: `${html}`,
                    digest: `${desp}`
                  }
                ]
              }
            }
        };
        if (!QYWX_AM_AY[4]) {
          //如不提供第四个参数,则默认进行文本消息类型推送
          options = {
            msgtype: 'text',
            text: {
              content: `${text}\n\n${desp}`
            }
          }
        }
        options = {
          url: `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${accesstoken}`,
          json: {
          	touser: `${QYWX_AM_AY[2]}`,
            agentid: `${QYWX_AM_AY[3]}`,
            safe: '0',
            ...options
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }

        $.post(options, (err, resp, data) => {
          try {
            if (err) {
              console.log('成员ID:' + QYWX_AM_AY[2] + '企业微信应用消息发送通知消息失败！！\n');              
            
              console.log(err);
            } else {
              data = JSON.parse(data);
              if (data.errcode === 0) {
                console.log('成员ID:' + QYWX_AM_AY[2] + '企业微信应用消息发送通知消息完成。\n'); 
              } else {
                console.log(`${data.errmsg}\n`);
              }
            }
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            resolve(data);
          }
        });
      });
    } else {
      console.log('您未提供企业微信应用消息推送所需的QYWX_AM，取消企业微信应用消息推送消息通知\n');
      resolve();
    }
  });
}

// 查询京东账户信息（检查 cookie 是否有效）
function TotalBean(currentCookie) {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": currentCookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
// prettier-ignore
function Env(t,s){return new class{constructor(t,s){this.name=t,this.data=null,this.dataFile="box.dat",this.logs=[],this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}getScript(t){return new Promise(s=>{$.get({url:t},(t,e,i)=>s(i))})}runScript(t,s){return new Promise(e=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=s&&s.timeout?s.timeout:o;const[h,a]=i.split("@"),r={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":h,Accept:"*/*"}};$.post(r,(t,s,i)=>e(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s);if(!e&&!i)return{};{const i=e?t:s;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s),o=JSON.stringify(this.data);e?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(s,o):this.fs.writeFileSync(t,o)}}lodash_get(t,s,e){const i=s.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return e;return o}lodash_set(t,s,e){return Object(t)!==t?t:(Array.isArray(s)||(s=s.toString().match(/[^.[\]]+/g)||[]),s.slice(0,-1).reduce((t,e,i)=>Object(t[e])===t[e]?t[e]:t[e]=Math.abs(s[i+1])>>0==+s[i+1]?[]:{},t)[s[s.length-1]]=e,t)}getdata(t){let s=this.getval(t);if(/^@/.test(t)){const[,e,i]=/^@(.*?)\.(.*?)$/.exec(t),o=e?this.getval(e):"";if(o)try{const t=JSON.parse(o);s=t?this.lodash_get(t,i,""):s}catch(t){s=""}}return s}setdata(t,s){let e=!1;if(/^@/.test(s)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(s),h=this.getval(i),a=i?"null"===h?null:h||"{}":"{}";try{const s=JSON.parse(a);this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i)}catch(s){const h={};this.lodash_set(h,o,t),e=this.setval(JSON.stringify(h),i)}}else e=$.setval(t,s);return e}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,s){return this.isSurge()||this.isLoon()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=t,this.writedata(),!0):this.data&&this.data[s]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,s=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,s)=>{try{const e=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(e,null),s.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)))}post(t,s=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t));else if(this.isNode()){this.initGotEnv(t);const{url:e,...i}=t;this.got.post(e,i).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t))}}time(t){let s={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in s)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?s[e]:("00"+s[e]).substr((""+s[e]).length)));return t}msg(s=t,e="",i="",o){const h=t=>!t||!this.isLoon()&&this.isSurge()?t:"string"==typeof t?this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0:"object"==typeof t&&(t["open-url"]||t["media-url"])?this.isLoon()?t["open-url"]:this.isQuanX()?t:void 0:void 0;$.isMute||(this.isSurge()||this.isLoon()?$notification.post(s,e,i,h(o)):this.isQuanX()&&$notify(s,e,i,h(o))),this.logs.push("","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="),this.logs.push(s),e&&this.logs.push(e),i&&this.logs.push(i)}log(...t){t.length>0?this.logs=[...this.logs,...t]:console.log(this.logs.join(this.logSeparator))}logErr(t,s){const e=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();e?$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){const s=(new Date).getTime(),e=(s-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,s)}

