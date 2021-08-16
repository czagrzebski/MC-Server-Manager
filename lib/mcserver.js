const { spawn } = require('child_process');
const { EventEmitter } = require('events');
const fs = require('fs').promises;
const path = require('path')
const fkill = require('fkill');
const configInfo = require("../config/config-info.json");

//Server States (Starting, Running, Stopped)
const STATES = {
    RUNNING: 'SERVER_RUNNING',
    STARTING: 'SERVER_STARTING',
    STOPPED: 'SERVER_STOPPED'
}

const stateRegex = {
    startingRegex: /Starting minecraft server version/,
    runningRegex: /Done (.*)! For help, type "help"/
}

class MCServer extends EventEmitter {
    constructor(UUID) {
        super();
        this.state = STATES.STOPPED;
        this.UUID = UUID;
    }

    /**
     * Starts the Minecraft Server 
     * Spawns a child java process for the server
     */
    startServer = async () => {
        const config = await this.getServerConfig();

        if (this.state !== STATES.STOPPED) {
            throw new Error("Server Already Running!");
        }

        //Check if EULA is signed
        const isEulaSigned = await this.isEulaSigned();
        if (!isEulaSigned) {
            throw new Error("EULA");
        }

        //Generate the startup flags for the Minecraft Server
        const launchOptions = await this.buildServerOptions();
  
        //Spawn the Server
        this.serverProcess = spawn("java", launchOptions, {
            cwd: (path.join(__dirname, `..${config.folderDir.value}/`))
        });

        this.setState(STATES.STARTING);
        this.serverProcess.on('close', () => this.setState(STATES.STOPPED));

        //Set error handler if the process dies unexpectedly 
        this.serverProcess.on('error', (err) => console.log(err))

        //Set event handler for console outputs (forwards to frontend client)
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
            if (stateRegex.startingRegex.test(consoleLog.output)) {
                this.setState(STATES.STARTING);
            } else if (stateRegex.runningRegex.test(consoleLog.output)) {
                this.setState(STATES.RUNNING);
            }
        }

    }

     /**
     * Checks to see if the Mojang End User License Agreement (EULA) is accepted
     * Returns a boolean
     */
      isEulaSigned = async () => {
        const config = await this.getServerConfig();
       
        return fs.readFile(path.join(__dirname, `..${config.folderDir.value}/eula.txt`), 'utf-8')
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

                if (serverProperties["eula"] == "true") 
                    return true;
        
                return false;
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
        const config = await this.getServerConfig();

        return fs.writeFile(path.join(__dirname, `..${config.folderDir.value}/eula.txt`), "eula=true")
            .then(() => { return "Success" })
            .catch((err) => {return err});
    }

    /**
     * Reads the server.properties file 
     * @Returns A javascript object containing the server properties
     */
    getServerProperties = async () => {
        const config = await this.getServerConfig();

        let serverProperties = {
            minecraftSettings: {}
        };

        const propertiesFile = await fs.readFile(path.join(__dirname, `..${config.folderDir.value}/server.properties`), 'utf-8')
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
            
            if(configInfo[key]){
                serverProperties.minecraftSettings[key] = {
                    value: value,
                    name: configInfo[key].name,
                    type: configInfo[key].type,
                    options: configInfo[key].options,
                    default: configInfo[key].default,
                    description: configInfo[key].description,
                    category: configInfo[key].category
                }
            } else {
                serverProperties[key] = value;
            }
        })

        return serverProperties
    }

    /**
     * Writes the Minecraft Server Properties to the server.properties file.
     * Accepts only a Javascript Object (not a JSON string)
     */
    writeServerProperties = async (serverProperties) => {
        let propertiesFile = ""
        
        const config = await this.getServerConfig();

        //Iterate through the object and convert to server.properties format
        Object.keys(serverProperties).forEach(key => {
            propertiesFile = propertiesFile.concat(`${key}=${serverProperties[key].value}\n`)

        });

        //Write the file to the server directory (Save)
        await fs.writeFile(path.join(__dirname, `..${config.folderDir.value}/server.properties`), propertiesFile);

        return "Settings Saved Successfully"
    }

    /**
     * Reads the configuration file and retrieves the server configuration (for this instance) (NOT SERVER.PROPERTIES)
     * @returns A javascript objecting containing the user configuration properties
     */
    getServerConfig = async () => {
        //Open Server Configuration File
        const serverConfigFile = await fs.readFile(path.join(__dirname, `../config/user/config.json`))
            
        //Convert Configuration file from JSON to a Javascript Object
        const serverConfig = JSON.parse(serverConfigFile)["servers"][this.UUID];

        let serverConfigWithInfo = {
            core: {},
            java: {}
        };

        //Add Properties to Server Config Object 
        Object.keys(serverConfig).forEach(property => {
            
            //Add property information to config file (type, friendly name, description, etc)
            if(configInfo[property]){
                serverConfigWithInfo[configInfo[property].category][property] = {
                    value: serverConfig[property],
                    name: configInfo[property].name,
                    type: configInfo[property].type,
                    options: configInfo[property].options,
                    default: configInfo[property].default,
                    description: configInfo[property].description,
                    category: configInfo[property].category
                }
            } else {
                //Property info does not exist
                serverConfigWithInfo[property] = {
                    value: serverConfig[property]
                } 
            }
        })

        return serverConfigWithInfo;
    }

    /**
     * Writes the user configuration to the config.json
     * Accepts a javascript object
     */
    writeServerConfig = async (config) => {
       const userConfig = await fs.readFile(path.join(__dirname, `../config/user/config.json`))
           .catch(err => {
               throw new Error(`Failed to save user configuration: ${err}`)
           })

       const userConfigJSON = JSON.parse(userConfig);
               
       userConfigJSON["servers"][this.UUID] = config;
              
       fs.writeFile(path.join(__dirname, `../config/user/config.json`), JSON.stringify(userConfigJSON))
            .catch(err => {
                throw new Error("Failed to save user configuration");
            })

        return "Successfully saved user configuration";
    }

    /**
     * Fetches the server's configurable settings. This includes the minecraft server.properties and
     * the server configuration settings. Used for display settings in the React App. 
     * @returns A JSON string containing both the user configuration properties and the 
     * server.properties configuration. 
     */
    getServerSettings = async () => {
        let serverProperties = await this.getServerProperties();
        let serverConfiguration = await this.getServerConfig();

        //Remove unchangable settings/properties from config (Example: folder directory, version, etc) 
        //These settings do not need to be configurable and are used for referencing throughout the class
        serverConfiguration = {
            java: serverConfiguration.java,
            core: serverConfiguration.core 
        }

        serverProperties = {
            minecraftSettings: serverProperties.minecraftSettings
        }

        return {
            ...serverProperties,
            ...serverConfiguration
        }
    }

    /**
     * Sets the value of a server setting. This includes the minecraft server.properties and
     * the server configuration settings.
     */
    setServerSetting = async (category, setting, value) => {
        switch (category) {
            case "java":
            case "core":
                //Open Server Config File
                const serverConfigFile = await fs.readFile(path.join(__dirname, `../config/user/config.json`))
                
                //Convert from JSON String to Javascript object
                let serverConfig = JSON.parse(serverConfigFile)["servers"][this.UUID];
                
                //Change Setting
                serverConfig[setting] = value;

                //Save Modified Configuration
                this.writeServerConfig(serverConfig);
                return "Setting Saved Succesfully";

            case "minecraftSettings":
                let serverProperties = await this.getServerProperties();
                serverProperties.minecraftSettings[setting].value = value;
                this.writeServerProperties(serverProperties.minecraftSettings);
                return "Setting Saved Successfully";

            default:
                throw new Error("Invalid Setting Category!")
        }
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
        
        return this.getServerConfig()
            .then(config => {
                if (config.java.maxHeapSize.value >= 12000) { //if memory is greater than 12GB, use alternative experimental options
                    experimentalFlags.push(...["-XX:G1NewSizePercent=40", "-XX:G1MaxNewSizePercent=50", "-XX:G1HeapRegionSize=16M", "-XX:G1ReservePercent=15", "-XX:InitiatingHeapOccupancyPercent=20"])
                } else {
                    experimentalFlags.push(...["-XX:G1NewSizePercent=30", "-XX:G1MaxNewSizePercent=40", "-XX:G1HeapRegionSize=8M", "-XX:G1ReservePercent=20", "-XX:InitiatingHeapOccupancyPercent=15"])
                }
        
                experimentalFlags = experimentalFlags.join(' ')
                return `-Xmx${config.java.maxHeapSize.value}M -Xms${config.java.maxHeapSize.value}M ${experimentalFlags} -jar ${config.core.jarFile.value} nogui`.split(' ')
            })
      }
  }

module.exports = {
    MCServer: MCServer
}