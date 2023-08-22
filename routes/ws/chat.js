var express = require("express");
var router = express.Router();
const { sendRes } = require("../../utlis/resTemplete");
const expressWs = require("express-ws");
const { log } = require("debug/src/browser");
expressWs(router);
//创建一个ws链接队列
const wsOnlineMap = new Map();
const msgStack = new Map();
router.ws("/testWs", (ws, req) => {
    //log(req.query)
    ws.userid = req.query.user;
    const haveMsg = msgStack.get(ws.userid) || {}
    log(Object.keys(haveMsg).length)
    if(Object.keys(haveMsg).length!==0 ){
        try{
            ws.send(new sendRes({
                //'msglist','',200,'','',JSON.stringify(haveMsg)
                type:'msglist',
                code:200,
                data:haveMsg
            }).toString())
            msgStack.delete(ws.userid)
        }catch(e){
            log(e)
            //'error','数据获取异常',200
            ws.send(new sendRes({type:'error',msg:'数据获取异常',code:200}).toString)

        }
    }

    wsOnlineMap.set(ws.userid, ws);
    console.log("链接成功");
    ws.on("message", (data) => {
        const getData = JSON.parse(data);
        const toNum = getData.to;
        //log(getData.to)
        //处理消息
        //const toMsg = {
        //  msg : getData.msg,
        //  from:ws.username,
        //  to:getData.to,
        //}
        const toMsg = new sendRes({
            type:"msg",
            msg:getData.msg,
            code:200,
            to:toNum,
            from:ws.userid
        }
        );
        try {
            //获取收消息的ws链接

            wsOnlineMap.get(toNum).send(toMsg.toString());
        } catch (e) {
            //"判断错误"
            //数据库查询是否有这个用户，如果没有
            if (false) {
                ws.send(
                    new sendRes({type:"error", msg:"系统错误",code: 444}).toString()
                );
            } else {
                //离线消息
                //ws.send(new sendRes('error',"暂时不在",400,getData.to,ws.username).toString())
                const msgLib = msgStack.get(toNum) || {};
                const SendeMsg = msgLib?.[ws.userid] || [];
                SendeMsg.push(toMsg);
                msgLib[ws.userid] = SendeMsg;
                msgStack.set(toNum, msgLib);
            }
        }
    });
    ws.on("close", (e) => {
        log("关闭链接", e);
        wsOnlineMap.delete(req.query.user);
    });
});
module.exports = router;
