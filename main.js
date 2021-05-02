let docContext = document.getElementById("mycanvas");
let ctx = docContext.getContext("2d");

let loadImage = (src, callback) => {
  let img = document.createElement("img");
  img.onload = () => callback(img);
  img.src = src;
};

let imagePath = (frameNumber, animation) => {
  return "/finisher/" + animation + "/" + frameNumber + ".png";
};
let frames = {
  idle: [1, 2, 3, 4, 5, 6, 7, 8],
  kick: [1, 2, 3, 4, 5, 6, 7],
  punch: [1, 2, 3, 4, 5, 6, 7],
  block: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  backward: [1, 2, 3, 4, 5, 6],
  forward: [1, 2, 3, 4, 5, 6],
};

let loadImages = (callback) => {
  let images = {
    idle: [],
    kick: [],
    punch: [],
    block: [],
    backward: [],
    forward: [],
  };
  let imagesToLoad = 0;

  ["idle", "kick", "punch", "block", "backward", "forward"].forEach(
    (animation) => {
      let animationFrames = frames[animation];
      imagesToLoad = imagesToLoad + animationFrames.length;

      animationFrames.forEach((frameNumber) => {
        let path = imagePath(frameNumber, animation);

        loadImage(path, (image) => {
          images[animation][frameNumber - 1] = image;
          imagesToLoad = imagesToLoad - 1;

          if (imagesToLoad === 0) {
            callback(images);
          }
        });
      });
    }
  );
};

let animate = (ctx, images, animation, callback) => {
  images[animation].forEach((image, index) => {
    setTimeout(() => {
      ctx.clearRect(0, 0, 800, 800);
      ctx.drawImage(image, 0, 0, 800, 800);
    }, index * 100);
  });

  setTimeout(callback, images[animation].length * 100);
};

loadImages((images) => {
  let queuedAnimations = [];

  let aux = () => {
    let selectedAnimation;
    if (queuedAnimations.length === 0) {
      selectedAnimation = "idle";
    } else {
      selectedAnimation = queuedAnimations.shift();
    }
    animate(ctx, images, selectedAnimation, aux);
  };
  aux();

  document.getElementById("kick").onclick = () => {
    queuedAnimations.push("kick");
    document.getElementById("punch_click").play();
  };

  document.getElementById("punch").onclick = () => {
    queuedAnimations.push("punch");
    document.getElementById("kick_click").play();
  };
  document.getElementById("block").onclick = () => {
    queuedAnimations.push("block");
  };

  document.getElementById("backward").onclick = () => {
    document.getElementById("backward_click").play();
    queuedAnimations.push("backward");
  };
  document.getElementById("forward").onclick = () => {
    queuedAnimations.push("forward");
    document.getElementById("forward_click").play();
  };

  document.addEventListener("keyup", (event) => {
    const key = event.key;
    if (key.toLowerCase() === "d") {
      queuedAnimations.push("forward");
      document.getElementById("forward_button").play();
    } else if (key.toLowerCase() === "a") {
      queuedAnimations.push("backward");
      document.getElementById("backward_button").play();
    } else if (key.toLowerCase() === "s") {
      queuedAnimations.push("block");
    } else if (key === "ArrowRight") {
      queuedAnimations.push("punch");
      document.getElementById("punch_button").play();
    } else if (key === "ArrowLeft") {
      queuedAnimations.push("kick");
      document.getElementById("kick_button").play();
    }
  });
});

/* img.src = "/images/idle.png"; */
