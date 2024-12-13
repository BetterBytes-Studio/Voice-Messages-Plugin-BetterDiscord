/**
 * @name VoiceMessages
 * @version 0.0.1
 * @author UnStackss
 * @authorId 1131965612890005626
 * @website https://github.com/UnStackss
 * @source https://github.com/UnStackss/Voice-Messages-Plugin-BetterDiscord/tree/master
 * @updateUrl https://raw.githubusercontent.com/UnStackss/Voice-Messages-Plugin-BetterDiscord/master/VoiceMessages.plugin.js
 * @invite NPa6DtPtMU
 */
module.exports = (() => {
  const config = {
    info: {
      name: "VoiceMessages",
      authors: [
        {
          name: "UnStackss",
          discord_id: "1131965612890005626",
          github_username: "UnStackss",
        },
      ],
      version: "0.0.1",
      description:
        "🔊 Quickly send voice messages directly in Discord! 🎤 With this plugin, you can easily record and send voice messages right to your channel. Simply press F12 to start recording and press it again to stop and send your message. Perfect for sharing updates, ideas, or just communicating more expressively with friends and your community! 🚀",
      github:
        "https://github.com/UnStackss/Voice-Messages-Plugin-BetterDiscord/tree/master",
      github_raw:
        "https://raw.githubusercontent.com/UnStackss/Voice-Messages-Plugin-BetterDiscord/master/VoiceMessages.plugin.js",
    },
    changelog: [
      {
        title: "🎙️ Send Voice Messages!",
        items: [
          "Now you can send voice messages effortlessly! 🎉",
          "Press F12 to start recording, and press it again to stop and send your message! 🚀",
        ],
      },
    ],
  };

  return class VoiceMessages {
    constructor() {
      this._config = config;
      this.recording = false;
    }

    getName() {
      return config.info.name;
    }

    getAuthor() {
      return config.info.authors.map((a) => a.name).join(", ");
    }

    getDescription() {
      return config.info.description;
    }

    getVersion() {
      return config.info.version;
    }

    load() {
      BdApi.showToast("VoiceMessages plugin loaded!", {
        type: "info",
      });
    }

    start() {
      document.addEventListener("keydown", this.onKeyDown.bind(this));
      BdApi.showToast("VoiceMessages plugin started!", {
        type: "info",
      });
    }

    stop() {
      document.removeEventListener("keydown", this.onKeyDown.bind(this));
      BdApi.showToast("VoiceMessages plugin stopped!", {
        type: "info",
      });
    }

    onKeyDown(event) {
      const settings = BdApi.getData("VoiceMessages", "settings") || {};
      const keybind = settings.keybind || "F12";

      if (event.key === keybind) {
        this.toggleRecording();
        event.preventDefault();
      }
    }

    toggleRecording() {
      if (this.recording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
    }

    startRecording() {
      const discordVoice = DiscordNative.nativeModules.requireModule("discord_voice");
      const settings = BdApi.getData("VoiceMessages", "settings") || {};
      const { echoCancellation = true, noiseCancellation = true } = settings;

      discordVoice.startLocalAudioRecording(
        { echoCancellation, noiseCancellation },
        (success) => {
          if (success) {
            BdApi.showToast("🎙️ Recording started successfully!", { type: "success" });
            this.recording = true;
          } else {
            BdApi.showToast("❌ Failed to start recording.", { type: "error" });
          }
        }
      );
    }

    stopRecording() {
      const discordVoice = DiscordNative.nativeModules.requireModule("discord_voice");
      const settings = BdApi.getData("VoiceMessages", "settings") || {};
      const { useRandomFilename = false, filename = "Recording", format = "mp3" } = settings;

      discordVoice.stopLocalAudioRecording((filePath) => {
        if (!filePath) {
          BdApi.showToast("❌ Failed to stop recording: file path is undefined.", { type: "error" });
          console.error("Recording might not have started or file path is missing.");
          return;
        }

        try {
          const buf = require("fs").readFileSync(filePath);
          if (!buf) {
            throw new Error("File buffer is empty or invalid.");
          }

          const channelId = this.getSelectedChannelId();
          if (!channelId) {
            throw new Error("Channel ID is undefined. Ensure a valid channel is selected.");
          }

          const filenameFinal = useRandomFilename ? this.generateRandomFileName() : filename;

          this.uploadFile(channelId, buf, filenameFinal, format)
            .then(() => {
              BdApi.showToast("🎙️ Recording uploaded successfully!", { type: "success" });
            })
            .catch((uploadError) => {
              console.error("Upload failed:", uploadError);
              BdApi.showToast("❌ Upload failed: " + uploadError.message, { type: "error" });
            });
        } catch (error) {
          console.error("Error during stopRecording:", error);
          BdApi.showToast("❌ Error occurred: " + error.message, { type: "error" });
        } finally {
          this.recording = false;
        }
      });
    }

    getSelectedChannelId() {
      const channelModule = BdApi.findModuleByProps("getSelectedChannelId");
      if (channelModule && channelModule.getSelectedChannelId) {
        return channelModule.getSelectedChannelId();
      }

      console.warn("getSelectedChannelId is unavailable.");
      return null;
    }

    async uploadFile(channelId, buffer, filename, format) {
      try {
        const uploadModule = BdApi.findModuleByProps("instantBatchUpload", "upload");
        if (!uploadModule) {
          throw new Error("Upload module is unavailable.");
        }

        await uploadModule.instantBatchUpload({
          channelId,
          files: [
            new File([new Blob([buffer], { type: `audio/${format}` })], `${filename}.${format}`),
          ],
        });
      } catch (error) {
        console.error("File upload failed:", error);
        throw new Error("Failed to upload file: " + error.message);
      }
    }

    static generateRandomFileName = function () {
      const names = [
        "PixelPurr😺",
        "FuzzyFling🦄",
        "ChirpChomp🐦",
        "BlipBop🎉",
        "DoodlePop🧚‍♀️",
        "SizzleSnap🔥",
        "GlimmerGlow🌟",
        "SqueakZoom🐭",
        "FizzFizz💧",
        "BuzzBop💥",
        "ZapZap⚡",
        "TwinkleTee✨",
        "SparkleSwoosh💫",
        "TwangTee🎵",
        "QuirkyQuip🤪",
        "ChirpBing🐣",
        "PopFizz🍾",
        "DoodleBloop🌀",
        "GlimmerPop💎",
        "SqueakZap⚡️",
        "TwistyTing🎠",
        "SnappySparkle✨",
        "WhisperWiz🌌",
        "GlitzyGlimpse💫",
        "FuzzyFizz🐼",
        "BubblyBuzz💧",
        "SlickSizzle🔥",
        "QuirkyChirp🐦",
        "DazzleGlow🌟",
        "GlimmerSnap✨",
        "WhisperTing🕊️",
        "PopFizz🎈",
        "SqueakySnap🐭",
        "FizzFizz💦",
        "BuzzBling💎",
        "TwinklePop🌠",
        "DoodleSwoosh🌌",
        "SnapSparkle🌟",
        "BlingBop💥",
        "WhisperFizz✨",
        "GlimmerTee🎵",
        "SizzleBling🔥",
        "PopBling💫",
        "TwistySwoosh🎠",
        "WhisperSparkle🌌",
        "GlitzyChirp🐦",
        "FizzBling💧",
        "BuzzPop💥",
        "SlickTing🔥",
        "QuirkyBop🤪",
        "ChirpSizzle🐦",
        "TwistBling🎠",
        "DoodlePop💎",
        "GlimmerSwoosh✨",
        "SnapBuzz💧",
        "WhisperPop🌌",
        "FizzTing💦",
        "BuzzSnap💥",
        "SizzleChirp🔥",
        "TwistSwoosh🎠",
        "PopFizz✨",
        "GlimmerBop💎",
        "ChirpTing🐦",
        "WhisperSwoosh🌌",
        "TwistPop🎠",
        "DoodleSnap💫",
        "SizzleFling🔥",
        "BuzzBling💥",
        "TwistBop🎠",
        "GlimmerFizz✨",
        "PopTing💦",
        "SlickSnap🔥",
        "BlingChirp💎",
        "WhisperBling🌌",
        "DoodleFling🌀",
        "FizzBuzz💦",
        "TwistBling🎠",
        "PopSizzle💥",
        "ChirpBling🐦",
        "GlimmerSwoosh✨",
        "FizzPop💧",
        "TwistSnap🎠",
        "BlingSizzle💫",
        "WhisperFizz🌌",
        "DoodleBop💫",
        "FizzBop💦",
        "GlimmerFling💎",
        "SizzlePop🔥",
        "TwistTee🎠",
        "WhisperSnap🌌",
        "PopFizz💥",
        "BlingSwoosh💫",
        "ChirpTee🐦",
        "TwistBling🎠",
        "DoodleSnap💫",
        "GlitterBuzz💫",
        "SqueakBling🐭",
        "BuzzFizz💥",
        "ChirpDazzle🐦",
        "TwistFizz🎠",
        "DoodleBling🌀",
        "SparkleChirp💫",
        "PopSnap💧",
        "FizzChirp💦",
        "BlingSwoosh🎠",
        "SizzlePop💥",
        "TwistBuzz🔥",
        "DoodleFizz🌀",
        "ChirpTing🐦",
        "SlickBling🔥",
        "WhisperPop🌌",
        "BuzzSwoosh💥",
        "GlimmerChirp💎",
        "FizzSnap💦",
        "BlingTwist🎠",
        "DoodleBling💎",
        "SizzleChirp🐦",
        "BuzzFizz💦",
        "PopSparkle💫",
        "TwistFizz🎠",
        "ChirpSizzle🐦",
        "FizzBop💧",
        "DoodleBling🌀",
        "WhisperBuzz🌌",
        "SizzleFizz🔥",
        "BuzzChirp💥",
        "TwistBop🎠",
        "GlimmerFizz💎",
        "SlickFizz🔥",
        "PopTwist🎈",
        "DoodleBuzz🌀",
        "FizzSnap💦",
        "ChirpPop🐦",
        "TwistBling🎠",
        "SizzleBuzz🔥",
        "GlimmerBling💎",
        "PopSizzle💥",
        "WhisperFling🌌",
        "BuzzFizz💥",
        "DoodleChirp🌀",
        "FizzPop💧",
        "TwistSnap🎠",
        "SizzleBling🔥",
        "WhisperBop🌌",
        "BuzzFizz💦",
        "ChirpTwist🐦",
        "DoodleFizz🌀",
        "SizzleFizz🔥",
        "FizzBop💧",
        "GlimmerBling💎",
        "BuzzSnap💥",
        "PopChirp🎈",
        "TwistSizzle🎠",
        "WhisperSnap🌌",
        "FizzBuzz💦",
        "DoodleChirp💫",
        "SizzleFizz🔥",
        "ChirpBling🐦",
        "PopFizz💥",
        "BuzzFizz💦",
        "FizzBop💧",
        "TwistFizz🎠",
        "GlimmerFizz💎",
        "WhisperBuzz🌌",
        "SizzleBling🔥",
        "DoodleSnap🌀",
        "FizzPop💧",
        "ChirpFizz🐦",
        "TwistBuzz🎠",
        "SizzleBling🔥",
        "PopSnap💥",
        "FizzChirp💦",
        "BuzzBling💥",
        "DoodleFizz🌀",
        "WhisperFizz🌌",
      ];
      return names[Math.floor(Math.random() * names.length)];
    };
    
    
    async uploadFile(channelId, buffer, filename, format) {
      try {
        const uploadModule = BdApi.findModuleByProps("instantBatchUpload", "upload");
        if (!uploadModule) {
          throw new Error("Upload module not found.");
        }
    
        // Prepara i dati per il caricamento
        await uploadModule.instantBatchUpload({
          channelId,
          files: [
            new File([new Blob([buffer], { type: `audio/${format}` })], `${filename}.${format}`),
          ],
        });
    
        return { success: true };
      } catch (error) {
        console.error("Error during file upload:", error);
        return { success: false, error: error.message || "Unknown error" };
      }
    }
    
    static generateRandomFileName = function () {
      const names = [
        "PixelPurr😺",
        "FuzzyFling🦄",
        "ChirpChomp🐦",
        "BlipBop🎉",
        "DoodlePop🧚‍♀️",
        "SizzleSnap🔥",
        "GlimmerGlow🌟",
        "SqueakZoom🐭",
        "FizzFizz💧",
        "BuzzBop💥",
        "ZapZap⚡",
        "TwinkleTee✨",
        "SparkleSwoosh💫",
        "TwangTee🎵",
        "QuirkyQuip🤪",
        "ChirpBing🐣",
        "PopFizz🍾",
        "DoodleBloop🌀",
        "GlimmerPop💎",
        "SqueakZap⚡️",
        "TwistyTing🎠",
        "SnappySparkle✨",
        "WhisperWiz🌌",
        "GlitzyGlimpse💫",
        "FuzzyFizz🐼",
        "BubblyBuzz💧",
        "SlickSizzle🔥",
        "QuirkyChirp🐦",
        "DazzleGlow🌟",
        "GlimmerSnap✨",
        "WhisperTing🕊️",
        "PopFizz🎈",
        "SqueakySnap🐭",
        "FizzFizz💦",
        "BuzzBling💎",
        "TwinklePop🌠",
        "DoodleSwoosh🌌",
        "SnapSparkle🌟",
        "BlingBop💥",
        "WhisperFizz✨",
        "GlimmerTee🎵",
        "SizzleBling🔥",
        "PopBling💫",
        "TwistySwoosh🎠",
        "WhisperSparkle🌌",
        "GlitzyChirp🐦",
        "FizzBling💧",
        "BuzzPop💥",
        "SlickTing🔥",
        "QuirkyBop🤪",
        "ChirpSizzle🐦",
        "TwistBling🎠",
        "DoodlePop💎",
        "GlimmerSwoosh✨",
        "SnapBuzz💧",
        "WhisperPop🌌",
        "FizzTing💦",
        "BuzzSnap💥",
        "SizzleChirp🔥",
        "TwistSwoosh🎠",
        "PopFizz✨",
        "GlimmerBop💎",
        "ChirpTing🐦",
        "WhisperSwoosh🌌",
        "TwistPop🎠",
        "DoodleSnap💫",
        "SizzleFling🔥",
        "BuzzBling💥",
        "TwistBop🎠",
        "GlimmerFizz✨",
        "PopTing💦",
        "SlickSnap🔥",
        "BlingChirp💎",
        "WhisperBling🌌",
        "DoodleFling🌀",
        "FizzBuzz💦",
        "TwistBling🎠",
        "PopSizzle💥",
        "ChirpBling🐦",
        "GlimmerSwoosh✨",
        "FizzPop💧",
        "TwistSnap🎠",
        "BlingSizzle💫",
        "WhisperFizz🌌",
        "DoodleBop💫",
        "FizzBop💦",
        "GlimmerFling💎",
        "SizzlePop🔥",
        "TwistTee🎠",
        "WhisperSnap🌌",
        "PopFizz💥",
        "BlingSwoosh💫",
        "ChirpTee🐦",
        "TwistBling🎠",
        "DoodleSnap💫",
        "GlitterBuzz💫",
        "SqueakBling🐭",
        "BuzzFizz💥",
        "ChirpDazzle🐦",
        "TwistFizz🎠",
        "DoodleBling🌀",
        "SparkleChirp💫",
        "PopSnap💧",
        "FizzChirp💦",
        "BlingSwoosh🎠",
        "SizzlePop💥",
        "TwistBuzz🔥",
        "DoodleFizz🌀",
        "ChirpTing🐦",
        "SlickBling🔥",
        "WhisperPop🌌",
        "BuzzSwoosh💥",
        "GlimmerChirp💎",
        "FizzSnap💦",
        "BlingTwist🎠",
        "DoodleBling💎",
        "SizzleChirp🐦",
        "BuzzFizz💦",
        "PopSparkle💫",
        "TwistFizz🎠",
        "ChirpSizzle🐦",
        "FizzBop💧",
        "DoodleBling🌀",
        "WhisperBuzz🌌",
        "SizzleFizz🔥",
        "BuzzChirp💥",
        "TwistBop🎠",
        "GlimmerFizz💎",
        "SlickFizz🔥",
        "PopTwist🎈",
        "DoodleBuzz🌀",
        "FizzSnap💦",
        "ChirpPop🐦",
        "TwistBling🎠",
        "SizzleBuzz🔥",
        "GlimmerBling💎",
        "PopSizzle💥",
        "WhisperFling🌌",
        "BuzzFizz💥",
        "DoodleChirp🌀",
        "FizzPop💧",
        "TwistSnap🎠",
        "SizzleBling🔥",
        "WhisperBop🌌",
        "BuzzFizz💦",
        "ChirpTwist🐦",
        "DoodleFizz🌀",
        "SizzleFizz🔥",
        "FizzBop💧",
        "GlimmerBling💎",
        "BuzzSnap💥",
        "PopChirp🎈",
        "TwistSizzle🎠",
        "WhisperSnap🌌",
        "FizzBuzz💦",
        "DoodleChirp💫",
        "SizzleFizz🔥",
        "ChirpBling🐦",
        "PopFizz💥",
        "BuzzFizz💦",
        "FizzBop💧",
        "TwistFizz🎠",
        "GlimmerFizz💎",
        "WhisperBuzz🌌",
        "SizzleBling🔥",
        "DoodleSnap🌀",
        "FizzPop💧",
        "ChirpFizz🐦",
        "TwistBuzz🎠",
        "SizzleBling🔥",
        "PopSnap💥",
        "FizzChirp💦",
        "BuzzBling💥",
        "DoodleFizz🌀",
        "WhisperFizz🌌",
      ];
      return names[Math.floor(Math.random() * names.length)];
    };
    

    getSettingsPanel() {
      const settingsPanel = document.createElement("div");
      settingsPanel.classList.add("settings-panel");
      settingsPanel.innerHTML = `
        <style>
          .settings-panel {
            background-color: #121212;
            color: #E0E0E0;
            padding: 20px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
            font-family: 'Roboto', sans-serif;
          }
  
          .feature-card {
            background-color: #1E1E1E;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 15px;
            text-align: center;
            width: 90%;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
            transition: box-shadow 0.3s, transform 0.3s;
          }
  
          .feature-card:hover {
            box-shadow: 0px 4px 8px rgba(59, 130, 246, 0.8);
            transform: translateY(-5px);
          }
  
          .feature-card.disabled {
            filter: blur(3px);
            pointer-events: none;
          }
  
          .feature-card h3 {
            font-size: 1.2em;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 10px;
          }
  
          .feature-card p {
            font-size: 1em;
            line-height: 1.6;
            color: #B0B0B0;
          }
  
          .settings-input {
            margin-top: 10px;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #333;
            background-color: #1E1E1E;
            color: #FFF;
            outline: none;
            font-size: 1em;
            width: calc(100% - 20px);
            transition: box-shadow 0.3s;
          }
  
          .settings-input:hover {
            box-shadow: 0px 0px 8px rgba(59, 130, 246, 0.8);
          }
  
          .save-button {
            background-color: #3b82f6;
            color: #FFF;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1em;
            margin-top: 20px;
            transition: background-color 0.3s, box-shadow 0.3s;
          }
  
          .save-button:hover {
            background-color: #2563eb;
            box-shadow: 0px 4px 8px rgba(59, 130, 246, 0.8);
          }
  
          .hidden {
            display: none;
          }
  
           @keyframes pulse {
0% {
opacity: 1;
}
50% {
opacity: 0.5;
}
100% {
opacity: 1;
}
}

.switch {
position: relative;
display: inline-block;
width: 40px;
height: 20px;
}

.switch input {
opacity: 0;
width: 0;
height: 0;
}

.slider {
position: absolute;
cursor: not-allowed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background-color: #ccc;
transition: .4s cubic-bezier(0, 1, 0.5, 1);
border-radius: 20px;
}

.slider:before {
position: absolute;
content: "";
height: 14px;
width: 14px;
left: 3px;
bottom: 3px;
background-color: white;
transition: .4s cubic-bezier(0, 1, 0.5, 1);
border-radius: 50%;
}

.slider.small {
width: 40px;
height: 20px;
}

.slider.small:before {
height: 14px;
width: 14px;
}

.slider.round {
border-radius: 34px;
}

.slider.round:before {
border-radius: 50%;
}

.custom-radio {
appearance: none;
background-color: #1E1E1E;
margin: 0;
font: inherit;
width: 20px;
height: 20px;
border: 2px solid #333;
border-radius: 50%;
display: grid;
place-content: center;
cursor: pointer;
outline: none;
transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease-in-out, box-shadow 0.3s ease;
position: relative;
}

.custom-radio:hover {
border-color: #3b82f6;
transform: scale(1.1);
}

.custom-radio:checked {
background-color: #3b82f6;
border-color: #3b82f6;
box-shadow: 0 0 8px #3b82f6;
}

.custom-radio::before {
content: '';
width: 12px;
height: 12px;
background-color: transparent;
clip-path: polygon(14% 44%, 0% 63%, 50% 100%, 100% 0%, 85% 0%, 43% 78%);
transform: scale(0);
transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
}

.custom-radio:checked::before {
background-color: #ffffff;
transform: scale(1);
}

.custom-radio-label {
margin-left: 8px;
color: #B0B0B0;
font-size: 1em;
cursor: pointer;
transition: color 0.3s ease;
}

.custom-radio-label:hover {
color: #3b82f6;
}

        </style>
        <section class="feature-section">
          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; margin-bottom: 20px; gap: 10px;">
<div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
<span style="color: #B0B0B0; font-size: 1em;">🚀 Send as Real Voice Message</span>
<label class="switch" style="margin: 0; opacity: 0.5; cursor: not-allowed;">
<input type="checkbox" class="settings-input" disabled>
<span class="slider small round"></span>
</label>
</div>
<span style="color: crimson; font-size: 0.9em; animation: pulse 1.5s infinite;">This feature is under maintenance and will be added in a future update.</span>
</div>
          <div class="feature-card" id="keybindCard">
            <h3>⌨️ Keybind</h3>
            <p>Set your preferred keybind for starting/stopping recording:</p>
            <input type="text" class="settings-input" id="keybindInput" placeholder="Enter keybind (e.g., F12)">
          </div>
          <div class="feature-card" id="filenameCard">
            <h3>📁 Filename Format</h3>
            <p>Choose between static or random filename:</p>
            <div style="margin-top: 10px; display: flex; align-items: center;">
              <input type="radio" id="randomName" name="filenameOption" value="random" class="custom-radio" checked>
              <label for="randomName" class="custom-radio-label">Random Name</label>
              <input type="radio" id="staticName" name="filenameOption" value="static" class="custom-radio" style="margin-left: 20px;">
              <label for="staticName" class="custom-radio-label">Static Name</label>
            </div>
            <input type="text" class="settings-input hidden" id="filenameInput" placeholder="Enter filename">
          </div>
          <div class="feature-card" id="formatCard">
            <h3>🎙️ Audio Format</h3>
            <p>Select the desired audio format:</p>
            <select class="settings-input" id="formatInput">
              <option value="mp3" selected>.mp3</option>
              <option value="ogg">.ogg</option>
              <option value="wav">.wav</option>
              <option value="aac">.aac</option>
              <option value="flac">.flac</option>
              <option value="m4a">.m4a</option>
              <option value="wma">.wma</option>
              <option value="opus">.opus</option>
            </select>
          </div>
        </section>
        <button class="save-button" id="saveSettings">Save Settings</button>
      `;

      const keybindInput = settingsPanel.querySelector("#keybindInput");
      const filenameInput =
        settingsPanel.querySelector("#filenameInput");
      const staticNameRadio =
        settingsPanel.querySelector("#staticName");
      const randomNameRadio =
        settingsPanel.querySelector("#randomName");
      const formatInput = settingsPanel.querySelector("#formatInput");
      const saveButton = settingsPanel.querySelector("#saveSettings");
      const keybindCard = settingsPanel.querySelector("#keybindCard");
      const filenameCard = settingsPanel.querySelector("#filenameCard");
      const formatCard = settingsPanel.querySelector("#formatCard");

      const savedSettings =
        BdApi.getData("VoiceMessages", "settings") || {};
      keybindInput.value = savedSettings.keybind || "F12";
      filenameInput.value = savedSettings.filename || "";
      staticNameRadio.checked = !savedSettings.useRandomFilename;
      randomNameRadio.checked = savedSettings.useRandomFilename;
      formatInput.value = savedSettings.format || "mp3";

      const toggleFilenameInput = () => {
        if (randomNameRadio.checked) {
          filenameInput.classList.add("hidden");
        } else {
          filenameInput.classList.remove("hidden");
        }
      };

      randomNameRadio.checked = true;
      staticNameRadio.checked = false;

      toggleFilenameInput();

      staticNameRadio.addEventListener("change", toggleFilenameInput);
      randomNameRadio.addEventListener("change", toggleFilenameInput);

      saveButton.addEventListener("click", () => {
        const newSettings = {
          keybind: keybindInput.value,
          filename: filenameInput.value,
          useRandomFilename: randomNameRadio.checked,
          format: formatInput.value
        };

        BdApi.saveData("VoiceMessages", "settings", newSettings);
        BdApi.showToast("Settings saved successfully!", {
          type: "success",
          icon: "✔️",
        });
      });

      return settingsPanel;
    }

    static generateRandomFileName = function () {
      const names = [
        "PixelPurr😺",
        "FuzzyFling🦄",
        "ChirpChomp🐦",
        "BlipBop🎉",
        "DoodlePop🧚‍♀️",
        "SizzleSnap🔥",
        "GlimmerGlow🌟",
        "SqueakZoom🐭",
        "FizzFizz💧",
        "BuzzBop💥",
        "ZapZap⚡",
        "TwinkleTee✨",
        "SparkleSwoosh💫",
        "TwangTee🎵",
        "QuirkyQuip🤪",
        "ChirpBing🐣",
        "PopFizz🍾",
        "DoodleBloop🌀",
        "GlimmerPop💎",
        "SqueakZap⚡️",
        "TwistyTing🎠",
        "SnappySparkle✨",
        "WhisperWiz🌌",
        "GlitzyGlimpse💫",
        "FuzzyFizz🐼",
        "BubblyBuzz💧",
        "SlickSizzle🔥",
        "QuirkyChirp🐦",
        "DazzleGlow🌟",
        "GlimmerSnap✨",
        "WhisperTing🕊️",
        "PopFizz🎈",
        "SqueakySnap🐭",
        "FizzFizz💦",
        "BuzzBling💎",
        "TwinklePop🌠",
        "DoodleSwoosh🌌",
        "SnapSparkle🌟",
        "BlingBop💥",
        "WhisperFizz✨",
        "GlimmerTee🎵",
        "SizzleBling🔥",
        "PopBling💫",
        "TwistySwoosh🎠",
        "WhisperSparkle🌌",
        "GlitzyChirp🐦",
        "FizzBling💧",
        "BuzzPop💥",
        "SlickTing🔥",
        "QuirkyBop🤪",
        "ChirpSizzle🐦",
        "TwistBling🎠",
        "DoodlePop💎",
        "GlimmerSwoosh✨",
        "SnapBuzz💧",
        "WhisperPop🌌",
        "FizzTing💦",
        "BuzzSnap💥",
        "SizzleChirp🔥",
        "TwistSwoosh🎠",
        "PopFizz✨",
        "GlimmerBop💎",
        "ChirpTing🐦",
        "WhisperSwoosh🌌",
        "TwistPop🎠",
        "DoodleSnap💫",
        "SizzleFling🔥",
        "BuzzBling💥",
        "TwistBop🎠",
        "GlimmerFizz✨",
        "PopTing💦",
        "SlickSnap🔥",
        "BlingChirp💎",
        "WhisperBling🌌",
        "DoodleFling🌀",
        "FizzBuzz💦",
        "TwistBling🎠",
        "PopSizzle💥",
        "ChirpBling🐦",
        "GlimmerSwoosh✨",
        "FizzPop💧",
        "TwistSnap🎠",
        "BlingSizzle💫",
        "WhisperFizz🌌",
        "DoodleBop💫",
        "FizzBop💦",
        "GlimmerFling💎",
        "SizzlePop🔥",
        "TwistTee🎠",
        "WhisperSnap🌌",
        "PopFizz💥",
        "BlingSwoosh💫",
        "ChirpTee🐦",
        "TwistBling🎠",
        "DoodleSnap💫",
        "GlitterBuzz💫",
        "SqueakBling🐭",
        "BuzzFizz💥",
        "ChirpDazzle🐦",
        "TwistFizz🎠",
        "DoodleBling🌀",
        "SparkleChirp💫",
        "PopSnap💧",
        "FizzChirp💦",
        "BlingSwoosh🎠",
        "SizzlePop💥",
        "TwistBuzz🔥",
        "DoodleFizz🌀",
        "ChirpTing🐦",
        "SlickBling🔥",
        "WhisperPop🌌",
        "BuzzSwoosh💥",
        "GlimmerChirp💎",
        "FizzSnap💦",
        "BlingTwist🎠",
        "DoodleBling💎",
        "SizzleChirp🐦",
        "BuzzFizz💦",
        "PopSparkle💫",
        "TwistFizz🎠",
        "ChirpSizzle🐦",
        "FizzBop💧",
        "DoodleBling🌀",
        "WhisperBuzz🌌",
        "SizzleFizz🔥",
        "BuzzChirp💥",
        "TwistBop🎠",
        "GlimmerFizz💎",
        "SlickFizz🔥",
        "PopTwist🎈",
        "DoodleBuzz🌀",
        "FizzSnap💦",
        "ChirpPop🐦",
        "TwistBling🎠",
        "SizzleBuzz🔥",
        "GlimmerBling💎",
        "PopSizzle💥",
        "WhisperFling🌌",
        "BuzzFizz💥",
        "DoodleChirp🌀",
        "FizzPop💧",
        "TwistSnap🎠",
        "SizzleBling🔥",
        "WhisperBop🌌",
        "BuzzFizz💦",
        "ChirpTwist🐦",
        "DoodleFizz🌀",
        "SizzleFizz🔥",
        "FizzBop💧",
        "GlimmerBling💎",
        "BuzzSnap💥",
        "PopChirp🎈",
        "TwistSizzle🎠",
        "WhisperSnap🌌",
        "FizzBuzz💦",
        "DoodleChirp💫",
        "SizzleFizz🔥",
        "ChirpBling🐦",
        "PopFizz💥",
        "BuzzFizz💦",
        "FizzBop💧",
        "TwistFizz🎠",
        "GlimmerFizz💎",
        "WhisperBuzz🌌",
        "SizzleBling🔥",
        "DoodleSnap🌀",
        "FizzPop💧",
        "ChirpFizz🐦",
        "TwistBuzz🎠",
        "SizzleBling🔥",
        "PopSnap💥",
        "FizzChirp💦",
        "BuzzBling💥",
        "DoodleFizz🌀",
        "WhisperFizz🌌",
      ];
      return names[Math.floor(Math.random() * names.length)];
    };
  };
})();
