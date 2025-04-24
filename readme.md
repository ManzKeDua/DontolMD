# **DontolMD** 
## kelebihan
```javascript
easy codding
welcome keren
all scraper
free feature downloader && tools
ai groq
supp 2 model plugin
ukuran script kecil 
No encrypt
```

## ⚙️ Settings Bot Check In ***( config.js )***


## 👨‍💻 How to install/run


```bash
$ git clone https://github.com/ManzKeDua/DontolMD
$ cd simple-base
$ npm install
$ npm start
```

## ☘️ Example Features
Berikut cara menambahkan fitur pada bot ini

### Plugins

```javascript
Example 1
let handler = async (m, { conn, text, usedPrefix, command }) => 
{
 // your code
}
handler.help = ["help"]
handler.tags = ["tag"]
handler.command = ["command"]
module.exports = handler

Example 2

module.exports = {
     help: ["help"],
     tags: ["tags"],
     command: ["command"],
     code: async(m, { conn, usedPrefix,  command, text,  isOwner, isAdmin, isBotAdmin, isPrems, chatUpdate  }) => 
     {
   //your code
  } 
}
```
