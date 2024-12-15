// // Initialize the map
// const map = L.map('map').setView([51.505, -0.09], 13); // Set initial city coordinates

// // Set the tile layer (background map)
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

// // Sample data for zombies, resources, and survivors
// let zombies = [
//     { id: 1, lat: 51.505, lng: -0.09 },
//     { id: 2, lat: 51.507, lng: -0.091 },
//     { id: 3, lat: 51.506, lng: -0.088 }
// ];

// const resources = [
//     { type: 'Food', lat: 51.509, lng: -0.08 },
//     { type: 'Water', lat: 51.510, lng: -0.085 }
// ];

// const survivors = [
//     { name: 'John', lat: 51.503, lng: -0.092 },
//     { name: 'Sarah', lat: 51.506, lng: -0.087 }
// ];

// // Function to add a zombie marker
// function addZombieMarker(zombie) {
//     const zombieIcon = L.divIcon({ className: 'zombie-marker' });
//     L.marker([zombie.lat, zombie.lng], { icon: zombieIcon })
//         .addTo(map)
//         .bindPopup(`Zombie ${zombie.id}`);
// }

// // Function to add a resource marker
// function addResourceMarker(resource) {
//     L.marker([resource.lat, resource.lng])
//         .addTo(map)
//         .bindPopup(`${resource.type} Resource`);
// }

// // Function to add a survivor marker
// function addSurvivorMarker(survivor) {
//     L.marker([survivor.lat, survivor.lng])
//         .addTo(map)
//         .bindPopup(`${survivor.name} - Survivor`);
// }

// // Add all zombies, resources, and survivors to the map
// zombies.forEach(zombie => addZombieMarker(zombie));
// resources.forEach(resource => addResourceMarker(resource));
// survivors.forEach(survivor => addSurvivorMarker(survivor));

// // Simulate real-time zombie movement
// function moveZombies() {
//     zombies.forEach(zombie => {
//         // Simulate random movement in a small area (within ±0.001 degrees)
//         zombie.lat += (Math.random() - 0.5) * 0.001;
//         zombie.lng += (Math.random() - 0.5) * 0.001;

//         // Find and update the zombie marker
//         map.eachLayer(layer => {
//             if (layer instanceof L.Marker && layer.getPopup().getContent() === `Zombie ${zombie.id}`) {
//                 layer.setLatLng([zombie.lat, zombie.lng]);
//             }
//         });
//     });
// }

// // Call the moveZombies function every 2 seconds
// setInterval(moveZombies, 2000);

// // Simulate random weather update (no backend)
// function generateWeatherAlert() {
//     const weatherAlerts = ['Storm', 'Flood', 'Clear'];
//     const randomAlert = weatherAlerts[Math.floor(Math.random() * weatherAlerts.length)];
//     alert(`Weather Alert: ${randomAlert}`);
// }

// // Call the generateWeatherAlert function every 10 seconds
// setInterval(generateWeatherAlert, 10000);
