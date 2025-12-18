// 사진 매칭(너가 말한 순서 기준)
// 1번 하수도 = (3번째 사진) -> bbbb1.png
// 2번 하수도 = (2번째 사진) -> bbbb2.png
// 3번 하수도 = (4번째 사진) -> bbbb3.png

const spots = [
  {
    id: "sewer-1",
    name: "1번 하수도",
    desc: "막힘 원인: 낙엽이 배수구(그릴) 주변에 다량으로 쌓여 유입을 막는 형태",
    lat: 36.351177,
    lng: 127.384994,
    image: "./assets/photos/bbbb1.png",
  },
  {
    id: "sewer-2",
    name: "2번 하수도",
    desc: "막힘 원인: 관 내부에 낙엽/유기물성 찌꺼기가 뭉쳐 쌓여 흐름을 막는 형태",
    lat: 36.309849,
    lng: 127.378487,
    image: "./assets/photos/bbbb2.png",
  },
  {
    id: "sewer-3",
    name: "3번 하수도",
    desc: "막힘 원인: 보도 턱 배수구 주변에 낙엽과 풀(잔디) 조각이 함께 쌓인 형태",
    lat: 36.317109,
    lng: 127.378278,
    image: "./assets/photos/bbbb3.png",
  },
];

// 지도 초기화
const map = L.map("map").setView([spots[0].lat, spots[0].lng], 14);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// 커스텀 느낌표 마커
function exclamationIcon() {
  return L.divIcon({
    className: "",
    html: `<div class="alert-marker" title="사진 보기"><span>!</span></div>`,
    iconSize: [34, 44],
    iconAnchor: [17, 44],
    popupAnchor: [0, -42],
  });
}

// 모달
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalImg = document.getElementById("modalImg");
const modalClose = document.getElementById("modalClose");

function openModal(spot) {
  modalTitle.textContent = spot.name;
  modalDesc.textContent = spot.desc || "";
  modalImg.src = spot.image;
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  modalImg.src = "";
}

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target?.dataset?.close) closeModal();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
    closeModal();
  }
});

// 마커 추가 + 화면 맞추기
const bounds = [];

spots.forEach((spot) => {
  const marker = L.marker([spot.lat, spot.lng], { icon: exclamationIcon() }).addTo(map);
  marker.on("click", () => openModal(spot));
  bounds.push([spot.lat, spot.lng]);
});

if (bounds.length >= 2) {
  map.fitBounds(bounds, { padding: [30, 30] });
}

map.on("click", (e) => {
  const { lat, lng } = e.latlng;
  const text = `lat: ${lat.toFixed(6)}, lng: ${lng.toFixed(6)}`;

  L.popup()
    .setLatLng(e.latlng)
    .setContent(`<b>좌표</b><br>${text}<br><small>`)
    .openOn(map);

  console.log(text);
});

