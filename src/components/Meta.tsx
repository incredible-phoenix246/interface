import Head from 'next/head';
import React from 'react';

type MetaProps = {
  title: string;
  description: string;
  imageUrl?: string;
  timestamp?: string;
};

export function Meta({ title, description, timestamp, imageUrl }: MetaProps) {
  return (
    <Head>
      <title>Eden Finance - {title}</title>
      <meta name="description" content={description} key="description" />
      <meta property="og:title" content={`Eden - ${title}`} key="title" />
      <meta property="og:description" content={description} key="ogdescription" />
      {imageUrl && <meta property="og:image" content={imageUrl} key="ogimage" />}
      {imageUrl && <meta name="twitter:image" content={imageUrl} key="twitterimage" />}
      {imageUrl && (
        <meta name="twitter:image:alt" content={`eden governance image`} key="twitteralt" />
      )}
      <meta name="twitter:site" content="@0xedenfi" key="twittersite" />
      <meta
        property="twitter:card"
        content={imageUrl ? 'summary_large_image' : 'summary'}
        key="twittercard"
      />
      <meta name="twitter:title" content={title} key="twittertitle" />
      <meta name="twitter:description" content={description} key="twitterdescription" />
      {timestamp && <meta name="revised" content={timestamp} key="timestamp" />}
      <meta
        name="keywords"
        key="keywords"
        content="assetchain, Decentralized Finance, DeFi, lending, borrowing, stablecoins, Ethereum, assets, erc-20, smart contracts, open finance, trustless,asset chain, onchain, yield farming"
      />
      <link rel="apple-touch-icon" href="/icon1.png" />
      <meta name="apple-mobile-web-app-title" content={`Eden Finance`} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    </Head>
  );
}
