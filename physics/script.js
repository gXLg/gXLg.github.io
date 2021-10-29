let objs = [];
let n = 0;
let max = 500;

function create(x, y, m, vx, vy){
  let el = document.createElement("span");
  el.innerHTML = m;
  el.id = n ++;
  el.style.left = x - 5;
  el.style.top = y - 5;

  document.getElementById("f").appendChild(el);
  let obj = {x, y, m, vx, vy, ax: 0, ay: 0, el};
  objs.push(obj);
}

function draw(obj){
  obj.el.style.left = obj.x - 5;
  obj.el.style.top = obj.y - 5;
  obj.innerHTML = obj.m;
  //obj.el.innerHTML = " " + obj.x + " " + obj.y + " " + obj.vx + " " + obj.vy;
}

function clamp(num){
  return num <= 0 ? 0 : num >= max ? max : num
}

function collide(){
  let removed = [];
  let collision = [];
  for(let obj of objs){
    if(removed.includes(obj.el.id)) continue;
    for(let fobj of objs){
      if(fobj.el.id == obj.el.id) continue;

      let rx = fobj.x - obj.x;
      let ry = fobj.y - obj.y;
      let r = Math.sqrt(rx * rx + ry * ry);

      if(r < 5){
        collision.push([obj, fobj]);
        removed.push(obj.el.id);
        removed.push(fobj.el.id);
      }
    }
  }
  objs = objs.filter(obj => {
    if(!removed.includes(obj.el.id)) return true;
    obj.el.parentNode.removeChild(obj.el);
    return false;
  });
  for(let t of collision){
    obj = t[0];
    fobj = t[1];
    let x = (obj.x + fobj.x) / 2;
    let y = (obj.y + fobj.y) / 2;
    let m = obj.m + fobj.m;

    let fx = obj.m * obj.ax + fobj.m * fobj.ax;
    let fy = obj.m * obj.ay + fobj.m * fobj.ay;
    let ax = fx * m;
    let ay = fy * m;

    create(x, y, m, ax, ay);
  }
  if(removed.length) collide();
}

function physic(){
  for(let obj of objs){
    obj.ax = 0;
    obj.ay = 0;
    for(let fobj of objs){
      if(fobj.el.id == obj.el.id) continue;

      let rx = fobj.x - obj.x;
      let ry = fobj.y - obj.y;
      let r = Math.sqrt(rx * rx + ry * ry);

      let alpha = Math.asin(rx / r);
      let gamma = Math.acos(ry / r);

      let a = fobj.m / (r * r);
      obj.ax += Math.sin(alpha) * a;
      obj.ay += Math.cos(gamma) * a;

    }

    obj.vx += obj.ax;
    obj.vy += obj.ay;

    obj.x += obj.vx;
    obj.y += obj.vy;

    if(obj.x <= 0 || obj.x >= max){
      obj.x = clamp(obj.x);
      obj.vx = - obj.vx;
    }
    if(obj.y <= 0 || obj.y >= max){
      obj.y = clamp(obj.y);
      obj.vy = - obj.vy;
    }

    draw(obj);
  }
  collide();
}

let phint;
function play(){
  phint = phint ? clearInterval(phint) : setInterval(physic, 10);
  document.getElementById("b").value = phint ? "stop" : "play";
}

window.onload = () => {
  let params = new URLSearchParams(window.location.search);
  let m = params.get("max");
  if(m) max = parseInt(m);
  let field = document.getElementById("f");
  field.style.height = max;
  field.style.width = max;
  create(0, 0, 1, 0.4, 0);
  create(150, 150, 2, 1, 1);
  create(0, 150, 3, 0.3, 0.3);
  create(290, 290, 5, -1, -0.4);
};

