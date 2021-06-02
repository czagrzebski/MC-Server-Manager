const { spawn } = require('child_process');
const { Console } = require('console');
const { EventEmitter } = require('events');
const fs = require('fs').promises;

//Server States (Starting, Running, Stopped)
const STATES = {
    RUNNING: 'SERVER_RUNNING',
    STARTING: 'SERVER_STARTING',
    STOPPED: 'SERVER_STOPPED'
}

class MCServer extends EventEmitter {
    
    constructor(config){
        super();

        this.stateRegex = {
            startingRegex: /Starting minecraft server version/,
            runningRegex: /Done (.*)! For help, type "help"/
        }

        const { jarFile, Xmx, Xms } = config;

        this.launchOptions = [`-Xmx${Xmx}`, `-Xms${Xms}`, "-DIReallyKnowWhatIAmDoingISwear=true", "-jar", jarFile, "nogui"]
        this.state = STATES.STOPPED;
        this.pid = 0;
    }
 
    //Spawns the minecraft server
    //TODO: Add Detection to Prevent the Server from spawning a new process when it's already running
    startServer = async () => {
        this.serverProcess = spawn("java", this.launchOptions, {cwd: './test-server'});
        this.serverProcess.on('close', () => this.setState(STATES.STOPPED));
        this.serverProcess.stdout.on('data', (data) => this.handleConsoleOutput(data));
        this.pid = this.serverProcess.pid;
        return "Server Started";
    }

    //Stops the server gracefully 
    stopServer = async () => {
        this.sendCommand("stop");
        return "Server Closing";
    }

    //Forces the server to stop 
    killServer = async () => {
        this.serverProcess.kill('SIGINT');
        return "Server Stopping";
    }

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

    //Reads the server.properies and returns a json string
    readProperties = async () => {
        const serverProperties = {};

        const propertiesFile = await fs.readFile('server.properties', 'utf-8');

        propertiesFile.split('\n').forEach((property) => {
            property = property.trim();

            //Do not include comments
            if (property[0] === "#" || property == '') {
                return;
            }

            let [key, value] = property.split('=');
            serverProperties[key] = value;
        })

        return JSON.stringify(serverProperties);
    }

}

module.exports = {
    MCServer: MCServer
}