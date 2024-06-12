# Meeting
A plugin that helps you wrangle your meetings together.
![demo](./assets/demo.gif)

It exports commands that streamlines creating notes to capture meeting information and attendance.

## Key Features
- Quickly create a meeting note with Title, Agenda, Participants
- Search functionality for Selecting Participants
- Backlink reference to meeting in your daily notes
- Use built-in audio-recorder to record the meeting
- Timestamped start and stop dates
- Automatically insert new notes for meeting participants if they do not exist in your vault.
- Customisable settings for different workflows.

## Installation
### Obsidian Plugin store
Not Available Yet 

### Via Install Script
1. Clone down this repository to your local machine.
  ```sh
  git clone git@github.com:wannabewayno/AutoLinker.git && cd meeting
  ```

2. Run the provided installer script.\
  The first and only argument to the installer script will be the absolute directory of the vault you wish to add the plugin to.

  **Powershell:**
  ```sh
  ./install.ps1 /path/to/your/vault
  ```

  **Bash:**
  ```sh
  ./install.sh /path/to/your/vault
  ```
  *__Note:__ If you encounter a permission denied error, ensure the script is executable with `chmod +x ./install.sh`* 

3. Refresh plugins to populate the list
4. Enable the plugin.

### Manually
1. Clone down the repository.
  ```sh
  git clone git@github.com:wannabewayno/AutoLinker.git && cd meeting
  ```

2. Build the Plugin.\
  **Node**
  ```sh
  npm run build
  ```

  **Bun**
  ```sh
  bun run build
  ```

3. Export your vault path for later reference
  1. First extract the pluginId from the manifest.
    ```sh
    export PluginId="$(jq -r '.id' ./manifest.json)"
    ```
  2. export the plugin dir
    ```sh
    export PluginDir="$VaultDir/.obsidian/plugins/$PluginId"
    ```

4. Create the plugin directory in your target vault
  ```sh
  mkdir -p $PluginDir
  ```

5. Move the necessary plugin files to your vault's plugin folder.
  ```sh
  cp ./{main.js,styles.css,manifest.json} $PluginDir
  ```

6. Refresh plugins to populate the list
7. Enable the plugin.

## Testing
There are no tests at this point in time.

## Usage
This plugin exports two commands.
1. Create Meeting `meeting:create`
2. Stop meeting `meeting:stop`

Bind hot keys to these or use the command palette to interact with them.

### Creating a Meeting
Initiate this command to open a modal that prompts you for
- Title
- Participants
- Agenda (optional)

Hit ok:
- A new note will be created
- A backlink to the note will be added to the active daily note
- The Audio Recorder will be started
- Flags this meeting as an active meeting
- Timestamps the meeting as active.

Take notes and when you're done, use the [StopMeeting](#stopping-a-meeting) command

### Stopping a Meeting
Stops the active meeting by:
1. Opening the meeting
2. Stop recording and backlink recording to the meeting
3. Unflags the meeting as being active
4. timestamp the meeting as finished.

## Known Issues
None at this stage.


## Road Map
This is already a fairly complex plugin however it is very extensible.
Future considerations will show up here at a high-level.

Please [contact us](#contact) if you want to contribute or have an idea, it might be something we also might like to incorporate.

## Contact
Wayne Griffiths


## Developing
For an integrated development environment when developing an Obsidian plugin, you can open a test vault with this plugin in it and install the hotrealod plugin provided by Obsidian that reloads plugins when they change, couple that with typescript watcher that rebuilds the bundle whenever code changes and you will have live reloading.

Exact steps for this need to be added...