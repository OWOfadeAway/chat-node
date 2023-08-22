var express = require("express");
var router = express.Router();
const { sendRes } = require("../../utlis/resTemplete");
const expressWs = require("express-ws");
const { log } = require("debug/src/browser");
expressWs(router)
//所有的连接信息
const roomUser = []
const msgList = []

router.ws('/chatroom' , (ws,req)=>{
    //储存id
    
    console.log(req.query.user);
    ws.userid = req.query.user
    roomUser.push(ws)
    if(req.query.user == 'null'){
        log('空的')
        //ws.close()
        ws.send(new sendRes({code:444,type:'error',msg:''}.toString()))
    } else {
        ws.send(new sendRes({type:'chatroomListmsg',data:msgList,msg:new Date().toString()}).toString())

    }
    ws.on('message',(data)=>{
        data = JSON.parse(data)
        const newMsg = new sendRes({
            msg:data.msg,
            type:'chatroom',
            from:ws.userid
        })
        msgList.push(newMsg)
        if(msgList.length > 10){
            msgList.shift()
        }
        //广播消息
        for(let i in roomUser){
            try{
                if(roomUser[i].userid !== ws.userid){
                    roomUser[i].send(newMsg.toString())
                }
            }catch(e){
                log(e)
            }
        }
    })
    ws.on('close',()=>{
        roomUser.splice(roomUser.indexOf(ws) , 1)
    })
})

module.exports = router