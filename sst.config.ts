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
    new sst.aws.Nextjs('MyWeb', {
      ...(process.env.SST_STAGE && {
        domain: {
          name: 'spotifydash.co',
          dns: sst.vercel.dns({
            domain: 'spotifydash.co',
          }),
        },
      }),
    });
  },
});
