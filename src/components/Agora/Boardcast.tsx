import AgoraRTC, {
  IAgoraRTCClient,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
  ILocalVideoTrack,
  ILocalAudioTrack,
} from "agora-rtc-sdk-ng";
import { fetchAgoraHostConfig } from "./AgoraConfig";

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

// Initialize Agora with the video container IDs for local and remote streams
export const initAgora = async (
  localContainerId: string,
  remoteContainerParentId: string
): Promise<void> => {
  agoraService.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

  // Event handler: Remote user publishes stream
  agoraService.client.on("user-published", async (user, mediaType) => {
    console.log(`Remote user published: ${user.uid}, mediaType: ${mediaType}`);

    try {
      // Subscribe to the user's media
      await agoraService.client?.subscribe(user, mediaType);
      console.log(`Subscribed to user ${user.uid}, mediaType: ${mediaType}`);

      // Dynamically create a container for each remote user
      let remoteContainer = document.getElementById(`remote-video-${user.uid}`);
      if (!remoteContainer) {
        remoteContainer = document.createElement("div");
        remoteContainer.textContent = "Remote user " + user.uid.toString();
        remoteContainer.id = `remote-video-${user.uid}`;
        remoteContainer.style.width = "640px";
        remoteContainer.style.height = "480px";
        remoteContainer.style.margin = "0px";
        remoteContainer.style.border = "2px solid #ccc";
        document.getElementById(remoteContainerParentId)?.appendChild(remoteContainer);
      }

      // Play remote video if available
      if (mediaType === "video" && user.videoTrack) {
        console.log(`Playing remote video for user ${user.uid}`);
        const remoteVideoTrack: IRemoteVideoTrack = user.videoTrack!;
        remoteVideoTrack.play(remoteContainer);
      }

      // Play remote audio if available
      if (mediaType === "audio" && user.audioTrack) {
        console.log(`Playing remote audio for user ${user.uid}`);
        const remoteAudioTrack: IRemoteAudioTrack = user.audioTrack!;
        remoteAudioTrack.play();

        // Debug log for ensuring remote audio is fetched
        console.log(`Remote audio fetched and played for user ${user.uid}`);
      }
    } catch (error) {
      console.error(`Error subscribing to user ${user.uid}:`, error);
    }
  });

  // Event handler: Remote user unpublishes stream
  agoraService.client.on("user-unpublished", (user, mediaType) => {
    console.log(`Remote user unpublished: ${user.uid}, mediaType: ${mediaType}`);
    const remoteContainer = document.getElementById(`remote-video-${user.uid}`);
    if (remoteContainer) {
      remoteContainer.remove();
    }
  });

  console.log("Agora initialized.");
};

// Function to join a channel based on role (host or audience)
export const joinChannel = async (isHost: boolean, localContainerId: string) => {
  const agoraConfig = await fetchAgoraHostConfig();
  console.log(`Joining channel: ${agoraConfig.channel} as ${isHost ? "host" : "audience"}`);

  if (!agoraService.client) {
    throw new Error("Agora client not initialized. Call initAgora first.");
  }

  await agoraService.client.setClientRole(isHost ? "host" : "audience");
  await agoraService.client.join(
    agoraConfig.appId,
    agoraConfig.channel,
    agoraConfig.token,
    agoraConfig.uid
  );

  if (isHost) {
    try {
      agoraService.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      agoraService.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

      const localContainer = document.getElementById(localContainerId);
      if (localContainer) {
        agoraService.localVideoTrack.play(localContainer);
      } else {
        console.error(`Local video container with id '${localContainerId}' not found.`);
      }

      await agoraService.client.publish([
        agoraService.localAudioTrack,
        agoraService.localVideoTrack,
      ]);
      console.log("Host joined and streams published.");
    } catch (error) {
      console.error("Error during track creation or publishing:", error);
    }
  } else {
    console.log("Audience joined (view-only mode).");
  }
};

// Function to leave the channel
export const leaveChannel = async () => {
  console.log("Leaving the channel...");

  if (agoraService.localAudioTrack) {
    agoraService.localAudioTrack.stop();
    agoraService.localAudioTrack.close();
  }
  if (agoraService.localVideoTrack) {
    agoraService.localVideoTrack.stop();
    agoraService.localVideoTrack.close();
  }

  agoraService.client?.remoteUsers.forEach((user) => {
    const remoteContainer = document.getElementById(`remote-video-${user.uid}`);
    if (remoteContainer) {
      remoteContainer.remove();
    }
  });

  await agoraService.client?.leave();
  console.log("Left the channel successfully.");
};
