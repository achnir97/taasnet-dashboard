import AgoraRTC, { IAgoraRTCClient, IRemoteVideoTrack, IRemoteAudioTrack, ILocalVideoTrack, ILocalAudioTrack } from "agora-rtc-sdk-ng";
import { agoraConfig } from "./AgoraConfig";

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

// Initialize Agora with the video container ID where the video will be appended
export const initAgora = async (localContainerId: string, remoteContainerId: string): Promise<void> => {
  // Initialize the AgoraRTC client
  agoraService.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

  // Event handler when a remote user publishes their stream
  agoraService.client.on("user-published", async (user, mediaType) => {
    await agoraService.client?.subscribe(user, mediaType);
    console.log("Subscribe success!");

    if (mediaType === "video") {
      const remoteVideoTrack: IRemoteVideoTrack = user.videoTrack!;
      const remoteContainer = document.getElementById(remoteContainerId);
      if (remoteContainer) {
        remoteVideoTrack.play(remoteContainer);
      } else {
        console.error(`Remote video container with id '${remoteContainerId}' not found.`);
      }
    }

    if (mediaType === "audio") {
      const remoteAudioTrack: IRemoteAudioTrack = user.audioTrack!;
      remoteAudioTrack.play();
    }

    agoraService.client?.on("user-unpublished", (user) => {
      const remoteContainer = document.getElementById(remoteContainerId);
      if (remoteContainer) {
        remoteContainer.innerHTML = ''; // Clear the container when the user unpublishes their stream
      }
    });
  });
};

// Function to join the channel based on role (host or audience)
export const joinChannel = async (isHost: boolean, localContainerId: string) => {
  // Set the role based on whether the user is a host or audience
  const role = isHost ? "host" : "audience";
  
  // Set client role
  await agoraService.client?.setClientRole(role);

  // Join the channel
  await agoraService.client?.join(agoraConfig.appId, agoraConfig.channel, agoraConfig.token, agoraConfig.uid);
  
  if (isHost) {
    // Only hosts are allowed to publish streams
    agoraService.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    agoraService.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

    const localContainer = document.getElementById(localContainerId);
    if (localContainer) {
      agoraService.localVideoTrack.play(localContainer);
    } else {
      console.error(`Local video container with id '${localContainerId}' not found.`);
    }

    await agoraService.client?.publish([agoraService.localAudioTrack, agoraService.localVideoTrack]);
    console.log("Join and publish success!");
  } else {
    console.log("Joined as audience (view-only mode).");
  }
};

// Function to leave the channel
export const leaveChannel = async () => {
  agoraService.localAudioTrack?.close();
  agoraService.localVideoTrack?.close();

  const localContainer = document.getElementById(agoraConfig.uid.toString());
  localContainer?.remove();

  agoraService.client?.remoteUsers.forEach(user => {
    const remoteContainer = document.getElementById(user.uid.toString());
    remoteContainer?.remove();
  });

  await agoraService.client?.leave();
  console.log("Leave channel success!");
};
