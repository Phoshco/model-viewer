<div align="center">

<h3> Model viewer for a certain anime game developer </h3>

</div>

###

<div align="center">
  <img height="300" src="banner.jpeg?raw=true"/>
</div>

### https://phoshco.github.io/model-viewer/

Implement MMD models using Babylon.js and babylon-mmd as a hobby project.
(Ongoing)

## Build Settings

- Typescript
- Webpack (only resolve html template, typescript, and static files)
- Babylon.js (with es6 module tree shaking applied)
- eslint (Babyon.js coding style)

## Details

- Run it with `npm i` & `npm start`
- It will do the eslint fix for you on save
- All code is written in sceneBuilder.ts


## Route handling
https://phoshco.github.io/model-viewer/*charactername*

- *charactername* is the name of the target character.
- *charactername* is case-insensitive. Periods and whitespaces in names are removed.
- Future enhancements might include more relaxed passing of *charactername* for easier search/access (eg *kaedeharakazuha* to just *kazuha*).

Example for route handling for certain characters with multiple words in their names:

| Character | *charactername* |
|-----------|-----------------|
| Arataki Itto | aratakiitto |
| Hu Tao | hutao |
| Kaedehara Kazuha | kaedeharakazuha |
| Kamisato Ayaka | kamisatoayaka |
| Kamisato Ayato | kamisatoayato |
| Kujou Sara | kujousara |
| Kuki Shinobu | kukishinobu |
| Raiden Shogun | raidenshogun |
| Shikanoin Heizou | shikanoinheizou |
| Yae Miko | yaemiko |
| Yun Jin | yunjin |
| ... | ... |

| Character | *charactername* |
|-----------|-----------------|
| Dan Heng | danheng |
| Jing Yuan | jingyuan |
| March 7th | march7th |
| Silver Wolf | silverwolf |
| Imbibitor Lunae | imbibitorlunae |
| Topaz and Numby | topazandnumby |
| Dr. Ratio | drratio |
| Ruan Mei | ruanmei |
| March 7th (The Hunt) | march7ththehunt |
| Mr. Reca | mrreca |
| ... | ... |

| Character | *charactername* |
|-----------|-----------------|
| Soldier 11 | soldier11 |
| Zhu Yuan | zhuyuan |
| Jane Doe | janedoe |
| Seth Lowell | sethlowell |
| Caesar King | caesarking |
| Burnice White | burnicewhite |
| Tsukishiro Yanagi | tsukishiroyanagi |
| Hoshimi Miyabi | hoshimimiyabi |
| ... | ... |