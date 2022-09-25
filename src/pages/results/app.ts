import qrcode from 'qrcode';

const canvas = document.getElementById('qrcode');
qrcode.toCanvas(canvas, `${location.origin}/app`, {
  scale: 8,
});
