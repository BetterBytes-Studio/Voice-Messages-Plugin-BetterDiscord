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
    settings: [
      {
        name: "Keybind",
        id: "keybind",
        type: "keybind",
        default: "F12",
        section: "General",
        name: "Start Recording",
        desc: "Press this key to start recording a voice message.",
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
                const fs = require("fs");
                const https = require("https");
                const path = require("path");

                const fileUrl =
                  "https://raw.githubusercontent.com/zerebos/BDPluginLibrary/3f321f9a3b21f3829277870068b98673ffd5c869/release/0PluginLibrary.plugin.js";
                const filePath = path.join(
                  BdApi.Plugins.folder,
                  "0PluginLibrary.plugin.js"
                );

                https
                  .get(fileUrl, (response) => {
                    if (response.statusCode === 200) {
                      const fileStream = fs.createWriteStream(filePath);
                      response.pipe(fileStream);

                      fileStream.on("finish", () => {
                        fileStream.close();
                        BdApi.showToast("Plugin downloaded successfully!", {
                          type: "success",
                          icon: "ℹ️"
                        });
                      });
                    } else {
                      BdApi.showToast(
                        "Failed to download plugin. Please try again.",
                        { type: "error", icon: "⚠️" }
                      );
                    }
                  })
                  .on("error", () => {
                    require("electron").shell.openExternal(fileUrl);
                    BdApi.showToast(
                      "Error occurred. Opening the file in browser.",
                      { type: "warning", icon: "⚠️" }
                    );
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
          const { WebpackModules, Settings } = Library;

          ("use strict");

          var discordVoice =
            DiscordNative.nativeModules.requireModule("discord_voice");

          class record {
            static start = function (options) {
              discordVoice.startLocalAudioRecording(
                {
                  echoCancellation: true,
                  noiseCancellation: true,
                  volume: options.volume || 1.0,
                  maxDuration: options.duration || 30,
                },
                (success) => {
                  if (success) {
                    console.log("🎙️ Recording has started!");
                    BdApi.showToast("🎙️ Recording started successfully!", {
                      type: "success",
                      icon: "ℹ️"
                    });
                  } else {
                    BdApi.showToast(
                      "❌ Failed to start recording. Please try again!",
                      {
                        type: "error",
                        icon: "⚠️"
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
                          icon: "⚠️"
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
                "TwistBling🎠",
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
                "BlingBop💥",
                "WhisperPop🌌",
                "PopSwoosh💥",
                "TwistBuzz🎠",
                "GlimmerTee💫",
                "FizzTwist💧",
                "BlingSwoosh💥",
                "WhisperTing🌌",
                "GlimmerPop💫",
                "SizzleBuzz🔥",
                "WhisperBling🌌",
              ];
              return names[Math.floor(Math.random() * names.length)];
            };
          }

          return class VoiceMessages extends Plugin {
            getSettingsPanel() {
              const header = document.createElement('h1');
              header.textContent = 'VoiceMessages Settings';
              const keybindLabel = document.createElement('label');
              keybindLabel.textContent = 'Start Recording Keybind:';
              const keybindInput = document.createElement('input');
              keybindInput.type = 'text';
              keybindInput.value = BdApi.loadData(this.getName(), "keybind") || "F12";
              keybindInput.addEventListener('change', (e) => BdApi.saveData(this.getName(), "keybind", e.target.value));

              const randomNameButton = document.createElement('button');
              randomNameButton.textContent = 'Generate Random File Name';
              randomNameButton.addEventListener('click', () => {
                const randomName = this.generateRandomFileName();
                BdApi.showToast(`Generated name: ${randomName}`, {
                  type: "info",
                  icon: "ℹ️"
                });
              });

              const staticNameButton = document.createElement('button');
              staticNameButton.textContent = 'Use Static Name';
              staticNameButton.addEventListener('click', () => {
                BdApi.showToast("Using static name mode", {
                  type: "info",
                  icon: "ℹ️"
                });
              });

              const settingsContainer = document.createElement('div');
              settingsContainer.appendChild(header);
              settingsContainer.appendChild(keybindLabel);
              settingsContainer.appendChild(keybindInput);
              settingsContainer.appendChild(randomNameButton);
              settingsContainer.appendChild(staticNameButton);
              return settingsContainer;
            }

            onStart() {
              BdApi.Vault.registerMessagePlugin(
                "VoiceMessages",
                "Press F12 to start recording.",
                {
                  type: "info",
                  delay: 5000,
                }
              );

              BdApi.Patcher.after("voice-messages-plugin", discordVoice, "startLocalAudioRecording", (thisObject, _, [options], returnValue) => {
                this.record.start(options);
                return returnValue;
              });

              BdApi.Patcher.after("voice-messages-plugin", discordVoice, "stopLocalAudioRecording", (thisObject, _, [callback]) => {
                this.record.stop();
                if (typeof callback === "function") callback();
              });

              document.addEventListener("keydown", (e) => {
                if (e.key === BdApi.loadData(this.getName(), "keybind")) {
                  BdApi.Vault.toggleMessagePlugin("VoiceMessages");
                }
              });
            }

            onStop() {
              BdApi.Patcher.unpatchAll("voice-messages-plugin");
            }
          };
        };

        return plugin(Plugin, Api);
      })(global.ZeresPluginLibrary.buildPlugin(config));

})();
