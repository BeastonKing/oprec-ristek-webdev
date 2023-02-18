
# Tugas Recruitment Web Development RISTEK

This is a repository of RISTEK Web Development Recruitment Assignment. The deployed application can be found {LINK TO WEB}.

## Local Installation
### Pre-Installation Notes
These installation steps were made for Windows OS as this was tested on Windows 11 Home (Version 21H2)
### Prerequisites
- Node JS ([Node.js main page](https://nodejs.org/en/)) (This project uses version 16.19.0)
- MongoDB 
  - Download MongoDB Community Version ([Download page](https://www.mongodb.com/try/download/community)) (This project was run version 6.0.3)
  - Install MongoDB Community Version
    - Choose custom installation and change the installation folder to `C:\mongodb` (optional as this was done to easily locate it)
    - Continue until Service Configuration page shows up. Untick "Install MongoD as a Service"
    - Untick "Install MongoDB Compass" (optional)
    - Restart PC if necessary
    - Open powershell and create a directory using command `mkdir C:\data`
    - Create a subdirectory using command `mkdir C:\data\db`
    - Close powershell
    - Add system environment variable to MongoDB bin folder (in this case add `C:\mongodb\bin`)

  - Download Mongo Shell ([Download page](https://www.mongodb.com/try/download/shell)) (This project was run on version 1.6.2)
  - Install Mongo Shell
    - Add system environment variable to Mongo Shell installation folder (the default is `C:\Program Files\mongosh\`)
  - ENV file ([Drive link](https://drive.google.com/file/d/1fawE-HGVJNR5uRkKy-9iSbuIKsMU_Vci/view?usp=sharing))
    - Change the filename if necessary to ensure its name is `.env`

### How to Run Locally
1. Open terminal
2. Clone this repository and install the necessary packages
    - `git clone https://github.com/BeastonKing/oprec-ristek-webdev.git`
    - `cd oprec-ristek-webdev`
    - `npm install`
3. Move `.env` file to the root of the project
4. Open powershell, run `mongod`
5. Open another powershell, run `mongosh` (Performing MongoDB queries can be done in this powershell window)
6. Run `node app.js` in the root folder of the project
7. Go to `localhost:3000`