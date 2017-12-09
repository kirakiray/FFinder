const http = require('http');
const url = require('url');
const querystring = require('querystring');

// 公共response处理方法
let responeFun = async(respone, paramData, pathname, doorObj) => {
    // 获取注册函数
    let tar = doorObj[pathname];

    if (tar) {
        let data = await tar(paramData);

        // 最后的数据转换
        data = JSON.stringify(data);
        respone.writeHead(200, {
            'Content-Type': "application/json; charset=utf-8",
            'Access-Control-Allow-Origin': "*"
        });

        // 响应数据
        respone.end(data, 'utf-8');
    } else {
        respone.writeHead(404);
        respone.end();
    }
};

class InterServer {
    constructor() {
        // 入口查询对象
        let doorObj = {
            "/": async(data) => {
                return {
                    stat: 0
                };
            }
        };

        this.door = doorObj;

        // 生成服务器
        let server = http.createServer();

        this.server = server;

        // 监听请求
        server.on('request', async(request, respone) => {
            switch (request.method) {
                case "GET":
                    // url数据转换
                    var urldata = url.parse(request.url);

                    // 参数
                    let params = querystring.parse(urldata.query);

                    responeFun(respone, params, urldata.pathname, doorObj);
                    break;
                case "POST":
                    // url数据转换
                    var urldata = url.parse(request.url);

                    let postdata = "";
                    request.addListener("data", (postchunk) => {
                        postdata += postchunk;
                    });

                    //POST结束输出结果
                    request.addListener("end", () => {
                        let params;
                        if (request.headers['content-type'] == "application/x-www-form-urlencoded") {
                            params = querystring.parse(postdata);
                        } else {
                            params = JSON.parse(postdata);
                        }
                        responeFun(respone, params, urldata.pathname, doorObj);
                    });
                    break;
                default:
                    respone.writeHead(404);
                    respone.end();
            }
        });
    }
    listen(port = 8804) {
        this.server.listen(port);
    }
}
module.exports = InterServer;