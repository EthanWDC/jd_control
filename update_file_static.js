const fs = require('fs');

!(async () => {
  await update_file();
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    //$.done();
  })


async function update_file() {
    //修改jd_bean_sign.ts
    try{
	let cont_beansign = await fs.readFileSync(process.env.JDPATH + 'jd_bean_sign.ts', 'utf8');
 	//replace之后的内容稍有不同，防止重复replace
    	cont_beansign = cont_beansign.replace(/replace\(\/红包\/g, \'红包\\n\\n\'\)/, "replace(/\\n【签到号/g, '\\n\\n【签到号 ').replace(/号一/g, '号 1').replace(/号 二/g, '号 2').replace(/号 三/g, '号 3').replace(/号 四/g, '号 4').replace(/号 五/g, '号 5').replace(/号 六/g, '号 6').replace(/号 七/g, '号 7').replace(/号 八/g, '号 8').replace(/号 九/g, '号 9').replace(/号 十/g, '号 10')");
	await fs.writeFileSync(process.env.JDPATH + 'jd_bean_sign.ts', cont_beansign, 'utf8');
    	console.log("jd_bean_sign.ts已成功修改!");
    }catch(e){
    	console.log("jd_bean_sign.ts修改失败...");
	console.log(e);
    }	
	
    //修改jd_fruit_help.ts
    try{
	let cont_fruithelp = await fs.readFileSync(process.env.JDPATH + 'jd_fruit_help.ts', 'utf8');
 	//replace之后的内容稍有不同，防止重复replace
    	cont_fruithelp = cont_fruithelp.replace(/\`【助力已领取】/, '\`【京东账号\${index+1}】\${UserName}\\n【助力已领取】');
	cont_fruithelp = cont_fruithelp.replace(/message\s*\+\=\s*\'\\n\\n\'/, '');        
	await fs.writeFileSync(process.env.JDPATH + 'jd_fruit_help.ts', cont_fruithelp, 'utf8');
    	console.log("jd_fruit_help.ts已成功修改!");
    }catch(e){
    	console.log("jd_fruit_help.ts修改失败...");
	console.log(e);
    }	
	
	//修改jd_speed_coin.js
	try{
		let cont_speed = await fs.readFileSync(process.env.JDPATH + 'jd_speed_coin.js', 'utf8');
 		//replace之后的内容稍有不同，防止重复replace
    		cont_speed = cont_speed.replace(/\$\.msg\(\$\.name\,\s*\'\'\,\s*\`京东账号\$\{\$\.index\}\$\{\$\.nickName\}\\n\$\{message\}\`\)\;/, "\$.msg(\$.name, \'\', \`【京东账号\${\$.index}】\${\$.nickName}\\n\${message}\`);const notify=require(process.env.JDPATH+\'sendNotify.js\');notify.sendNotify(\$.name, \`【京东账号\${\$.index}】\${\$.nickName}\\n\${message}\`);");
		await fs.writeFileSync(process.env.JDPATH + 'jd_speed_coin.js', cont_speed, 'utf8');
    		console.log("jd_speed_coin.js已成功修改!");
    }catch(e){
    	console.log("jd_speed_coin.js修改失败...");
	console.log(e);
    }
    //修改jd_bean_change.js
    try{
	let cont_beanchange = await fs.readFileSync(process.env.JDPATH + 'jd_bean_change.js', 'utf8');
 	//replace之后的内容稍有不同，防止重复replace
    	cont_beanchange = cont_beanchange.replace(/\(\$.levelName\s*\|\|\s*\$.JingXiang\)\s*\{/, '\(0\)\{');
	cont_beanchange = cont_beanchange.replace(/【账号\$\{IndexAll\}\s*\$\{\$.nickName\s*\|\|\s*\$.UserName\}】/, '【账号\$\{IndexAll\}】\$\{\$.nickName \|\| \$.UserName\}');        
	cont_beanchange = cont_beanchange.replace(/\+\s*allReceiveMessage/, '\+allReceiveMessage.replace(/\\n/,\"\\n\\n\")');
	cont_beanchange = cont_beanchange.replace(/\+\s*allWarnMessage/, '\+allWarnMessage.replace(/\\n/,\"\\n\\n\")');
	await fs.writeFileSync(process.env.JDPATH + 'jd_bean_change.js', cont_beanchange, 'utf8');
    	console.log("jd_bean_change.js已成功修改!");
    }catch(e){
    	console.log("jd_bean_change.js修改失败...");
	console.log(e);
    }
}
