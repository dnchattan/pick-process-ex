import spawn from "await-spawn";

export interface FilterProcessOptions {
  program?: string;
  commandline?: string;
}

export interface Process {
  pid: string;
  name: string;
  commandline: string;
  creationDate: Date;
}

async function getProcesses(): Promise<Process[]> {
  const outputBuffer = await spawn(
    "wmic",
    ["process", "get", "CreationDate,ProcessId,Name,CommandLine"],
    {
      shell: true,
    }
  );
  const output = outputBuffer.toString();
  const lines = output.split("\r\n");
  const columnLengths: number[] = [];
  const matchColumn = /\w+\s+/g;
  const columnHeader = lines.shift()!;
  let match: RegExpExecArray | null;
  while ((match = matchColumn.exec(columnHeader))) {
    columnLengths.push(match[0].length);
  }
  return lines.map<Process>((line) => {
    let pos = 0;
    let values: string[] = [];
    for (let col = 0; col < columnLengths.length; ++col) {
      values[col] = line.substring(pos, (pos += columnLengths[col])).trim();
    }
    const [commandline, creationDate, name, pid] = values;
    return {
      commandline,
      creationDate: new Date(
        parseInt(creationDate.substring(0, 4), 10),
        parseInt(creationDate.substring(4, 6), 10),
        parseInt(creationDate.substring(6, 8), 10),
        parseInt(creationDate.substring(8, 10), 10),
        parseInt(creationDate.substring(10, 12), 10),
        parseInt(creationDate.substring(12, 14), 10),
        parseInt(creationDate.substring(15, 21), 10)
      ),
      name,
      pid,
    };
  });
}

export async function filterProcesses(
  opts: FilterProcessOptions
): Promise<Process[]> {
  let results = await getProcesses();
  if (opts.program) {
    results = results.filter(
      (result) =>
        result.name.toLocaleLowerCase() === opts.program?.toLocaleLowerCase()
    );
  }
  if (opts.commandline) {
    results = results.filter((result) =>
      result.commandline
        .toLocaleLowerCase()
        .includes(opts.commandline!.toLocaleLowerCase())
    );
  }
  return results;
}
