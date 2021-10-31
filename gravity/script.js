let objs = [];
let n = 0;
let mx = 300;
let my = 300;
let rebound = 100;

function create(x, y, m, vx, vy, ax = 0, ay = 0){
  let el = document.createElement("span");
  el.innerHTML = m;
  el.id = n;
  el.style.left = x - 5;
  el.style.top = y - 5;

  let l = document.createElement("div");
  l.innerHTML = ["id:", n, "<br>x:", x, "<br>y:", y,
                 "<br>m:", m, "<br>vx:", vx, "<br>vy:", vy].join(" ");
  l.innerHTML += "<br><input type=button value=remove onclick=remove(" + n + ")><br><br>";

  document.getElementById("l").appendChild(l);

  document.getElementById("f").appendChild(el);
  let obj = {x, y, m, vx, vy, ax, ay, el, l};
  objs.push(obj);
  n ++;
}

function draw(obj){
  obj.el.style.left = obj.x - 5;
  obj.el.style.top = obj.y - 5;
  obj.el.innerHTML = obj.m;
  obj.l.innerHTML = ["id:", obj.el.id, "<br>x:", obj.x, "<br>y:", obj.y,
                     "<br>m:", obj.m, "<br>vx:", obj.vx, "<br>vy:", obj.vy].join(" ");
  obj.l.innerHTML += "<br><input type=button value=remove onclick=remove(" + obj.el.id + ")><br><br>";
}

function clx(num){
  return num <= 0 ? 0 : num >= mx ? mx : num
}
function cly(num){
  return num <= 0 ? 0 : num >= my ? my : num
}

function remove(id){
  objs = objs.filter(obj => {
    if(obj.el.id != id) return true;
    obj.el.parentNode.removeChild(obj.el);
    obj.l.parentNode.removeChild(obj.l);
    return false;
  });
}

function collide(){
  let removed = [];
  let collision = [];
  for(let obj of objs){
    if(removed.includes(obj.el.id)) continue;
    for(let fobj of objs){
      if(fobj.el.id == obj.el.id) continue;
      if(removed.includes(fobj.el.id)) continue;

      let rx = fobj.x - obj.x;
      let ry = fobj.y - obj.y;
      let r = Math.sqrt(rx * rx + ry * ry);

      if(r < 5){
        collision.push([obj, fobj]);
        removed.push(obj.el.id);
        removed.push(fobj.el.id);
        break;
      }
    }
  }
  objs = objs.filter(obj => {
    if(!removed.includes(obj.el.id)) return true;
    obj.el.parentNode.removeChild(obj.el);
    obj.l.parentNode.removeChild(obj.l);
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
    let ax = fx / m;
    let ay = fy / m;

    create(x, y, m, ax, ay);
  }
  if(removed.length) collide();
}

function physic(){
  collide();
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

    if(obj.x <= 0 || obj.x >= mx){
      obj.x = clx(obj.x);
      obj.vx = - obj.vx * rebound / 100;
    }
    if(obj.y <= 0 || obj.y >= my){
      obj.y = cly(obj.y);
      obj.vy = - obj.vy * rebound / 100;
    }

    draw(obj);
  }
}

let phint;
function play(){
  phint = phint ? clearInterval(phint) : setInterval(physic, 10);
  document.getElementById("b").value = phint ? "stop" : "play";
}

function add(){
  let x = mx / 2;
  let y = my / 2;
  let m = 1;
  let vx = 0;
  let vy = 0;

  let elx = document.getElementById("x");
  let ely = document.getElementById("y");
  let elm = document.getElementById("m");
  let elvx = document.getElementById("vx");
  let elvy = document.getElementById("vy");

  let tx = elx.value;
  let ty = ely.value;
  let tm = elm.value;
  let tvx = elvx.value;
  let tvy = elvy.value;

  if(tx) x = Number(tx);
  if(ty) y = Number(ty);
  if(tm) m = Number(tm);
  if(tvx) vx = Number(tvx);
  if(tvy) vy = Number(tvy);

  elx.value = "";
  ely.value = "";
  elm.value = "";
  elvx.value = "";
  elvy.value = "";

  create(x, y, m, vx, vy);
}

function convertBase(str, fromBase, toBase) {

  const DIGITS = "0123456789!_.-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ()*~$[]@^:";

  const add = (x, y, base) => {
    let z = [];
    const n = Math.max(x.length, y.length);
    let carry = 0;
    let i = 0;
    while (i < n || carry) {
      const xi = i < x.length ? x[i] : 0;
      const yi = i < y.length ? y[i] : 0;
      const zi = carry + xi + yi;
      z.push(zi % base);
      carry = Math.floor(zi / base);
      i++;
    }
    return z;
  }

  const multiplyByNumber = (num, x, base) => {
    if (num < 0) return null;
    if (num == 0) return [];

    let result = [];
    let power = x;
    while (true) {
      num & 1 && (result = add(result, power, base));
      num = num >> 1;
      if (num === 0) break;
      power = add(power, power, base);
    }

    return result;
  }

  const parseToDigitsArray = (str, base) => {
    const digits = str.split('');
    let arr = [];
    for (let i = digits.length - 1; i >= 0; i--) {
      const n = DIGITS.indexOf(digits[i])
      if (n == -1) return null;
      arr.push(n);
    }
    return arr;
  }

  const digits = parseToDigitsArray(str, fromBase);
  if (digits === null) return null;

  let outArray = [];
  let power = [1];
  for (let i = 0; i < digits.length; i++) {
    digits[i] && (outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase));
    power = multiplyByNumber(fromBase, power, toBase);
  }

  let out = '';
  for (let i = outArray.length - 1; i >= 0; i--)
    out += DIGITS[outArray[i]];

  return out;
}

function compress(){
  let e = [];
  for(let obj of objs){
    let d = [];
    for(let i in obj){
      if(i == "el" || i == "l") continue
      d.push(obj[i]);
    }
    e.push(d.join("!"));
  }
  let c = e.join("_");
  c = convertBase(c, 14, 76);
  let del = window.location.search.length ? "&" : "?"
  let url =  window.location + del + "planets=" + c;
  document.getElementById("s").value = url;
}

window.onload = () => {
  let params = new URLSearchParams(window.location.search);
  let m = params.get("max");
  if(m){
    let x = m.split(":")[0];
    let y = m.split(":")[1];
    if(x) mx = Number(x);
    if(y) my = Number(y);
  }
  let field = document.getElementById("f");
  field.style.width = mx;
  field.style.height = my;
  let r = params.get("rebound");
  if(r) rebound = Number(r);
  let p = params.get("planets");
  if(p){
    p = convertBase(p, 76, 14);
    let e = p.split("_");
    for(let i of e){
      let d = i.split("!");
      d = d.map(el => Number(el));
      create(...d);
    }
  }
};

