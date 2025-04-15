function setFontSize() {
    // 获取视口宽度
    const viewportWidth = Math.max(1024, Math.min(window.innerWidth, 1920));

    
    // 根据视口宽度动态计算 font-size
    // 示例：假设设计稿宽度为 1024px，基准字体为 28px
    const baseWidth = 1024; // 设计稿宽度
    const baseFontSize = 28; // 基准字体大小
    const fontSize = (viewportWidth / baseWidth) * baseFontSize;

    // 设置 html 的 font-size
    document.documentElement.style.fontSize = `${fontSize}px`;
}

// 初始化设置
setFontSize();

// 监听窗口大小变化，实时更新 font-size
window.addEventListener("resize", setFontSize);


(function(){
    const circle = document.getElementById('circle')  //getElementById的用法
    
    let timer = null
    document.getElementById('body').addEventListener('mouseenter', function(){
        const random = () => {
            function getrandom(){
                const countrandom = Math.random()
                if(countrandom > 0.1 && countrandom < 0.9) return countrandom
                else return getrandom()
            }
            // 检验getrandom
            // const arr = []
            // for(let i=0;i<100;i++){
            //     arr.push( getrandom() )}
            // console.log(arr);
            
            circle.style.top = `${window.innerHeight * getrandom()}px`
            circle.style.left = `${window.innerWidth * getrandom()}px`
        }
        random()
        timer = setInterval(random, 2000)
    })

    document.getElementById('body').addEventListener('mouseleave', function(){
        clearInterval(timer)
    })
}())