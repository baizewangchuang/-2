const gameContainer = document.getElementById('gameContainer');
        const divider = document.querySelector('.divider');
        const girlScore = document.getElementById('girlScore');
        const boyScore = document.getElementById('boyScore');
        const girl = document.getElementById('girl');
        const boy = document.getElementById('boy');
        
        let girlPoints = 0;
        let boyPoints = 0;
        let dividerPosition = 50; // 百分比

        // 在脚本中定义移动速度常量
        const MOVE_SPEED = 1.5;  // 降低移动速度使游戏更容易控制

        // 在脚本开头添加按键状态追踪
        let keyPressed = false;

        // 添加一个游戏状态标志
        let isResetting = false;

        // 更新游戏元素位置
        function updatePositions() {
            // 更新分界线位置
            divider.style.left = `${dividerPosition}%`;
            
            // 更新角色位置
            girl.style.right = `${100 - dividerPosition}%`;
            boy.style.left = `${dividerPosition}%`;
            
            // 更新左右区域宽度
            document.querySelector('.left-side').style.width = `${dividerPosition}%`;
            document.querySelector('.right-side').style.width = `${100 - dividerPosition}%`;
        }

        // 检查游戏是否结束
        function checkGameEnd() {
            if (isResetting) return; // 如果正在重置中，不再处理

            if (dividerPosition <= 0) {
                isResetting = true; // 设置重置状态
                boyPoints++;
                boyScore.textContent = `BOYS：${boyPoints}`;
                gameContainer.style.transition = 'all 0.5s';
                gameContainer.style.backgroundColor = '#4d79ff';
                setTimeout(() => {
                    gameContainer.style.transition = 'background-position 0.3s';
                    resetGame();
                    isResetting = false; // 重置完成后解除状态
                }, 500);
            } else if (dividerPosition >= 100) {
                isResetting = true; // 设置重置状态
                girlPoints++;
                girlScore.textContent = `GIRLS：${girlPoints}`;
                gameContainer.style.transition = 'all 0.5s';
                gameContainer.style.backgroundColor = '#ff4d4d';
                setTimeout(() => {
                    gameContainer.style.transition = 'background-position 0.3s';
                    resetGame();
                    isResetting = false; // 重置完成后解除状态
                }, 500);
            }
        }

        // 重置游戏
        function resetGame() {
            dividerPosition = 50;
            updatePositions();
            girlScore.textContent = `GIRLS：${girlPoints}`;
            boyScore.textContent = `BOYS：${boyPoints}`;
        }

        // 添加闪烁效果
        function addPushEffect(side) {
            const element = side === 'left' ? document.querySelector('.left-side') : document.querySelector('.right-side');
            element.style.animation = `${side}Push 0.3s ease`;
            
            // 动画结束后移除
            setTimeout(() => {
                element.style.animation = '';
            }, 300);
        }

        // 修改点击处理函数
        function handleClick(e) {
            if (isResetting) return;
            const rect = gameContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            
            if (x < rect.width / 2) {
                // 点击左边时向右推
                dividerPosition = Math.min(100, dividerPosition + MOVE_SPEED);
                addPushEffect('left');
            } else {
                // 点击右边时向左推
                dividerPosition = Math.max(0, dividerPosition - MOVE_SPEED);
                addPushEffect('right');
            }
            
            updatePositions();
            checkGameEnd();
        }

        // 修改触摸处理函数
        function handleTouch(e) {
            if (isResetting) return;
            e.preventDefault();
            const touch = e.touches[0];
            const rect = gameContainer.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            
            if (x < rect.width / 2) {
                // 触摸左边时向右推
                dividerPosition = Math.min(100, dividerPosition + MOVE_SPEED);
                addPushEffect('left');
            } else {
                // 触摸右边时向左推
                dividerPosition = Math.max(0, dividerPosition - MOVE_SPEED);
                addPushEffect('right');
            }
            
            updatePositions();
            checkGameEnd();
        }

        // 修改键盘控制
        document.addEventListener('keydown', (e) => {
            if (isResetting || keyPressed) return;
            keyPressed = true;

            switch(e.key) {
                case 'a':
                case 'ArrowLeft':
                    // 按左键时，左边闪烁并向右推
                    dividerPosition = Math.min(100, dividerPosition + MOVE_SPEED);
                    addPushEffect('left');
                    break;
                case 'd':
                case 'ArrowRight':
                    // 按右键时，右边闪烁并向左推
                    dividerPosition = Math.max(0, dividerPosition - MOVE_SPEED);
                    addPushEffect('right');
                    break;
            }
            
            updatePositions();
            checkGameEnd();
        });

        // 添加按键抬起事件监听
        document.addEventListener('keyup', () => {
            keyPressed = false;
        });

        gameContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleTouch(e);
        }, { passive: false });

        gameContainer.addEventListener('click', handleClick);

        // 初始化游戏
        resetGame();

        gameContainer.addEventListener('selectstart', (e) => e.preventDefault());
        gameContainer.addEventListener('contextmenu', (e) => e.preventDefault());
        document.addEventListener('dragstart', (e) => e.preventDefault());