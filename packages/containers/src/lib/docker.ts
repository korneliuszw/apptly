import dockerize from "dockerode";
import { mapConstantsToEnv } from "./constants";
import { map } from "better-auth";

type ContainerId = string;

export class DockerManager {
	private _docker: dockerize;
	constructor() {
		this._docker = new dockerize();
		this._docker;
	}

    _getPortName(port: number): string {
        return `${port}/tcp`;
    }
	async createContainer(image: string, port: number): Promise<ContainerId> {
		const portStr = this._getPortName(port);
		const env = mapConstantsToEnv();
		const container = await this._docker.createContainer({
			Image: image,
			Tty: false,
			AttachStdin: false,
			AttachStderr: false,
			AttachStdout: false,
			ExposedPorts: {
				[portStr]: {},
			},
			Env: env,
		});
		return container.id;
	}
    
    async getPort(containerId: ContainerId, exposedPort: number): Promise<string | null> {
        const container = this._docker.getContainer(containerId);
        const portStr = this._getPortName(exposedPort);
        const data = await container.inspect()
        return data.NetworkSettings.Ports[portStr]?.[0]?.HostPort ?? null
    }

    async stopContainer(containerId: ContainerId): Promise<void> {
        const container = this._docker.getContainer(containerId);
        try {
            await container.stop();
        } finally {
            await container.remove();
        }
    }

    async didContainerFinish(containerId: ContainerId): Promise<boolean> {
        const container = this._docker.getContainer(containerId);
        const data = await container.inspect();
        return data.State.Status === "exited";
    }
}
