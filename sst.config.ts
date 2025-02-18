/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: 'spotify-dashboard',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
      providers: {
        aws: {
          region: 'us-east-1',
          profile: 'agape-media-dev',
        },
        '@pulumiverse/vercel': '1.14.3',
      },
    };
  },
  async run() {
    const NEXT_PUBLIC_WEB_URL = new sst.Secret('NEXT_PUBLIC_WEB_URL');
    const NEXT_PUBLIC_CLIENT_SECRET = new sst.Secret(
      'NEXT_PUBLIC_CLIENT_SECRET'
    );
    const NEXT_PUBLIC_CLIENT_ID = new sst.Secret('NEXT_PUBLIC_CLIENT_ID');
    new sst.aws.Nextjs('MyWeb', {
      link: [
        NEXT_PUBLIC_WEB_URL,
        NEXT_PUBLIC_CLIENT_SECRET,
        NEXT_PUBLIC_CLIENT_ID,
      ],
      domain: {
        name: 'spotifydash.co',
        dns: sst.vercel.dns({
          domain: 'spotifydash.co',
        }),
      },
    });
  },
});
