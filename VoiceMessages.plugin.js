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

  return !global.ZeresPluginLibrary
    ? class {
        constructor() {
          this._config = config;
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
          BdApi.showConfirmationModal(
            "Library Missing",
            `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`,
            {
              confirmText: "Download Now",
              cancelText: "Cancel",
              onConfirm: () => {
                const fileUrl =
                  "https://raw.githubusercontent.com/zerebos/BDPluginLibrary/3f321f9a3b21f3829277870068b98673ffd5c869/release/0PluginLibrary.plugin.js";
                const filePath = require("path").join(
                  BdApi.Plugins.folder,
                  "0PluginLibrary.plugin.js"
                );

                BdApi.Net.fetch(fileUrl, { method: "GET" })
                  .then((response) => {
                    if (!response.ok) {
                      BdApi.showToast(
                        "Failed to download plugin. Please try again.",
                        { type: "error", icon: "⚠️" }
                      );
                      throw new Error("Network response was not ok.");
                    }
                    return response.text();
                  })
                  .then((data) => {
                    require("fs").writeFile(filePath, data, (err) => {
                      if (err) {
                        BdApi.showToast(
                          "Error occurred. Failed to save plugin.",
                          { type: "error", icon: "⚠️" }
                        );
                      } else {
                        BdApi.showToast("Plugin downloaded successfully!", {
                          type: "success",
                          icon: "ℹ️",
                        });
                      }
                    });
                  })
                  .catch((error) => {
                    BdApi.showToast(
                      "Error occurred. Opening the file in browser.",
                      { type: "warning", icon: "⚠️" }
                    );
                    require("electron").shell.openExternal(fileUrl);
                  });
              },
            }
          );
        }
        start() {}
        stop() {}
      }
    : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {
          const { WebpackModules } = Library;

          ("use strict");

          var discordVoice =
            DiscordNative.nativeModules.requireModule("discord_voice");

          class record {
            static start = function (options) {
              discordVoice.startLocalAudioRecording(
                {
                  echoCancellation: true,
                  noiseCancellation: true,
                },
                (success) => {
                  if (success) {
                    console.log("🎙️ Recording has started!");
                    BdApi.showToast("🎙️ Recording started successfully!", {
                      type: "success",
                      icon: "ℹ️",
                    });
                  } else {
                    BdApi.showToast(
                      "❌ Failed to start recording. Please try again!",
                      {
                        type: "error",
                        icon: "⚠️",
                      }
                    );
                  }
                }
              );
            };

            static stop = function () {
              discordVoice.stopLocalAudioRecording((filePath) => {
                if (filePath) {
                  try {
                    require("fs").readFile(filePath, {}, (err, buf) => {
                      if (buf) {
                        const randomName = this.generateRandomFileName();
                        WebpackModules.getByProps(
                          "instantBatchUpload",
                          "upload"
                        ).instantBatchUpload({
                          channelId: channel.getChannelId(),
                          files: [
                            new File(
                              [
                                new Blob([buf], {
                                  type: "audio/ogg; codecs=opus",
                                }),
                              ],
                              `${randomName}.ogg`,
                              { type: "audio/ogg; codecs=opus" }
                            ),
                          ],
                        });
                      } else {
                        BdApi.showToast("Failed to finish recording", {
                          type: "error",
                          icon: "⚠️",
                        });
                      }
                    });
                  } catch (e) {
                    console.log(e);
                  }
                }
                console.log("RECORDING STOPPED! 🎤");
              });
            };

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
          }

          var recording = true;

          const { showToast } = BdApi;
          const channel = BdApi.findModuleByProps("getLastSelectedChannelId");

          function toggleRecording() {
            if (recording === true) {
              record.start();
              recording = false;
            } else {
              record.stop();
              recording = true;
              console.log("STOPPED RECORDING");
              showToast("🛑 Recording stopped!", {
                type: "info",
                icon: "ℹ️",
              });
            }
          }

          startFunc = function (event) {
            if (event.key === "F12") {
              toggleRecording();
              event.preventDefault();
            }
          };
          return class VoiceMessages extends Plugin {
            constructor() {
              super();
              this.active = true;
            }

            onStart() {
              ZLibrary.PluginUpdater.checkForUpdate(
                this.getName(),
                this.getVersion(),
                "https://raw.githubusercontent.com/UnStackss/Voice-Messages-Plugin-BetterDiscord/master/VoiceMessages.plugin.js"
              );
              document.addEventListener("keydown", startFunc);
            }

            getSettingsPanel() {
              const settingsPanel = document.createElement("div");
              settingsPanel.classList.add("settings-panel");

              // Keybind Section
              const keybindSection = document.createElement("div");
              keybindSection.classList.add("keybind-section");

              const keybindText = document.createElement("h1");
              keybindText.textContent = "Set Rec KeyBind";
              keybindText.style.color = "white";
              keybindText.style.fontWeight = "bold";
              keybindSection.appendChild(keybindText);

              const keybindInput = document.createElement("span");
              keybindInput.id = "keybind-input";
              keybindInput.textContent = "F12";
              keybindInput.style.color = "white";
              keybindInput.style.marginLeft = "10px";
              keybindInput.style.cursor = "pointer";
              keybindInput.style.border = "1px solid #3b82f6"; // border to indicate focus
              keybindInput.style.padding = "2px 5px";
              keybindInput.style.borderRadius = "3px";
              keybindInput.onclick = () => this.changeKeybind(); // method to change keybind
              keybindSection.appendChild(keybindInput);

              settingsPanel.appendChild(keybindSection);

              // Filename Section
              const filenameSection = document.createElement("div");
              filenameSection.classList.add("filename-section");

              const filenameText = document.createElement("h1");
              filenameText.textContent = "Set Rec Filename";
              filenameText.style.color = "white";
              filenameText.style.fontWeight = "bold";
              filenameSection.appendChild(filenameText);

              const filenameSelect = document.createElement("select");
              filenameSelect.id = "filename-select";
              filenameSelect.style.backgroundColor = "#3b82f6"; // Material-style color
              filenameSelect.style.color = "white";
              filenameSelect.style.border = "none";
              filenameSelect.style.padding = "5px";
              filenameSelect.style.borderRadius = "3px";

              const option1 = document.createElement("option");
              option1.value = "generateRandomFileName";
              option1.textContent = "Generate Random Filename";
              filenameSelect.appendChild(option1);

              const option2 = document.createElement("option");
              option2.value = "staticName";
              option2.textContent = "Set Static Name";
              filenameSelect.appendChild(option2);

              filenameSection.appendChild(filenameSelect);

              const staticNameInput = document.createElement("input");
              staticNameInput.id = "static-name-input";
              staticNameInput.type = "text";
              staticNameInput.style.display = "none";
              staticNameInput.style.border = "1px solid #3b82f6"; // border to indicate focus
              staticNameInput.style.padding = "5px";
              staticNameInput.style.borderRadius = "3px";
              filenameSection.appendChild(staticNameInput);

              filenameSelect.onchange = function () {
                if (this.value === "staticName") {
                  staticNameInput.style.display = "inline-block";
                } else {
                  staticNameInput.style.display = "none";
                }
              };

              settingsPanel.appendChild(filenameSection);

              // Save Button
              const saveButton = document.createElement("button");
              saveButton.textContent = "Save Settings";
              saveButton.style.backgroundColor = "#3b82f6"; // modern blue color
              saveButton.style.color = "white";
              saveButton.style.border = "none";
              saveButton.style.padding = "10px 20px";
              saveButton.style.borderRadius = "5px";
              saveButton.style.cursor = "pointer";
              saveButton.onclick = () => this.saveSettings(); // method to save settings
              settingsPanel.appendChild(saveButton);

              return settingsPanel;
            }

            // Example methods for changing keybind and saving settings
            changeKeybind() {
              // Logic to change the keybind, perhaps by capturing a new key input
              console.log("Keybind changed");
            }

            saveSettings() {
              // Logic to save settings
              console.log("Settings saved");
            }

            onStop() {
              document.removeEventListener("keydown", startFunc);
              this.active = false;
            }
          };
        };
        return plugin(Plugin, Api);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
