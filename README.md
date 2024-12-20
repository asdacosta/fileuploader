<div align='center'>

# File Uploader

</div>
<div align='center'>
    <h3>💻 Technologies</h3>
    <img src="https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black" alt="Linux badge">
    <img src="https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white" alt="VS Code badge">
    <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git badge">
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js badge">
    <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm badge">
    <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint badge">
    <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" alt="Prettier badge">
    <img src="https://img.shields.io/badge/Babel-F7B93E?style=for-the-badge&logo=babel&logoColor=black" alt="Babel badge">
    <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest badge">
    <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL badge">
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="ExpressJS badge">
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma badge">
    <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render badge">
    <img src="https://img.shields.io/badge/Neon-00A99D?style=for-the-badge&logo=neon&logoColor=white" alt="Neon badge">
    <h4><a href="https://fileuploader-5pnx.onrender.com/">Live Preview</a></h4>
</div>

<!-- **Demo:** -->

<!-- ![Live Demo](./readme-assets/) -->

<details>

**<summary>Screen views</summary>**

**Desktop View:**

<img src="./readme-assets/desktop.jpg" alt="desktop view">
<br>

**Tablet View:**

<img src="./readme-assets/tablet.jpg" alt="desktop view">
<br>

**Mobile View:**

<img src="./readme-assets/mobile.jpg" alt="desktop view">

</details>

## 🌐 Origin

[The Odin Project](https://www.theodinproject.com/)

## 📝 Description

Users upload sign up and upload files.

<details>
<summary>Features</summary>

- ###

</details>

## 🎯 Relevance

To solidify concepts of `Prisma ORM` in Back-end.

## 👥 Intended Audience

Developers, users, and non-developers.

> [!NOTE]
> Users can install all dependencies using `package.json` file via:
>
> ```bash
> npm install
> ```
>
> To use `manageDeployments.sh`:
>
> ```bash
> sudo apt install gh
> gh auth login
> sudo apt-get install jq
> chmod +x manageDeployments.sh
> ./manageDeployments.sh
> ```

## 📂 Files

<details>
<summary>Invert</summary>

| File                | Description                                                                                                                                                             |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/*`             | Source files that are bundled into the output directory `dist/`.                                                                                                        |
| `src/app.ts`        | The main JavaScript entry point that bundling begins.                                                                                                                   |
| `src/controllers/*` | Functions that handle routes.                                                                                                                                           |
| `src/views/*`       | EJS (Embedded JavaScript) files.                                                                                                                                        |
| `public/*`          | Contains favicon and stylesheet that should be public for deployment service - Render.                                                                                  |
| `prisma/*`          | Contains all files for Prisma database. The sql tables are defined and generated from `schema.prisma` and `/migrations` contains all defined migrations.                |
| `api/`              | Contains `app.js` for deployment service - Render.                                                                                                                      |
| `dist/*`            | Output files from bundling of files in directory `src/`.                                                                                                                |
| `dist/app.ts`       | Main JavaScript output file that contains the bundled JavaScript code. Code is minified and optimized for deployment (Due to mode set to production in webpack config). |
| `package*`          | Contains details of project and dependencies versions.                                                                                                                  |
| `readme-assets/*`   | Live demo and different screen views used in `README.md`.                                                                                                               |

</details>

## ©️ Credit

<details>
<summary>Invert</summary>

| File | Description |
| ---- | ----------- |

</details>

## 🔄 Improvements

<details>
<summary>Invert</summary>

- [ ] Allow upload of only images
- [ ] Make logIn and SignUp page more presentable

</details>

## 👤 Curator

1. [Ace Da Costa Silvanus](https://github.com/asdacosta)

**[🞁 Top](#file-uploader)**
