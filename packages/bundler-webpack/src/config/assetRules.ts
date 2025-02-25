import Config from '@umijs/bundler-webpack/compiled/webpack-5-chain';
import { Env, IConfig } from '../types';

interface IOpts {
  config: Config;
  userConfig: IConfig;
  cwd: string;
  env: Env;
  staticPathPrefix: string;
}

export async function addAssetRules(opts: IOpts) {
  const { config, userConfig } = opts;

  const inlineLimit = parseInt(userConfig.inlineLimit || '10000', 10);
  const rule = config.module.rule('asset');

  rule
    .oneOf('avif')
    .test(/\.avif$/)
    .type('asset')
    .mimetype('image/avif')
    .parser({
      dataUrlCondition: {
        maxSize: inlineLimit,
      },
    })
    .generator({
      filename: `${opts.staticPathPrefix}[name].[hash:8].[ext]`,
    });

  rule
    .oneOf('image')
    .test(/\.(bmp|gif|jpg|jpeg|png)$/)
    .type('asset')
    .parser({
      dataUrlCondition: {
        maxSize: inlineLimit,
      },
    })
    .generator({
      filename: `${opts.staticPathPrefix}[name].[hash:8].[ext]`,
    });

  rule
    .oneOf('fallback')
    .exclude.add(/^$/) /* handle data: resources */
    .add(/\.(js|mjs|jsx|ts|tsx)$/)
    .add(/\.(css|less|sass|scss|stylus)$/)
    .add(/\.html$/)
    .add(/\.json$/)
    .end()
    .type('asset/resource')
    .generator({
      filename: `${opts.staticPathPrefix}[name].[hash:8].[ext]`,
    });
}
