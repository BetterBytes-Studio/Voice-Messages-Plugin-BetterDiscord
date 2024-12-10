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
                        });
                      });
                    } else {
                      BdApi.showToast(
                        "Failed to download plugin. Please try again.",
                        { type: "error" }
                      );
                    }
                  })
                  .on("error", () => {
                    require("electron").shell.openExternal(fileUrl);
                    BdApi.showToast(
                      "Error occurred. Opening the file in browser.",
                      { type: "warning" }
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
                    });
                  } else {
                    BdApi.showToast(
                      "❌ Failed to start recording. Please try again!",
                      {
                        type: "error",
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
                        const timestamp = new Date()
                          .toISOString()
                          .replace(/[:.]/g, "-");
                        const userName = BdApi.getUsername();
                        const newFileName = `${userName}-${timestamp}.mp3`;

                        WebpackModules.getByProps(
                          "instantBatchUpload",
                          "upload"
                        ).instantBatchUpload({
                          channelId: channel.getChannelId(),
                          files: [
                            new File(
                              [new Blob([buf], { type: "audio/mp3" })],
                              newFileName,
                              { type: "audio/mp3" }
                            ),
                          ],
                        });
                      } else {
                        BdApi.showToast(
                          "🚨 Error: Recording could not be completed. Please retry!",
                          { type: "failure" }
                        );
                      }
                    });
                  } catch (e) {
                    console.error(e);
                  }
                }
                console.log("STOPPED RECORDING");
                BdApi.showToast("🛑 Recording stopped!", { type: "info" });
              });
            };
          }

          var recording = true;

          const { showToast } = BdApi;
          const channel = BdApi.findModuleByProps("getLastSelectedChannelId");

          function toggleRecording() {
            if (recording === true) {
              record.start();
              recording = false;
              showToast("🎙️ Recording started successfully!", {
                type: "success",
              });
            } else {
              record.stop();
              recording = true;
              console.log("STOPPED RECORDING");
              showToast("🛑 Recording stopped!", {
                type: "info",
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

            onStop() {
              document.removeEventListener("keydown", startFunc);
              this.active = false;
            }
          };
        };
        return plugin(Plugin, Api);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
