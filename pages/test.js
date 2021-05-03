import React, { useEffect } from "react";
import Layout from '../components/Layout'

export default function page({userData}) {
    useEffect(() => {
       
      }, []);

    return (
        <Layout>
            <div>{JSON.stringify(userData)}</div>
        </Layout>
    )
  }

