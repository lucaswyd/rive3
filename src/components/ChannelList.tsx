// components/ChannelList.tsx
import React, { useState, useEffect } from "react";
import styles from "../styles/channelList.module.scss";

interface ChannelListProps {
  onSelectChannel: (url: string) => void;
}

interface Channel {
  name: string;
  url: string;
  group: string;
}

const ChannelList: React.FC<ChannelListProps> = ({ onSelectChannel }) => {
  const [playlist, setPlaylist] = useState<Channel[]>([]);
  const [groups, setGroups] = useState<string[]>([]);

  useEffect(() => {
    const loadDefaultPlaylist = async () => {
      try {
        const response = await fetch("/iptv.m3u8");
        if (!response.ok) {
          throw new Error("Failed to fetch the default playlist");
        }
        const text = await response.text();
        const parsedPlaylist = parseM3U(text);
        setPlaylist(parsedPlaylist);

        const uniqueGroups = Array.from(
          new Set(parsedPlaylist.map((channel) => channel.group)),
        );
        setGroups(uniqueGroups);
      } catch (error) {
        console.error("Failed to load default playlist:", error);
      }
    };

    loadDefaultPlaylist();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        const parsedPlaylist = parseM3U(text);
        setPlaylist(parsedPlaylist);

        const uniqueGroups = Array.from(
          new Set(parsedPlaylist.map((channel) => channel.group)),
        );
        setGroups(uniqueGroups);
      };
      reader.readAsText(file);
    }
  };

  const parseM3U = (text: string): Channel[] => {
    const lines = text.split("\n");
    const playlist: Channel[] = [];
    let currentItem: Partial<Channel> = {};

    lines.forEach((line) => {
      if (line.startsWith("#EXTINF:")) {
        const attrs = line.split(",");
        currentItem.name = attrs[1]?.trim() || "Unknown Channel";
        const tvgAttrs = attrs[0].match(
          /tvg-id="([^"]*)".*tvg-name="([^"]*)".*tvg-logo="([^"]*)".*group-title="([^"]*)"/,
        );
        if (tvgAttrs) {
          currentItem.group = tvgAttrs[4];
        } else {
          currentItem.group = "Unknown Group";
        }
      } else if (line && !line.startsWith("#")) {
        currentItem.url = line.trim();
        playlist.push(currentItem as Channel);
        currentItem = {};
      }
    });

    return playlist;
  };

  return (
    <div className={styles.channelListContainer}>
      <h2 className={styles.header}>Lista de Canais</h2>
      <input
        className={styles.fileInput}
        type="file"
        accept=".m3u8,.m3u,.ott"
        onChange={handleFileUpload}
      />
      <div className={styles.channelList}>
        {groups.map((group) => (
          <div key={group} className={styles.group}>
            <h3 className={styles.groupHeader}>{group}</h3>
            <ul className={styles.channelGroup}>
              {playlist
                .filter((channel) => channel.group === group)
                .map((channel, index) => (
                  <li
                    key={`${channel.name}-${index}`}
                    onClick={() => onSelectChannel(channel.url)}
                    className={styles.channelItem}
                  >
                    {channel.name}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelList;
