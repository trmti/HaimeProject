import React, { useState } from 'react';
import styles from '../styles/Home.module.scss';
import { Web3Button } from '@web3modal/react';
import {
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useAccount,
  useWaitForTransaction,
} from 'wagmi';

const JPYCaddress = '0x6AE7Dfc73E0dDE2aa99ac063DcF7e8A63265108c';
const FanClubNFTaddress = '0xe43BC0363cADAA0749Efac7deb04C78cC523fB04';
const ContactNFTaddress = '0x708F74faC774D1F832F9edEA318aba48540C9991';

const chainId = 137;

function Home() {
  const { address, isConnected } = useAccount();
  const [approved, setApproved] = useState(false);

  // get allowances
  const { data, isLoading } = useContractReads({
    contracts: [
      {
        address: JPYCaddress,
        abi: JPYCabi,
        functionName: 'allowance',
        args: [address, FanClubNFTaddress],
        onError(err: any) {
          console.error(err);
        },
      },
      {
        address: JPYCaddress,
        abi: JPYCabi,
        functionName: 'allowance',
        args: [address, ContactNFTaddress],
        onError(err: any) {
          console.error(err);
        },
      },
    ],
  });

  // approve FanClub NFT
  const { config: approveConfig_FanClub } = usePrepareContractWrite({
    address: JPYCaddress,
    abi: JPYCabi,
    functionName: 'approve',
    chainId,
    args: [FanClubNFTaddress, BigInt(10 ** 23).toString()],
    onError(err: any) {
      console.error(err);
    },
  });
  const {
    data: data_approveFanClub,
    isLoading: isLoading_approveFanClub,
    writeAsync: write_approveFanClub,
  } = useContractWrite(approveConfig_FanClub);

  const waited = useWaitForTransaction({ wait: data_approveFanClub?.wait });

  // approve Contact NFT
  const { config: approveConfig_Contact } = usePrepareContractWrite({
    address: JPYCaddress,
    abi: JPYCabi,
    functionName: 'approve',
    chainId,
    args: [ContactNFTaddress, BigInt(10 ** 23).toString()],
    onError(err: any) {
      console.error(err);
    },
  });
  const {
    data: data_approveContact,
    isLoading: isLoading_approveContact,
    writeAsync: write_approveContact,
  } = useContractWrite(approveConfig_Contact);

  // mint FanClub NFT
  const { config: mintConfig_FanClub } = usePrepareContractWrite({
    address: FanClubNFTaddress,
    abi: FanClubNFTabi,
    functionName: 'safeMint',
    chainId,
    args: [address],
    onError(err: any) {
      console.error(err);
    },
  });
  const {
    data: data_FanClub,
    isLoading: isLoading_FanClub,
    writeAsync: write_FanClub,
  } = useContractWrite(mintConfig_FanClub);

  // mint Contact NFT
  const { config: mintConig_Contact } = usePrepareContractWrite({
    address: ContactNFTaddress,
    abi: ContactNFTabi,
    functionName: 'safeMint',
    chainId,
    args: [address],
    onError(err: any) {
      console.error(err);
    },
  });

  const {
    data: data_Contact,
    isLoading: isLoading_Contact,
    writeAsync: write_Contact,
  } = useContractWrite(mintConig_Contact);
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src="/logo.png" alt="logo" />

        <div className={styles.options}>
          <p>MemberShip</p>
          <p>MeetUp</p>
          <p>How to get NFT?</p>
          <Web3Button />
        </div>
      </header>

      <div className={styles.topPage}>
        <img src="/top.png" />
      </div>

      <div className={styles.member}>
        <div className={styles.joinMemberShip}>
          <div className={styles.description}>
            <h1 className={styles.Title}>
              JOIN OUR <br />
              MEMBERSHIP
            </h1>
            <p>
              Mint a menbership NFT.
              <br /> This is a proof of you are supporting Jaime.
              <br />
              <br />
              メンバーシップNFTを発行して、
              <br />
              様々な特典を受け取ろう！ <br />
              <br />
              Price: 10000 JPYC ( 10000yen )
            </p>
          </div>

          <div className={styles.memberRight}>
            <img src="/NFT1.jpg" />
          </div>
        </div>
        <div className={styles.approveBtn} suppressHydrationWarning={true}>
          {data !== undefined && data[0] > BigInt(10 ** 22) ? (
            <div
              suppressHydrationWarning={true}
              onClick={async () => {
                await write_FanClub?.();
                // console.log(waited);
                console.log('clicked');
              }}
            >
              Mint
            </div>
          ) : (
            <div
              suppressHydrationWarning={true}
              onClick={async () => {
                await write_approveFanClub?.();
              }}
            >
              Approve
            </div>
          )}
        </div>
      </div>

      <div className={styles.meetUpWrapper}>
        <div className={styles.meetUp}>
          <div className={styles.meetLeft}>
            <img src="NFT2.png" />
          </div>
          <div className={styles.description}>
            <h1 className={styles.Title}>
              MEET UP <br />
              JAIME IN ZOOM
            </h1>
            <p>
              Mint a meet up NFT.
              <br /> You can talk with JAIME using zoom 30min. <br />※ This NFT
              will Burn when you talked.
              <br />
              <br /> Meet up NFTを発行して、JAIMEと30分間Zoomで通話しよう！
              <br /> ※ 通話はNFT一つに付き一度までです。 <br />
              <br />
              Price: 5000 JPYC ( 5000yen )
            </p>
          </div>
        </div>
        <div className={styles.approveBtn} suppressHydrationWarning={true}>
          {data !== undefined && data[1] > BigInt(5 ** 22) ? (
            <div
              suppressHydrationWarning={true}
              onClick={async () => {
                await write_Contact?.();
              }}
            >
              Mint
            </div>
          ) : (
            <div
              suppressHydrationWarning={true}
              onClick={async () => {
                await write_approveContact?.();
              }}
            >
              Approve
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;

const JPYCabi = [
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const FanClubNFTabi = [
  {
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'safeMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const ContactNFTabi = [
  {
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'safeMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
