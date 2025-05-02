// import confetti from "canvas-confetti";
import { GameElements } from '../types';
import { updatePaddles } from '../components/paddle';
import { updateBall, resetBall, autoChangeColor } from '../components/ball';
import { checkWinner } from '../components/score';
import { WIN_SCORE } from '../utils/constants';
import { resetScore } from '../components/score';
import { resetPaddles } from '../components/paddle';
import { getElements } from '../components/elements';
import { setupKeyPress, gameState, pause, isBasic, isResetting, animationFrameId, colorChangeTimer, setColorChangeTimer, setIsBasic, setPause, setAnimationFrameId  } from './gamestate';
import { resetAllsounds, initSounds, gameSounds, stopAllAudio, mute} from '../utils/audio';
import { listenStatus } from '../events';

//main loop
function gameLoop(gameId: GameElements): void {
    console.log("im in gameLoop")
    if (pause === false) {
        updatePaddles(gameId)
        updateBall(gameId);
    }
    if (mute) {
        stopAllAudio();
    }
    checkWinner(gameId); 
    setAnimationFrameId(requestAnimationFrame(() => gameLoop(gameId)));
}


export function initPong(): void {
    console.log(`(in initPong) Basic mode is: ${isBasic}`);
    setupKeyPress();
    if (animationFrameId !== -1) {
        cancelAnimationFrame(animationFrameId);
        setAnimationFrameId(-1);
    }
    let gameId = getElements();
    gameId.winnerMsg.textContent = `Reach ${WIN_SCORE} point(s) to claim victory!🏆`;
    listenStatus(gameId);
    if (!gameSounds) {
        initSounds();
    }
    setAnimationFrameId(requestAnimationFrame(() => gameLoop(gameId)));
}

//reset game si leave PongView
export function stopPong(): void {
    setPause(true);
    if (animationFrameId !== -1) {
        cancelAnimationFrame(animationFrameId);
        setAnimationFrameId(-1);
    }
    let gameId = getElements();
    setIsBasic(true);
    console.log(`(in function stopPong) Basic mode is: ${isBasic}`);
    resetGame(gameId);
    console.log(`(in function stopPong after resetGame) Basic mode is: ${isBasic}`);
}

export function setMode(status:boolean): void {
    setIsBasic(status);
}

//change le status de pause
export function changePause(gameId: GameElements): void{
    setPause(!pause);
    if (gameId.pauseGame) {
        if (pause === true) {
         gameId.pauseGame.textContent = "start";
         clearTimeout(colorChangeTimer);
         setColorChangeTimer(undefined);
        }
        if (pause === false) {
         gameId.pauseGame.textContent = "pause";
         autoChangeColor(gameId); //start la boucle principale pour le mode features
        }
    }
}


//reset le jeu
export function resetGame(gameId: GameElements): void {
    if (colorChangeTimer !== undefined) {
        clearTimeout(colorChangeTimer);
        setColorChangeTimer(undefined);
    }
    gameState.scoreRight = 0
    gameState.scoreLeft = 0
    gameState.paddleRightY = 160;
    gameState.paddleLeftY = 160;
    resetBall(gameId);
    resetPaddles(gameId);
    resetScore(gameId);
    resetAllsounds();
    setIsBasic(true);
    gameId.basicButton.textContent = "features-mode";
    gameId.ball.style.backgroundColor = "white";
    setPause(true);
    gameId.pauseGame.textContent = "start";
}

export function setBasicMode(gameId: GameElements):void {
    if (isBasic !== null) {
        if (isBasic === false) {
            setIsBasic(true);
            if (!isResetting) {
                gameSounds?.defaultMode.play();
            }
            gameId.basicButton.textContent = "features-mode";
            gameId.ball.style.backgroundColor = "white";
        }
        else {
            setIsBasic(false);
            if (!isResetting) {
                gameSounds?.featuresMode.play();
            }
            gameId.basicButton.textContent = "default-mode";
        }
    }
}
