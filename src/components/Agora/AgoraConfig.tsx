import axios from "axios";

interface AgoraConfig {
  appId: string;
  channel: string;
  token: string;
  uid: number;
}

let cachedAgoraConfig: AgoraConfig | null = null; // Global cache for the Agora configuration

// Fetch Agora configuration for the host
export const fetchAgoraHostConfig = async (): Promise<AgoraConfig> => {
  if (cachedAgoraConfig) {
    // Log the cached token to the terminal
    console.log("Using cached Agora host token:", cachedAgoraConfig.token);
    console.log("Using cached Agora host UID:", cachedAgoraConfig.uid);
    return cachedAgoraConfig;
  }

  try {
    // Replace with your backend API endpoint
    const response = await axios.get("http://222.112.183.197:8080/generate_token", {
      params: {
        channelName: "taasnet", // Pass the channel name
        uid: 123456, // Pass the user ID for the host
        role: "host", // Explicitly specify role for token generation
      },
    });

    if (response.status === 200) {
      const { token } = response.data;

      // Populate the config with the fetched token
      cachedAgoraConfig = {
        appId: "474b444cdc5e499781d0ee121f2638b6", // Replace with your Agora App ID
        channel: "taasnet",
        token: token, // Use the token from the backend
        uid: 123456, // Host UID
      };

      // Log the fetched token to the terminal
      console.log("Fetched Agora host token:", token);
      console.log("Fetched Agora host UID:", cachedAgoraConfig.uid);

      return cachedAgoraConfig;
    } else {
      throw new Error("Failed to fetch Agora host token");
    }
  } catch (error) {
    console.error("Error fetching Agora host configuration:", error);
    throw error;
  }
};

// Get the cached host configuration directly (without re-fetching)
export const getAgoraHostConfig = (): AgoraConfig | null => {
  const config = cachedAgoraConfig;
  if (config) {
    console.log("Retrieved cached Agora host token:", config.token);
    console.log("Retrieved cached Agora host UID:", config.uid);
  } else {
    console.log("No cached Agora host token available.");
  }
  return config;
};

// Function to display the host token on the browser screen
export const displayHostTokenOnScreen = async (containerId: string): Promise<void> => {
  try {
    const config = await fetchAgoraHostConfig();
    const tokenContainer = document.getElementById(containerId);
    if (tokenContainer) {
      tokenContainer.innerHTML = `<p>Fetched Agora Host Token: ${config.token}</p>`;
    } else {
      console.error(`Container with id '${containerId}' not found.`);
    }
  } catch (error) {
    console.error("Failed to display Agora host token:", error);
  }
};

// Function to explicitly print host token to the terminal
export const printHostTokenToTerminal = async (): Promise<void> => {
  try {
    const config = await fetchAgoraHostConfig();
    console.log("Agora Host Token (Terminal):", config.token);
    console.log("Agora Host UID (Terminal):", config.uid);
  } catch (error) {
    console.error("Failed to fetch or print Agora host token:", error);
  }
};
