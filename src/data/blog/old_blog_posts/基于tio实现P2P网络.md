---
author: Boyu Ren
pubDatetime: &id001 2021-05-15 00:02:18
modDatetime: *id001
title: 基于tio实现P2P网络
slug: 基于tio实现P2P网络
featured: false
draft: false
tags:
- tio
- P2P
- 区块链
description: ''
---

# 基于tio实现P2P网络结构

## 导入相关依赖
```xml
        <!-- swagger API框架-->
        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger2</artifactId>
            <version>2.9.2</version>
        </dependency>
        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger-ui</artifactId>
            <version>2.9.2</version>
        </dependency>

        <!-- tio Network framework 基于JVM的网络编程框架-->
        <dependency>
            <groupId>org.t-io</groupId>
            <artifactId>tio-core</artifactId>
            <version>3.7.0.v20201010-RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.16.22</version>
        </dependency>
```

## 创建数据包结构
```java
/**
 * 数据包
 */
@Data
public class MyPacket extends Packet {
    public static final Integer PACKET_HEADER_LENGTH=4; //信息包头部长度
    public static final Integer PORT=8999; //端口
    byte[] body; //信息包中存储的数据
}
```

## 服务器结构

```java
public class MyServerAioHandler implements ServerAioHandler{
    //日志记录
    private static final Logger logger=LoggerFactory.getLogger(MyServerAioHandler.class);

    @SneakyThrows
    @Override
    public Packet decode(ByteBuffer byteBuffer, int limit, int position, int readableLength, ChannelContext channelContext) throws TioDecodeException {
        logger.debug("inside decode...");

        if(MyPacket.PACKET_HEADER_LENGTH>readableLength){
            return null;
        }
        int bodyLength=byteBuffer.getInt();
        if(bodyLength<0){
            throw new TioDecodeException("body length [ "+bodyLength+" ] is invalid remote: "+channelContext.getServerNode());
        }
        int len=bodyLength+ MyPacket.PACKET_HEADER_LENGTH;
        if(len>readableLength){
            return null;
        }else {
            byte[] bytes=new byte[len];
            int i=0;
            while (true){
                if(byteBuffer.remaining()==0){
                    break;
                }
                byte b =byteBuffer.get();
                bytes[i++]=b;
            }
            MyPacket myPacket =new MyPacket();
            myPacket.setBody(bytes);
            String data=new String(bytes,"utf-8");
            return myPacket;
        }
    }

    @Override
    public ByteBuffer encode(Packet packet, TioConfig tioConfig, ChannelContext channelContext) {
        logger.debug("inside encode...");
        MyPacket myPacket = (MyPacket) packet;
        byte[] body= myPacket.getBody();
        int bodyLength=0;
        if(body!=null){
            bodyLength=body.length;
        }
        ByteBuffer byteBuffer=ByteBuffer.allocate(bodyLength+ MyPacket.PACKET_HEADER_LENGTH);
        byteBuffer.order(tioConfig.getByteOrder());
        byteBuffer.putInt(bodyLength);
        if(body!=null){
            byteBuffer.put(body);
        }

        String bodyStr = null;
        try {
            bodyStr = new String(body, "utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        System.out.println("bodyStr2:"+bodyStr);

        return byteBuffer;
    }

    @Override
    public void handler(Packet packet, ChannelContext channelContext) throws Exception {
        logger.debug("inside handler...");
        channelContext.setServerNode(new Node("127.0.0.1", MyPacket.PORT));
        MyPacket myPacket = (MyPacket) packet;
        byte[] body= myPacket.getBody();
        if(body!=null){
            String bodyStr=new String(body,"utf-8");
            MyPacket myPacket1 =new MyPacket();
            myPacket1.setBody((" receive from [ "+channelContext.getClientNode()+" ]: "+bodyStr).getBytes(StandardCharsets.UTF_8));
            Tio.send(channelContext, myPacket1);
        }
    }
}
```

```java
public class MyServerAioListener implements ServerAioListener {
    @Override
    public boolean onHeartbeatTimeout(ChannelContext channelContext, Long aLong, int i) {
        return false;
    }

    @Override
    public void onAfterConnected(ChannelContext channelContext, boolean b, boolean b1) throws Exception {

    }

    @Override
    public void onAfterDecoded(ChannelContext channelContext, Packet packet, int i) throws Exception {

    }

    @Override
    public void onAfterReceivedBytes(ChannelContext channelContext, int i) throws Exception {

    }

    @Override
    public void onAfterSent(ChannelContext channelContext, Packet packet, boolean b) throws Exception {

    }

    @Override
    public void onAfterHandled(ChannelContext channelContext, Packet packet, long l) throws Exception {

    }

    @Override
    public void onBeforeClose(ChannelContext channelContext, Throwable throwable, String s, boolean b) throws Exception {

    }
}
```

### 服务端

```java
@Component
public class MyTioServer {
    public String startupTio(){
        try {
            ServerTioConfig serverTioConfig=new ServerTioConfig("tio-server",new MyServerAioHandler(),new MyServerAioListener());
            TioServer server=new TioServer(serverTioConfig);
            TioServer tioServer=new TioServer(serverTioConfig);
            server.start("127.0.0.1",8999);
        } catch (IOException e) {
            System.out.println("出现异常："+e.getMessage());
            return "error!";
        }
        return "Startup Server OK!";
    }
}
```

## 客户端结构

```java
public class MyClientAioHandler implements ClientAioHandler {

    Logger logger= LoggerFactory.getLogger(MyClientAioHandler.class);

    @Override
    public Packet heartbeatPacket(ChannelContext channelContext) {
        return null;
    }

    @Override
    public Packet decode(ByteBuffer byteBuffer, int limit, int position, int readableLength, ChannelContext channelContext) throws TioDecodeException {
        if(MyPacket.PACKET_HEADER_LENGTH>readableLength){
            return null;
        }
        int bodyLength=byteBuffer.getInt();
        if(bodyLength<0){
            throw new TioDecodeException("body length [ "+bodyLength+" ] is invalid remote: "+channelContext.getServerNode());
        }

        int usefulLength=bodyLength+ MyPacket.PACKET_HEADER_LENGTH;
        if(usefulLength>readableLength){
            return null;
        }else {
            MyPacket packet=new MyPacket();
            byte[] body=new byte[bodyLength];
            byteBuffer.get(body);
            packet.setBody(body);
            return packet;
        }

    }

    @Override
    public ByteBuffer encode(Packet packet, TioConfig tioConfig, ChannelContext channelContext) {
        MyPacket clientPacket= (MyPacket) packet;
        byte[] body=clientPacket.getBody();
        int bodyLength=0;
        if(body!=null){
            bodyLength=body.length;
        }
        int len= MyPacket.PACKET_HEADER_LENGTH+bodyLength;
        ByteBuffer byteBuffer=ByteBuffer.allocate(len);
        byteBuffer.order(tioConfig.getByteOrder());
        byteBuffer.putInt(bodyLength);
        if(body!=null){
            byteBuffer.put(body);
        }
        return byteBuffer;
    }

    @Override
    public void handler(Packet packet, ChannelContext channelContext) throws Exception {
        MyPacket clientPacket= (MyPacket) packet;
        byte[] body=clientPacket.getBody();
        if(body!=null){
            String bodyStr=new String(body,"utf-8");
            logger.debug("客户端收到信息："+bodyStr);
        }
    }
}
```

```java
public class MyClientAioListener implements ClientAioListener {

    Logger logger= LoggerFactory.getLogger(MyClientAioListener.class);
    private static Integer count=0;

    @Override
    public void onAfterConnected(ChannelContext channelContext, boolean b, boolean b1) throws Exception {
        logger.info("onAfterConnected...");
    }

    @Override
    public void onAfterDecoded(ChannelContext channelContext, Packet packet, int i) throws Exception {
        logger.info("onAfterDecoded...");
    }

    @Override
    public void onAfterReceivedBytes(ChannelContext channelContext, int i) throws Exception {
        logger.info("onAfterReceivedBytes---------------------------"+i);
    }

    @Override
    public void onAfterSent(ChannelContext channelContext, Packet packet, boolean b) throws Exception {
        logger.info("onAfterSent...");
    }

    @Override
    public void onAfterHandled(ChannelContext channelContext, Packet packet, long l) throws Exception {
        System.out.println("onAfterHandled...");
        MyPacket clientPacket= (MyPacket) packet;
        String resData=new String(clientPacket.getBody(),"utf-8");
        logger.info("[ "+channelContext.getServerNode()+" ] : "+resData);
        count++;
        ((MyPacket)packet).setBody(("[ "+channelContext.getServerNode()+" ]: "+count).getBytes(StandardCharsets.UTF_8));
        Thread.sleep(5000);
        Tio.send(channelContext,packet);
    }

    @Override
    public void onBeforeClose(ChannelContext channelContext, Throwable throwable, String s, boolean b) throws Exception {
        logger.error(throwable.getMessage());
        logger.info(s);
    }
}
```

### 客户端
```java
@Component
public class MyTioClient {
    public String startupTio(){
        try {
            ClientTioConfig clientTioConfig=new ClientTioConfig(new MyClientAioHandler(),new MyClientAioListener());
            TioClient tioClient=new TioClient(clientTioConfig);
            System.out.println("tio连接开始...");
            MyPacket clientPacket=new MyPacket();
            clientPacket.setBody("hello,tio-ywrby".getBytes(StandardCharsets.UTF_8));
            ClientChannelContext clientChannelContext=tioClient.connect(new Node("127.0.0.1",8999));
            //clientPacket.setBody("hello,tio-ywrby".getBytes(StandardCharsets.UTF_8));
            //System.out.println("tio连接关闭...");
            Tio.send(clientChannelContext,clientPacket);
        } catch (Exception e) {
            System.out.println("出现异常："+e.getMessage());
            return "error!";
        }


        return "Startup Client OK!";
    }

    public void send(){

    }
}
```

## 控制层
```java
@RestController
public class MyTioController {
    @Autowired
    private MyTioServer tioServer;
    @Autowired
    private MyTioClient tioClient;

    @GetMapping("/server")
    public String server(){
        return tioServer.startupTio();
    }

    @GetMapping("/client")
    public String client(){
        return tioClient.startupTio();
    }
}
```