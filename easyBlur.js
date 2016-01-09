function easyBlur(config){
    var ID = config.canvasId;
    var img = new Image();
    if(config.CORS !== false){
        img.crossOrigin = "Anonymous";
    }
    img.src = config.imgUrl;
    img.onload = function() {
        var ctx;
        var imageData;
        var img_width = img.width;
        var img_height = img.height;
        var canvas = document.getElementById(ID);
        document.getElementById('canvas').width = img_width;
        document.getElementById('canvas').height = img_height;
        ctx = canvas.getContext('2d');
        ctx.drawImage(this, 0, 0, img_width, img_height, 0, 0, img_width, img_height);
        imageData = ctx.getImageData(0, 0, img_width,img_height);
        imageData.data = blur(imageData, 10);
        ctx.putImageData(imageData, 0, 0);
        function blur(imageData, radius, sigma){
            console.log("running ...");
            var data = imageData.data;
            var radius = radius || 5;
            var sigma = sigma || radius/3;
            var a = 1 / (sigma * Math.sqrt(2 * Math.PI));
            var b = -1 / (2*sigma*sigma);
            var arr = [];//权重
            var arrSum = 0,
                x, y,
                i, j,
                re,t,
                len,
                r,g,b,a;
            var w = imageData.width;
            var h = imageData.height;

            function gauss(x){
                return a * Math.exp(b*x*x );
            }
            for(i = -radius; i <= radius; i++){
                re = gauss(i);
                arr.push(re);
                arrSum += re;
            }
            for(len = 0; len < arr.length; len++){
                arr[len] /= arrSum;//权重,总和为 1
            }
            //按行进行模糊
            for(y = 0; y < h; y++){
                for(x = 0; x < w; x++){
                    r = g = b = a = 0;
                    arrSum = 0;
                    for(j = -radius; j < radius; j++){
                        t = x + j;
                        if(t >= 0 && t < w){
                            r += data[(w*y+t)*4] * arr[j+radius];
                            g += data[(w*y+t)*4+1] * arr[j+radius];
                            b += data[(w*y+t)*4+2] * arr[j+radius];
                            arrSum += arr[j+radius];
                        }
                    }
                    i = (w*y+x)*4;
                    data[i  ] = ~~(r/arrSum);
                    // console.log(arrSum);
                    data[i+1] = ~~(g/arrSum);
                    data[i+2] = ~~(b/arrSum);
                }
            }
            //按列进行模糊
            for(x = 0; x < w; x++){
                for(y = 0; y < h; y++){
                    r = g = b = a = 0;
                    arrSum = 0;
                    for(j = -radius; j < radius; j++){
                        t = y+j;
                        if(t >= 0 && t < h){
                            r += data[(w*t+x)*4] * arr[j+radius];
                            g += data[(w*t+x)*4+1] * arr[j+radius];
                            b += data[(w*t+x)*4+2] * arr[j+radius];
                            arrSum += arr[j+radius];
                        }
                    }
                    i = (w*y+x)*4;
                    data[i  ] = ~~(r/arrSum);
                    data[i+1] = ~~(g/arrSum);
                    data[i+2] = ~~(b/arrSum);
                }
            }
            return data;
        }
    };
}
