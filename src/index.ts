import * as github from "@actions/github";
import * as core from "@actions/core";
import * as fs from "fs";
import * as path from "path";

const context = github.context;

async function run() {
  try {
    if (context.eventName !== "release") {
      core.setOutput("skip", true);
      core.info("Not a release, skipping");
      return;
    }

    const payload = context.payload;

    switch (payload.action) {
      case "published":
        break;

      default:
        core.setOutput("skip", true);
        core.info(`Release action ${payload.action} is ignored`);
        return;
    }

    const filePath = core.getInput("file");
    const release = payload.release.tag_name;
    const fileName = path.parse(filePath).base;

    core.info(`Publishing asset to release ${release}`);

    const token = process.env.GITHUB_TOKEN as string;
    if (token) {
      const client = github.getOctokit(token);
      const owner = github.context.repo.owner;
      const repo = github.context.repo.repo;

      const response = await client.rest.repos.uploadReleaseAsset({
        owner,
        repo,
        release_id: payload.release.id,
        headers: {
          "content-type": "application/zip",
        },
        data: fs.readFileSync(filePath) as unknown as string,
        name: fileName,
      });
      core.debug(`Asset uploaded: ${response.data.name}`);
    }
  } catch (err: any) {
    core.setFailed(err.message);
  }
}

run();
