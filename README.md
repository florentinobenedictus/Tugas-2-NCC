# Tugas 2 NCC
**5025201222 - Florentino Benedictus**<br>
**5025201241 - Jabalnur**

# Live chat dan shared whiteboard menggunakan socket.io dan node.js

## Langkah Penggunaan
* install node.js di https://nodejs.org/en/download/
* buka cmd lalu ubah directory
* npm init
* npm install socket.io socket.io-client
* npm install express@4
* node server
* buka http://127.0.0.1:${port}/
#### Menggunakan Nodemon:
* lakukan langkah 1-5
* npm install -g nodemon
* npm start
* buka http://127.0.0.1:${port}/

## Deskripsi
Ketika menggunakan aplikasi ini, pertama user akan diarahkan pada halaman login dimana user dapat mengisi username lalu memilih nama room dan tipe roomnya. Tipe room dibagi menjadi 2 yaitu:<br>
- *Shared Whiteboard*: whiteboard colaborative dimana semua user bisa menggambar dan chat sesukanya
- *Unshared Whiteboard*: whiteboard dimana hanya 1 user (admin) yang dapat menulis pada whiteboard, sedangkan yang lain hanya dapat mengirim chat<br><br>

Setelah memilih tipe room, maka user akan dialihkan ke halaman utama dimana user dapat mengirim chat maupun menulis pada whiteboard.

### Claim Admin
Pada room *Unshared Whiteboard*, agar dapat menulis pada whiteboard user harus menjadi admin terlebih dahulu, caranya dengan menggunakan command `Admin plz` pada chat untuk deaktivasi admin sebelumnya pada room tersebut (jika ada) lalu menjadikan user yang menggunakan command tersebut sebagai admin. Akan ada notifikasi di chat room ketika dilakukan perubahan admin.

### Socket.io
Dalam penugasan ini socket.io digunakan sebagai penghubung antara server dan client. Pertukaran informasi dan menggunaan method antara server-client menggunakan `emit` dan `on`. 

### Whiteboard
Implementasi whiteboard menggunakan algoritma dari internet yang telah dimodifikasi dan diletakkan pada client.js

#### Resize
Jika posisi whiteboard dan mouse tidak sesuai ketika menggunakan device lain/zoom in/zoom out, dapat dilakukan modifikasi pada fungsi onResize() di client.js
```
canvas.width = window.innerWidth * x;
canvas.height = canvas.width * y;
```
Dengan:
* x = width_ideal/width layar
* y = height_ideal/width_ideal<br>
Selanjutnya penyesuaian ketika resize akan dilakukan secara otomatis.

## Fitur
* Memiliki halaman log in
* Terdapat tombol untuk pindah room dari room saat ini

### Link Referensi
#### Bootstrap
* halaman login:
https://demos.creative-tim.com/material-kit/pages/sign-in.html
https://mdbootstrap.com/docs/b4/jquery/components/demo/

* halaman pilih room yg ada:
https://mdbootstrap.com/support/

* room chatbox:
https://demos.creative-tim.com/material-kit/pages/contact-us.html
#### Whiteboard dan Chat
- https://socket.io/demos/whiteboard/
- https://github.com/ncclaboratory18/Oprec_Admin_NCC_Second_Assignment
