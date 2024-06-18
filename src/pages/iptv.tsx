// pages/iptv.tsx
import React, { useState } from "react";
import ChannelList from "../components/ChannelList";
import IPTVPlayer from "../components/IPTVPlayer";
import Layout from "../components/Layout";
import { NextPage } from "next";
import styles from "../styles/Iptv.module.scss";

const IPTVPage: NextPage = () => {
  const [selectedChannel, setSelectedChannel] = useState<string>("");

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.channelList}>
          <ChannelList onSelectChannel={setSelectedChannel} />
        </div>
        <div className={styles.videoPlayer}>
          {selectedChannel && <IPTVPlayer src={selectedChannel} />}
        </div>
      </div>
    </Layout>
  );
};

export default IPTVPage;
