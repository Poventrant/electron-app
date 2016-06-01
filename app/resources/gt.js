(function(window, document) {

    if (window.initGeetest) {
        return;
    }
    var head = document.getElementsByTagName("head")[0];
    var protocol = location.protocol + "//";
    var callbacks = [];
    var status = "init";
    var random = function() {
        return parseInt(Math.random() * 10000) + (new Date()).valueOf();
    };
    var run = function() {
        for (var i = 0, len = callbacks.length; i < len; i = i + 1) {
            callbacks[i]();
        }
        callbacks = [];
    };
    var detect = function() {
        return window.Geetest || document.getElementById("gt_lib");
    };
    var down = function(config) {
        var s = document.createElement("script");
        s.charset = "UTF-8";
        s.type = "text/javascript";
        s.onload = s.onreadystatechange = function() {
            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                if (detect()) {
                    status = "loaded";
                    run();
                } else {
                    status = "fail";
                    throw new Error("网络错误");
                }
                s.onload = s.onreadystatechange = null;
            }
        };
        s.onerror = function() {
            status = "fail";
            s.onerror = null;
            throw new Error("网络错误");
        };
        var staticServer = (config.staticservers && config.staticservers[0]) || "static.geetest.com/";
        s.src = protocol + staticServer + "static/js/geetest.0.0.0.js";
        head.appendChild(s);
    };

    var getLib = function(config) {
        status = "loading";
        var cb = "geetest_" + random();
        window[cb] = function() {
            status = "loaded";
            run();
            window[cb] = undefined;
            try {
                delete window[cb];
            } catch (e) {}
        };
        var s = document.createElement("script");
        s.charset = "UTF-8";
        s.type = "text/javascript";
        s.onload = s.onreadystatechange = function() {
            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                if (!detect()) {
                    down(config);
                }
            }
        };
        s.onerror = function() {
            down(config);
        };
        var apiServer = config.apiserver || "api.geetest.com/";
        s.src = "http://" + apiServer + "getfrontlib.php?gt=" + config.gt + "&callback=" + cb;
        // console.log(s)
        // head.appendChild(s);
        




        var request = http.request({
            method: 'GET',
            // host: '127.0.0.1',
            // port: '8888',
            host: 'api.geetest.com',
            path: "/getfrontlib.php?gt=" + config.gt + "&callback=" + cb,
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, sdch',
                'Accept-Language': 'zh-CN,zh;q=0.8',
                'Host': 'api.geetest.com',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
                'Referer': 'http://uems.sysu.edu.cn/jwxt/',
                'Connection': 'keep-alive'
            }
        }, function(res) {
            try {
                var data = "";
                res.on('data', function(chunk) {
                    data += chunk;
                }).on('end', function() {
                    var cookieStr = res.headers['set-cookie'].toString();
                    reg = new RegExp("(GeeTestUser=[^;]*)");
                    var geeTestUserCookie = cookieStr.match(reg)[1];
                    window.geeTestUserCookie = geeTestUserCookie;
                    window[cb]();

                });

            } catch (err) {
                console.error(err);
            }
        });
        request.on('error', function(e) {
            console.log(e);
        });
        request.end();







    };

    if (detect()) {
        status = "loaded";
    }

    window.initGeetest = function(config, callback) {
        if (typeof config.gt !== "string") {
            console.log(config.gt)
            throw new Error("")
        }
        var init = function() {
            callback(new window.Geetest(config));
        };
        if (status === "loaded") {
            init();
        } else if (status === "fail") {
            throw new Error("网络错误");
        } else if (status === "loading") {
            callbacks.push(function() {
                init();
            });
        } else if (status === "init") {
            callbacks.push(function() {
                init();
            });
            getLib(config);
        }
    };

})(window, document);