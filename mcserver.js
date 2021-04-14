const { spawn } = require('child_process');
const { EventEmitter } = require('events');

class MCServer extends EventEmitter {
    
    constructor(config){
        super();
    }
 
    startServer = async () => {
        this.serverProcess = spawn("java -Xmx1024M -Xms1024M -jar minecraft-server.jar nogui");

       

        this.serverProcess.stdout.on('data', (data) => this.consoleLog(data));
        
        return "Server Started";
    }

    killServer = () => {

    }

    consoleLog = async (data) => {
        console.log(data.toString());
        
        return data;
    }
}


module.exports = {
    MCServer: MCServer
}