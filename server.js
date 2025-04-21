import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import r from "./db.js";

//bu kısmı gpt çözdü
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));


app.get("/", async (req, res) => {
  const users = await r.table("users").run();
  let html = '<h1>Kullanıcı Listesi</h1><a href="/create">Yeni Kullanıcı Ekle</a><ul>';
  users.forEach(user => {
    html += `<li><b>${user.name}</b> - <a href="/update/${user.id}">Güncelle</a> | <a href="/delete/${user.id}">Sil</a></li>`;
  });
  html += "</ul>";
  res.send(html);
});


app.get("/create", (req, res) => {
  res.sendFile(path.join(__dirname, "views/create.html"));
});


app.post("/create", async (req, res) => {
  const last = await r.table("users").orderBy(r.desc("id")).limit(1).run();
  const newId = last.length > 0 ? last[0].id + 1 : 1;

  await r.table("users").insert({
    id: newId,
    name: req.body.name
  });

  res.redirect("/");
});


app.get("/update/:id", async (req, res) => {
  const user = await r.table("users").get(parseInt(req.params.id));
  res.send(`
    <h2>Kullanıcı Güncelle</h2>
    <form method="POST">
      <label>ID:</label><br>
      <input name="id" value="${user.id}" readonly><br><br>

      <label>Ad Soyad:</label><br>
      <input name="name" value="${user.name}" required><br><br>

      <button type="submit">Güncelle</button>
    </form>
  `);
});


app.post("/update/:id", async (req, res) => {
  await r.table("users").get(parseInt(req.params.id)).update({
    name: req.body.name
  });
  res.redirect("/");
  console.log("güncellendi");
});


app.get("/delete/:id", async (req, res) => {
  await r.table("users").get(parseInt(req.params.id)).delete();
  res.redirect("/");
});


app.listen(3000, () => {
  console.log("sunucu 3000 portunda çalışıyor");
});
