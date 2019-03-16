function user(n, rx, ry, rz) {
  var a = Math.PI / n, i, j, p = [],
    z = rz * 2 / n;
  for(i = 0; i < n; ++i) {
    j = a * i;
    if(i % 2)
      j += Math.PI;
    p.push([rx * Math.cos(j),
      rz - z * i,
      ry * Math.sin(j)]);
  }
  return p;
}


function changeType(shape) {
    TagCanvas.Delete('tagcanvas');
    TagCanvas.Start('tagcanvas', '', {
        shape: shape
    });
}