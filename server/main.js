const pfs = require('./pfs');
const fs = require('fs');
const InterfaceServer = require('./interfaceServer');

let iserver = new InterfaceServer();

iserver.listen();

// 设置接口函数
iserver.door['/getdir/'] = async(param) => {
    let data;

    // 判断类型
    switch (param.type) {
        case "getdir":
            try {
                // 获取目录
                let dirdata = await pfs.readdir(param.path);

                // 判断是否是目录
                let arrdata = await Promise.all(dirdata.map(async(e) => {
                    let filepath = param.path.replace(/\/$/, "") + '/' + e;

                    // 获取相关信息
                    let d = await pfs.stat(filepath);

                    // 获取是否有进一步读取权限
                    let permit_d = await pfs.permit(filepath);

                    return {
                        size: d.size,
                        isdir: d.isDirectory(),
                        atimeMs: d.atimeMs,
                        mtimeMs: d.mtimeMs,
                        ctimeMs: d.ctimeMs,
                        birthtimeMs: d.birthtimeMs,
                        p: filepath,
                        permit: permit_d
                    };
                }));

                data = {
                    stat: 1,
                    data: arrdata
                };
            } catch (e) {
                data = {
                    stat: 0,
                    msg: "没有权限"
                };
                console.log(e);
            }
            break;
        default:
            data = {
                stat: 0
            };
    }

    return data;
}