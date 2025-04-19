document.addEventListener('DOMContentLoaded', function() {
    // 3秒倒计时
    let countdown = 3;
    const countdownElement = document.getElementById('countdown');
    const countdownNumber = document.getElementById('countdown-number');
    const container = document.querySelector('.container');
    
    const countdownInterval = setInterval(() => {
        countdown--;
        countdownNumber.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            countdownElement.style.opacity = '0';
            container.style.display = 'block';
            
            // 自动播放音乐
            const playButton = document.getElementById('playButton');
            const birthdaySong = document.getElementById('birthdaySong');
            birthdaySong.volume = 0.3;
            
            // 音乐控制功能
            const musicControl = document.getElementById('musicControl');
            let isPlaying = false;
            let isMuted = false;
            
            function updateControlIcon() {
                if (!isPlaying) {
                    musicControl.querySelector('.icon').textContent = '🔈';
                } else if (isMuted) {
                    musicControl.querySelector('.icon').textContent = '🔇';
                } else {
                    musicControl.querySelector('.icon').textContent = '🔊';
                }
            }

            function tryPlay() {
                birthdaySong.src = 'https://assets.mixkit.co/music/preview/mixkit-happy-birthday-880.mp3';
                birthdaySong.load(); // 确保音频加载
                birthdaySong.play()
                    .then(() => {
                        isPlaying = true;
                        updateControlIcon();
                    })
                    .catch(e => {
                        console.log('音乐播放失败:', e);
                        // 添加用户交互后重试
                        document.body.addEventListener('click', function once() {
                            birthdaySong.play().then(() => {
                                isPlaying = true;
                                updateControlIcon();
                            });
                            document.body.removeEventListener('click', once);
                        }, {once: true});
                        updateControlIcon();
                    });
            }

            // 点击控制
            musicControl.addEventListener('click', () => {
                if (isPlaying) {
                    if (isMuted) {
                        // 取消静音
                        isMuted = false;
                        birthdaySong.muted = false;
                    } else {
                        // 暂停
                        birthdaySong.pause();
                        isPlaying = false;
                    }
                } else {
                    // 播放
                    birthdaySong.play();
                    isPlaying = true;
                }
                updateControlIcon();
            });

            // 长按静音/取消静音
            let longPressTimer;
            musicControl.addEventListener('mousedown', () => {
                longPressTimer = setTimeout(() => {
                    if (isPlaying) {
                        isMuted = !isMuted;
                        birthdaySong.muted = isMuted;
                        updateControlIcon();
                    }
                }, 500);
            });

            musicControl.addEventListener('mouseup', () => {
                clearTimeout(longPressTimer);
            });

            musicControl.addEventListener('mouseleave', () => {
                clearTimeout(longPressTimer);
            });
            
            // 开始尝试播放
            tryPlay();
            
            // 移除倒计时元素
            setTimeout(() => {
                countdownElement.remove();
            }, 500);
        }
    }, 1000);

    // 设置蛋糕画布
    const canvas = document.getElementById('birthdayCake');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;

    let animationId;
    const candlePositions = [];
    
    function drawStaticCake() {
        // 蛋糕底座
        ctx.fillStyle = '#f9c5d1';
        ctx.beginPath();
        ctx.roundRect(100, 150, 200, 80, [0, 0, 20, 20]);
        ctx.fill();

        // 蛋糕顶层
        ctx.fillStyle = '#fce4ec';
        ctx.beginPath();
        ctx.roundRect(120, 100, 160, 50, [20, 20, 0, 0]);
        ctx.fill();

        // 蜡烛主体
        const candleCount = 5;
        const spacing = 160 / (candleCount + 1);
        candlePositions.length = 0;
        
        for (let i = 1; i <= candleCount; i++) {
            const x = 120 + (spacing * i);
            candlePositions.push(x);
            
            ctx.fillStyle = '#ffeb3b';
            ctx.fillRect(x - 3, 70, 6, 30);
        }

        // 装饰糖粒
        ctx.fillStyle = 'white';
        for (let i = 0; i < 30; i++) {
            const x = 100 + Math.random() * 200;
            const y = 150 + Math.random() * 80;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function animateFlames(time) {
        // 清除火焰区域
        ctx.clearRect(80, 50, 240, 30);
        
        // 绘制所有火焰
        candlePositions.forEach(x => {
            ctx.save();
            ctx.beginPath();
            const scale = 0.8 + Math.sin(time * 0.01) * 0.2;
            ctx.ellipse(x, 65, 5 * scale, 8 * scale, 0, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(x, 65, 0, x, 65, 8 * scale);
            gradient.addColorStop(0, 'yellow');
            gradient.addColorStop(0.5, 'orange');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.restore();
        });
        
        animationId = requestAnimationFrame(animateFlames);
    }

    function init() {
        drawStaticCake();
        animateFlames(Date.now());
    }

    init();

    // 点击重新绘制蛋糕
    canvas.addEventListener('click', function() {
        cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        init();
    });
});
