
# MiniSOS

A minimalistic 'social media' where users can write, edit, delete, and see self or other's posts.

Initially, this was a repository of RISTEK Web Development Recruitment Assignment which then rebranded to MiniSOS. The deployed application can be found [here](https://beastonking-ristek-medsos.cyclic.app/).     

Note: Make sure to turn off any custom DNS settings. Sometimes the website cannot be opened if you set a certain DNS settings for some reason. (Cyclic is weird I know)

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

### How to Run Locally
1. Clone this repository
2. Install the necessary packages using `npm install`
3. This project uses an env file. An `env-template` file is provided.
4. Open powershell, run `mongod`
5. Open another powershell, run `mongosh` (Performing MongoDB queries can be done in this powershell window)
6. Run `node index.js` in the root folder of the project
7. Go to `localhost:3000`