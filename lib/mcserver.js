const {
    spawn
} = require('child_process');
const {
    EventEmitter
} = require('events');
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
    constructor(config) {
        super();

        const { jarFile, dedicatedMemory, folderDir } = config;

        this.folderDir = folderDir;

        this.stateRegex = {
            startingRegex: /Starting minecraft server version/,
            runningRegex: /Done (.*)! For help, type "help"/
        }

        this.dedicatedMemory = dedicatedMemory;

        this.jarFile = jarFile;

        this.state = STATES.STOPPED;
      
    }

    /**
     * Starts the Minecraft Server 
     * Spawns a child java process for the server
     */
    startServer = async () => {
        if (this.state !== STATES.STOPPED) {
            throw new Error("Server Already Running!");
        }

        const isEulaSigned = await this.isEulaSigned();
        if (!isEulaSigned) {
            throw new Error("EULA");
        }

        const launchOptions = this.buildServerOptions();

        this.serverProcess = spawn("java", launchOptions, {
            cwd: `./${this.folderDir}`
        });

        this.setState(STATES.STARTING);
        this.serverProcess.on('close', () => this.setState(STATES.STOPPED));
        this.serverProcess.stdout.on('data', (data) => this.handleConsoleOutput(data));

        return "Server Started";

    }

    /**
     * Sends the stop command to the minecraft server
     */
    stopServer = async () => {
        this.sendCommand("stop");

        return "Server Stopping";
    }

    /**
     * Forcefully kills the java process for the minecraft server.
     * NOT RECOMMENDED for casually stopping the server and will lead to world data loss. 
     */
    killServer = async () => {
        await fkill(this.serverProcess.pid, {
                force: true
            })
            .catch(err => {
                throw new Error(`Failed to kill server: ${err}`);
            })

        return "Server Killed";
    }

    //Set the state of the server
    setState = (state) => {
        this.state = state;
        this.emit('state', state);
    }

    /**
     * Returns the current state of the server
     * Starting - The server has not completed initialization
     * Running - The server is currently active and ready to accept players
     * Stopped - The server is currently inactive. 
     */
    getState = async () => {
        return this.state;
    }

    /**
     * Sends a command to the minecraft server.
     * Uses STDIN to write the command to the console
     */
    sendCommand = async (command) => {
        this.serverProcess.stdin.write(command + "\n");
        return "Sent Command";
    }

    /**
     * Parses the console STDOUT into a more readable format. 
     * Emits each console output as an event to the websocket.
     * Also checks to see if the server state has changed 
     */
    handleConsoleOutput = async (data) => {

        //retrieve string from buffer
        const consoleOutput = await data.toString();

        //split console output by newline operator for formatting
        //send output to client
        this.emit('console', await consoleOutput.split("\n"));

        //convert string output to consoleEvent object
        const regex = /(\[[0-9:]*\]) \[([A-z(-| )#0-9]*)\/([A-z #]*)\]: (.*)/gm;

        //use regex to split the console output into a log object
        const line = await consoleOutput.split(regex);

        const consoleLog = {
            timeStamp: line[1],
            thread: line[2],
            level: line[3],
            output: line[4]
        }

        //Check if the server state has changed
        if (this.state != STATES.RUNNING) {
            if (this.stateRegex.startingRegex.test(consoleLog.output)) {
                this.setState(STATES.STARTING);
            } else if (this.stateRegex.runningRegex.test(consoleLog.output)) {
                this.setState(STATES.RUNNING);
            }
        }

    }

    /**
     * Reads the server.properties file 
     * Returns a JSON string contaiining the properties from the server.properties file
     */
    readProperties = async () => {
        const serverProperties = {};

        const propertiesFile = await fs.readFile(path.join(__dirname, `..${this.folderDir}/server.properties`), 'utf-8')
            .catch((err) => {
                //server.properties file not found
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

    /**
     * Writes the Minecraft Server Properties to the server.properties file.
     * Accepts only a Javascript Object (not a JSON string)
     */
    writeProperties = async (serverProperties) => {
        let propertiesFile = ""

        //Iterate through the object and convert to server.properties format
        Object.keys(serverProperties).forEach(key => {
            propertiesFile = propertiesFile.concat(`${key}=${serverProperties[key]}\n`)

        });

        //Write the file to the server directory (Save)
        await fs.writeFile(path.join(__dirname, `..${this.folderDir}/server.properties`), propertiesFile);

        return "Settings Saved Successfully"
    }

    /**
     * Checks to see if the Mojang End User License Agreement (EULA) is accepted
     * Returns a boolean
     */
    isEulaSigned = () => {
        return fs.readFile(path.join(__dirname, `..${this.folderDir}/eula.txt`), 'utf-8')
            .then(propertiesFile => {
                const serverProperties = {};

                propertiesFile.split('\n').forEach((property) => {
                    property = property.trim();

                    //Do not include lines that are commented out or empty
                    if (property[0] === "#" || property == '') {
                        return;
                    }

                    let [key, value] = property.split('=');
                    serverProperties[key] = value;
                })

                if (serverProperties["eula"] == "true") {
                    return true;
                } else {
                    return false;
                }
            })
            .catch((err) => {
                //file not found
                if (err.code === "ENOENT") return false;
            })
        }

    /**
     * Changes the Mojang EULA agreement file to true
     */
    acceptEULA = async () => {
        return fs.writeFile(path.join(__dirname, `..${this.folderDir}/eula.txt`), "eula=true")
            .then(() => { return "Success" })
            .catch((err) => {return err});
    }

    /**
     * Builds the launch parameters for the minecraft server.
     * Returns a string containing the users specified memory, and various other experimental options
     * that are used to improve the performance of the server
     */
    buildServerOptions = () => {
        //Add Experimental Flags
        let experimentalFlags = [
            "-XX:+UseG1GC",
            "-XX:+ParallelRefProcEnabled",
            "-XX:MaxGCPauseMillis=200",
            "-XX:+UnlockExperimentalVMOptions", //Allows experimental options to be used
            "-XX:+DisableExplicitGC",
            "-XX:+AlwaysPreTouch",
            "-XX:G1HeapWastePercent=5",
            "-XX:G1MixedGCCountTarget=4",
            "-XX:G1MixedGCLiveThresholdPercent=90",
            "-XX:G1RSetUpdatingPauseTimePercent=5",
            "-XX:SurvivorRatio=32",
            "-XX:+PerfDisableSharedMem",
            "-XX:MaxTenuringThreshold=1",
            "-Dusing.aikars.flags=https://mcflags.emc.gs",
            "-Daikars.new.flags=true",
            "-DIReallyKnowWhatIAmDoingISwear=true"
        ]

        if (this.dedicatedMemory >= 12) { //if memory is greater than 12GB, use alternative experimental options
            experimentalFlags.push(...["-XX:G1NewSizePercent=40", "-XX:G1MaxNewSizePercent=50", "-XX:G1HeapRegionSize=16M", "-XX:G1ReservePercent=15", "-XX:InitiatingHeapOccupancyPercent=20"])
        } else {
            experimentalFlags.push(...["-XX:G1NewSizePercent=30", "-XX:G1MaxNewSizePercent=40", "-XX:G1HeapRegionSize=8M", "-XX:G1ReservePercent=20", "-XX:InitiatingHeapOccupancyPercent=15"])
        }

        experimentalFlags = experimentalFlags.join(' ')
        return `-Xmx${this.dedicatedMemory}G -Xms${this.dedicatedMemory}G ${experimentalFlags} -jar ${this.jarFile} nogui`.split(' ')
    }

}

module.exports = {
    MCServer: MCServer
}