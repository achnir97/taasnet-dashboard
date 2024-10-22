// AgoraService.ts
import AgoraRTC, { IAgoraRTCClient, IRemoteVideoTrack, IRemoteAudioTrack, ILocalVideoTrack, ILocalAudioTrack } from "agora-rtc-sdk-ng";
import { agoraConfig } from "./AgoraConfig"
export interface IAgoraService {
  client: IAgoraRTCClient | null;
  localAudioTrack: ILocalAudioTrack | null;
  localVideoTrack: ILocalVideoTrack | null;
}

export const agoraService: IAgoraService = {
  client: null,
  localAudioTrack: null,
  localVideoTrack: null,
};

export const initAgora = async (): Promise<void> => {
  // Initialize the AgoraRTC client
  agoraService.client = AgoraRTC.createClient({ mode: "live", codec: "vp8", role: "host" });

  // Event handler when a remote user publishes their stream
  agoraService.client.on("user-published", async (user, mediaType) => {
    await agoraService.client?.subscribe(user, mediaType);
    console.log("Subscribe success!");

    if (mediaType === "video") {
      const remoteVideoTrack: IRemoteVideoTrack = user.videoTrack!;
      const remotePlayerContainer = document.createElement("div");
      remotePlayerContainer.id = user.uid.toString();
      remotePlayerContainer.style.width = "640px";
      remotePlayerContainer.style.height = "480px";
      document.body.append(remotePlayerContainer);
      remoteVideoTrack.play(remotePlayerContainer);
    }

    if (mediaType === "audio") {
      const remoteAudioTrack: IRemoteAudioTrack = user.audioTrack!;
      remoteAudioTrack.play();
    }

    agoraService.client?.on("user-unpublished", user => {
      const remotePlayerContainer = document.getElementById(user.uid.toString());
      remotePlayerContainer?.remove();
    });
  });
};

export const joinChannel = async () => {
  await agoraService.client?.join(agoraConfig.appId, agoraConfig.channel, agoraConfig.token, agoraConfig.uid);
  agoraService.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  agoraService.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

  const localPlayerContainer = document.createElement("div");
  localPlayerContainer.id = agoraConfig.uid.toString();
  localPlayerContainer.style.width = "640px";
  localPlayerContainer.style.height = "480px";
  document.body.append(localPlayerContainer);

  agoraService.localVideoTrack.play(localPlayerContainer);
  await agoraService.client?.publish([agoraService.localAudioTrack, agoraService.localVideoTrack]);

  console.log("Join and publish success!");
};

export const leaveChannel = async () => {
  agoraService.localAudioTrack?.close();
  agoraService.localVideoTrack?.close();

  const localPlayerContainer = document.getElementById(agoraConfig.uid.toString());
  localPlayerContainer?.remove();

  agoraService.client?.remoteUsers.forEach(user => {
    const playerContainer = document.getElementById(user.uid.toString());
    playerContainer?.remove();
  });

  await agoraService.client?.leave();
  console.log("Leave channel success!");
};
