const { spawn } = require('child_process');
const { EventEmitter } = require('events');
const fs = require('fs').promises;
const path = require('path')
const fkill = require('fkill');


//Server States (Starting, Running, Stopped)
const STATES = {
    RUNNING: 'SERVER_RUNNING',
    STARTING: 'SERVER_STARTING',
    STOPPED: 'SERVER_STOPPED'
}

class MCServer extends EventEmitter {
    
    constructor(config){
        super();

        const { jarFile, Xmx, Xms, folderDir } = config;

        this.folderDir = folderDir;

        this.stateRegex = {
            startingRegex: /Starting minecraft server version/,
            runningRegex: /Done (.*)! For help, type "help"/
        }
        
        this.launchOptions = [`-Xmx${Xmx}`, `-Xms${Xms}`, "-DIReallyKnowWhatIAmDoingISwear=true", "-jar", jarFile, "nogui"]
        this.state = STATES.STOPPED;
        this.pid = 0;
    }
 
    //Spawns the minecraft server
    startServer = async () => {
        if(this.state === STATES.STOPPED) {
            this.setState(STATES.STARTING);
            this.serverProcess = spawn("java", this.launchOptions, {cwd: `./${this.folderDir}`});
            this.serverProcess.on('close', () => this.setState(STATES.STOPPED));
            this.serverProcess.stdout.on('data', (data) => this.handleConsoleOutput(data));
            this.pid = this.serverProcess.pid;
            return "Server Started";
        }else{
            throw new Error("Server already running!");
        }
    }

    //Stops the server gracefully 
    stopServer = async () => {
        this.sendCommand("stop");
        return "Server Stopping";
    }

    //Forces the server to stop 
    killServer = async () => {
        try {
            await fkill(this.pid, {force: true})
        
            return "Server Killed"
        }catch (err) {
            console.log(err)
            throw new Error("Failed to kill server");
        }
      
    }

    //Set the state of the server
    setState = (state) => {
        this.state = state;
        this.emit('state', state);
    }

    //Returns the current state of the server
    getState = async () => {
        return this.state;
    }

    //Sends a command to the console via STDIN
    sendCommand = async (command) => {
        this.serverProcess.stdin.write(command + "\n");
        return "Sent Command";
    }

    handleConsoleOutput = async (data) => {

        //retrieve string from buffer
        const consoleOutput = await data.toString();

        //split console output by newline operator for formatting
        //send output to client
        this.emit('console', await consoleOutput.split("\n"));

        //convert string output to consoleEvent object
        const regex = /(\[[0-9:]*\]) \[([A-z(-| )#0-9]*)\/([A-z #]*)\]: (.*)/gm;

        const line = await consoleOutput.split(regex);

        const consoleLog = {
            timeStamp: line[1],
            thread: line[2],
            level: line[3],
            output: line[4]
        }

        //detect server state change from console output
        if(this.state != STATES.RUNNING){
            if(this.stateRegex.startingRegex.test(consoleLog.output)){
                this.setState(STATES.STARTING);
            }else if(this.stateRegex.runningRegex.test(consoleLog.output)){
                this.setState(STATES.RUNNING);
            }
        }
       
    }

    //Reads the server.properies file and returns a json string containing all of the properties
    readProperties = async () => {
        const serverProperties = {};
      
        const propertiesFile = await fs.readFile(path.join(__dirname, `..${this.folderDir}/server.properties`), 'utf-8')
            .catch((err) => {
                if (err.code === "ENOENT") throw new Error("Properties file does not exist. Start the server and try again.");
            })

        propertiesFile.split('\n').forEach((property) => {
            property = property.trim();

            //Do not include lines that are commented out or empty
            if (property[0] === "#" || property == '') {
                return;
            }

            let [key, value] = property.split('=');
            serverProperties[key] = value;
        })

        return JSON.stringify(serverProperties);
    }

    //Saves the minecraft server properties to the server.properties file. Accepts a Javascropt Object (not a JSON)
    writeProperties = async (serverProperties) => {
        let propertiesFile = ""
    
        //Iterate through the object and convert to server.properties format
        Object.keys(serverProperties).forEach(key => {
           propertiesFile = propertiesFile.concat(`${key}=${serverProperties[key]}\n`)
           
        })
    
        //Write the file to the server directory (Save)
        await fs.writeFile(path.join(__dirname, `..${this.folderDir}/server.properties`), propertiesFile);
    
        return "Settings Saved Successfully"
    }

}

module.exports = {
    MCServer: MCServer
}