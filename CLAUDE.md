## Development

Start the dev server with `npm run dev` (`npm.cmd run dev` on Windows). It runs
in the foreground on http://localhost:4321/ and stays attached until stopped, so
run it as a background task rather than blocking on it. Claude Code does this via
the Bash/PowerShell tool's `run_in_background` option, which reports a task ID and
a log file path; check progress by reading that log file, and stop the server by
killing that background task.

Astro's CLI has no `--background` flag and no `stop`, `status`, or `logs`
subcommands — backgrounding is the job of whatever runs the command.

## 記事の公開手順

記事ファイルを `src/pages/<category>/` に配置しただけでは公開されない。
必ず以下を実行すること。

1. ローカルで表示確認

   ```
   npm.cmd run dev
   ```

   `http://localhost:4321/<category>/<slug>/` を開いて確認する。

2. 送信（この3つを必ず実行）

   ```
   git add .
   git commit -m "変更内容"
   git push
   ```

3. 3〜5分待ってから、公開URLで確認

   `https://health-evidence.jp/<category>/<slug>/`

### 公開されないときの確認順

1. `git status` で未送信の変更がないか確認
   （Untracked files に記事があれば未送信）
2. Cloudflare の Deployments でビルドが成功しているか確認
3. ファイル名とURLが一致しているか確認

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
