const { spawn } = require('child_process');
const { Console } = require('console');
const { EventEmitter } = require('events');

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
 
    startServer = async () => {
        this.serverProcess = spawn("java", this.launchOptions, {cwd: './test-server'});
        this.serverProcess.on('close', () => this.setState(STATES.STOPPED));
        this.serverProcess.stdout.on('data', (data) => this.handleConsoleOutput(data));
        this.pid = this.serverProcess.pid;
        return "Server Started";
    }

    stopServer = async () => {
        this.sendCommand("stop");
        return "Server Closing";
    }

    killServer = async () => {
        this.serverProcess.kill();
        return "Server Stopping";
    }

    setState = (state) => {
        this.state = state;
        this.emit('state', state);
    }

    getState = async () => {
        return this.state;
    }

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

}

module.exports = {
    MCServer: MCServer
}