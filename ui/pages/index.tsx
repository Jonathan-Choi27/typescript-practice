import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import useSwr from "swr";
import styles from "../styles/Home.module.css";
import {
  Container,
  Button,
  Input,
  Spacer,
  Text,
  Link,
} from "@nextui-org/react";
import fetcher from "../utils/fetcher";

interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  session: string;
  iat: number;
  exp: number;
}

const Home: NextPage<{ fallbackData: User }> = ({ fallbackData }) => {
  const { data, error } = useSwr<User | null>(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    fetcher,
    { fallbackData }
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>NextUI | Create Next App</title>
        <meta
          name="description"
          content="Generated by create next app and using NextUI as a react UI library"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {data ? <p>Welcome {data.name}!</p> : <p>Please Login</p>}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await fetcher(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    context.req.headers
  );

  return {
    props: { fallbackData: data },
  };
};

export default Home;