import { canvas, c, gravity } from "../constants";

export class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1 }) {
         this.position = position;
         this.height = 150;
         this.width = 50;
         this.image = new Image ();
         this.image.src = imageSrc;
         this.scale = scale;
         this.framesMax = framesMax;
         this.framesCurrent = 0;
         this.framesElapsed = 0;
         this.framesHold = 10;
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax), // Crop location x
            0, // Crop location y
            this.image.width / this.framesMax, // Crop end x
            this.image.height, // Crop end y
            this.position.x, // Position x in the canvas
            this.position.y, // Position y in tha canvas
            (this.image.width / this.framesMax) * this.scale, // Used to make mage img bigger or smaller.
            this.image.height * this.scale
        );
    }

    update() {
        this.draw();
        this.framesElapsed++; //Every loop we draw frame, this keep track how much we draw.

        //We will switch frame every time in gets hold enough time
        if (this.framesElapsed % this.framesHold === 0)
        {
            // If the image have multiple frames this will increase to make it crop the the right frame imgage , if
            // we looped the whole animation we go back the 0.
            if (this.framesCurrent < this.framesMax - 1)
                this.framesCurrent++;
            else
                this.framesCurrent = 0;
        }
    }

    // Class attributes
    position: {x: number, y: number} // This will be de spawn position.
    height: number; // Default height of a player.
    width: number; // Default width of a player.
    image: HTMLImageElement; // The image that will be draw on canvas
    scale: number; // Change the scaling to make the image bigger/smaller, if no value specified it will use default 1.
    framesMax: number; // Indicate how many frames we have in our png (ex: shop has 6 frames).
    framesCurrent: number; // If a img have multiple frames, this will tell at which frame we actually are.
    framesElapsed: number;
    framesHold: number; // How long a frame is hold , how long it stays on canvas.
}
