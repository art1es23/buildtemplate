const canvasBg = () => {
  let canvas = document.querySelector("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let c = canvas.getContext("2d");

  let mouse = {
    x: undefined,
    y: undefined,
  };

  let maxRadius = 20;

  let colorArray = ["#f6f4e6", "#edca00", "#FF0043", "#41444b"];

  window.addEventListener("mousemove", function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
  });

  function Circle(x, y, dx, dy, r) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    this.minRadius = r;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

    this.draw = function () {
      c.beginPath();
      c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      /*c.strokeStyle = 'red';
          c.stroke();*/
      c.fillStyle = this.color;
      c.fill();
    };

    this.update = function () {
      if (this.x + this.r > innerWidth || this.x - this.r < 0) {
        this.dx = -this.dx;
      }
      if (this.y + this.r > innerHeight || this.y - this.r < 0) {
        this.dy = -this.dy;
      }

      this.x += this.dx;
      this.y += this.dy;

      //interactive
      if (
        mouse.x - this.x < 75 &&
        mouse.x - this.x > -75 &&
        mouse.y - this.y < 75 &&
        mouse.y - this.y > -75
      ) {
        if (this.r < maxRadius) {
          this.r++;
        }
      } else if (this.r > this.minRadius) {
        this.r--;
      }

      this.draw();
    };
  }

  let circleArray = [];

  function init() {
    circleArray = [];

    for (let i = 0; i < 300; i++) {
      let r = Math.random() * 3 + 1;
      let x = Math.random() * (innerWidth - r * 2) + r;
      let y = Math.random() * (innerHeight - r * 2) + r;
      let dx = Math.random() - 0.5;
      let dy = Math.random() - 0.5;
      circleArray.push(new Circle(x, y, dx, dy, r));

      circleArray[i].update();
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < circleArray.length; i++) {
      circleArray[i].update();
    }
  }

  init();
  animate();

};

export default canvasBg;

/*
document.body.style.background = 'url(' + canvas.toDataURL() + ')';
*/