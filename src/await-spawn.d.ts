declare module "await-spawn" {
  import type { spawn } from "child_process";
  import type BufferList from "bl/BufferList";
  export default function spawnAsync(
    ...args: Parameters<typeof spawn>
  ): Promise<BufferList>;
}
