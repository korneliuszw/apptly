import simpleGit from "simple-git";
import { APP_WORKDIR, TEMPLATE_REPOSITORY_URL } from "./constants";

export const initApp = async () => {
    if (await Bun.file(`${APP_WORKDIR}/.git`).exists()) {
        return "APP_ALREADY_INITIALIZED";
    }
    await simpleGit().clone(TEMPLATE_REPOSITORY_URL, APP_WORKDIR)
    await simpleGit(APP_WORKDIR).addConfig("user.name", "Apptly").addConfig("user.email", "bot@apptly.ai")
    return "APP_INITIALIZED";
}

const createGitArchive = async (inputPath: string, outputPath: string) => {
    const git = simpleGit(inputPath);
    await git.raw(["archive", "--format=tar.gz", "-o", outputPath, "HEAD"]);
}

export const createAppArtifact = async () => {
    await simpleGit(APP_WORKDIR).add("*").commit(`${new Date().toISOString()}: Create artifact`)
    await createGitArchive(APP_WORKDIR, `${APP_WORKDIR}/artifact.tar.gz`);
    return `${APP_WORKDIR}/artifact.tar.gz`;
}