/*  clock */
const hours = document.querySelector('.hours');
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');

/*  play button */
const play = document.querySelector('.play');
const pause = document.querySelector('.pause');
const playBtn = document.querySelector('.circle__btn');
const wave1 = document.querySelector('.circle__back-1');
const wave2 = document.querySelector('.circle__back-2');

/*  rate slider */
const container = document.querySelector('.slider__box');
const btn = document.querySelector('.slider__btn');
const color = document.querySelector('.slider__color');
const tooltip = document.querySelector('.slider__tooltip');

clock = () => {
  let today = new Date();
  let h = (today.getHours() % 12) + today.getMinutes() / 59; // 22 % 12 = 10pm
  let m = today.getMinutes(); // 0 - 59
  let s = today.getSeconds(); // 0 - 59

  h *= 30; // 12 * 30 = 360deg
  m *= 6;
  s *= 6; // 60 * 6 = 360deg

  rotation(hours, h);
  rotation(minutes, m);
  rotation(seconds, s);

  // call every second
  setTimeout(clock, 500);
}

rotation = (target, val) => {
  target.style.transform =  `rotate(${val}deg)`;
}

window.onload = clock();

dragElement = (target, btn) => {
  target.addEventListener('mousedown', (e) => {
      onMouseMove(e);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
  });

  onMouseMove = (e) => {
      e.preventDefault();
      let targetRect = target.getBoundingClientRect();
      let x = e.pageX - targetRect.left + 10;
      if (x > targetRect.width) { x = targetRect.width};
      if (x < 0){ x = 0};
      btn.x = x - 10;
      btn.style.left = btn.x + 'px';

      // get the position of the button inside the container (%)
      let percentPosition = (btn.x + 10) / targetRect.width * 100;
      
      // color width = position of button (%)
      color.style.width = percentPosition + "%";

      // move the tooltip when button moves, and show the tooltip
      tooltip.style.left = btn.x - 5 + 'px';
      tooltip.style.opacity = 1;

      // show the percentage in the tooltip
      tooltip.textContent = Math.round(percentPosition) + '%';
  };

  onMouseUp  = (e) => {
      window.removeEventListener('mousemove', onMouseMove);
      tooltip.style.opacity = 0;

      btn.addEventListener('mouseover', function() {
        tooltip.style.opacity = 1;
      });
      
      btn.addEventListener('mouseout', function() {
        tooltip.style.opacity = 0;
      });
  };
};

dragElement(container, btn);

/*  play button  */
playBtn.addEventListener('click', function(e) {
  e.preventDefault();
  pause.classList.toggle('visibility');
  play.classList.toggle('visibility');
  playBtn.classList.toggle('shadow');
  wave1.classList.toggle('paused');
  wave2.classList.toggle('paused');
});

var valueTemp = firebase.database().ref('status/temperature');
valueTemp.on('value', snap => {
  console.log("NhietDo: " + snap.val())
  document.getElementById("NhietDo").innerHTML = "Nhiệt Độ: " + snap.val()+" C"
});

var valueTemp = firebase.database().ref('status/humidity');
valueTemp.on('value', snap => {
  console.log("DoAm: " + snap.val())
  document.getElementById("DoAm").innerHTML = "Độ Ẩm: " + snap.val()+" %"
});

// Lấy các nút và phần tử statusChip
const btnSecondary = document.getElementById('autoButton');
const btnPrimary = document.getElementById('manualButton');
const statusChip = document.getElementById('statusChip');

statusChip.innerText = 'Auto';

// Hàm cập nhật trạng thái
function updateStatus(status) {
  // Cập nhật status hiển thị trên giao diện
  statusChip.innerText = status;

  // Lưu trạng thái vào Firebase
  firebase.database().ref('status/mode').set(status)
    .then(() => {
      console.log('Mode updated to Firebase: ' + status);
    })
    .catch((error) => {
      console.error('Error updating mode in Firebase: ', error);
    });
}

// Thiết lập sự kiện cho nút btn_secondary
btnSecondary.addEventListener('click', () => {
  updateStatus('Auto');
});

// Thiết lập sự kiện cho nút btn_primary
btnPrimary.addEventListener('click', () => {
  updateStatus('Manual');
});

// // Lắng nghe sự thay đổi của 'status/mode' trong Firebase và cập nhật statusChip
// firebase.database().ref('status/mode').on('value', (snapshot) => {
//   const mode = snapshot.val(); // Lấy giá trị hiện tại của 'mode' từ Firebase
//   if (mode) {
//     statusChip.innerText = mode; // Cập nhật lại statusChip với giá trị từ Firebase
//   } else {
//     statusChip.innerText = 'Auto'; // Nếu không có giá trị, mặc định là 'Auto'
//   }
// });

firebase.database().ref('status/mode').on('value', (snapshot) => {
  const mode = snapshot.val(); // Get the mode value from Firebase

  // Now listen for motorposition value in Firebase
  firebase.database().ref('status/motorposition').on('value', (motomodeSnapshot) => {
    const motor = motomodeSnapshot.val(); // Get the motor position value

    // Update the statusChip text with the mode and motorposition
    if (mode && motor) {
      statusChip.innerText = `${mode} (${motor})`; // Display mode and motor position
    } else {
      statusChip.innerText = `${mode} (Unknown)`; // Default text if no data is found
    }
  });
});
